/** Lecturas y escrituras en Supabase. La seguridad la aplica la base de datos (políticas RLS). */
import { ApiError } from "./api";
import { supabase } from "./supabase";
import type { CourseDetail, CourseSource, CourseSummary, Lesson, ModuleItem, MyCourse } from "./types";

type CourseRow = Omit<CourseSummary, "modules" | "topics"> & { id: number; sources?: CourseSource[]; lang?: string | null };
type ModuleRow = { id: number; position: number; title: string; topics: { id: number; position: number; title: string }[] };

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw res.error;
  return res.data as T;
}

export async function listCourses(): Promise<CourseSummary[]> {
  const rows = check(
    await supabase
      .from("courses")
      .select("slug, title, category, color, summary, price_cop, free_modules, lang")
      .eq("is_published", true)
      .order("title"),
  ) as Omit<CourseSummary, "modules" | "topics">[];
  return rows.map((r) => ({ ...r, modules: 10, topics: 120 }));
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
      .select("id, slug, title, category, color, summary, price_cop, free_modules, sources, lang")
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
    lang: course.lang ?? null,
    sources: Array.isArray(course.sources) ? course.sources : [],
    modules,
  };
}

type TopicRow = {
  id: number;
  position: number;
  title: string;
  modules: { position: number; title: string; course_id: number; courses: { id: number; slug: string; title: string; lang: string | null; category: string } };
};

export async function getLesson(topicId: number, userId: string): Promise<Lesson> {
  const topic = check(
    await supabase
      .from("topics")
      .select("id, position, title, modules!inner(position, title, course_id, courses!inner(id, slug, title, lang, category))")
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
    course: { slug: course.slug, title: course.title, lang: course.lang ?? null, category: course.category },
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

/* ---------- Perfil ---------- */
export async function updateProfile(userId: string, fields: { full_name: string; document_id: string | null; phone: string | null; bio: string | null }) {
  const { error } = await supabase.from("profiles").update(fields).eq("id", userId);
  if (error) throw error;
}

/** Recorta la foto al centro en un cuadrado de 400 px (JPEG liviano) antes de subirla. */
async function squareJpeg(file: File, size = 400): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("No pude leer esa imagen. Prueba con una foto JPG o PNG."));
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Tu navegador no pudo procesar la foto.");
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No pude preparar la foto."))), "image/jpeg", 0.88),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Sube la foto de perfil a la carpeta propia del usuario y guarda su dirección en el perfil. */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Elige un archivo de imagen (JPG, PNG o WEBP).");
  if (file.size > 15 * 1024 * 1024) throw new Error("La foto pesa más de 15 MB. Elige una más liviana.");
  const blob = await squareJpeg(file);
  const path = `${userId}/avatar.jpg`;
  const { error } = await supabase.storage.from("avatars").upload(path, blob, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
  if (error) {
    if (/bucket not found/i.test(error.message)) throw new Error("Falta activar las fotos: ejecuta el archivo 04_perfil.sql en Supabase.");
    throw error;
  }
  const url = `${supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
  const { error: e2 } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
  if (e2) throw e2;
  return url;
}

export async function removeAvatar(userId: string) {
  await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`]);
  const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
  if (error) throw error;
}

/* ---------- Pagos con el link de Wompi (sin servidor) ---------- */
export const DEFAULT_WOMPI_LINK = "https://checkout.wompi.co/l/4CnTOr";

export async function getPaymentLink(): Promise<string> {
  const { data } = await supabase.from("settings").select("value").eq("key", "public_wompi_link_url").maybeSingle();
  return (data as { value?: string } | null)?.value || DEFAULT_WOMPI_LINK;
}

export async function claimWompiPayment(slug: string, txId: string): Promise<{ status: string; message: string }> {
  const { data, error } = await supabase.rpc("claim_wompi_payment", { p_slug: slug, p_tx_id: txId.trim() });
  if (error) {
    if (/claim_wompi_payment|schema cache/i.test(error.message)) throw new Error("Falta activar los pagos: ejecuta el archivo 05_pagos_wompi_link.sql en Supabase.");
    throw error;
  }
  return data as { status: string; message: string };
}

export interface AdminPayment {
  id: number;
  created_at: string;
  status: string;
  student: string | null;
  email: string;
  course: string;
  amount_cop: number;
  method: string | null;
  tx_id: string | null;
  customer_email: string | null;
}

export async function adminPayments(onlyReview: boolean): Promise<AdminPayment[]> {
  const { data, error } = await supabase.rpc("admin_payments", { p_only_review: onlyReview });
  if (error) throw error;
  return (data ?? []) as AdminPayment[];
}

export async function adminReviewPayment(id: number, approve: boolean): Promise<string> {
  const { data, error } = await supabase.rpc("admin_review_payment", { p_id: id, p_approve: approve });
  if (error) throw error;
  return data as string;
}

/** Contenido de varias lecciones a la vez (solo las que el estudiante puede ver). */
export async function lessonContents(topicIds: number[]): Promise<{ topic_id: number; content: string }[]> {
  if (!topicIds.length) return [];
  const { data, error } = await supabase.from("topic_contents").select("topic_id, content").in("topic_id", topicIds);
  if (error) return [];
  return (data ?? []) as { topic_id: number; content: string }[];
}
