import { supabase } from "./supabase";

/** Servidor Python (pagos Wompi y PDF del certificado). */
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "") + "/api";

/** El servidor Python se usa en desarrollo (localhost) o cuando VITE_API_URL tiene su dirección. */
export const apiConfigured = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_URL);

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Convierte errores de Supabase/servidor en mensajes claros en español. */
export function errorMessage(e: unknown, fallback = "Ocurrió un error, intenta de nuevo"): string {
  if (e instanceof ApiError) return e.message;
  if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
    const m = e.message;
    if (m.includes("Invalid login credentials")) return "Correo o contraseña incorrectos";
    if (m.includes("Email not confirmed")) return "Confirma tu correo: te enviamos un enlace al registrarte";
    if (m.includes("User already registered")) return "Ese correo ya está registrado";
    if (m.includes("Password should be")) return "La contraseña debe tener al menos 8 caracteres";
    if (m.includes("rate limit")) return "Demasiados intentos. Espera un minuto y vuelve a intentar";
    if (m.includes("Failed to fetch")) return "No hay conexión con el servidor";
    return m;
  }
  return fallback;
}

export async function backend<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiConfigured)
    throw new ApiError(503, "Los pagos se activan cuando publiquemos el servidor de pagos. Por ahora disfruta los módulos gratis.");
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const { data } = await supabase.auth.getSession();
  if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "El servidor de pagos no responde. Intenta en un momento.");
  }
  if (!res.ok) {
    let msg = "Ocurrió un error, intenta de nuevo";
    try {
      const body = await res.json();
      if (typeof body.detail === "string") msg = body.detail;
    } catch {
      /* sin JSON */
    }
    throw new ApiError(res.status, msg);
  }
  return res.json() as Promise<T>;
}

export const certificatePdfUrl = (code: string) => `${BASE}/certificates/${code}/pdf`;

export const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
