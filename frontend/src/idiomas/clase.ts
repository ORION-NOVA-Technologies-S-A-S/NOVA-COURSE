/**
 * Clases "de tú a tú" con NOVA: conversaciones guiadas por nivel (A1 a C2) con las 84 frases de cada idioma.
 * Los números son posiciones en SPANISH / PHRASES (ver frases.ts).
 */

import { SPANISH_ADVANCED } from "./frases_avanzadas";

export interface Turn {
  /** Frase que NOVA dice en el idioma (opcional). */
  nova?: number;
  /** Instrucción en español para el estudiante. */
  tip: string;
  /** Frases que se aceptan como respuesta. */
  expect: number[];
  /** Lo que NOVA contesta cuando el estudiante acierta (opcional). */
  after?: number;
}

export type Cefr = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export const CEFR_LEVELS: Cefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const CEFR_NAMES: Record<Cefr, string> = {
  A1: "Básico", A2: "Básico", B1: "Intermedio", B2: "Intermedio", C1: "Avanzado", C2: "Avanzado",
};

export interface Scenario {
  id: string;
  title: string;
  level: string;
  /** Nivel del Marco Común Europeo al que pertenece la clase. "libre" = práctica que no cuenta para el certificado. */
  cefr: Cefr | "libre";
  description: string;
  turns: Turn[] | "random" | "random-all";
}

export const SCENARIOS: Scenario[] = [
  {
    id: "saludar",
    cefr: "A1",
    title: "Saludar",
    level: "Módulo 1",
    description: "NOVA te saluda y tú le respondes.",
    turns: [
      { nova: 1, tip: "NOVA te da los buenos días. Respóndele el saludo.", expect: [1, 0] },
      { nova: 10, tip: "NOVA te pregunta cómo estás. Dile que estás bien.", expect: [11] },
      { nova: 14, tip: "NOVA dice «mucho gusto». Respóndele lo mismo.", expect: [14] },
      { tip: "Dale las gracias a NOVA.", expect: [5], after: 6 },
      { nova: 3, tip: "NOVA se despide. Despídete tú también.", expect: [3, 19] },
    ],
  },
  {
    id: "presentarte",
    cefr: "A1",
    title: "Presentarte",
    level: "Módulos 2 y 3",
    description: "Di tu nombre, de dónde eres y si hablas español.",
    turns: [
      { nova: 0, tip: "NOVA te saluda. Salúdala.", expect: [0, 1] },
      { nova: 12, tip: "NOVA te pregunta tu nombre. Responde con la frase «Me llamo Ana».", expect: [13], after: 14 },
      { nova: 15, tip: "NOVA te pregunta de dónde eres. Dile que eres de Colombia.", expect: [16] },
      { nova: 18, tip: "NOVA te pregunta si hablas español. Responde que sí.", expect: [8] },
      { nova: 19, tip: "NOVA se despide con «hasta luego». Despídete.", expect: [19, 3] },
    ],
  },
  {
    id: "cafeteria",
    cefr: "A2",
    title: "En la cafetería",
    level: "Módulos 4 y 5",
    description: "Pide un café, pregunta el precio y da las gracias.",
    turns: [
      { nova: 0, tip: "Llegas a la cafetería y NOVA te saluda. Salúdala.", expect: [0, 1] },
      { tip: "Pide un café: di «café».", expect: [35] },
      { tip: "Ahora agrega «por favor».", expect: [4] },
      { tip: "Pregunta cuánto cuesta.", expect: [38], after: 24 },
      { tip: "NOVA te dijo el precio (cinco). Dale las gracias.", expect: [5], after: 6 },
      { tip: "Pregunta dónde está el baño.", expect: [39] },
      { tip: "Despídete de NOVA.", expect: [3, 19] },
    ],
  },
  {
    id: "numeros",
    cefr: "A1",
    title: "Números",
    level: "Módulo 3",
    description: "NOVA dice un número y tú dices el que sigue.",
    turns: [
      { nova: 20, tip: "NOVA dice «uno». Di el número que sigue.", expect: [21] },
      { nova: 22, tip: "NOVA dice «tres». Di el número que sigue.", expect: [23] },
      { nova: 24, tip: "NOVA dice «cinco». Di el número que sigue.", expect: [25] },
      { nova: 26, tip: "NOVA dice «siete». Di el número que sigue.", expect: [27] },
      { nova: 28, tip: "NOVA dice «nueve». Di el número que sigue.", expect: [29] },
    ],
  },
  {
    id: "familia",
    cefr: "A1",
    title: "Familia y casa",
    level: "Módulos 4 y 5",
    description: "NOVA te pregunta cómo se dicen las palabras de todos los días.",
    turns: [
      { tip: "¿Cómo se dice «madre»?", expect: [30] },
      { tip: "¿Cómo se dice «padre»?", expect: [31] },
      { tip: "¿Cómo se dice «hermano»?", expect: [32] },
      { tip: "¿Cómo se dice «amigo»?", expect: [33] },
      { tip: "¿Cómo se dice «casa»?", expect: [37] },
      { tip: "¿Cómo se dice «agua»?", expect: [34] },
    ],
  },
  {
    id: "dias",
    cefr: "A1",
    title: "Días de la semana",
    level: "Módulo 6",
    description: "NOVA dice un día y tú dices el que sigue.",
    turns: [
      { nova: 40, tip: "NOVA dice «lunes». Di el día que sigue.", expect: [41] },
      { nova: 41, tip: "NOVA dice «martes». Di el día que sigue.", expect: [42] },
      { nova: 42, tip: "NOVA dice «miércoles». Di el día que sigue.", expect: [43] },
      { nova: 43, tip: "NOVA dice «jueves». Di el día que sigue.", expect: [44] },
      { nova: 44, tip: "NOVA dice «viernes». Di el día que sigue.", expect: [45] },
      { nova: 45, tip: "NOVA dice «sábado». Di el día que sigue.", expect: [46] },
    ],
  },
  {
    id: "colores",
    cefr: "A1",
    title: "Colores",
    level: "Módulo 6",
    description: "NOVA te pregunta cómo se dicen los colores.",
    turns: [
      { tip: "¿Cómo se dice «rojo»?", expect: [47] },
      { tip: "¿Cómo se dice «azul»?", expect: [48] },
      { tip: "¿Cómo se dice «verde»?", expect: [49] },
      { tip: "¿Cómo se dice «blanco»?", expect: [50] },
      { tip: "¿Cómo se dice «negro»?", expect: [51] },
    ],
  },
  {
    id: "restaurante",
    cefr: "A2",
    title: "En el restaurante",
    level: "Módulo 7",
    description: "Di que tienes hambre, pide agua y pide la cuenta.",
    turns: [
      { nova: 1, tip: "El mesero (NOVA) te da los buenos días. Respóndele.", expect: [1, 0] },
      { tip: "Dile que tienes hambre.", expect: [56] },
      { tip: "Pide agua: di «agua».", expect: [34] },
      { tip: "Agrega «por favor».", expect: [4] },
      { tip: "Ya comiste. Pide la cuenta.", expect: [58] },
      { tip: "Da las gracias.", expect: [5], after: 6 },
      { tip: "Despídete.", expect: [3, 19] },
    ],
  },
  {
    id: "viaje",
    cefr: "A2",
    title: "De viaje",
    level: "Módulo 8",
    description: "Llegas de noche a otra ciudad y buscas tu hotel.",
    turns: [
      { nova: 2, tip: "NOVA te dice «buenas noches». Respóndele igual.", expect: [2] },
      { tip: "Dile que no entiendes.", expect: [17] },
      { tip: "Pregunta dónde está el hotel.", expect: [59] },
      { tip: "Pregunta cuánto cuesta.", expect: [38], after: 26 },
      { tip: "NOVA te dijo el precio (siete). Dile que estás cansado.", expect: [57] },
      { tip: "Da las gracias.", expect: [5], after: 6 },
      { tip: "Despídete con «hasta luego».", expect: [19] },
    ],
  },
  {
    id: "tiempo",
    cefr: "A2",
    title: "Hoy, mañana y ayer",
    level: "Módulo 9",
    description: "Pregunta la hora y habla de los días.",
    turns: [
      { tip: "Pregunta qué hora es.", expect: [55], after: 22 },
      { tip: "¿Cómo se dice «hoy»?", expect: [52] },
      { tip: "¿Cómo se dice «mañana» (el día siguiente)?", expect: [53] },
      { tip: "¿Cómo se dice «ayer»?", expect: [54] },
      { nova: 44, tip: "NOVA dice «viernes». Di el día que sigue.", expect: [45] },
      { nova: 46, tip: "NOVA dice «domingo». ¿Qué día empieza la semana? Di «lunes».", expect: [40] },
    ],
  },
  {
    id: "repaso-general",
    cefr: "libre",
    title: "Repaso general",
    level: "Módulo 10",
    description: "Diez frases al azar de todos los temas: repítelas como NOVA.",
    turns: "random-all",
  },
  {
    id: "repite",
    cefr: "libre",
    title: "Repite como NOVA",
    level: "Pronunciación",
    description: "NOVA dice frases al azar; tú las repites y te miras en la cámara.",
    turns: "random",
  },
];

/* ---------- Niveles B1 a C2: frases 60 a 83 ---------- */
const ADVANCED: { cefr: Cefr; title: string; from: number }[] = [
  { cefr: "B1", title: "Contar y opinar", from: 60 },
  { cefr: "B2", title: "En el trabajo", from: 66 },
  { cefr: "C1", title: "Argumentar", from: 72 },
  { cefr: "C2", title: "Matices y refranes", from: 78 },
];
for (const a of ADVANCED) {
  const idx = [0, 1, 2, 3, 4, 5].map((i) => a.from + i);
  SCENARIOS.push(
    {
      id: `${a.cefr.toLowerCase()}-di`,
      cefr: a.cefr,
      title: `${a.title}: ¿cómo dirías…?`,
      level: `Nivel ${a.cefr}`,
      description: "NOVA te da la frase en español y tú la dices en el idioma.",
      turns: idx.map((k) => ({ tip: `¿Cómo dirías: «${SPANISH_ADVANCED[k - 60]}»?`, expect: [k] })),
    },
    {
      id: `${a.cefr.toLowerCase()}-repite`,
      cefr: a.cefr,
      title: `${a.title}: repite como NOVA`,
      level: `Nivel ${a.cefr}`,
      description: "NOVA dice frases largas y tú las repites con buena pronunciación.",
      turns: idx.map((k) => ({ nova: k, tip: "Escucha a NOVA y repite la frase completa.", expect: [k] })),
    },
  );
}

/** Clases que hay que aprobar para certificar cada nivel. */
export const scenariosFor = (level: Cefr) => SCENARIOS.filter((s) => s.cefr === level);

/** Turnos de "Repite como NOVA": 8 frases distintas al azar. */
export function randomTurns(total = 60, n = 8): Turn[] {
  const idx = Array.from({ length: total }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((k) => ({ nova: k, tip: "Escucha a NOVA y repite la frase igual.", expect: [k] }));
}

/** Palabras para practicar en Lengua de Señas Colombiana frente a la cámara. */
export const LSC_WORDS = ["Hola", "Gracias", "Por favor", "Adiós", "Buenos días", "¿Cómo estás?", "Mucho gusto", "Familia", "Madre", "Padre",
  "Amigo", "Casa", "Agua", "Comer", "Sí", "No", "Uno", "Dos", "Tres", "Colombia",
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Rojo", "Azul", "Verde",
  "Hoy", "Mañana", "Ayer", "Hambre", "Cansado", "Restaurante", "Hotel", "Cuánto cuesta", "Baño", "No entiendo"];

/** Palabras de LSC por nivel: 10 por nivel, se aprueba con 7 o más bien hechas. */
export const LSC_LEVEL_WORDS: Record<Cefr, string[]> = {
  A1: ["Hola", "Gracias", "Por favor", "Adiós", "Buenos días", "Sí", "No", "Uno", "Dos", "Tres"],
  A2: ["¿Cómo estás?", "Mucho gusto", "Familia", "Madre", "Padre", "Amigo", "Casa", "Agua", "Comer", "Colombia"],
  B1: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Hoy", "Mañana", "Ayer"],
  B2: ["Rojo", "Azul", "Verde", "Hambre", "Cansado", "Restaurante", "Hotel", "Cuánto cuesta", "Baño", "No entiendo"],
  C1: ["Trabajo", "Reunión", "Estudiar", "Universidad", "Médico", "Hospital", "Ayuda", "Emergencia", "Derecho", "Comunidad"],
  C2: ["Opinión", "Acuerdo", "Desacuerdo", "Explicar", "Importante", "Cultura", "Sordo", "Oyente", "Intérprete", "Inclusión"],
};

/* ---------- Comparar lo que dijo el estudiante ---------- */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:'"’«»。、？！，]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function distance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Parecido entre 0 y 1 (sin tildes, signos ni espacios, para que sirva también en chino o japonés). */
export function similarity(heard: string, expected: string): number {
  const a = normalize(heard).replace(/ /g, "");
  const b = normalize(expected).replace(/ /g, "");
  if (!a || !b) return 0;
  if (a === b || (a.includes(b) && b.length >= 2)) return 1;
  return 1 - distance(a, b) / Math.max(a.length, b.length);
}
