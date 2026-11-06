import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Dirección base de la web (sirve igual en localhost, Render o GitHub Pages). */
export const appBaseUrl = () => window.location.origin + window.location.pathname;

export const supabaseConfigured = Boolean(url && key);

// Si faltan los datos, la app muestra un aviso en lugar de fallar
// ORION NOVA CLOUD: public/servidor.js decide si se usa Supabase o el servidor propio de Orion Nova
const elegir = (window as unknown as { __orionElegir?: (f: typeof createClient) => typeof createClient }).__orionElegir;
export const supabase = (elegir ? elegir(createClient) : createClient)(url || "https://falta-configurar.supabase.co", key || "falta-configurar", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
});
