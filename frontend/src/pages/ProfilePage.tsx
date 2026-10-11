import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { errorMessage } from "../api";
import { useAuth } from "../auth";
import { removeAvatar, updateProfile, uploadAvatar } from "../data";

/** Foto de perfil redonda; si no hay foto, muestra las iniciales. */
export function UserAvatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return url ? (
    <img className="user-avatar" src={url} alt="" width={size} height={size} style={{ width: size, height: size }} />
  ) : (
    <span className="user-avatar initials" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">
      {initials}
    </span>
  );
}

/** Mi perfil: foto, datos personales, panel de administrador (si aplica) y botón para salir. */
export function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ full_name: "", document_id: "", phone: "", bio: "" });
  const [params] = useSearchParams();
  const [editing, setEditing] = useState(params.get("editar") === "1");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const wantsEdit = params.get("editar") === "1";
  useEffect(() => {
    if (wantsEdit) setEditing(true);
  }, [wantsEdit]);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name, document_id: user.document_id ?? "", phone: user.phone ?? "", bio: user.bio ?? "" });
  }, [user]);

  if (loading) return <section className="wrap section"><p className="muted">Cargando…</p></section>;
  if (!user) return <Navigate to="/ingresar?next=/perfil" replace />;

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      await refreshUser();
      setMsg({ ok: true, text: ok });
      return true;
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e) });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    await run(() => uploadAvatar(user.id, file), "¡Foto actualizada!");
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (form.full_name.trim().length < 3) return setMsg({ ok: false, text: "Escribe tu nombre completo (así saldrá en tus certificados)." });
    const ok = await run(
      () =>
        updateProfile(user.id, {
          full_name: form.full_name.trim(),
          document_id: form.document_id.trim() || null,
          phone: form.phone.trim() || null,
          bio: form.bio.trim() || null,
        }),
      "Datos guardados.",
    );
    if (ok) setEditing(false);
  };

  const signOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const isAdmin = user.role === "admin";

  return (
    <section className="wrap section profile-page">
      <p className="eyebrow">{isAdmin ? "Panel de administrador" : "Mi cuenta"}</p>
      <h1>Mi perfil</h1>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-photo">
            <UserAvatar name={user.full_name} url={user.avatar_url} size={132} />
          </div>
          <h2>{user.full_name || "Sin nombre"}</h2>
          <p className="muted">{user.email}</p>
          {isAdmin && <span className="chip admin-chip">Administrador</span>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => void onPhoto(e.target.files?.[0])} />
          <div className="profile-actions">
            <button className="btn sm" onClick={() => fileRef.current?.click()} disabled={busy}>
              {user.avatar_url ? "Cambiar foto" : "Subir foto"}
            </button>
            {user.avatar_url && (
              <button className="btn ghost sm" onClick={() => void run(() => removeAvatar(user.id), "Foto eliminada.")} disabled={busy}>
                Quitar foto
              </button>
            )}
          </div>
          <p className="muted small">JPG, PNG o WEBP. La recortamos en cuadrado automáticamente.</p>
          <button className="btn danger block" onClick={() => void signOut()}>Cerrar sesión</button>
        </div>

        <div className="profile-main">
          <form className="card profile-form" onSubmit={save}>
            <div className="profile-form-head">
              <h3>Mis datos</h3>
              {!editing && (
                <button type="button" className="btn ghost sm" onClick={() => { setEditing(true); setMsg(null); }}>
                  ✏️ Editar
                </button>
              )}
            </div>
            <label>
              Nombre completo
              <input value={form.full_name} disabled={!editing} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={120} />
              <span className="muted small">Así aparece en tus certificados.</span>
            </label>
            <label>
              Documento de identidad
              <input value={form.document_id} disabled={!editing} onChange={(e) => setForm({ ...form, document_id: e.target.value })} maxLength={30} />
            </label>
            <label>
              Celular
              <input value={form.phone} disabled={!editing} inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
            </label>
            <label>
              Sobre mí
              <textarea value={form.bio} disabled={!editing} rows={3} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} />
            </label>
            <label>
              Correo
              <input value={user.email} disabled />
            </label>
            {editing && (
              <div className="row">
                <button className="btn" disabled={busy}>{busy ? "Guardando…" : "Guardar cambios"}</button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setEditing(false);
                    setForm({ full_name: user.full_name, document_id: user.document_id ?? "", phone: user.phone ?? "", bio: user.bio ?? "" });
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
            <Link className="muted small" to="/nueva-clave">Cambiar contraseña</Link>
          </form>

          {msg && <p className={`feedback ${msg.ok ? "ok" : "bad"}`} role="status">{msg.text}</p>}

          {isAdmin && (
            <div className="card admin-links">
              <h3>Herramientas de administrador</h3>
              <div className="admin-link-grid">
                <Link className="admin-link" to="/admin">
                  <b>📚 Contenido de los cursos</b>
                  <span className="muted small">Edita lecciones, videos y precios.</span>
                </Link>
                <Link className="admin-link" to="/cursos">
                  <b>🗂️ Catálogo</b>
                  <span className="muted small">Revisa cómo se ven todos los cursos.</span>
                </Link>
                <Link className="admin-link" to="/verificar">
                  <b>✅ Verificar certificados</b>
                  <span className="muted small">Comprueba un código de certificado.</span>
                </Link>
                <Link className="admin-link" to="/clase">
                  <b>🎥 Clase con NOVA</b>
                  <span className="muted small">Prueba la práctica de idiomas.</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
