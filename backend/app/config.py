import os
from dataclasses import dataclass, field
from pathlib import Path


def _load_dotenv() -> None:
    """Carga backend/.env si existe (sin sobrescribir variables ya definidas)."""
    env_file = Path(__file__).resolve().parent.parent / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


_load_dotenv()


def _env(name: str, default: str = "") -> str:
    return os.environ.get(name, default)


@dataclass(frozen=True)
class Settings:
    # Supabase
    supabase_url: str = _env("SUPABASE_URL").rstrip("/")
    supabase_publishable_key: str = _env("SUPABASE_PUBLISHABLE_KEY")
    # Conexión directa a PostgreSQL de Supabase (Connect > Session pooler). Es privada: solo en el servidor.
    database_url: str = _env("DATABASE_URL")

    frontend_url: str = _env("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    cors_origins: list[str] = field(
        default_factory=lambda: [o.strip() for o in _env("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
    )

    # Wompi (Bancolombia) — https://docs.wompi.co
    wompi_public_key: str = _env("WOMPI_PUBLIC_KEY")
    wompi_integrity_secret: str = _env("WOMPI_INTEGRITY_SECRET")
    wompi_events_secret: str = _env("WOMPI_EVENTS_SECRET")
    wompi_api_url: str = _env("WOMPI_API_URL", "https://sandbox.wompi.co/v1")
    # Permite simular pagos mientras no haya llaves de Wompi. En producción: false
    payments_demo_mode: bool = _env("PAYMENTS_DEMO_MODE", "true").lower() == "true"

    company_name: str = "ORION NOVA TECHNOLOGIES"
    company_motto: str = "Innovamos · Desarrollamos · Conectamos"
    director_name: str = _env("CERT_SIGNER_NAME", "Director")
    director_title: str = _env("CERT_SIGNER_TITLE", "Orion Nova Technologies")


settings = Settings()
