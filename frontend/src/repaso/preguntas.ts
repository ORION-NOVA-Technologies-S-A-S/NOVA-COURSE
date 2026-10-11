/**
 * Preguntas del "Repaso con NOVA" para los cursos que no son de idiomas.
 *
 * 1. Preguntas escritas por el administrador dentro de cada lección, debajo de "### Preguntas":
 *      - ¿Qué es una variable? | Un espacio para guardar datos* | Un tipo de computador | Un error
 *        > Explicación: una variable guarda un valor que puede cambiar.
 *    La respuesta correcta lleva un asterisco (*) al final. La línea con ">" es opcional.
 * 2. Preguntas automáticas a partir del temario (módulos y temas).
 * 3. "Explícale a NOVA": el estudiante explica un tema en voz alta y NOVA revisa si mencionó las ideas clave.
 */
import type { ModuleItem } from "../types";

export interface ChoiceQuestion {
  kind: "choice";
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  topicId?: number;
  topicTitle?: string;
}
export interface ExplainQuestion {
  kind: "explain";
  prompt: string;
  topicId: number;
  topicTitle: string;
  keywords: string[];
}
export type Question = ChoiceQuestion | ExplainQuestion;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n);

/** Mezcla las opciones y devuelve dónde quedó la correcta. */
function choice(prompt: string, right: string, wrong: string[], explanation: string, topic?: { id: number; title: string }): ChoiceQuestion {
  const options = shuffle([right, ...wrong.filter((w) => w !== right).slice(0, 3)]);
  return { kind: "choice", prompt, options, correct: options.indexOf(right), explanation, topicId: topic?.id, topicTitle: topic?.title };
}

/** Lee las preguntas que el administrador escribió en una lección. */
export function questionsFromContent(content: string, topic: { id: number; title: string }): ChoiceQuestion[] {
  const start = content.search(/^###\s*Preguntas/im);
  if (start < 0) return [];
  const lines = content.slice(start).split("\n").slice(1);
  const out: ChoiceQuestion[] = [];
  for (const raw of lines) {
    if (/^#{1,3}\s/.test(raw)) break;
    const line = raw.trim();
    const expl = /^>\s*(?:Explicación:)?\s*(.+)$/i.exec(line);
    if (expl && out.length) {
      out[out.length - 1].explanation = expl[1].trim();
      continue;
    }
    const parts = line.replace(/^[-*]\s*/, "").split("|").map((s) => s.trim()).filter(Boolean);
    if (parts.length < 3) continue;
    const [prompt, ...opts] = parts;
    const right = opts.find((o) => o.endsWith("*"));
    if (!right) continue;
    const clean = (o: string) => o.replace(/\*$/, "").trim();
    out.push(choice(prompt, clean(right), opts.filter((o) => o !== right).map(clean), `La respuesta correcta es «${clean(right)}».`, topic));
  }
  return out;
}

const STOP = new Set(["para", "como", "sobre", "entre", "desde", "hasta", "taller", "proyecto", "final", "integrador", "básica", "básico",
  "introducción", "fundamentos", "aplicada", "aplicado", "práctica", "qué", "cómo", "cuál", "este", "esta", "estos", "estas", "con", "del", "los", "las", "una", "uno"]);
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Palabras clave de un tema (las que se espera escuchar en la explicación). */
export function keywordsOf(title: string): string[] {
  return Array.from(new Set(strip(title).replace(/[^a-z0-9ñ ]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w))));
}

/** Revisa una explicación: palabras clave mencionadas, extensión y si dio un ejemplo. */
export function reviewExplanation(text: string, keywords: string[]) {
  const t = strip(text);
  const words = t.split(/\s+/).filter(Boolean).length;
  // Acepta la palabra o su raíz (por ejemplo, "programación" ↔ "programar")
  const mentioned = keywords.filter((k) => t.includes(k) || (k.length > 6 && t.includes(k.slice(0, k.length - 3))));
  const missing = keywords.filter((k) => !mentioned.includes(k));
  const example = /por ejemplo|como cuando|un ejemplo|ejemplo/.test(t);
  const ok = words >= 15 && mentioned.length >= Math.ceil(keywords.length * 0.6);
  const tips: string[] = [];
  if (words < 15) tips.push("Tu explicación es muy corta: di qué es, para qué sirve y da un ejemplo.");
  if (missing.length) tips.push(`Te faltó mencionar: ${missing.join(", ")}.`);
  if (!example) tips.push("Agrega un ejemplo («por ejemplo…») para que quede más claro.");
  return { ok, words, mentioned, missing, example, tips };
}

/** Arma el repaso de un módulo: preguntas del administrador + automáticas + explicaciones orales. */
export function buildQuiz(modules: ModuleItem[], moduleIndex: number, custom: ChoiceQuestion[]): Question[] {
  const mod = modules[moduleIndex];
  const others = modules.filter((_, i) => i !== moduleIndex);
  const otherTopics = others.flatMap((m) => m.topics.map((t) => t.title));
  const topics = mod.topics.filter((t) => !/^(Taller|Proyecto)/i.test(t.title));
  const qs: Question[] = [...pick(custom, 6)];

  // ¿Cuál de estos temas se estudia en este módulo?
  for (const t of pick(topics, 2))
    qs.push(choice(`¿Cuál de estos temas se estudia en el módulo «${mod.title}»?`, t.title, pick(otherTopics, 3),
      `«${t.title}» es el tema ${t.position} del módulo ${mod.position}: ${mod.title}.`, t));

  // ¿En qué módulo se estudia este tema?
  if (others.length >= 3)
    for (const t of pick(topics, 2))
      qs.push(choice(`¿En qué módulo se estudia «${t.title}»?`, `Módulo ${mod.position}: ${mod.title}`,
        pick(others, 3).map((m) => `Módulo ${m.position}: ${m.title}`), `Este tema hace parte del módulo ${mod.position}: ${mod.title}.`, t));

  // ¿Qué tema viene después?
  for (const t of pick(mod.topics.slice(0, -1), 2)) {
    const next = mod.topics.find((x) => x.position === t.position + 1);
    if (!next) continue;
    const wrong = mod.topics.filter((x) => x.id !== next.id && x.id !== t.id).map((x) => x.title);
    qs.push(choice(`En el módulo «${mod.title}», ¿qué tema viene justo después de «${t.title}»?`, next.title, pick(wrong, 3),
      `Después de «${t.title}» sigue «${next.title}» (tema ${next.position}).`, next));
  }

  // Explícale a NOVA (al final)
  const explainable = topics.filter((t) => keywordsOf(t.title).length > 0);
  const choiceQs = shuffle(qs).slice(0, 8);
  const explain: Question[] = pick(explainable, 2).map((t) => ({
    kind: "explain",
    prompt: `Explícale a NOVA con tus palabras: «${t.title}». Di qué es, para qué sirve y da un ejemplo.`,
    topicId: t.id,
    topicTitle: t.title,
    keywords: keywordsOf(t.title),
  }));
  return [...choiceQs, ...explain];
}

/** Interpreta una respuesta hablada: "la b", "opción c", "c" o el texto de la opción. */
export function optionFromSpeech(heard: string, options: string[]): number {
  const t = strip(heard).replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
  const letter = /^(?:la |letra |opcion |respuesta )?([abcd])$/.exec(t)?.[1];
  if (letter) return "abcd".indexOf(letter);
  const nums: Record<string, number> = { uno: 0, primera: 0, dos: 1, segunda: 1, tres: 2, tercera: 2, cuatro: 3, cuarta: 3 };
  const n = /(?:opcion |la )?(uno|dos|tres|cuatro|primera|segunda|tercera|cuarta)$/.exec(t)?.[1];
  if (n) return nums[n];
  let best = -1;
  let bestScore = 0;
  options.forEach((o, i) => {
    const words = strip(o).replace(/[^a-z0-9ñ ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
    const score = words.length ? words.filter((w) => t.includes(w)).length / words.length : 0;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return bestScore >= 0.5 ? best : -1;
}
