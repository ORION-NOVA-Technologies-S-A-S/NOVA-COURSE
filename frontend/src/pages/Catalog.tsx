import { useEffect, useMemo, useState } from "react";
import { listCourses } from "../data";
import { CourseCard } from "../components/CourseCard";
import type { CourseSummary } from "../types";

export function Catalog() {
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todos");

  useEffect(() => {
    listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set((courses ?? []).map((c) => c.category))).sort()],
    [courses],
  );
  const filtered = (courses ?? []).filter((c) => {
    const text = (c.title + " " + c.summary).toLowerCase();
    return (cat === "Todos" || c.category === cat) && text.includes(q.trim().toLowerCase());
  });

  return (
    <section className="wrap section">
      <h1>Catálogo de cursos</h1>
      <p className="lead muted">Cada curso: 5 módulos · 12 temas por módulo · módulos 1 a 3 gratis.</p>
      <input
        className="search"
        type="search"
        placeholder="Buscar: robótica, datos, derecho…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Buscar cursos"
      />
      <div className="chips" role="tablist">
        {categories.map((c) => (
          <button key={c} className={`chip-btn ${c === cat ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {courses === null ? (
        <p className="muted">Cargando cursos…</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No hay cursos con esa búsqueda.</p>
      ) : (
        <div className="grid">{filtered.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
      )}
    </section>
  );
}
