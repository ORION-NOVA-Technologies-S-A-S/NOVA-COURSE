import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { certificatePdfUrl } from "../api";
import { useAuth } from "../auth";
import { ProgressBar } from "../components/CourseCard";
import { myCourses } from "../data";
import { CourseArt } from "../components/CourseArt";
import type { MyCourse } from "../types";

export function Dashboard() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<MyCourse[] | null>(null);

  useEffect(() => {
    if (user) myCourses().then(setCourses).catch(() => setCourses([]));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/ingresar?next=/mi-aprendizaje" replace />;

  return (
    <section className="wrap section">
      <h1>Hola, {user.full_name.split(" ")[0] || "estudiante"}</h1>
      <p className="lead muted">Tu avance y tus certificados.</p>
      {courses === null ? (
        <p className="muted">Cargando…</p>
      ) : courses.length === 0 ? (
        <div className="card empty">
          <p>Aún no has empezado ningún curso.</p>
          <Link className="btn" to="/cursos">Elegir un curso</Link>
        </div>
      ) : (
        <div className="grid">
          {courses.map((c) => {
            const pct = c.total_topics ? Math.round((100 * c.completed_topics) / c.total_topics) : 0;
            return (
              <div key={c.slug} className="card my-course" style={{ ["--accent" as string]: c.color }}>
                <div className="my-course-top">
                  <span className="chip">{c.plan === "premium" ? "Curso completo" : "Plan gratis"}</span>
                  <span className="my-art"><CourseArt slug={c.slug} lang={c.slug.startsWith("idioma-") ? (c.slug.endsWith("colombiana") ? "lsc" : "x") : null} /></span>
                </div>
                <h3>{c.title}</h3>
                <p className="muted">{c.completed_topics} de {c.total_topics} temas · {pct}%</p>
                <ProgressBar value={pct} />
                <div className="row">
                  <Link className="btn sm" to={`/cursos/${c.slug}`}>Continuar</Link>
                  {c.certificate_code && (
                    <a className="btn gold sm" href={certificatePdfUrl(c.certificate_code)} target="_blank" rel="noreferrer">
                      Certificado
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
