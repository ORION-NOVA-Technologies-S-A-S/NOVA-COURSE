import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ApiError, errorMessage } from "../api";
import { useAuth } from "../auth";
import { Markdown } from "../components/Markdown";
import { completeTopic, getLesson } from "../data";
import type { Lesson } from "../types";
import { setCurrentLesson } from "../nova/brain";
import { openNova } from "../nova/NovaChat";

function embedUrl(url: string) {
  const yt = /(?:youtu\.be\/|v=|embed\/)([\w-]{11})/.exec(url);
  return yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : url;
}

export function LessonPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLesson(null);
    setError(null);
    getLesson(Number(id), user.id)
      .then(setLesson)
      .catch((e) => setError({ status: e instanceof ApiError ? e.status : 0, message: errorMessage(e) }));
    window.scrollTo(0, 0);
  }, [id, user]);

  // NOVA puede leer o resumir la lección abierta
  useEffect(() => {
    setCurrentLesson(
      lesson ? { title: lesson.title, course: lesson.course.title, module: lesson.module.title, content: lesson.content } : null,
    );
    return () => setCurrentLesson(null);
  }, [lesson]);

  if (loading) return null;
  if (!user) return <Navigate to={`/ingresar?next=/leccion/${id}`} replace />;

  if (error)
    return (
      <section className="wrap section narrow center">
        <h1>{error.status === 402 ? "Contenido premium" : "No disponible"}</h1>
        <p className="lead muted">{error.message}</p>
        <button className="btn" onClick={() => navigate(-1)}>Volver al curso</button>
      </section>
    );
  if (!lesson) return <section className="wrap section"><p className="muted">Cargando lección…</p></section>;

  const completeAndNext = async () => {
    setSaving(true);
    try {
      await completeTopic(lesson.id, user.id);
      navigate(lesson.next_id ? `/leccion/${lesson.next_id}` : `/cursos/${lesson.course.slug}`);
    } catch (e) {
      setError({ status: 0, message: errorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="wrap section narrow">
      <nav className="crumbs">
        <Link to={`/cursos/${lesson.course.slug}`}>{lesson.course.title}</Link>
        <span>›</span>
        <span>Módulo {lesson.module.position}: {lesson.module.title}</span>
      </nav>
      <p className="eyebrow">Tema {lesson.position} de 12 {lesson.completed && "· ✓ Completado"}</p>
      {lesson.video_url && (
        <div className="video">
          <iframe src={embedUrl(lesson.video_url)} title={lesson.title} allowFullScreen loading="lazy" />
        </div>
      )}
      <button className="btn ghost sm ask-nova" onClick={() => openNova("Léeme esta lección")}>
        Que NOVA me lea esta lección
      </button>
      <article className="card lesson">
        <Markdown source={lesson.content} />
      </article>
      <div className="lesson-nav">
        {lesson.prev_id ? <Link className="btn ghost" to={`/leccion/${lesson.prev_id}`}>← Anterior</Link> : <span />}
        <button className="btn" onClick={completeAndNext} disabled={saving}>
          {lesson.next_id ? "Marcar como visto y seguir →" : "Terminar curso"}
        </button>
      </div>
    </section>
  );
}
