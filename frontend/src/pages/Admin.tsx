import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { errorMessage } from "../api";
import { useAuth } from "../auth";
import { AdminPayments } from "../components/AdminPayments";
import { Markdown } from "../components/Markdown";
import { adminCourseTopics, adminGetContent, adminSaveContent, adminSavePrice, listCourses } from "../data";
import type { CourseSummary } from "../types";

type Mod = Awaited<ReturnType<typeof adminCourseTopics>>["modules"][number];

export function Admin() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [slug, setSlug] = useState("");
  const [modules, setModules] = useState<Mod[]>([]);
  const [price, setPrice] = useState("");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [video, setVideo] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    listCourses().then((c) => {
      setCourses(c);
      if (c[0]) setSlug(c[0].slug);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setTopicId(null);
    adminCourseTopics(slug).then((r) => {
      setModules(r.modules);
      setPrice(String(r.course.price_cop));
    });
  }, [slug]);

  useEffect(() => {
    if (topicId === null) return;
    setStatus("");
    adminGetContent(topicId).then((r) => {
      setContent(r.content);
      setVideo(r.video_url ?? "");
    });
  }, [topicId]);

  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  const save = async () => {
    if (topicId === null) return;
    setStatus("Guardando…");
    try {
      await adminSaveContent(topicId, content, video);
      setStatus("Guardado");
    } catch (e) {
      setStatus(errorMessage(e));
    }
  };

  const savePrice = async () => {
    try {
      await adminSavePrice(slug, Number(price));
      setStatus("Precio actualizado");
    } catch (e) {
      setStatus(errorMessage(e));
    }
  };

  return (
    <section className="wrap section">
      <h1>Administración</h1>
      <AdminPayments />
      <h2>Contenido de los cursos</h2>
      <p className="muted">Escribe el contenido real de cada tema y agrega su video de YouTube.</p>
      <div className="admin-bar card">
        <label>Curso
          <select id="admin-course" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </label>
        <label>Precio completo (COP)
          <span className="row-inline">
            <input id="admin-price" type="number" min={0} step={100} value={price} onChange={(e) => setPrice(e.target.value)} />
            <button className="btn sm" onClick={savePrice}>Guardar precio</button>
          </span>
        </label>
      </div>
      <div className="admin-grid">
        <nav className="card admin-topics" aria-label="Temas">
          {modules.map((m) => (
            <div key={m.id}>
              <p className="eyebrow">Módulo {m.position} · {m.title}</p>
              {m.topics.map((t) => (
                <button key={t.id} className={`admin-topic ${t.id === topicId ? "on" : ""}`} onClick={() => setTopicId(t.id)}>
                  {t.position}. {t.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-editor">
          {topicId === null ? (
            <div className="card"><p className="muted">Elige un tema de la lista para editarlo.</p></div>
          ) : (
            <>
              <div className="card form wide">
                <label>Video de YouTube (opcional)
                  <input id="admin-video" value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://youtu.be/..." />
                </label>
                <label>Contenido (## título, ### subtítulo, **negrita**, - lista)
                  <textarea id="admin-content" rows={18} value={content} onChange={(e) => setContent(e.target.value)} />
                  <details className="admin-help">
                    <summary>¿Cómo agrego preguntas para el repaso con NOVA?</summary>
                    <p className="muted small">Al final de la lección escribe un título «### Preguntas» y una pregunta por línea. Separa las opciones con «|» y marca la correcta con un asterisco (*). La línea con «&gt;» es la explicación que NOVA da cuando el estudiante se equivoca (opcional):</p>
                    <pre>{`### Preguntas
- ¿Qué es una variable? | Un espacio para guardar datos* | Un tipo de computador | Un error del programa
  > Explicación: una variable guarda un valor que puede cambiar.`}</pre>
                  </details>
                </label>
                <div className="row">
                  <button className="btn" onClick={save}>Guardar tema</button>
                  {status && <span className="muted">{status}</span>}
                </div>
              </div>
              <div className="card lesson"><p className="eyebrow">Vista previa</p><Markdown source={content} /></div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
