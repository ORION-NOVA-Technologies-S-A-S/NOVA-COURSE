import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { appBaseUrl, supabase } from "./supabase";
import type { User } from "./types";

interface RegisterData {
  full_name: string;
  email: string;
  document_id?: string;
  password: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Devuelve true si la cuenta quedó activa, false si falta confirmar el correo. */
  register: (data: RegisterData) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Vuelve a leer el perfil (después de editarlo o cambiar la foto). */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

async function loadUser(id: string, email: string): Promise<User> {
  // Con foto (04_perfil.sql); si ese archivo aún no se ha ejecutado, lee el perfil básico
  let { data, error } = await supabase.from("profiles").select("full_name, document_id, role, avatar_url, phone, bio").eq("id", id).maybeSingle();
  if (error) ({ data } = await supabase.from("profiles").select("full_name, document_id, role").eq("id", id).maybeSingle());
  const p = (data ?? {}) as Partial<Record<string, string | null>>;
  return {
    id,
    email,
    full_name: p.full_name ?? "",
    document_id: p.document_id ?? null,
    role: p.role === "admin" ? "admin" : "student",
    avatar_url: p.avatar_url ?? null,
    phone: p.phone ?? null,
    bio: p.bio ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      // Enlace del correo de "recuperar contraseña"
      if (event === "PASSWORD_RECOVERY") window.location.hash = "/nueva-clave";
      // Enlace del correo de confirmación: limpia ?code= de la dirección
      if (event === "SIGNED_IN" && window.location.search.includes("code=")) {
        window.history.replaceState(null, "", appBaseUrl() + "#/mi-aprendizaje");
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Se difiere para no bloquear el aviso de Supabase
      setTimeout(() => {
        loadUser(session.user.id, session.user.email ?? "")
          .then(setUser)
          .finally(() => setLoading(false));
      }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const register = useCallback(async (d: RegisterData) => {
    const { data, error } = await supabase.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        data: { full_name: d.full_name.trim(), document_id: d.document_id ?? "" },
        emailRedirectTo: appBaseUrl(),
      },
    });
    if (error) throw error;
    return Boolean(data.session);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: appBaseUrl(),
    });
    if (error) throw error;
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) setUser(await loadUser(data.user.id, data.user.email ?? ""));
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, resetPassword, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
