import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { verifyCertificate, type CertInfo } from "../data";

export function Verify() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState<CertInfo | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setInfo(null);
    setNotFound(false);
    if (code)
      verifyCertificate(code)
        .then((r) => (r ? setInfo(r) : setNotFound(true)))
        .catch(() => setNotFound(true));
  }, [code]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("code") || "").trim().toUpperCase();
    if (value) navigate(`/verificar/${value}`);
  };

  return (
    <section className="wrap section narrow">
      <h1>Verificar certificado</h1>
      <p className="lead muted">Comprueba que un certificado fue emitido por ORION NOVA TECHNOLOGIES.</p>
      <form className="verify-form" onSubmit={submit}>
        <input id="verify-code" name="code" placeholder="ONT-XXXXXXXX" defaultValue={code ?? ""} aria-label="Código del certificado" />
        <button className="btn">Verificar</button>
      </form>
      {info && (
        <div className="card verified">
          <p className="ok-badge">✓ Certificado válido</p>
          <h2>{info.student}</h2>
          <p>Aprobó <b>{info.course}</b> · {info.hours} horas</p>
          <p className="muted">
            Emitido el {new Date(info.issued_at).toLocaleDateString("es-CO", { dateStyle: "long" })} por ORION NOVA TECHNOLOGIES
          </p>
          <p className="muted small">Código: {info.code}</p>
          <Link className="btn sm" to={`/certificado/${info.code}`}>Ver certificado y descargar PDF</Link>
        </div>
      )}
      {notFound && <p className="error">No existe un certificado con el código {code}.</p>}
    </section>
  );
}
