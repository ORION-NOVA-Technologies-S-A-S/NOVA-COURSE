import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { backend, errorMessage } from "../api";
import { useAuth } from "../auth";

interface PayStatus {
  reference: string;
  status: string;
  course_slug?: string;
}

const LABELS: Record<string, string> = {
  APPROVED: "¡Pago aprobado! Ya tienes el curso completo.",
  PENDING: "Tu pago está en proceso. Recarga esta página en unos minutos.",
  DECLINED: "El pago fue rechazado. Puedes intentarlo de nuevo.",
  VOIDED: "El pago fue anulado.",
  ERROR: "Hubo un problema con el pago. Escríbenos con tu referencia.",
};

export function PaymentResult() {
  const [params] = useSearchParams();
  const { user, loading } = useAuth();
  const ref = params.get("ref") ?? "";
  const txId = params.get("id"); // Wompi agrega ?id=<transacción> al volver
  const demo = params.get("demo") === "1";
  const [state, setState] = useState<PayStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demo || loading || !user) return;
    const q = txId ? `?transaction_id=${encodeURIComponent(txId)}` : "";
    backend<PayStatus>(`/payments/${ref}/verify${q}`).then(setState).catch((e) => setError(errorMessage(e)));
  }, [ref, txId, demo, loading, user]);

  const simulate = async () => {
    try {
      setState(await backend<PayStatus>(`/payments/${ref}/simulate-approval`, { method: "POST" }));
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <section className="wrap section narrow center">
      <h1>Resultado del pago</h1>
      <p className="muted">Referencia {ref}</p>
      {!loading && !user && <p>Ingresa a tu cuenta para ver el estado de tu pago.</p>}
      {demo && !state && (
        <div className="card">
          <p><b>Modo de pruebas:</b> la pasarela Wompi aún no tiene llaves configuradas.</p>
          <button className="btn gold" onClick={simulate}>Simular pago aprobado</button>
        </div>
      )}
      {state && <p className="lead">{LABELS[state.status] ?? state.status}</p>}
      {error && <p className="error">{error}</p>}
      {state?.course_slug && <Link className="btn" to={`/cursos/${state.course_slug}`}>Ir al curso</Link>}
    </section>
  );
}
