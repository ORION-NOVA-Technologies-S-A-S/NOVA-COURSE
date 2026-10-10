import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Dirección base de la web (sirve igual en localhost, Render o GitHub Pages). */
export const appBaseUrl = () => window.location.origin + window.location.pathname;

export const supabaseConfigured = Boolean(url && key);

// Si faltan los datos, la app muestra un aviso en lugar de fallar
export const supabase = createClient(url || "https://falta-configurar.supabase.co", key || "falta-configurar", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
});
