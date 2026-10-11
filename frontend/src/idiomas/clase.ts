/**
 * Clases "de tú a tú" con NOVA: conversaciones guiadas con las 40 frases base de cada idioma.
 * Los números son posiciones en SPANISH / PHRASES (ver frases.ts).
 */

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

export interface Scenario {
  id: string;
  title: string;
  level: string;
  description: string;
  turns: Turn[] | "random";
}

export const SCENARIOS: Scenario[] = [
  {
    id: "saludar",
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
    id: "repite",
    title: "Repite como NOVA",
    level: "Pronunciación",
    description: "NOVA dice frases al azar; tú las repites y te miras en la cámara.",
    turns: "random",
  },
];

/** Turnos de "Repite como NOVA": 8 frases distintas al azar. */
export function randomTurns(total = 40, n = 8): Turn[] {
  const idx = Array.from({ length: total }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((k) => ({ nova: k, tip: "Escucha a NOVA y repite la frase igual.", expect: [k] }));
}

/** Palabras para practicar en Lengua de Señas Colombiana frente a la cámara. */
export const LSC_WORDS = ["Hola", "Gracias", "Por favor", "Adiós", "Buenos días", "¿Cómo estás?", "Mucho gusto", "Familia", "Madre", "Padre",
  "Amigo", "Casa", "Agua", "Comer", "Sí", "No", "Uno", "Dos", "Tres", "Colombia"];

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
