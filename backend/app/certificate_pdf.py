"""Genera el certificado PDF avalado por ORION NOVA TECHNOLOGIES (reportlab, sin dependencias extra)."""
from datetime import datetime
from io import BytesIO

from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas

from pathlib import Path

from .config import settings

LOGO = str(Path(__file__).resolve().parent / "assets" / "logo-emblema.png")

NAVY = HexColor("#0B1026")
INDIGO = HexColor("#4F46E5")
SILVER = HexColor("#B8C0D0")
INK = HexColor("#1E2235")

MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
          "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def build_certificate(*, student: str, document_id: str | None, course: str, hours: int,
                      code: str, issued_at: datetime, verify_url: str) -> bytes:
    buf = BytesIO()
    w, h = landscape(A4)
    c = canvas.Canvas(buf, pagesize=(w, h))
    c.setTitle(f"Certificado {code}")
    c.setAuthor(settings.company_name)

    # Marco
    c.setFillColor(NAVY)
    c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(28, 28, w - 56, h - 56, 14, fill=1, stroke=0)
    c.setStrokeColor(INDIGO)
    c.setLineWidth(2)
    c.roundRect(40, 40, w - 80, h - 80, 10, fill=0, stroke=1)
    c.setStrokeColor(SILVER)
    c.setLineWidth(0.8)
    c.roundRect(46, 46, w - 92, h - 92, 8, fill=0, stroke=1)

    # Logo de Orion Nova Technologies
    c.drawImage(LOGO, w / 2 - 34, h - 122, width=68, height=68, mask="auto")

    # Encabezado de la empresa
    c.setFillColor(INDIGO)
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(w / 2, h - 140, settings.company_name)
    c.setFillColor(HexColor("#6B7280"))
    c.setFont("Helvetica", 10)
    c.drawCentredString(w / 2, h - 157, settings.company_motto.upper() + "  ·  NOVA COURSE")

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 34)
    c.drawCentredString(w / 2, h - 215, "CERTIFICADO DE APROBACIÓN")

    c.setFont("Helvetica", 13)
    c.drawCentredString(w / 2, h - 250, "Orion Nova Technologies certifica que")

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(w / 2, h - 293, student)
    if document_id:
        c.setFillColor(HexColor("#6B7280"))
        c.setFont("Helvetica", 11)
        c.drawCentredString(w / 2, h - 313, f"Documento de identidad {document_id}")

    c.setFillColor(INK)
    c.setFont("Helvetica", 13)
    c.drawCentredString(w / 2, h - 343, "completó y aprobó satisfactoriamente el curso")
    c.setFillColor(INDIGO)
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(w / 2, h - 375, course)
    c.setFillColor(INK)
    c.setFont("Helvetica", 12)
    date_txt = f"{issued_at.day} de {MONTHS[issued_at.month - 1]} de {issued_at.year}"
    c.drawCentredString(w / 2, h - 401, f"con una intensidad de {hours} horas · expedido el {date_txt}")

    # Firma
    c.setStrokeColor(INK)
    c.setLineWidth(0.8)
    c.line(w / 2 - 110, 120, w / 2 + 110, 120)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(w / 2, 104, settings.director_name)
    c.setFont("Helvetica", 9)
    c.drawCentredString(w / 2, 91, settings.director_title)

    # QR de verificación
    qr = QrCodeWidget(verify_url)
    bx, by, bw, bh = qr.getBounds()
    size = 84
    d = Drawing(size, size, transform=[size / (bw - bx), 0, 0, size / (bh - by), 0, 0])
    d.add(qr)
    renderPDF.draw(d, c, w - 160, 70)
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#6B7280"))
    c.drawCentredString(w - 118, 62, "Escanea para verificar")

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(INK)
    c.drawString(76, 104, f"Código: {code}")
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#6B7280"))
    c.drawString(76, 91, "Verificación en línea:")
    c.setFont("Helvetica", 6.5)
    c.drawString(76, 80, verify_url[:100])

    c.showPage()
    c.save()
    return buf.getvalue()
