"""Conexión asíncrona (asyncpg) a la base PostgreSQL de Supabase."""
from typing import AsyncIterator

import asyncpg

from .config import settings

_pool: asyncpg.Pool | None = None


async def connect() -> None:
    global _pool
    if not settings.database_url:
        raise RuntimeError("Falta DATABASE_URL en backend/.env")
    # statement_cache_size=0 hace compatible la conexión con el pooler de Supabase
    _pool = await asyncpg.create_pool(
        settings.database_url, min_size=1, max_size=5, command_timeout=30, statement_cache_size=0
    )


async def disconnect() -> None:
    if _pool:
        await _pool.close()


async def get_conn() -> AsyncIterator[asyncpg.Connection]:
    if _pool is None:
        raise RuntimeError("La base de datos no está conectada")
    async with _pool.acquire() as conn:
        yield conn
