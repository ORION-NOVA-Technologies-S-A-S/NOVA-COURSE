import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { qrSvg } from "../components/qr";
import { verifyCertificate, type CertInfo } from "../data";
import { appBaseUrl } from "../supabase";

/** Certificado listo para ver, imprimir o guardar en PDF (se genera en el navegador, sin servidor). */
export function CertificatePage() {
  const { code = "" } = useParams();
  const [info, setInfo] = useState<CertInfo | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    setState("loading");
    verifyCertificate(code)
      .then((r) => {
        setInfo(r);
        setState(r ? "ok" : "missing");
      })
      .catch(() => setState("missing"));
  }, [code]);

  const verifyUrl = `${appBaseUrl()}#/verificar/${encodeURIComponent(code.toUpperCase())}`;
  const qr = useMemo(() => qrSvg(verifyUrl), [verifyUrl]);

  useEffect(() => {
    document.body.classList.add("printing-certificate");
    return () => document.body.classList.remove("printing-certificate");
  }, []);

  if (state === "loading") return <section className="wrap section"><p className="muted">Cargando certificado…</p></section>;
  if (state === "missing" || !info)
    return (
      <section className="wrap section narrow">
        <h1>Certificado no encontrado</h1>
        <p className="error">No existe un certificado con el código {code}.</p>
        <Link className="btn" to="/verificar">Verificar otro código</Link>
      </section>
    );

  const date = new Date(info.issued_at).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="wrap section cert-page">
      <div className="cert-toolbar no-print">
        <p className="ok-badge">✓ Certificado válido · {info.code}</p>
        <div className="row-inline">
          <button className="btn" onClick={() => window.print()}>⬇️ Descargar PDF / Imprimir</button>
          <Link className="btn ghost" to={`/verificar/${info.code}`}>Ver verificación</Link>
        </div>
        <p className="muted small">En la ventana de impresión elige «Guardar como PDF» y orientación horizontal.</p>
      </div>

      <article className="certificate" aria-label={`Certificado de ${info.student}`}>
        <div className="cert-inner">
          <img className="cert-logo" src="logo-emblema.png" alt="Orion Nova Technologies" width="96" height="96" />
          <p className="cert-company">ORION NOVA TECHNOLOGIES</p>
          <p className="cert-motto">INNOVAMOS · DESARROLLAMOS · CONECTAMOS · NOVA COURSE</p>
          <h1 className="cert-title">CERTIFICADO DE APROBACIÓN</h1>
          <p className="cert-text">Orion Nova Technologies certifica que</p>
          <p className="cert-name">{info.student}</p>
          <p className="cert-text">completó y aprobó satisfactoriamente el curso</p>
          <p className="cert-course">{info.course}</p>
          <p className="cert-text">con una intensidad de {info.hours} horas · expedido el {date}</p>

          <div className="cert-foot">
            <div className="cert-code">
              <b>Código: {info.code}</b>
              <span>Verificación en línea:</span>
              <span className="cert-url">{verifyUrl}</span>
            </div>
            <div className="cert-sign">
              <span className="cert-line" />
              <b>Director Académico</b>
              <span>Orion Nova Technologies</span>
            </div>
            <div className="cert-qr">
              <span dangerouslySetInnerHTML={{ __html: qr }} />
              <span>Escanea para verificar</span>
            </div>
          </div>
          <p className="cert-legal">Decreto 1075 de 2015</p>
        </div>
      </article>
    </section>
  );
}
