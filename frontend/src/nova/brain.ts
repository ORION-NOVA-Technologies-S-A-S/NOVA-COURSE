/**
 * Cerebro de NOVA para NOVA COURSE.
 * Responde con los datos reales de la plataforma (cursos, módulos, precios, avance del estudiante).
 * Funciona sin servidor de IA: entiende intenciones por palabras clave.
 */
import { formatCOP } from "../api";
import { getCourse, listCourses, myCourses } from "../data";
import type { CourseSummary, User } from "../types";

export interface NovaAction {
  label: string;
  to?: string; // ir a una página
  ask?: string; // preguntarle algo a NOVA
  read?: boolean; // leer la lección actual en voz alta
}

export interface NovaReply {
  text: string;
  /** Texto para la voz (si es distinto del escrito). */
  say?: string;
  actions?: NovaAction[];
}

/** Lección abierta en pantalla (la pone LessonPage para que NOVA pueda leerla). */
export interface LessonContext {
  title: string;
  course: string;
  module: string;
  content: string;
}
let currentLesson: LessonContext | null = null;
export const setCurrentLesson = (l: LessonContext | null) => {
  currentLesson = l;
};
export const getCurrentLesson = () => currentLesson;

export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));

/** Palabras que relacionan intereses con cada curso. */
const INTERESTS: Record<string, string[]> = {
  "diseno-grafico": ["diseno", "grafico", "logo", "marca", "dibuj", "ilustra", "creativ", "photoshop", "illustrator", "redes sociales", "publicidad", "arte"],
  "programacion-de-software": ["program", "codigo", "software", "python", "javascript", "react", "app", "aplicacion", "pagina web", "desarroll", "backend", "frontend"],
  "ingenieria-de-sistemas": ["sistemas", "redes", "computador", "servidor", "base de datos", "bases de datos", "ingenieria", "informatica", "tecnologia", "soporte"],
  "inteligencia-artificial": ["inteligencia artificial", " ia ", "machine learning", "chatgpt", "claude", "redes neuronales", "aprendizaje automatico", "deep learning", "robot que piensa"],
  derecho: ["derecho", "abogad", "ley", "leyes", "juridic", "constitucion", "contrato", "tutela", "justicia"],
  "energias-renovables": ["energia", "solar", "panel", "eolic", "renovable", "ambiente", "sostenib", "electric", "clima"],
  robotica: ["robot", "arduino", "electronica", "sensor", "motor", "automatiz", "humanoide", "mecatronica", "esp32"],
  "licenciatura-lengua-castellana": ["lengua", "castellano", "espanol", "literatura", "leer", "escribir", "redaccion", "ortografia", "docente", "profesor", "ensenar", "gramatica"],
  "educacion-fisica": ["educacion fisica", "deporte", "entrenador", "profesor de educacion", "recreacion", "futbol", "baloncesto"],
  fisica: ["fisica", "ciencia", "newton", "mecanica", "electricidad y magnetismo", "cuantica", "universo", "icfes", "saber 11"],
  "ejercicios-fisicos": ["ejercicio", "gimnasio", "rutina", "bajar de peso", "fuerza", "musculo", "cardio", "yoga", "salud", "estar en forma", "entrenar"],
  "visualizacion-de-datos": ["grafica", "graficos", "dashboard", "power bi", "excel", "visualiz", "tableau", "reporte", "informe"],
  "big-data": ["big data", "datos masivos", "spark", "hadoop", "analisis de datos", "datos", "data"],
  "cloud-computing": ["nube", "cloud", "aws", "azure", "google cloud", "docker", "kubernetes", "servidores", "devops"],
  "administracion-hotelera-y-turistica": ["hotel", "turismo", "turistic", "restaurante", "hospedaje", "viajes", "gastronomia", "huila", "recepcion", "administracion"],
};

let catalog: CourseSummary[] | null = null;
async function courses(): Promise<CourseSummary[]> {
  if (!catalog) catalog = await listCourses();
  return catalog;
}

function findCourse(t: string, list: CourseSummary[]): CourseSummary | undefined {
  // Puntaje: nombre completo = 2; si no, la fracción de palabras del nombre que aparecen (Física gana a Educación Física)
  let best: CourseSummary | undefined;
  let bestScore = 0;
  for (const c of list) {
    const title = norm(c.title);
    // "datos" es muy general (Big Data y Visualización): ahí decide la recomendación por intereses
    const words = title.split(" ").filter((w) => w.length > 4 && w !== "datos");
    const score = t.includes(` ${title} `) || t.includes(title)
      ? 2 + title.length / 100
      : words.filter((w) => new RegExp(`\\b${w}\\b`).test(t)).length / Math.max(words.length, 1);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return bestScore >= 0.5 ? best : undefined;
}

function recommend(t: string, list: CourseSummary[]): CourseSummary[] {
  const padded = ` ${t} `;
  return list
    .map((c) => ({ c, score: (INTERESTS[c.slug] ?? []).filter((k) => padded.includes(k)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.c);
}

const goCourse = (c: CourseSummary): NovaAction => ({ label: `Ver ${c.title}`, to: `/cursos/${c.slug}` });

export const STARTER_ACTIONS: NovaAction[] = [
  { label: "¿Qué curso me recomiendas?", ask: "¿Qué curso me recomiendas?" },
  { label: "¿Qué es gratis?", ask: "¿Qué es gratis?" },
  { label: "¿Cómo obtengo el certificado?", ask: "¿Cómo obtengo el certificado?" },
  { label: "Ver todos los cursos", to: "/cursos" },
];

export function greeting(user: User | null): NovaReply {
  const name = user?.full_name.split(" ")[0];
  return {
    text: `¡Hola${name ? `, ${name}` : ""}! Soy NOVA, la asistente de NOVA COURSE de Orion Nova Technologies. Te ayudo a elegir un curso, te cuento qué es gratis, cómo pagar y cómo sacar tu certificado. Si estás en una lección, también te la puedo leer en voz alta. ¿Qué te gustaría aprender?`,
    actions: STARTER_ACTIONS,
  };
}

export async function reply(input: string, user: User | null): Promise<NovaReply> {
  const t = ` ${norm(input)} `;
  const list = await courses().catch(() => [] as CourseSummary[]);
  const course = findCourse(t, list);
  const lesson = currentLesson;

  // Saludo
  if (/^ (hola|buenas|buenos dias|buenas tardes|buenas noches|hey|holi|que mas|quiubo) ?$/.test(t) || (t.length < 14 && has(t, "hola"))) {
    return greeting(user);
  }

  // Leer o explicar la lección abierta
  if (has(t, "lee", "leer", "leeme", "lectura", "explica", "resume", "resumen", "este tema", "esta leccion") && !course) {
    if (!lesson) {
      return {
        text: "Para leerte una lección, ábrela primero. Entra a un curso, elige un tema y vuelve a pedírmelo.",
        actions: [{ label: "Ver cursos", to: "/cursos" }],
      };
    }
    if (has(t, "resume", "resumen", "explica")) {
      const objective = /### Objetivo de aprendizaje\s*\n([^\n]+)/.exec(lesson.content)?.[1] ?? "";
      const concepts = [...lesson.content.matchAll(/^\d+\.\s+(.+)$/gm)].map((m) => m[1]).join(" ");
      return {
        text: `Resumen de «${lesson.title}» (${lesson.course}).\n${objective}\n${concepts}`.trim(),
        actions: [{ label: "Léemela completa", read: true }],
      };
    }
    return { text: `Te leo «${lesson.title}». Puedes detenerme con el botón del parlante.`, say: lesson.content };
  }

  // Avance del estudiante
  if (has(t, "progreso", "como voy", "mi avance", "mis cursos", "cuanto me falta", "continuar", "seguir estudiando")) {
    if (!user) {
      return {
        text: "Para ver tu avance necesito que ingreses a tu cuenta. Si no tienes, créala gratis en un minuto.",
        actions: [
          { label: "Ingresar", to: "/ingresar" },
          { label: "Crear cuenta gratis", to: "/registro" },
        ],
      };
    }
    const mine = await myCourses().catch(() => []);
    if (!mine.length)
      return { text: "Todavía no has empezado ningún curso. ¿Te ayudo a escoger uno?", actions: [STARTER_ACTIONS[0]] };
    const lines = mine.map((c) => {
      const pct = c.total_topics ? Math.round((100 * c.completed_topics) / c.total_topics) : 0;
      return `• ${c.title}: ${pct}% (${c.completed_topics} de ${c.total_topics} temas)${c.certificate_code ? " · certificado listo" : ""}`;
    });
    const next = [...mine].sort((a, b) => b.completed_topics - a.completed_topics)[0];
    return {
      text: `Así vas, ${user.full_name.split(" ")[0]}:\n${lines.join("\n")}\n¡Sigue así!`,
      actions: [{ label: `Continuar ${next.title}`, to: `/cursos/${next.slug}` }, { label: "Mi aprendizaje", to: "/mi-aprendizaje" }],
    };
  }

  // Formas de pago
  if (has(t, "pse", "nequi", "tarjeta", "wompi", "bancolombia", "daviplata", "como pago", "como se paga", "medio de pago", "metodo de pago", "forma de pago")) {
    return {
      text: "El pago es único por curso y se hace con Wompi de Bancolombia: PSE, Nequi, Bancolombia o tarjeta. En cuanto el pago se aprueba, se abren los módulos 4 y 5 y queda habilitado tu certificado.",
      actions: course ? [goCourse(course)] : [{ label: "Ver cursos", to: "/cursos" }],
    };
  }

  // Precio
  if (has(t, "precio", "cuesta", "cuanto vale", "valor", "costo", "cuanto cobran", "cuanto es", "pagar")) {
    if (course)
      return {
        text: `${course.title}: los módulos 1, 2 y 3 son gratis. El curso completo, con los módulos 4 y 5 y el certificado, cuesta ${formatCOP(course.price_cop)} en un solo pago.`,
        actions: [goCourse(course)],
      };
    const prices = [...new Set(list.map((c) => c.price_cop))];
    return {
      text:
        prices.length === 1
          ? `Cada curso tiene los módulos 1, 2 y 3 gratis. El curso completo con certificado cuesta ${formatCOP(prices[0])} en un solo pago, sin mensualidades.`
          : "Cada curso tiene los módulos 1, 2 y 3 gratis. El precio del curso completo con certificado aparece en la página de cada curso.",
      actions: [{ label: "¿Cómo pago?", ask: "¿Cómo pago?" }, { label: "Ver cursos", to: "/cursos" }],
    };
  }

  // Certificado
  if (has(t, "certificado", "certifica", "diploma", "titulo", "aval")) {
    return {
      text: "El certificado lo expide ORION NOVA TECHNOLOGIES. Para obtenerlo: desbloquea el curso completo y marca como vistos los 60 temas. Después pulsa «Obtener certificado» en la página del curso. Sale en PDF con tu nombre, 60 horas, un código único y un QR para que cualquier empresa lo verifique.",
      actions: [{ label: "Verificar un certificado", to: "/verificar" }, ...(course ? [goCourse(course)] : [])],
    };
  }

  // Gratis
  if (has(t, "gratis", "gratuito", "free", "sin pagar", "sin costo")) {
    return {
      text: "Con una cuenta gratis abres los módulos 1, 2 y 3 de los 15 cursos: 36 temas por curso, sin tarjeta. Los módulos 4 y 5 y el certificado se desbloquean con un pago único.",
      actions: user ? [STARTER_ACTIONS[0]] : [{ label: "Crear cuenta gratis", to: "/registro" }, STARTER_ACTIONS[0]],
    };
  }

  // Registro / ingreso
  if (has(t, "registr", "crear cuenta", "inscrib", "matricul", "ingresar", "iniciar sesion", "entrar")) {
    if (user) return { text: `Ya estás dentro con ${user.email}. ¿Qué curso quieres empezar?`, actions: [STARTER_ACTIONS[0]] };
    return {
      text: "Crear tu cuenta es gratis: escribe tu nombre completo (así saldrá en el certificado), tu correo y una contraseña. Luego confirma el correo que te llega y listo.",
      actions: [{ label: "Crear cuenta gratis", to: "/registro" }, { label: "Ya tengo cuenta", to: "/ingresar" }],
    };
  }

  // Contraseña
  if (has(t, "contrasena", "clave", "olvide")) {
    return {
      text: "Si olvidaste tu contraseña, pide un enlace nuevo con tu correo y crea otra.",
      actions: [{ label: "Recuperar contraseña", to: "/recuperar" }],
    };
  }

  // Información de un curso concreto
  if (course) {
    const detail = await getCourse(course.slug, null).catch(() => null);
    const modules = detail?.modules.map((m) => `${m.position}. ${m.title}${m.is_free ? " (gratis)" : ""}`).join("\n") ?? "";
    return {
      text: `${course.title}: ${course.summary}\nTiene 5 módulos y 60 temas:\n${modules}\nEl curso completo con certificado cuesta ${formatCOP(course.price_cop)}.`,
      say: `${course.title}. ${course.summary} Tiene 5 módulos y 60 temas. Los tres primeros módulos son gratis.`,
      actions: [goCourse(course), { label: "¿Qué es gratis?", ask: "¿Qué es gratis?" }],
    };
  }

  // Recomendación por intereses
  const recs = recommend(t, list);
  if (recs.length) {
    const names = recs.map((c) => c.title);
    return {
      text: `Por lo que me cuentas, te recomiendo: ${names.join(", ")}. Puedes empezar gratis con los módulos 1 a 3 y decidir después.`,
      actions: recs.map(goCourse),
    };
  }
  if (has(t, "recomienda", "recomiendas", "que curso", "cual curso", "que estudio", "que puedo estudiar", "no se que", "aprender")) {
    return {
      text: "¡Con gusto! Cuéntame qué te gusta o a qué te dedicas. Por ejemplo: «me gusta la tecnología», «quiero trabajar en hoteles», «soy profesor» o «quiero ponerme en forma».",
      actions: [
        { label: "Me gusta la tecnología", ask: "Me gusta la tecnología y programar" },
        { label: "Quiero trabajar con datos", ask: "Quiero trabajar con datos" },
        { label: "Me interesan los robots", ask: "Me interesan los robots" },
        { label: "Quiero ponerme en forma", ask: "Quiero hacer ejercicio" },
      ],
    };
  }

  // Lista de cursos
  if (has(t, "cursos", "catalogo", "que tienen", "que ofrecen", "carreras", "programas")) {
    return {
      text: `Tenemos ${list.length} cursos: ${list.map((c) => c.title).join(", ")}. Cada uno con 5 módulos y 60 temas.`,
      actions: [{ label: "Ver todos los cursos", to: "/cursos" }, STARTER_ACTIONS[0]],
    };
  }

  if (has(t, "gracias", "chao", "adios", "hasta luego", "listo")) {
    return { text: "¡Con gusto! Aquí estaré cuando me necesites. ¡Mucho éxito en tu aprendizaje!" };
  }

  if (has(t, "quien eres", "que eres", "como te llamas", "tu nombre")) {
    return {
      text: "Soy NOVA, el humanoide de Orion Nova Technologies. En NOVA COURSE te acompaño en tus cursos: te recomiendo qué estudiar, resuelvo dudas de la plataforma y te leo las lecciones.",
      actions: STARTER_ACTIONS,
    };
  }

  return {
    text: "No te entendí bien. Puedo recomendarte un curso, contarte el temario de cualquier curso, explicarte precios y pagos, cómo sacar el certificado o leerte la lección que tengas abierta.",
    actions: STARTER_ACTIONS,
  };
}
