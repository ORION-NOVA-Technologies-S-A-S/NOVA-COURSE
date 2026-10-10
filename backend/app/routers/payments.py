"""Pagos con Wompi (PSE, Nequi, Bancolombia, tarjetas).

1. POST /api/payments/checkout       → crea la referencia y la firma de integridad (SHA-256).
2. El navegador va al Web Checkout de Wompi.
3. Wompi regresa a /pago/resultado?ref=...&id=<transacción>; la web llama
   GET /api/payments/{ref}/verify?transaction_id=... y el servidor confirma con la API de Wompi.
4. Wompi también avisa por webhook (POST /api/payments/wompi/webhook), verificado con el secreto de eventos.
Solo este servidor puede activar el plan premium (la web no tiene permiso).
"""
import hashlib
import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from ..auth import Conn, CurrentUser
from ..config import settings

router = APIRouter(prefix="/payments", tags=["pagos"])
WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/p/"


class CheckoutIn(BaseModel):
    course_slug: str


def integrity_signature(reference: str, amount_cents: int, currency: str) -> str:
    raw = f"{reference}{amount_cents}{currency}{settings.wompi_integrity_secret}"
    return hashlib.sha256(raw.encode()).hexdigest()


def event_checksum_ok(event: dict) -> bool:
    try:
        sig = event["signature"]
        values = []
        for prop in sig["properties"]:
            node = event["data"]
            for key in prop.split("."):
                node = node[key]
            values.append(str(node))
        raw = "".join(values) + str(event["timestamp"]) + settings.wompi_events_secret
        return hashlib.sha256(raw.encode()).hexdigest().upper() == str(sig["checksum"]).upper()
    except (KeyError, TypeError):
        return False


async def apply_status(conn, reference: str, status: str, tx_id: str | None, amount_cents: int | None) -> dict:
    pay = await conn.fetchrow("select * from public.payments where reference = $1", reference)
    if not pay:
        raise HTTPException(404, "Referencia de pago no encontrada")
    if pay["status"] == "APPROVED":
        status = "APPROVED"  # un pago aprobado no se revierte por un aviso repetido
    elif amount_cents is not None and amount_cents != pay["amount_cents"]:
        status = "ERROR"  # el monto no coincide: no se libera el curso
    async with conn.transaction():
        await conn.execute(
            "update public.payments set status = $2, provider_tx_id = coalesce($3, provider_tx_id), updated_at = now() "
            "where id = $1",
            pay["id"], status, tx_id,
        )
        if status == "APPROVED":
            await conn.execute(
                """insert into public.enrollments (user_id, course_id, plan, upgraded_at) values ($1, $2, 'premium', now())
                   on conflict (user_id, course_id) do update set plan = 'premium', upgraded_at = now()""",
                pay["user_id"], pay["course_id"],
            )
    slug = await conn.fetchval("select slug from public.courses where id = $1", pay["course_id"])
    return {"reference": reference, "status": status, "course_slug": slug}


@router.post("/checkout")
async def checkout(body: CheckoutIn, conn: Conn, user: CurrentUser):
    course = await conn.fetchrow(
        "select id, title, price_cop from public.courses where slug = $1 and is_published", body.course_slug)
    if not course:
        raise HTTPException(404, "Curso no encontrado")
    plan = await conn.fetchval(
        "select plan from public.enrollments where user_id = $1::uuid and course_id = $2", user["id"], course["id"])
    if plan == "premium":
        raise HTTPException(409, "Ya tienes el curso completo")

    reference = f"ONA-{course['id']}-{secrets.token_hex(6).upper()}"
    amount_cents = course["price_cop"] * 100
    await conn.execute(
        "insert into public.payments (reference, user_id, course_id, amount_cents) values ($1, $2::uuid, $3, $4)",
        reference, user["id"], course["id"], amount_cents,
    )
    gateway_ready = bool(settings.wompi_public_key and settings.wompi_integrity_secret)
    checkout_url = None
    if gateway_ready:
        params = {
            "public-key": settings.wompi_public_key,
            "currency": "COP",
            "amount-in-cents": amount_cents,
            "reference": reference,
            "signature:integrity": integrity_signature(reference, amount_cents, "COP"),
            "redirect-url": f"{settings.frontend_url}/?pago={reference}",
            "customer-data:email": user["email"],
        }
        if user["full_name"]:
            params["customer-data:full-name"] = user["full_name"]
        checkout_url = f"{WOMPI_CHECKOUT_URL}?{urlencode(params)}"
    return {
        "reference": reference,
        "amount_cop": course["price_cop"],
        "course": course["title"],
        "checkout_url": checkout_url,
        "demo_mode": settings.payments_demo_mode and not gateway_ready,
    }


@router.get("/{reference}/verify")
async def verify(reference: str, conn: Conn, user: CurrentUser, transaction_id: str | None = None):
    pay = await conn.fetchrow(
        "select * from public.payments where reference = $1 and user_id = $2::uuid", reference, user["id"])
    if not pay:
        raise HTTPException(404, "Pago no encontrado")
    if pay["status"] != "PENDING" or not transaction_id:
        slug = await conn.fetchval("select slug from public.courses where id = $1", pay["course_id"])
        return {"reference": reference, "status": pay["status"], "course_slug": slug}
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(f"{settings.wompi_api_url}/transactions/{transaction_id}")
    if r.status_code != 200:
        raise HTTPException(502, "No se pudo consultar la transacción en Wompi")
    tx = r.json()["data"]
    if tx.get("reference") != reference:
        raise HTTPException(400, "La transacción no corresponde a esta referencia")
    return await apply_status(conn, reference, tx["status"], tx["id"], tx.get("amount_in_cents"))


@router.post("/wompi/webhook")
async def wompi_webhook(request: Request, conn: Conn):
    event = await request.json()
    if not settings.wompi_events_secret or not event_checksum_ok(event):
        raise HTTPException(401, "Firma de evento inválida")
    if event.get("event") == "transaction.updated":
        tx = event["data"]["transaction"]
        await apply_status(conn, tx["reference"], tx["status"], tx["id"], tx.get("amount_in_cents"))
    return {"ok": True}


@router.post("/{reference}/simulate-approval")
async def simulate(reference: str, conn: Conn, user: CurrentUser):
    """Solo para pruebas mientras no haya llaves de Wompi (PAYMENTS_DEMO_MODE=true)."""
    if not settings.payments_demo_mode or settings.wompi_public_key:
        raise HTTPException(403, "Modo de pruebas desactivado")
    owner = await conn.fetchval("select user_id::text from public.payments where reference = $1", reference)
    if owner != user["id"]:
        raise HTTPException(404, "Pago no encontrado")
    return await apply_status(conn, reference, "APPROVED", f"DEMO-{secrets.token_hex(4)}", None)
