import { useEffect, useMemo, useState } from "react";
import { hasMic, hasVoiceFor, listen, speakIn } from "../nova/voice";
import { MODULE_CATEGORIES, PHRASES, phrasesFor, phrasesFromContent, type Phrase } from "./frases";

type Mode = "tarjetas" | "escucha" | "lectura" | "dictado";
const RTL = ["ar", "he", "fa"];

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:'"’«»。、？！]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Ejercicios del tema: tarjetas con voz, escucha y elige, lectura y dictado. */
export function LanguagePractice({ lang, languageName, modulePosition, content }: { lang: string; languageName: string; modulePosition: number; content: string }) {
  const custom = useMemo(() => phrasesFromContent(content), [content]);
  const base = useMemo(() => {
    const cats = MODULE_CATEGORIES[modulePosition];
    return cats ? phrasesFor(lang, cats) : phrasesFor(lang, [0, 1, 2, 3]);
  }, [lang, modulePosition]);
  const phrases: Phrase[] = custom.length ? custom : base;
  const isReview = !custom.length && !MODULE_CATEGORIES[modulePosition];
  const latin = !phrases.some((p) => p.roman);
  const rtl = RTL.includes(lang.split("-")[0]);

  const [mode, setMode] = useState<Mode>("tarjetas");
  const [i, setI] = useState(0);
  const [voiceOk, setVoiceOk] = useState(() => hasVoiceFor(lang));
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [typed, setTyped] = useState("");
  const [listening, setListening] = useState(false);
  const [order, setOrder] = useState<number[]>(() => shuffle(phrases.map((_, k) => k)));

  // Las voces del navegador cargan con un pequeño retraso
  useEffect(() => {
    const t = window.setTimeout(() => setVoiceOk(hasVoiceFor(lang)), 800);
    return () => window.clearTimeout(t);
  }, [lang]);

  useEffect(() => {
    setI(0);
    setFeedback(null);
    setTyped("");
    setOrder(shuffle(phrases.map((_, k) => k)));
  }, [mode, phrases]);

  const current: Phrase | undefined = phrases.length
    ? phrases[mode === "tarjetas" ? i % phrases.length : (order[i % order.length] ?? 0)]
    : undefined;
  const options = useMemoOptions(phrases, current);

  if ((!PHRASES[lang] && !custom.length) || !current) return null;

  const play = (rate = 0.95) => void speakIn(current.text, lang, rate);
  const next = () => {
    setI((x) => x + 1);
    setFeedback(null);
    setTyped("");
  };
  const answer = (ok: boolean, text: string) => {
    setFeedback({ ok, text });
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    if (voiceOk && ok) play();
  };

  const repeatAloud = async () => {
    setFeedback(null);
    try {
      const heard = await listen(setListening, lang);
      if (!heard) return;
      const ok = normalize(heard) === normalize(current.text) || normalize(heard).includes(normalize(current.text));
      setFeedback({ ok, text: ok ? `¡Muy bien! Te entendí: «${heard}»` : `Te entendí: «${heard}». Escucha otra vez e inténtalo de nuevo.` });
    } catch (e) {
      setFeedback({ ok: false, text: e instanceof Error ? e.message : "No pude escucharte." });
    }
  };

  const modes: [Mode, string][] = [
    ["tarjetas", "Tarjetas"],
    ["escucha", "Escucha y elige"],
    ["lectura", "Lee y elige"],
    ...(latin ? ([["dictado", "Dictado"]] as [Mode, string][]) : []),
  ];

  return (
    <section className="card practice" aria-label={`Práctica de ${languageName}`}>
      <header className="practice-head">
        <div>
          <p className="eyebrow">Práctica con NOVA · {languageName}</p>
          <h3>{custom.length ? "Frases de este tema" : isReview ? "Repaso de frases esenciales" : "Frases del módulo"}</h3>
        </div>
        {score.total > 0 && <span className="score">{score.ok}/{score.total} correctas</span>}
      </header>

      {!voiceOk && (
        <p className="practice-note">
          Tu dispositivo todavía no tiene la voz de {languageName}. En Chrome o Edge suele venir incluida; en Android puedes instalarla en
          Ajustes → Texto a voz. Mientras tanto puedes practicar con «Lee y elige».
        </p>
      )}

      <div className="practice-tabs" role="tablist">
        {modes.map(([m, label]) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}
            disabled={(m === "escucha" || m === "dictado") && !voiceOk}>
            {label}
          </button>
        ))}
      </div>

      {mode === "tarjetas" && (
        <div className="flashcard">
          <p className="phrase" lang={lang} dir={rtl ? "rtl" : "ltr"}>{current.text}</p>
          {current.roman && <p className="roman">{current.roman}</p>}
          <p className="meaning">{current.es}</p>
          <div className="practice-actions">
            <button className="btn sm" onClick={() => play()} disabled={!voiceOk}>Escuchar</button>
            <button className="btn ghost sm" onClick={() => play(0.6)} disabled={!voiceOk}>Más lento</button>
            {hasMic() && (
              <button className="btn ghost sm" onClick={repeatAloud} aria-pressed={listening}>{listening ? "Te escucho…" : "Repítelo en voz alta"}</button>
            )}
          </div>
          <div className="practice-nav">
            <button className="btn ghost sm" onClick={() => { setI((x) => (x - 1 + phrases.length) % phrases.length); setFeedback(null); }}>← Anterior</button>
            <span className="muted">{(i % phrases.length) + 1} de {phrases.length}</span>
            <button className="btn ghost sm" onClick={next}>Siguiente →</button>
          </div>
        </div>
      )}

      {(mode === "escucha" || mode === "lectura") && (
        <div className="quiz">
          {mode === "escucha" ? (
            <div className="practice-actions center">
              <button className="btn" onClick={() => play()}>Escuchar la frase</button>
              <button className="btn ghost sm" onClick={() => play(0.6)}>Más lento</button>
            </div>
          ) : (
            <p className="phrase" lang={lang} dir={rtl ? "rtl" : "ltr"}>{current.text}</p>
          )}
          <p className="muted center">¿Qué significa?</p>
          <div className="options">
            {options.map((o) => (
              <button key={o} disabled={Boolean(feedback)} className={feedback && o === current.es ? "right" : ""}
                onClick={() => answer(o === current.es, o === current.es ? "¡Correcto!" : `No. La respuesta es «${current.es}».`)}>
                {o}
              </button>
            ))}
          </div>
          {feedback && current.roman && <p className="roman center">{current.text} · {current.roman}</p>}
        </div>
      )}

      {mode === "dictado" && (
        <form className="quiz" onSubmit={(e) => {
          e.preventDefault();
          if (feedback) return next();
          const ok = normalize(typed) === normalize(current.text);
          answer(ok, ok ? "¡Perfecto!" : `Se escribe: «${current.text}» (${current.es}).`);
        }}>
          <div className="practice-actions center">
            <button type="button" className="btn" onClick={() => play()}>Escuchar</button>
            <button type="button" className="btn ghost sm" onClick={() => play(0.6)}>Más lento</button>
          </div>
          <input id="dictado-input" lang={lang} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Escribe lo que escuchaste" autoComplete="off" />
          <button className="btn sm">{feedback ? "Siguiente" : "Comprobar"}</button>
        </form>
      )}

      {feedback && (
        <div className={`feedback ${feedback.ok ? "ok" : "bad"}`} role="status">
          <span>{feedback.text}</span>
          {mode !== "tarjetas" && mode !== "dictado" && <button className="btn ghost sm" onClick={next}>Siguiente →</button>}
        </div>
      )}
    </section>
  );
}

function useMemoOptions(phrases: Phrase[], current: Phrase | undefined): string[] {
  return useMemo(() => {
    if (!current) return [];
    const others = shuffle(phrases.filter((p) => p.es !== current.es)).slice(0, 3).map((p) => p.es);
    return shuffle([current.es, ...others]);
  }, [phrases, current]);
}
