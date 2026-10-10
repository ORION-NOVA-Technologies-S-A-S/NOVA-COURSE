import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";
import { supabaseConfigured } from "../supabase";
import { NovaAvatarDefs } from "../nova/NovaAvatar";
import { NovaChat } from "../nova/NovaChat";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="NOVA COURSE de Orion Nova Technologies, inicio">
      <img src="logo-emblema.png" alt="" width="38" height="38" className="logo-img" />
      <span>
        <b>ORION NOVA</b>
        <small>NOVA COURSE</small>
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
        <div className="wrap footer-inner">
          <img src="logo-orion-nova-520.jpg" alt="Orion Nova Technologies — Innovamos · Desarrollamos · Conectamos" className="footer-logo" width="160" height="160" loading="lazy" />
          <div>
          <p>Plataforma educativa de <b>ORION NOVA TECHNOLOGIES</b> · Innovamos · Desarrollamos · Conectamos</p>
          <p className="muted">© {new Date().getFullYear()} Orion Nova Technologies. Certificados verificables en línea.</p>
          </div>
        </div>
      </footer>
      <NovaAvatarDefs />
      <NovaChat />
    </>
  );
}
