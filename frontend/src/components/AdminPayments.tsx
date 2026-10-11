import { useCallback, useEffect, useState } from "react";
import { errorMessage, formatCOP } from "../api";
import { adminPayments, adminReviewPayment, type AdminPayment } from "../data";

const LABEL: Record<string, string> = { APPROVED: "Aprobado", REVIEW: "En revisión", DECLINED: "Rechazado", PENDING: "Pendiente", VOIDED: "Anulado", ERROR: "Error" };

/** Pagos del link de Wompi: los que quedaron en revisión se aprueban o rechazan aquí. */
export function AdminPayments() {
  const [onlyReview, setOnlyReview] = useState(true);
  const [rows, setRows] = useState<AdminPayment[] | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    adminPayments(onlyReview)
      .then(setRows)
      .catch((e) => {
        setRows([]);
        setMsg(/admin_payments|schema cache/i.test(errorMessage(e)) ? "Para ver los pagos, ejecuta el archivo 05_pagos_wompi_link.sql en Supabase." : errorMessage(e));
      });
  }, [onlyReview]);
  useEffect(load, [load]);

  const review = async (p: AdminPayment, approve: boolean) => {
    if (!window.confirm(`${approve ? "¿Aprobar" : "¿Rechazar"} el pago de ${p.student || p.email} por ${formatCOP(p.amount_cop)}?${approve ? "\n\nRevisa primero en tu panel de Wompi que el pago sí llegó." : ""}`)) return;
    try {
      setMsg(await adminReviewPayment(p.id, approve));
      load();
    } catch (e) {
      setMsg(errorMessage(e));
    }
  };

  return (
    <div className="card admin-payments">
      <div className="admin-payments-head">
        <h2>Pagos</h2>
        <div className="row-inline">
          <button className={`chip-btn ${onlyReview ? "on" : ""}`} onClick={() => setOnlyReview(true)}>Por revisar</button>
          <button className={`chip-btn ${!onlyReview ? "on" : ""}`} onClick={() => setOnlyReview(false)}>Todos</button>
        </div>
      </div>
      <p className="muted small">
        Los pagos que Wompi confirma que entraron por tu link se aprueban solos. Si no se puede confirmar, quedan "en revisión":
        búscalos en tu panel de Wompi por el número de transacción y apruébalos aquí.
      </p>
      {msg && <p className="muted" role="status">{msg}</p>}
      {rows === null ? (
        <p className="muted">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="muted">{onlyReview ? "No hay pagos por revisar. 🎉" : "Todavía no hay pagos."}</p>
      ) : (
        <div className="pay-table">
          {rows.map((p) => (
            <div key={p.id} className="pay-row">
              <div>
                <b>{p.student || "Sin nombre"}</b> <span className="muted small">{p.email}</span>
                <div className="muted small">
                  {p.course} · {formatCOP(p.amount_cop)} · {p.method ?? "Wompi"} · {new Date(p.created_at).toLocaleString("es-CO")}
                </div>
                <div className="muted small">Transacción: <code>{p.tx_id}</code>{p.customer_email && ` · pagó con ${p.customer_email}`}</div>
              </div>
              <div className="pay-row-actions">
                <span className={`status-pill s-${p.status.toLowerCase()}`}>{LABEL[p.status] ?? p.status}</span>
                {p.status === "REVIEW" && (
                  <>
                    <button className="btn sm" onClick={() => void review(p, true)}>Aprobar</button>
                    <button className="btn danger sm" onClick={() => void review(p, false)}>Rechazar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
