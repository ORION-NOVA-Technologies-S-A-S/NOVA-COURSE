/** Lecturas y escrituras en Supabase. La seguridad la aplica la base de datos (políticas RLS). */
import { ApiError } from "./api";
import { supabase } from "./supabase";
import type { CourseDetail, CourseSummary, Lesson, ModuleItem, MyCourse } from "./types";

type CourseRow = Omit<CourseSummary, "modules" | "topics"> & { id: number };
type ModuleRow = { id: number; position: number; title: string; topics: { id: number; position: number; title: string }[] };

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw res.error;
  return res.data as T;
}

export async function listCourses(): Promise<CourseSummary[]> {
  const rows = check(
    await supabase
      .from("courses")
      .select("slug, title, category, color, summary, price_cop, free_modules")
      .eq("is_published", true)
      .order("title"),
  ) as Omit<CourseSummary, "modules" | "topics">[];
  return rows.map((r) => ({ ...r, modules: 5, topics: 60 }));
}

async function courseStructure(courseId: number): Promise<ModuleRow[]> {
  const mods = check(
    await supabase.from("modules").select("id, position, title, topics(id, position, title)").eq("course_id", courseId),
  ) as ModuleRow[];
  mods.sort((a, b) => a.position - b.position);
  mods.forEach((m) => m.topics.sort((a, b) => a.position - b.position));
  return mods;
}

export async function getCourse(slug: string, userId: string | null): Promise<CourseDetail> {
  const course = check(
    await supabase
      .from("courses")
      .select("id, slug, title, category, color, summary, price_cop, free_modules")
      .eq("slug", slug)
      .maybeSingle(),
  ) as CourseRow | null;
  if (!course) throw new ApiError(404, "Curso no encontrado");
  const mods = await courseStructure(course.id);
  const topicIds = mods.flatMap((m) => m.topics.map((t) => t.id));

  let plan: "free" | "premium" | null = null;
  let done = new Set<number>();
  let certificate: string | null = null;
  if (userId) {
    const [enr, prog, cert] = await Promise.all([
      supabase.from("enrollments").select("plan").eq("course_id", course.id).maybeSingle(),
      supabase.from("topic_progress").select("topic_id").in("topic_id", topicIds),
      supabase.from("certificates").select("code").eq("course_id", course.id).maybeSingle(),
    ]);
    plan = (check(enr) as { plan: "free" | "premium" } | null)?.plan ?? null;
    done = new Set((check(prog) as { topic_id: number }[]).map((r) => r.topic_id));
    certificate = (check(cert) as { code: string } | null)?.code ?? null;
  }

  const modules: ModuleItem[] = mods.map((m) => ({
    id: m.id,
    position: m.position,
    title: m.title,
    is_free: m.position <= course.free_modules,
    unlocked: m.position <= course.free_modules || plan === "premium",
    topics: m.topics.map((t) => ({ ...t, completed: done.has(t.id) })),
  }));
  const total = topicIds.length;
  const completed = topicIds.filter((id) => done.has(id)).length;
  return {
    slug: course.slug,
    title: course.title,
    category: course.category,
    color: course.color,
    summary: course.summary,
    price_cop: course.price_cop,
    free_modules: course.free_modules,
    plan,
    progress: { completed, total, percent: total ? Math.round((100 * completed) / total) : 0 },
    certificate_code: certificate,
    modules,
  };
}

type TopicRow = {
  id: number;
  position: number;
  title: string;
  modules: { position: number; title: string; course_id: number; courses: { id: number; slug: string; title: string } };
};

export async function getLesson(topicId: number, userId: string): Promise<Lesson> {
  const topic = check(
    await supabase
      .from("topics")
      .select("id, position, title, modules!inner(position, title, course_id, courses!inner(id, slug, title))")
      .eq("id", topicId)
      .maybeSingle(),
  ) as TopicRow | null;
  if (!topic) throw new ApiError(404, "Tema no encontrado");
  const course = topic.modules.courses;

  // Inscripción gratuita automática (si ya existe no cambia nada)
  await supabase
    .from("enrollments")
    .upsert({ user_id: userId, course_id: course.id }, { onConflict: "user_id,course_id", ignoreDuplicates: true });

  const [content, prog, mods] = await Promise.all([
    supabase.from("topic_contents").select("content, video_url").eq("topic_id", topicId).maybeSingle(),
    supabase.from("topic_progress").select("topic_id").eq("topic_id", topicId).maybeSingle(),
    courseStructure(course.id),
  ]);
  const body = check(content) as { content: string; video_url: string | null } | null;
  if (!body) throw new ApiError(402, "Este módulo es premium. Desbloquea el curso completo para continuar.");

  const ids = mods.flatMap((m) => m.topics.map((t) => t.id));
  const i = ids.indexOf(topicId);
  return {
    id: topic.id,
    title: topic.title,
    content: body.content,
    video_url: body.video_url,
    position: topic.position,
    module: { position: topic.modules.position, title: topic.modules.title },
    course: { slug: course.slug, title: course.title },
    completed: Boolean(check(prog)),
    prev_id: i > 0 ? ids[i - 1] : null,
    next_id: i >= 0 && i < ids.length - 1 ? ids[i + 1] : null,
  };
}

export async function completeTopic(topicId: number, userId: string) {
  check(
    await supabase
      .from("topic_progress")
      .upsert({ user_id: userId, topic_id: topicId }, { onConflict: "user_id,topic_id", ignoreDuplicates: true }),
  );
}

export async function myCourses(): Promise<MyCourse[]> {
  return check(await supabase.rpc("my_courses")) as MyCourse[];
}

export async function issueCertificate(slug: string): Promise<string> {
  return check(await supabase.rpc("issue_certificate", { p_course_slug: slug })) as string;
}

export interface CertInfo {
  code: string;
  student: string;
  course: string;
  hours: number;
  issued_at: string;
}

export async function verifyCertificate(code: string): Promise<CertInfo | null> {
  const rows = check(await supabase.rpc("verify_certificate", { p_code: code })) as CertInfo[];
  return rows[0] ?? null;
}

/* ---------- Administración ---------- */

export async function adminCourseTopics(slug: string) {
  const course = check(await supabase.from("courses").select("id, title, price_cop").eq("slug", slug).single()) as {
    id: number;
    title: string;
    price_cop: number;
  };
  return { course, modules: await courseStructure(course.id) };
}

export async function adminGetContent(topicId: number) {
  return check(
    await supabase.from("topic_contents").select("content, video_url").eq("topic_id", topicId).single(),
  ) as { content: string; video_url: string | null };
}

export async function adminSaveContent(topicId: number, content: string, videoUrl: string) {
  check(
    await supabase
      .from("topic_contents")
      .update({ content, video_url: videoUrl.trim() || null })
      .eq("topic_id", topicId)
      .select("topic_id")
      .single(),
  );
}

export async function adminSavePrice(slug: string, price: number) {
  check(await supabase.from("courses").update({ price_cop: price }).eq("slug", slug).select("slug").single());
}
