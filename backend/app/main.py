"""Servidor Python de Orion Nova Academy.

Supabase se encarga de cuentas, catálogo, lecciones y progreso.
Este servidor hace lo que debe quedar privado: cobrar con Wompi, activar el plan premium
y generar el certificado PDF.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import db
from .config import settings
from .routers import certificates, payments


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(title="Orion Nova Academy API", version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(payments.router, prefix="/api")
app.include_router(certificates.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
