import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { UserAvatar } from "../pages/ProfilePage";

/** Círculo con la foto: al pasar el mouse (o tocarlo en el celular) despliega los datos y los accesos de la cuenta. */
export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);
  const hovered = useRef(false);

  // Se cierra al cambiar de página, al tocar fuera o con la tecla Escape
  const where = `${location.pathname}${location.search ?? ""}`;
  useEffect(() => setOpen(false), [where]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const isAdmin = user.role === "admin";

  // En computador se abre al pasar el mouse; en celular, al tocar
  const hoverOpen = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    hovered.current = true;
    setOpen(true);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hovered.current = false;
    closeTimer.current = window.setTimeout(() => setOpen(false), 250);
  };

  const signOut = async () => {
    setOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="user-menu" ref={box} onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
      <button
        className="nav-avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={isAdmin ? "Menú de mi cuenta y panel de administrador" : "Menú de mi cuenta"}
        onClick={() => setOpen((o) => (hovered.current ? true : !o))}
      >
        <UserAvatar name={user.full_name} url={user.avatar_url} size={34} />
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-head">
            <UserAvatar name={user.full_name} url={user.avatar_url} size={52} />
            <div>
              <b>{user.full_name || "Sin nombre"}</b>
              <span className="muted small">{user.email}</span>
              {user.phone && <span className="muted small">📱 {user.phone}</span>}
              {isAdmin && <span className="chip admin-chip">Administrador</span>}
            </div>
          </div>
          {user.bio && <p className="user-dropdown-bio muted small">{user.bio}</p>}
          <div className="user-dropdown-links">
            <Link role="menuitem" to="/perfil">👤 Mi perfil y foto</Link>
            <Link role="menuitem" to="/perfil?editar=1">✏️ Editar mis datos</Link>
            <Link role="menuitem" to="/mi-aprendizaje">📈 Mi aprendizaje</Link>
            {isAdmin && <Link role="menuitem" to="/admin">🛠️ Panel de administrador</Link>}
          </div>
          <button role="menuitem" className="btn danger block sm" onClick={() => void signOut()}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
