import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { backend, certificatePdfUrl, errorMessage, formatCOP } from "../api";
import { useAuth } from "../auth";
import { coverText, ProgressBar } from "../components/CourseCard";
import { CourseArt } from "../components/CourseArt";
import { getCourse, issueCertificate } from "../data";
import type { CheckoutResponse, CourseDetail } from "../types";
import { openNova } from "../nova/NovaChat";
import { skillOf } from "../idiomas/skills";

export function CoursePage() {
  const { slug = "" } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [open, setOpen] = useState<number>(1);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    getCourse(slug, user?.id ?? null)
      .then(setCourse)
      .catch(() => setNotFound(true));
  }, [slug, user?.id]);
  useEffect(() => {
    if (!loading) load();
  }, [load, loading]);

  if (notFound) return <section className="wrap section"><h1>Curso no encontrado</h1><Link to="/cursos">Ver cursos</Link></section>;
  if (!course) return <section className="wrap section"><p className="muted">Cargando curso…</p></section>;

  const firstPending = course.modules
    .filter((m) => m.unlocked)
    .flatMap((m) => m.topics)
    .find((t) => !t.completed);
  const startId = firstPending?.id ?? course.modules[0]?.topics[0]?.id;

  const buy = async () => {
    if (!user) return navigate(`/ingresar?next=/cursos/${slug}`);
    setBusy(true);
    setMsg("");
    try {
      const r = await backend<CheckoutResponse>("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ course_slug: slug }),
      });
      if (r.checkout_url) window.location.href = r.checkout_url;
      else if (r.demo_mode) navigate(`/pago/resultado?ref=${r.reference}&demo=1`);
      else setMsg("La pasarela de pago aún no está configurada.");
    } catch (e) {
      setMsg(errorMessage(e, "No se pudo iniciar el pago"));
    } finally {
      setBusy(false);
    }
  };

  const certify = async () => {
    setBusy(true);
    setMsg("");
    try {
      await issueCertificate(slug);
      load();
    } catch (e) {
      setMsg(errorMessage(e, "No se pudo emitir el certificado"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="course-hero" style={{ ["--accent" as string]: course.color }}>
        <div className="wrap course-hero-inner">
          <div>
            <span className="chip">{course.category}</span>
            <h1>{course.title}</h1>
            <p className="lead">{course.summary}</p>
            <p className="muted">{course.modules.length} módulos · {course.progress.total} temas · {course.progress.total} horas · Certificado Orion Nova Technologies</p>
          </div>
          <div className="card buy-box">
            <span className={`course-mono big ${course.lang ? "hello" : ""}`}>
              <CourseArt slug={course.slug} lang={course.lang} className="big-art" />
              {course.lang && <span>{coverText(course)}</span>}
            </span>
            {user && course.plan ? (
              <>
                <p><b>{course.progress.percent}%</b> completado · {course.progress.completed}/{course.progress.total} temas</p>
                <ProgressBar value={course.progress.percent} />
              </>
            ) : (
              <p className="muted">Módulos 1–{course.free_modules} gratis con tu cuenta.</p>
            )}
            <Link className="btn block" to={user ? `/leccion/${startId}` : `/registro?next=/cursos/${slug}`}>
              {course.progress.completed > 0 ? "Continuar aprendiendo" : "Empezar gratis"}
            </Link>
            {course.plan !== "premium" ? (
              <button className="btn gold block" onClick={buy} disabled={busy}>
                Desbloquear curso completo · {formatCOP(course.price_cop)}
              </button>
            ) : course.certificate_code ? (
              <a className="btn gold block" href={certificatePdfUrl(course.certificate_code)} target="_blank" rel="noreferrer">
                Descargar certificado
              </a>
            ) : (
              <button className="btn gold block" onClick={certify} disabled={busy || course.progress.percent < 100}>
                {course.progress.percent < 100 ? "Certificado al completar el 100%" : "Obtener certificado"}
              </button>
            )}
            <button className="btn ghost block" onClick={() => openNova(`Cuéntame del curso ${course.title}`)}>
              Pregúntale a NOVA por este curso
            </button>
            <p className="fine">Pago único con PSE, Nequi, Bancolombia o tarjeta (Wompi). Incluye los módulos {course.free_modules + 1} al {course.modules.length} y el certificado.</p>
            {msg && <p className="error">{msg}</p>}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2>Contenido del curso</h2>
        <div className="modules">
          {course.modules.map((m) => {
            const done = m.topics.filter((t) => t.completed).length;
            return (
              <div key={m.id} className={`card module ${open === m.position ? "open" : ""}`}>
                <button className="module-head" onClick={() => setOpen(open === m.position ? 0 : m.position)}>
                  <span className="module-num">{m.position}</span>
                  <span className="module-title">
                    <b>{m.title}</b>
                    <small>{done}/{m.topics.length} temas {m.is_free ? "· Gratis" : "· Premium"}</small>
                  </span>
                  <span className={`lock ${m.unlocked ? "ok" : ""}`}>{m.unlocked ? "Abierto" : "Bloqueado"}</span>
                </button>
                {open === m.position && (
                  <ol className="topics">
                    {m.topics.map((t) => (
                      <li key={t.id}>
                        {m.unlocked && user ? (
                          <Link to={`/leccion/${t.id}`} className={t.completed ? "done" : ""}>
                            <span className="dot" />{t.title}
                            {course.lang && <span className="skill-badge">{skillOf(t.title)}</span>}
                          </Link>
                        ) : (
                          <span className="locked"><span className="dot" />{t.title}{course.lang && <span className="skill-badge">{skillOf(t.title)}</span>}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {course.sources.length > 0 && (
        <section className="wrap section sources" aria-labelledby="fuentes">
          <h2 id="fuentes">Fuentes y referencias</h2>
          <p className="muted">Documentos oficiales y materiales de consulta en los que se apoya este curso. Abren en una pestaña nueva.</p>
          <ul className="source-list">
            {course.sources.map((s) => (
              <li key={s.url} className="card source">
                <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                <span className="muted">{s.publisher}</span>
                <small>{s.use}</small>
              </li>
            ))}
          </ul>
          <p className="fine">Enlaces verificados en octubre de 2026. El temario fue diseñado por Orion Nova Technologies tomando estas fuentes como referencia.</p>
        </section>
      )}
    </>
  );
}
