import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";
import { supabaseConfigured } from "../supabase";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Orion Nova Academy, inicio">
      <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden>
        <circle cx="32" cy="32" r="17" fill="none" stroke="var(--indigo)" strokeWidth="5" />
        <circle cx="46" cy="18" r="5.5" fill="var(--silver)" />
      </svg>
      <span>
        <b>ORION NOVA</b>
        <small>ACADEMY</small>
      </span>
    </Link>
  );
}

export function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Logo />
          <nav className="nav">
            <NavLink to="/cursos">Cursos</NavLink>
            <NavLink to="/verificar">Verificar</NavLink>
            {user ? (
              <>
                <NavLink to="/mi-aprendizaje">Mi aprendizaje</NavLink>
                {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                <button className="btn ghost sm" onClick={() => void logout()}>Salir</button>
              </>
            ) : (
              <Link className="btn sm" to="/ingresar">Ingresar</Link>
            )}
          </nav>
        </div>
      </header>
      {!supabaseConfigured && (
        <div className="wrap config-warning">
          Falta configurar Supabase: copia <code>frontend/.env.example</code> como <code>.env</code> y escribe la URL y la publishable key.
        </div>
      )}
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap">
          <Logo />
          <p>Plataforma educativa de <b>ORION NOVA TECHNOLOGIES</b> · Innovamos · Desarrollamos · Conectamos</p>
          <p className="muted">© {new Date().getFullYear()} Orion Nova Technologies. Certificados verificables en línea.</p>
        </div>
      </footer>
    </>
  );
}
