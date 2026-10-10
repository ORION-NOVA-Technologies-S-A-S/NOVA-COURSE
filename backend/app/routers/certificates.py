from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from ..auth import Conn
from ..certificate_pdf import build_certificate
from ..config import settings

router = APIRouter(prefix="/certificates", tags=["certificados"])


@router.get("/{code}/pdf")
async def pdf(code: str, conn: Conn):
    """PDF público del certificado (el código funciona como enlace de verificación)."""
    r = await conn.fetchrow(
        """select ce.code, ce.issued_at, ce.hours, ce.student_name, ce.document_id, c.title
           from public.certificates ce join public.courses c on c.id = ce.course_id
           where ce.code = upper($1)""",
        code.strip(),
    )
    if not r:
        raise HTTPException(404, "Certificado no encontrado")
    data = build_certificate(
        student=r["student_name"], document_id=r["document_id"], course=r["title"], hours=r["hours"],
        code=r["code"], issued_at=r["issued_at"],
        verify_url=f"{settings.frontend_url}/#/verificar/{r['code']}",
    )
    return Response(data, media_type="application/pdf",
                    headers={"Content-Disposition": f'inline; filename="certificado-{r["code"]}.pdf"'})
