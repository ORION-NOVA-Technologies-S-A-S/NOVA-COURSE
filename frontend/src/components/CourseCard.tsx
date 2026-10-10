import { Link } from "react-router-dom";
import { formatCOP } from "../api";
import type { CourseSummary } from "../types";

export function initials(title: string) {
  return title
    .split(" ")
    .filter((w) => w.length > 3)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <Link to={`/cursos/${course.slug}`} className="card course-card" style={{ ["--accent" as string]: course.color }}>
      <div className="course-cover">
        <span className="course-mono">{initials(course.title)}</span>
        <span className="chip">{course.category}</span>
      </div>
      <div className="course-body">
        <h3>{course.title}</h3>
        <p>{course.summary}</p>
        <div className="course-meta">
          <span>{course.modules} módulos · {course.topics} temas</span>
        </div>
        <div className="course-price">
          <span className="free-badge">Módulos 1–{course.free_modules} gratis</span>
          <span className="muted">Completo {formatCOP(course.price_cop)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${value}%` }} />
    </div>
  );
}
