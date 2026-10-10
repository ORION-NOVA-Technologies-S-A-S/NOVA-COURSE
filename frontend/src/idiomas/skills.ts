/** Habilidad que trabaja cada tema de un curso de idiomas (se deduce del título). */
const RULES: [string, string[]][] = [
  ["Escucha", ["Escucha", "Video:", "Comprensión auditiva", "Comprensión de videos"]],
  ["Conversación", ["Conversación", "Práctica:", "Expresión oral", "Expresión en LSC"]],
  ["Lectura", ["Lectura", "Comprensión lectora"]],
  ["Escritura", ["Escritura", "Expresión escrita", "Glosas"]],
  ["Pronunciación", ["ronunciación", "Sonidos", "tonos", "Tonos", "Entonación", "Vocales", "Consonantes", "diéresis", "Armonía vocálica", "stød", "letra"]],
  ["Alfabeto", ["alfabeto", "Alfabeto", "Hiragana", "Katakana", "kanji", "Pinyin", "hangul", "escritura", "Trazos", "alefato", "Formas de las letras", "Signos diacríticos", "Las letras"]],
  ["Gramática", ["presente", "pasado", "futuro", "Gramática", "gramática", "Pronombres", "Ser y estar", "Sustantivos", "Adjetivos", "Preposiciones", "Comparar",
    "Adverbios", "Conectores", "condicionales", "voz pasiva", "estilo indirecto", "Clasificadores", "Condiciones", "clases de sustantivos"]],
  ["Cultura", ["Países", "Festividades", "Música", "Literatura", "Cine", "Tradiciones", "Cultura", "Historia", "comunidad", "Humor", "Refranes", "Variantes",
    "Identidad", "Arte", "Teatro"]],
];

export function skillOf(title: string): string {
  for (const [skill, keys] of RULES) if (keys.some((k) => title.includes(k))) return skill;
  return "Vocabulario";
}
