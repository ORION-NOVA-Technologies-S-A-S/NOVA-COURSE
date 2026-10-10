import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses } from "../data";
import { CourseCard } from "../components/CourseCard";
import type { CourseSummary } from "../types";

export function Home() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  useEffect(() => {
    listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <img className="hero-logo" src="logo-orion-nova-520.jpg" alt="Orion Nova Technologies" width="260" height="260" />
          <span className="eyebrow">ORION NOVA TECHNOLOGIES · NOVA COURSE</span>
          <h1>Aprende lo que mueve el futuro. <em>Empieza gratis.</em></h1>
          <p className="lead">
            {courses.length || 15} cursos con 5 módulos y 12 temas cada uno. Los 3 primeros módulos son gratis; desbloquea
            el curso completo y obtén tu certificado avalado por Orion Nova Technologies.
          </p>
          <div className="hero-actions">
            <Link className="btn lg" to="/cursos">Explorar cursos</Link>
            <Link className="btn ghost lg" to="/registro">Crear cuenta gratis</Link>
          </div>
          <dl className="stats">
            <div><dt>{courses.length || 15}</dt><dd>cursos</dd></div>
            <div><dt>{(courses.length || 15) * 60}</dt><dd>temas</dd></div>
            <div><dt>36</dt><dd>temas gratis por curso</dd></div>
          </dl>
        </div>
      </section>

      <section className="wrap section">
        <div className="steps">
          <div className="card step"><b>1</b><h3>Regístrate</h3><p>Crea tu cuenta en segundos, sin tarjeta.</p></div>
          <div className="card step"><b>2</b><h3>Aprende gratis</h3><p>Módulos 1, 2 y 3 abiertos: 36 temas por curso.</p></div>
          <div className="card step"><b>3</b><h3>Desbloquea</h3><p>Paga una sola vez con PSE, Nequi o tarjeta vía Wompi.</p></div>
          <div className="card step"><b>4</b><h3>Certifícate</h3><p>Certificado PDF con código QR verificable.</p></div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Cursos destacados</h2>
          <Link to="/cursos">Ver todos →</Link>
        </div>
        <div className="grid">
          {courses.slice(0, 6).map((c) => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>
    </>
  );
}
