import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { errorMessage } from "../api";
import { useAuth } from "../auth";
import { supabase } from "../supabase";

function useNext() {
  const [params] = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/mi-aprendizaje";
}

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const next = useNext();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, next, navigate]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await login(String(f.get("email")), String(f.get("password")));
    } catch (err) {
      setError(errorMessage(err, "No se pudo ingresar"));
      setBusy(false);
    }
  };

  return (
    <section className="wrap section auth">
      <form className="card form" onSubmit={submit}>
        <h1>Ingresar</h1>
        <label>Correo<input id="login-email" name="email" type="email" autoComplete="email" required /></label>
        <label>Contraseña<input id="login-password" name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn block" disabled={busy}>{busy ? "Ingresando…" : "Ingresar"}</button>
        <p className="muted"><Link to="/recuperar">¿Olvidaste tu contraseña?</Link></p>
        <p className="muted">¿No tienes cuenta? <Link to={`/registro?next=${encodeURIComponent(next)}`}>Regístrate gratis</Link></p>
      </form>
    </section>
  );
}

export function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const next = useNext();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, next, navigate]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    setBusy(true);
    setError("");
    try {
      const active = await register({
        full_name: String(f.get("full_name")),
        email,
        document_id: String(f.get("document_id") || "") || undefined,
        password: String(f.get("password")),
      });
      if (!active) setPendingEmail(email);
    } catch (err) {
      setError(errorMessage(err, "No se pudo crear la cuenta"));
    } finally {
      setBusy(false);
    }
  };

  if (pendingEmail)
    return (
      <section className="wrap section auth">
        <div className="card form center">
          <h1>Revisa tu correo</h1>
          <p>Te enviamos un enlace a <b>{pendingEmail}</b> para activar tu cuenta.</p>
          <p className="muted">Ábrelo desde este mismo dispositivo. Si no lo ves, busca en Spam o Promociones.</p>
          <Link className="btn ghost" to="/ingresar">Ir a ingresar</Link>
        </div>
      </section>
    );

  return (
    <section className="wrap section auth">
      <form className="card form" onSubmit={submit}>
        <h1>Crea tu cuenta gratis</h1>
        <p className="muted">Accede a los módulos 1 al 5 de todos los cursos.</p>
        <label>Nombre completo (así saldrá en tu certificado)<input id="reg-name" name="full_name" minLength={3} required /></label>
        <label>Documento de identidad (opcional)<input id="reg-doc" name="document_id" inputMode="numeric" /></label>
        <label>Correo<input id="reg-email" name="email" type="email" autoComplete="email" required /></label>
        <label>Contraseña (mínimo 8 caracteres)<input id="reg-password" name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn block" disabled={busy}>{busy ? "Creando…" : "Crear cuenta"}</button>
        <p className="muted">¿Ya tienes cuenta? <Link to={`/ingresar?next=${encodeURIComponent(next)}`}>Ingresa</Link></p>
      </form>
    </section>
  );
}

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await resetPassword(String(new FormData(e.currentTarget).get("email")));
      setSent(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="wrap section auth">
      {sent ? (
        <div className="card form center">
          <h1>Revisa tu correo</h1>
          <p>Si el correo está registrado, te llegará un enlace para crear una contraseña nueva.</p>
        </div>
      ) : (
        <form className="card form" onSubmit={submit}>
          <h1>Recuperar contraseña</h1>
          <label>Correo de tu cuenta<input id="forgot-email" name="email" type="email" required /></label>
          {error && <p className="error">{error}</p>}
          <button className="btn block" disabled={busy}>Enviar enlace</button>
        </form>
      )}
    </section>
  );
}

export function NewPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({
      password: String(new FormData(e.currentTarget).get("password")),
    });
    setBusy(false);
    if (err) setError(errorMessage(err, "El enlace venció. Pide uno nuevo."));
    else navigate("/mi-aprendizaje");
  };

  return (
    <section className="wrap section auth">
      <form className="card form" onSubmit={submit}>
        <h1>Nueva contraseña</h1>
        <label>Contraseña nueva (mínimo 8 caracteres)<input id="new-password" name="password" type="password" minLength={8} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn block" disabled={busy}>Guardar contraseña</button>
      </form>
    </section>
  );
}
