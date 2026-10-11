import { useEffect, useState, type FormEvent } from "react";
import { errorMessage, formatCOP } from "../api";
import { claimWompiPayment, DEFAULT_WOMPI_LINK, getPaymentLink } from "../data";

const PENDING = "nova.pendingPay";
function rememberPending(slug: string) {
  try {
    localStorage.setItem(PENDING, slug);
  } catch {
    /* sin almacenamiento */
  }
}
function forgetPending() {
  try {
    localStorage.removeItem(PENDING);
  } catch {
    /* sin almacenamiento */
  }
}

/** Pago con el link de Wompi: el estudiante paga y luego escribe el número de la transacción. */
export function WompiLinkPay({ slug, title, price, initialTx = "", onDone, onClose }: { slug: string; title: string; price: number; initialTx?: string; onDone: () => void; onClose: () => void }) {
  const [link, setLink] = useState(DEFAULT_WOMPI_LINK);
  const [opened, setOpened] = useState(false);
  const [tx, setTx] = useState(initialTx);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getPaymentLink().then(setLink).catch(() => undefined);
  }, []);

  // Si volvió desde Wompi con el número de la transacción, se confirma solo
  useEffect(() => {
    if (initialTx) void check(initialTx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTx]);

  const confirm = async (e: FormEvent) => {
    e.preventDefault();
    await check(tx);
  };

  const check = async (value: string) => {
    if (!value.trim()) return;
    setBusy(true);
    setResult(null);
    try {
      const r = await claimWompiPayment(slug, value);
      setResult({ ok: r.status === "approved" || r.status === "review", text: r.message });
      if (r.status === "approved" || r.status === "review") forgetPending();
      if (r.status === "approved") window.setTimeout(onDone, 1200);
    } catch (err) {
      setResult({ ok: false, text: errorMessage(err, "No pudimos confirmar el pago.") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pay-box" role="dialog" aria-label={`Pagar ${title}`}>
      <div className="pay-head">
        <b>Pagar curso completo</b>
        <button className="btn ghost sm" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      <p className="pay-amount">{formatCOP(price)}</p>
      <p className="muted small">Nequi, PSE, tarjeta o Bancolombia, a través de Wompi.</p>

      <ol className="pay-steps">
        <li>
          <span>Abre Wompi y escribe el valor exacto: <b>{formatCOP(price)}</b>.</span>
          <a className="btn block" href={link} target="_blank" rel="noopener noreferrer" onClick={() => {
              setOpened(true);
              rememberPending(slug);
            }}>
            Pagar con Wompi ↗
          </a>
        </li>
        <li>
          <span>Al terminar, copia el <b>número de la transacción</b> que aparece en el comprobante de Wompi (también te llega al correo).</span>
        </li>
        <li>
          <form className="pay-form" onSubmit={confirm}>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="Ej.: 123456-1728650000-12345" autoComplete="off" aria-label="Número de la transacción" />
            <button className="btn gold" disabled={busy || !tx.trim()}>{busy ? "Verificando con Wompi…" : "Confirmar mi pago"}</button>
          </form>
        </li>
      </ol>

      {opened && !result && <p className="muted small">¿Ya pagaste? Pega aquí el número de la transacción.</p>}
      {result && <p className={`feedback ${result.ok ? "ok" : "bad"}`} role="status">{result.text}</p>}
      <p className="muted small">Verificamos tu pago directamente con Wompi. Cada pago solo se puede usar una vez.</p>
    </div>
  );
}
