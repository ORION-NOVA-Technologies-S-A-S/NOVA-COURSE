/** Voz de NOVA: síntesis y reconocimiento de voz del navegador (gratis, sin servidor). */
import { avatarState } from "./avatarState";

const VOICE_KEY = "nova.voice";
let enabled = true;
try {
  enabled = localStorage.getItem(VOICE_KEY) !== "off";
} catch {
  /* sin almacenamiento */
}
let token = 0;
let voices: SpeechSynthesisVoice[] = [];

export const hasTTS = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

function loadVoices() {
  try {
    voices = (speechSynthesis.getVoices() || []).filter((v) => /^es/i.test(v.lang));
  } catch {
    voices = [];
  }
}
if (hasTTS()) {
  loadVoices();
  try {
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
  } catch {
    /* navegador antiguo */
  }
}

export const voiceEnabled = () => enabled;
export function setVoiceEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(VOICE_KEY, on ? "on" : "off");
  } catch {
    /* sin almacenamiento */
  }
  if (!on) stopSpeech();
}

/** Prefiere voz femenina en español de Colombia o Latinoamérica. */
function pickVoice(): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of voices) {
    const l = v.lang.replace("_", "-").toLowerCase();
    let s = l === "es-co" ? 50 : l === "es-mx" ? 40 : l === "es-us" ? 36 : l === "es-419" ? 34 : l.startsWith("es-") ? 20 : 0;
    if (/natural|neural|online|google|sabina|dalia|paola|salome|helena|monica|laura|female|mujer/i.test(v.name)) s += 25;
    if (/male|jorge|pablo|raul|diego|juan/i.test(v.name) && !/female/i.test(v.name)) s -= 15;
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return best;
}

/** Números en palabras para que los precios se escuchen bien ("ochenta y nueve mil novecientos pesos"). */
function numberToWords(n: number): string {
  if (n === 0) return "cero";
  const u = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
    "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiún", "veintidós", "veintitrés",
    "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
  const d = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const c = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
  const lt = (x: number) => {
    if (x === 100) return "cien";
    const s: string[] = [];
    if (x >= 100) {
      s.push(c[Math.floor(x / 100)]);
      x %= 100;
    }
    if (x > 0) {
      if (x < 30) s.push(u[x]);
      else s.push(x % 10 ? `${d[Math.floor(x / 10)]} y ${u[x % 10]}` : d[Math.floor(x / 10)]);
    }
    return s.join(" ");
  };
  const out: string[] = [];
  const m = Math.floor(n / 1e6);
  n %= 1e6;
  if (m) out.push(m === 1 ? "un millón" : `${lt(m)} millones`);
  const k = Math.floor(n / 1000);
  n %= 1000;
  if (k) out.push(k === 1 ? "mil" : `${lt(k).replace(/uno$/, "ún")} mil`);
  if (n) out.push(lt(n));
  return out.join(" ");
}

/** Texto limpio para leer en voz alta (sin asteriscos ni símbolos). */
export function speakable(t: string): string {
  return String(t)
    .replace(/\$\s?([\d.]+)/g, (m, digits: string) => {
      const n = parseInt(digits.replace(/\./g, ""), 10);
      return Number.isFinite(n) && n < 1e9 ? `${numberToWords(n)} pesos` : m;
    })
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/[*_`#]+/g, "")
    .replace(/[«»“”"]/g, "")
    .replace(/[•·→←]/g, ",")
    .replace(/\s*\n+\s*/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

export function stopSpeech() {
  token++;
  try {
    if (hasTTS()) speechSynthesis.cancel();
  } catch {
    /* ok */
  }
  avatarState.set("talk", false);
}

export function speak(text: string): Promise<void> {
  if (!enabled || !hasTTS()) return Promise.resolve();
  if (!voices.length) loadVoices();
  const tok = ++token;
  const parts = speakable(text).match(/[^.!?¿]+[.!?]?/g) ?? [];
  const voice = pickVoice();
  let i = 0;
  try {
    speechSynthesis.cancel();
  } catch {
    /* ok */
  }
  return new Promise((resolve) => {
    const next = () => {
      if (tok !== token || i >= parts.length) {
        if (tok === token) avatarState.set("talk", false);
        resolve();
        return;
      }
      const s = parts[i++].trim();
      if (s.length < 2) return next();
      const u = new SpeechSynthesisUtterance(s);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else u.lang = "es-CO";
      u.rate = 1.02;
      u.pitch = 1.08;
      let started = false;
      const guard = setTimeout(() => {
        if (!started) {
          stopSpeech();
          resolve();
        }
      }, 2500);
      u.onstart = () => {
        started = true;
        clearTimeout(guard);
        avatarState.set("talk", true);
      };
      u.onend = () => {
        clearTimeout(guard);
        next();
      };
      u.onerror = () => {
        clearTimeout(guard);
        if (tok === token) avatarState.set("talk", false);
        resolve();
      };
      try {
        speechSynthesis.speak(u);
      } catch {
        clearTimeout(guard);
        resolve();
      }
    };
    next();
  });
}

/* ---------- Micrófono ---------- */
type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionCtor = new () => RecognitionLike;

const SR: RecognitionCtor | undefined =
  typeof window !== "undefined"
    ? ((window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition)
    : undefined;

export const hasMic = () => Boolean(SR);
let recog: RecognitionLike | null = null;

/** Escucha una frase. Devuelve el texto, o lanza un error con un mensaje claro. */
export function listen(onState: (listening: boolean) => void): Promise<string> {
  if (!SR) return Promise.reject(new Error("Tu navegador no permite hablarle a NOVA. Escribe tu mensaje."));
  if (recog) {
    try {
      recog.stop();
    } catch {
      /* ok */
    }
    return Promise.resolve("");
  }
  stopSpeech();
  return new Promise((resolve, reject) => {
    const r = new SR();
    recog = r;
    let heard = "";
    r.lang = "es-CO";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onstart = () => {
      avatarState.set("listen", true);
      onState(true);
    };
    r.onresult = (e) => {
      heard = e.results?.[0]?.[0]?.transcript ?? "";
    };
    r.onerror = (e) => {
      reject(
        new Error(
          e.error === "not-allowed" || e.error === "service-not-allowed"
            ? "El navegador no dio permiso al micrófono. Escribe tu mensaje."
            : "No pude escucharte. Intenta de nuevo o escribe.",
        ),
      );
    };
    r.onend = () => {
      recog = null;
      avatarState.set("listen", false);
      onState(false);
      resolve(heard);
    };
    try {
      r.start();
    } catch {
      recog = null;
      onState(false);
      reject(new Error("No pude abrir el micrófono."));
    }
  });
}
