/**
 * Cerebro de NOVA para NOVA COURSE.
 * Responde con los datos reales de la plataforma (cursos, módulos, precios, avance del estudiante).
 * Funciona sin servidor de IA: entiende intenciones por palabras clave.
 */
import { formatCOP } from "../api";
import { getCourse, listCourses, myCourses } from "../data";
import type { CourseSummary, User } from "../types";
import { PHRASES, SPANISH } from "../idiomas/frases";

export interface NovaAction {
  label: string;
  to?: string; // ir a una página
  ask?: string; // preguntarle algo a NOVA
  read?: boolean; // leer la lección actual en voz alta
  href?: string; // abrir un sitio externo (fuentes)
  speak?: { text: string; lang: string }; // pronunciar en otro idioma
}

export interface NovaReply {
  text: string;
  /** Texto para la voz (si es distinto del escrito). */
  say?: string;
  actions?: NovaAction[];
  /** Frase que NOVA pronuncia en otro idioma después de hablar. */
  speakTarget?: { text: string; lang: string };
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
  quimica: ["quimica", "laboratorio", "reacciones", "moleculas", "tabla periodica"],
  biologia: ["biologia", "seres vivos", "celulas", "plantas", "animales", "naturaleza"],
  matematicas: ["matematicas", "calculo", "algebra", "numeros", "estadistica", "geometria"],
  astronomia: ["astronomia", "estrellas", "planetas", "universo", "telescopio", "espacio"],
  geologia: ["geologia", "rocas", "volcanes", "minerales", "terremotos", "mineria"],
  ecologia: ["ecologia", "ecosistemas", "biodiversidad", "bosques", "conservacion"],
  "ciencias-ambientales": ["ambiental", "contaminacion", "reciclaje", "cambio climatico", "medio ambiente"],
  genetica: ["genetica", "adn", "genes", "herencia", "crispr"],
  microbiologia: ["microbiologia", "bacterias", "virus", "microbios", "hongos", "laboratorio clinico"],
  bioquimica: ["bioquimica", "metabolismo", "enzimas", "proteinas"],
  "ciencias-naturales": ["ciencias naturales", "ciencias para ninos", "experimentos", "profesor de ciencias"],
  sociologia: ["sociologia", "sociedad", "desigualdad", "comunidades"],
  psicologia: ["psicologia", "mente", "comportamiento", "emociones", "salud mental", "terapia"],
  antropologia: ["antropologia", "culturas", "indigenas", "arqueologia", "etnografia"],
  historia: ["historia", "pasado", "independencia", "guerras", "memoria historica"],
  geografia: ["geografia", "mapas", "territorio", "regiones", "sig"],
  "ciencia-politica": ["politica", "gobierno", "elecciones", "estado", "democracia"],
  economia: ["economia", "dinero", "finanzas", "inflacion", "mercados", "inversion"],
  "relaciones-internacionales": ["relaciones internacionales", "diplomacia", "diplomatico", "onu", "comercio exterior", "cancilleria"],
  "trabajo-social": ["trabajo social", "ayudar a las personas", "comunidad", "familias", "victimas"],
  demografia: ["demografia", "poblacion", "censo", "natalidad", "migracion"],
  "ciencias-de-la-comunicacion": ["comunicacion", "periodismo", "periodista", "medios", "radio", "redes sociales"],
  "diseno-industrial": ["diseno industrial", "productos", "muebles", "prototipos", "impresion 3d"],
  "diseno-de-interiores": ["interiores", "decoracion", "espacios", "remodelar", "casa bonita"],
  "diseno-de-modas": ["moda", "ropa", "costura", "confeccion", "vestidos", "pasarela"],
  "artes-plasticas": ["pintura", "pintar", "escultura", "dibujar", "artes plasticas", "ceramica"],
  "artes-visuales": ["artes visuales", "arte digital", "instalacion", "video arte", "museo"],
  musica: ["musica", "cantar", "guitarra", "piano", "componer", "canciones", "produccion musical"],
  teatro: ["teatro", "actuar", "actor", "actriz", "escenario", "drama"],
  "cine-y-produccion-audiovisual": ["cine", "peliculas", "video", "youtube", "director", "audiovisual"],
  fotografia: ["fotografia", "fotos", "camara", "retrato"],
  "animacion-digital": ["animacion", "dibujos animados", "3d", "pixar", "videojuegos"],
  "escritura-creativa": ["escribir", "escritor", "novela", "cuentos", "poesia", "libro"],
  arquitectura: ["arquitectura", "arquitecto", "edificios", "planos", "construccion de casas"],
  publicidad: ["publicidad", "anuncios", "campanas", "marcas", "marketing", "creativo"],
  // Datos
  "ciencia-de-datos": ["datos", "ciencia de datos", "cientifico de datos", "data science", "pandas", "jupyter"],
  estadistica: ["estadistica", "probabilidad", "encuestas", "promedio", "muestreo"],
  "analisis-de-datos": ["datos", "analisis de datos", "analista de datos", "sql", "limpieza de datos"],
  "aprendizaje-automatico": ["machine learning", "aprendizaje automatico", "modelos predictivos", "scikit"],
  "mineria-de-datos": ["mineria de datos", "data mining", "patrones", "clustering"],
  "inteligencia-de-negocios": ["inteligencia de negocios", "business intelligence", " bi ", "kpi", "indicadores"],
  econometria: ["econometria", "regresion", "series de tiempo", "evaluacion de impacto"],
  "bases-de-datos": ["base de datos", "bases de datos", "postgresql", "mysql", "mongodb", "sql"],
  "analitica-predictiva": ["analitica predictiva", "predecir", "pronostico", "prediccion", "churn"],
  bioestadistica: ["bioestadistica", "epidemiologia", "ensayos clinicos", "estadistica en salud"],
  // Educación
  pedagogia: ["pedagogia", "docente", "profesor", "maestro", "ensenar", "licenciatura"],
  "educacion-infantil": ["educacion infantil", "primera infancia", "preescolar", "jardin", "ninos pequenos"],
  "educacion-primaria": ["primaria", "maestra de primaria", "escuela", "lectoescritura"],
  "educacion-secundaria": ["secundaria", "bachillerato", "colegio", "adolescentes"],
  "educacion-especial": ["educacion especial", "discapacidad", "autismo", "braille", "sindrome de down"],
  "educacion-inclusiva": ["inclusion", "educacion inclusiva", "diversidad", "piar", "dua"],
  didactica: ["didactica", "estrategias de ensenanza", "planear clases", "secuencia didactica"],
  psicopedagogia: ["psicopedagogia", "dificultades de aprendizaje", "dislexia", "tdah"],
  "administracion-educativa": ["rector", "coordinador", "gestion escolar", "administracion educativa", "pei"],
  "tecnologia-educativa": ["tecnologia educativa", "tic en el aula", "edtech", "gamificacion"],
  "educacion-bilingue": ["bilingue", "bilinguismo", "ensenar ingles", "clil"],
  "educacion-virtual": ["educacion virtual", "clases virtuales", "e-learning", "moodle", "cursos en linea"],
  "orientacion-escolar": ["orientacion escolar", "orientador", "orientacion vocacional", "convivencia escolar"],
  // Ingeniería
  "ingenieria-de-software": ["ingenieria de software", "arquitectura de software", "requisitos", "uml"],
  "ingenieria-informatica": ["ingenieria informatica", "algoritmos", "sistemas operativos", "computacion"],
  "ingenieria-electronica": ["electronica", "circuitos", "transistores", "microcontroladores", "pcb"],
  "ingenieria-electrica": ["ingenieria electrica", "electricista", "instalaciones electricas", "retie", "transformadores"],
  "ingenieria-industrial": ["ingenieria industrial", "procesos", "produccion", "productividad", "lean"],
  "ingenieria-civil": ["ingenieria civil", "construccion", "puentes", "carreteras", "estructuras", "obras"],
  "ingenieria-mecanica": ["ingenieria mecanica", "maquinas", "motores", "termodinamica", "mecanico"],
  "ingenieria-mecatronica": ["mecatronica", "plc", "automatizacion", "robots industriales"],
  "ingenieria-ambiental": ["ingenieria ambiental", "aguas residuales", "residuos", "impacto ambiental"],
  "ingenieria-quimica": ["ingenieria quimica", "procesos quimicos", "reactores", "refineria"],
  "ingenieria-biomedica": ["biomedica", "equipos medicos", "protesis", "dispositivos medicos"],
  "ingenieria-de-telecomunicaciones": ["telecomunicaciones", "antenas", "5g", "fibra optica", "satelites"],
  "ingenieria-aeroespacial": ["aeroespacial", "aviones", "cohetes", "aviacion", "aeronautica", "drones"],
  "ingenieria-de-minas": ["ingenieria de minas", "mineria", "minas", "minerales", "oro"],
  "ingenieria-de-petroleos": ["petroleo", "petroleos", "hidrocarburos", "gas natural", "pozos"],
  "ingenieria-agricola": ["ingenieria agricola", "agricultura", "riego", "campo", "cultivos", "tractores"],
  // Negocios
  "administracion-de-empresas": ["administracion de empresas", "administrador", "gerente", "empresa", "gerencia"],
  contabilidad: ["contabilidad", "contador", "contable", "impuestos", "niif", "nomina"],
  finanzas: ["finanzas", "inversiones", "bolsa", "acciones", "ahorro", "credito"],
  mercadeo: ["mercadeo", "marketing", "ventas", "clientes", "redes sociales", "marca"],
  "comercio-internacional": ["comercio internacional", "exportar", "importar", "aduanas", "incoterms"],
  "negocios-internacionales": ["negocios internacionales", "internacionalizacion", "otros paises", "multinacional"],
  emprendimiento: ["emprender", "emprendimiento", "mi negocio", "startup", "idea de negocio", "negocio propio"],
  "gestion-de-proyectos": ["gestion de proyectos", "proyectos", "pmi", "cronograma", "scrum", "gerente de proyectos"],
  "recursos-humanos": ["recursos humanos", "talento humano", "seleccion de personal", "reclutamiento", "nomina"],
  logistica: ["logistica", "inventarios", "bodega", "transporte", "distribucion", "envios"],
  "gestion-empresarial": ["pyme", "mi empresa", "pequena empresa", "gestion empresarial", "negocio familiar"],
  "economia-empresarial": ["economia empresarial", "precios", "competencia", "microeconomia"],
  "gestion-de-operaciones": ["operaciones", "gestion de operaciones", "calidad", "procesos productivos"],
  "administracion-publica": ["administracion publica", "sector publico", "gobierno", "contratacion estatal", "funcionario"],
  "gestion-de-la-innovacion": ["innovacion", "innovar", "design thinking", "creatividad", "patentes"],
  // Salud
  medicina: ["medicina", "medico", "doctor", "anatomia", "enfermedades"],
  enfermeria: ["enfermeria", "enfermera", "enfermero", "cuidado de pacientes"],
  odontologia: ["odontologia", "odontologo", "dientes", "salud oral", "dentista"],
  farmacia: ["farmacia", "medicamentos", "drogueria", "farmaceutico", "regente"],
  "nutricion-y-dietetica": ["nutricion", "dieta", "alimentacion", "nutricionista", "comer sano"],
  fisioterapia: ["fisioterapia", "fisioterapeuta", "rehabilitacion", "lesiones"],
  "terapia-ocupacional": ["terapia ocupacional", "terapeuta ocupacional", "actividades de la vida diaria"],
  bacteriologia: ["bacteriologia", "laboratorio clinico", "examenes de sangre", "bacteriologo"],
  "salud-publica": ["salud publica", "epidemiologia", "vacunacion", "pandemia", "prevencion"],
  "psicologia-clinica": ["psicologia clinica", "psicoterapia", "terapia psicologica", "ansiedad", "depresion"],
  optometria: ["optometria", "optometra", "vista", "gafas", "lentes", "ojos"],
  fonoaudiologia: ["fonoaudiologia", "fonoaudiologo", "habla", "lenguaje", "audicion", "voz"],
  // Deporte
  "ciencias-del-deporte": ["ciencias del deporte", "deportes", "rendimiento deportivo", "deportista"],
  "entrenamiento-deportivo": ["entrenamiento deportivo", "entrenador", "director tecnico", "equipo deportivo"],
  "preparacion-fisica": ["preparacion fisica", "preparador fisico", "fuerza", "velocidad", "pliometria"],
  "gestion-deportiva": ["gestion deportiva", "club deportivo", "eventos deportivos", "dirigente"],
  "fisiologia-del-ejercicio": ["fisiologia del ejercicio", "vo2", "frecuencia cardiaca", "metabolismo"],
  "biomecanica-deportiva": ["biomecanica", "tecnica deportiva", "movimiento", "analisis de video"],
  recreacion: ["recreacion", "recreador", "juegos", "campamentos", "animacion", "tiempo libre"],
  "entrenamiento-personal": ["entrenador personal", "personal trainer", "gimnasio", "clientes fitness"],
  // Tecnología
  "desarrollo-de-software": ["desarrollador", "full stack", "desarrollo web", "paginas web", "react", "fastapi"],
  ciberseguridad: ["ciberseguridad", "seguridad informatica", "hackers", "hacking etico", "virus informatico"],
  "redes-y-telecomunicaciones": ["redes", "cisco", "wifi", "internet", "router", "cableado"],
  "internet-de-las-cosas": ["iot", "internet de las cosas", "domotica", "sensores", "casa inteligente"],
  "computacion-forense": ["forense", "informatica forense", "evidencia digital", "peritaje", "investigacion digital"],
  "administracion-de-sistemas": ["administrador de sistemas", "linux", "windows server", "servidores", "sysadmin"],
  "desarrollo-de-aplicaciones-moviles": ["aplicaciones moviles", "apps", "android", "ios", "flutter", "celular"],
  "realidad-virtual-y-aumentada": ["realidad virtual", "realidad aumentada", "metaverso", "unity", "vr", "gafas virtuales"],
  devops: ["devops", "ci/cd", "docker", "kubernetes", "despliegue", "terraform"],
  "automatizacion-industrial": ["automatizacion industrial", "plc", "scada", "fabrica", "neumatica"],
  blockchain: ["blockchain", "bitcoin", "criptomonedas", "ethereum", "contratos inteligentes", "nft"],
  "soporte-tecnico": ["soporte tecnico", "arreglar computadores", "mantenimiento de computadores", "mesa de ayuda", "tecnico"],
  "sistemas-de-informacion": ["sistemas de informacion", "erp", "crm", "procesos de negocio", "transformacion digital"],
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

// Palabras que comparten muchos cursos: no bastan para elegir uno (ahí decide la recomendación por intereses)
const GENERIC_WORDS = new Set(["datos", "fundamentos", "tecnologia", "educacion", "ingenieria", "gestion", "administracion", "ciencias", "ciencia", "desarrollo", "sistemas", "entrenamiento", "analisis", "internacional", "internacionales"]);

function findCourse(t: string, list: CourseSummary[]): CourseSummary | undefined {
  // Puntaje: nombre completo = 2; si no, la fracción de palabras del nombre que aparecen (Física gana a Educación Física)
  let best: CourseSummary | undefined;
  let bestScore = 0;
  for (const c of list) {
    // Sin paréntesis ni signos: "Medicina (Fundamentos)" → "medicina fundamentos" (evita expresiones regulares inválidas)
    const title = norm(c.title).replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
    // "datos" es muy general (Big Data y Visualización): ahí decide la recomendación por intereses
    const words = title.split(" ").filter((w) => w.length > 4 && !GENERIC_WORDS.has(w));
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
    text: `¡Hola${name ? `, ${name}` : ""}! Soy NOVA, la asistente de NOVA COURSE de Orion Nova Technologies. Te ayudo a elegir un curso o un idioma, te cuento qué es gratis, cómo pagar y cómo sacar tu certificado. También te digo cómo se dice algo en otro idioma. Si estás en una lección, también te la puedo leer en voz alta. ¿Qué te gustaría aprender?`,
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

  // ¿Cómo se dice X en un idioma?
  const howSay = /como se dice (.+?) en ([a-z ]+?) ?$/.exec(t.trim()) ?? /como digo (.+?) en ([a-z ]+?) ?$/.exec(t.trim());
  if (howSay) {
    const [, what, langName] = howSay;
    const langCourse = list.find((c) => c.lang && c.lang !== "lsc" && norm(c.title).startsWith(langName.trim()));
    if (!langCourse || !langCourse.lang) {
      return { text: `No encontré el idioma «${langName}». Tenemos ${list.filter((c) => c.lang).length} idiomas.`, actions: [{ label: "Ver idiomas", to: "/cursos?categoria=Idiomas" }] };
    }
    const lang = langCourse.lang;
    const langLower = langCourse.title.toLowerCase();
    const idx = SPANISH.findIndex((s) => norm(s) === norm(what) || norm(what).includes(norm(s)) && norm(s).length > 3);
    const raw = idx >= 0 ? PHRASES[lang]?.[idx] : undefined;
    if (!raw) {
      return {
        text: `Todavía no tengo «${what}» en ${langLower}. Por ahora sé frases como: hola, gracias, por favor, ¿cómo te llamas?, los números del 1 al 10, agua o ¿dónde está el baño?`,
        actions: [{ label: `Curso de ${langCourse.title}`, to: `/cursos/${langCourse.slug}` }],
      };
    }
    const [text, roman] = raw.split("|");
    return {
      text: `«${SPANISH[idx]}» en ${langLower} se dice: ${text}${roman ? ` (se pronuncia: ${roman})` : ""}`,
      say: `${SPANISH[idx]}, en ${langLower}, se dice:`,
      speakTarget: { text, lang },
      actions: [{ label: "Escuchar otra vez", speak: { text, lang } }, { label: `Curso de ${langCourse.title}`, to: `/cursos/${langCourse.slug}` }],
    };
  }

  // Idiomas
  if (!course && has(t, "idioma", "idiomas", "lenguas extranjeras", "aprender a hablar", "bilingue")) {
    const langs = list.filter((c) => c.lang);
    return {
      text: `Tenemos ${langs.length} idiomas, del nivel A1 al C1: ${langs.map((c) => c.title).join(", ")}. Los módulos 1 al 5 son gratis. Yo te pronuncio las frases, practicas escucha, lectura y dictado, y puedes repetir en voz alta para que te corrija.`,
      say: `Tenemos ${langs.length} idiomas, del nivel A1 al C1. Los módulos del uno al cinco son gratis, y yo te pronuncio las frases para que practiques.`,
      actions: [
        { label: "Ver idiomas", to: "/cursos?categoria=Idiomas" },
        { label: "¿Cómo se dice gracias en japonés?", ask: "¿Cómo se dice gracias en japonés?" },
        ...langs.slice(0, 2).map(goCourse),
      ],
    };
  }

  // Fuentes y referencias
  if (has(t, "fuente", "referencia", "bibliografia", "de donde", "donde sacaron", "donde salio", "respaldo", "documentos oficiales")) {
    if (!course)
      return {
        text: "Cada curso tiene su sección «Fuentes y referencias» con documentos oficiales verificados: leyes de Colombia, guías del Ministerio de Educación, la OMS, y la documentación oficial de Python, React, AWS y otras. ¿De qué curso quieres ver las fuentes?",
        actions: list.slice(0, 4).map((c) => ({ label: `Fuentes de ${c.title}`, ask: `Fuentes de ${c.title}` })),
      };
    const detail = await getCourse(course.slug, null).catch(() => null);
    const sources = detail?.sources ?? [];
    return {
      text: sources.length
        ? `Fuentes de ${course.title}:\n${sources.map((s) => `• ${s.title} (${s.publisher})`).join("\n")}`
        : `Todavía no hay fuentes registradas para ${course.title}.`,
      say: `${course.title} se apoya en ${sources.length} fuentes oficiales. Te las dejo en pantalla para que las abras.`,
      actions: [...sources.slice(0, 3).map((s) => ({ label: s.title.length > 38 ? s.title.slice(0, 36) + "…" : s.title, href: s.url })), goCourse(course)],
    };
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
      text: "El pago es único por curso y se hace con Wompi de Bancolombia: PSE, Nequi, Bancolombia o tarjeta. En cuanto el pago se aprueba, se abren los módulos 6 al 10 y queda habilitado tu certificado.",
      actions: course ? [goCourse(course)] : [{ label: "Ver cursos", to: "/cursos" }],
    };
  }

  // Precio
  if (has(t, "precio", "cuesta", "cuanto vale", "valor", "costo", "cuanto cobran", "cuanto es", "pagar")) {
    if (course)
      return {
        text: `${course.title}: los módulos 1 al 5 son gratis. El curso completo, con los módulos 6 al 10 y el certificado, cuesta ${formatCOP(course.price_cop)} en un solo pago.`,
        actions: [goCourse(course)],
      };
    const prices = [...new Set(list.map((c) => c.price_cop))];
    return {
      text:
        prices.length === 1
          ? `Cada curso tiene los módulos 1 al 5 gratis. El curso completo con certificado cuesta ${formatCOP(prices[0])} en un solo pago, sin mensualidades.`
          : "Cada curso tiene los módulos 1 al 5 gratis. El precio del curso completo con certificado aparece en la página de cada curso.",
      actions: [{ label: "¿Cómo pago?", ask: "¿Cómo pago?" }, { label: "Ver cursos", to: "/cursos" }],
    };
  }

  // Certificado
  if (has(t, "certificado", "certifica", "diploma", "titulo", "aval")) {
    return {
      text: "El certificado lo expide ORION NOVA TECHNOLOGIES. Para obtenerlo: desbloquea el curso completo y marca como vistos los 120 temas. Después pulsa «Obtener certificado» en la página del curso. Sale en PDF con tu nombre, 120 horas, un código único y un QR para que cualquier empresa lo verifique.",
      actions: [{ label: "Verificar un certificado", to: "/verificar" }, ...(course ? [goCourse(course)] : [])],
    };
  }

  // Gratis
  if (has(t, "gratis", "gratuito", "free", "sin pagar", "sin costo")) {
    return {
      text: `Con una cuenta gratis abres los módulos 1 al 5 de los ${list.length} cursos: 60 temas por curso, sin tarjeta. Los módulos 6 al 10 y el certificado se desbloquean con un pago único.`,
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
      text: `${course.title}: ${course.summary}\nTiene 10 módulos y 120 temas:\n${modules}\nEl curso completo con certificado cuesta ${formatCOP(course.price_cop)}.`,
      say: `${course.title}. ${course.summary} Tiene 10 módulos y 120 temas. Los cinco primeros módulos son gratis.`,
      actions: [goCourse(course), { label: "¿Qué es gratis?", ask: "¿Qué es gratis?" }],
    };
  }

  // Recomendación por intereses
  const recs = recommend(t, list);
  if (recs.length) {
    const names = recs.map((c) => c.title);
    return {
      text: `Por lo que me cuentas, te recomiendo: ${names.join(", ")}. Puedes empezar gratis con los módulos 1 al 5 y decidir después.`,
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
      text: `Tenemos ${list.length} cursos en ${new Set(list.map((c) => c.category)).size} áreas: ${Array.from(new Set(list.map((c) => c.category))).sort().join(", ")}. Cada uno con 10 módulos y 120 temas. Cuéntame qué te gusta y te recomiendo uno.`,
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
