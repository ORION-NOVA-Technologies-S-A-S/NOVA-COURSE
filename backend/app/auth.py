"""Valida la sesión del estudiante con Supabase Auth.

El frontend envía el token de sesión de Supabase en `Authorization: Bearer <token>`.
El backend lo confirma con Supabase (GET /auth/v1/user), así funciona con cualquier
tipo de llave de firma que use el proyecto.
"""
from typing import Annotated

import asyncpg
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings
from .db import get_conn

bearer = HTTPBearer(auto_error=False)


async def current_user(creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]) -> dict:
    if not creds:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Debes iniciar sesión")
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            f"{settings.supabase_url}/auth/v1/user",
            headers={"apikey": settings.supabase_publishable_key, "Authorization": f"Bearer {creds.credentials}"},
        )
    if r.status_code != 200:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sesión inválida o vencida")
    data = r.json()
    meta = data.get("user_metadata") or {}
    return {"id": data["id"], "email": data.get("email", ""), "full_name": meta.get("full_name", "")}


CurrentUser = Annotated[dict, Depends(current_user)]
Conn = Annotated[asyncpg.Connection, Depends(get_conn)]
