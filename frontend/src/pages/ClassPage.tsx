import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth";
import { listCourses } from "../data";
import type { CourseSummary } from "../types";
import { LSC_WORDS, normalize, randomTurns, SCENARIOS, similarity, type Scenario, type Turn } from "../idiomas/clase";
import { PHRASES, SPANISH } from "../idiomas/frases";
import { avatarState } from "../nova/avatarState";
import { NovaAvatar } from "../nova/NovaAvatar";
import { hasMic, hasVoiceFor, listen, speak, speakIn, stopSpeech } from "../nova/voice";
import { ReviewClass } from "./ReviewClass";

const RTL = ["ar", "he", "fa"];

/** Clase "de tú a tú" con NOVA: conversación guiada por voz y la cámara como espejo. */
export function ClassPage() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const [langs, setLangs] = useState<CourseSummary[] | null>(null);
  const [others, setOthers] = useState<CourseSummary[] | null>(null);
  const [slug, setSlug] = useState(params.get("idioma") ?? "");
  const [tab, setTab] = useState<"idiomas" | "cursos">(params.get("curso") ? "cursos" : "idiomas");
  const [courseSlug, setCourseSlug] = useState(params.get("curso") ?? "");
  const [scenario, setScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    listCourses()
      .then((all) => {
        setLangs(all.filter((c) => c.lang && (PHRASES[c.lang] || c.lang === "lsc")));
        setOthers(all.filter((c) => !c.lang).sort((a, b) => a.title.localeCompare(b.title, "es")));
      })
      .catch(() => {
        setLangs([]);
        setOthers([]);
      });
  }, []);

  useEffect(() => () => stopSpeech(), []);

  // Si llega con otro idioma en el enlace (?idioma=...), cambia de idioma
  const fromLink = params.get("idioma") ?? "";
  useEffect(() => {
    if (fromLink) {
      setTab("idiomas");
      setSlug(fromLink);
      setScenario(null);
    }
  }, [fromLink]);
  const courseFromLink = params.get("curso") ?? "";
  useEffect(() => {
    if (courseFromLink) {
      setTab("cursos");
      setCourseSlug(courseFromLink);
    }
  }, [courseFromLink]);

  const course = langs?.find((c) => c.slug === slug);

  if (loading) return <section className="wrap section"><p className="muted">Cargando…</p></section>;

  return (
    <section className="wrap section class-page">
      <p className="eyebrow">De tú a tú con NOVA</p>
      <h1>Clase con NOVA</h1>
      <p className="lead muted">
        NOVA te pregunta, tú respondes en voz alta y, si te equivocas, te corrige al momento y te explica la respuesta correcta.
        Enciende la cámara para verte mientras hablas, como frente a un espejo.
      </p>

      {!user ? (
        <div className="card class-gate">
          <h3>Crea tu cuenta gratis para tomar la clase</h3>
          <p className="muted">La clase con NOVA está incluida en todos los cursos de idiomas.</p>
          <div className="row">
            <Link className="btn" to="/registro?next=/clase">Crear cuenta gratis</Link>
            <Link className="btn ghost" to="/ingresar?next=/clase">Ya tengo cuenta</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="class-tabs" role="tablist">
            <button role="tab" aria-selected={tab === "idiomas"} className={`chip-btn ${tab === "idiomas" ? "on" : ""}`} onClick={() => { stopSpeech(); setTab("idiomas"); }}>
              🗣️ Idiomas
            </button>
            <button role="tab" aria-selected={tab === "cursos"} className={`chip-btn ${tab === "cursos" ? "on" : ""}`} onClick={() => { stopSpeech(); setTab("cursos"); }}>
              📚 Repaso de cursos
            </button>
          </div>

          {tab === "cursos" ? (
            <>
              <label className="class-select">
                <span>Curso</span>
                <select value={courseSlug} onChange={(e) => { stopSpeech(); setCourseSlug(e.target.value); }}>
                  <option value="">Elige el curso…</option>
                  {(others ?? []).map((c) => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </label>
              {courseSlug ? <ReviewClass slug={courseSlug} /> : others && <p className="muted">Elige uno de los {others.length} cursos para repasar con NOVA.</p>}
            </>
          ) : (
          <>
          <label className="class-select">
            <span>Idioma</span>
            <select
              value={slug}
              onChange={(e) => {
                stopSpeech();
                setSlug(e.target.value);
                setScenario(null);
              }}
            >
              <option value="">Elige el idioma…</option>
              {(langs ?? []).map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </label>

          {course?.lang === "lsc" ? (
            <LscClass key={course.slug} />
          ) : course?.lang ? (
            scenario ? (
              <Conversation
                key={`${course.slug}-${scenario.id}`}
                lang={course.lang}
                languageName={course.title}
                scenario={scenario}
                onExit={() => {
                  stopSpeech();
                  setScenario(null);
                }}
              />
            ) : (
              <div className="scenario-grid">
                {SCENARIOS.map((s) => (
                  <button key={s.id} className="card scenario" onClick={() => setScenario(s)}>
                    <span className="chip">{s.level}</span>
                    <h3>{s.title}</h3>
                    <p className="muted">{s.description}</p>
                  </button>
                ))}
              </div>
            )
          ) : (
            langs && <p className="muted">Elige uno de los {langs.length} idiomas para empezar.</p>
          )}
          </>
          )}
        </>
      )}
    </section>
  );
}

/* ---------- Conversación guiada ---------- */
type Result = { status: "ok" | "almost" | "bad"; heard: string } | null;

function Conversation({ lang, languageName, scenario, onExit }: { lang: string; languageName: string; scenario: Scenario; onExit: () => void }) {
  const turns: Turn[] = useMemo(
    () => (scenario.turns === "random" ? randomTurns(SPANISH.length, 8) : scenario.turns === "random-all" ? randomTurns(SPANISH.length, 10) : scenario.turns),
    [scenario],
  );
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const [revealed, setRevealed] = useState(false);
  const [reply, setReply] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [notice, setNotice] = useState("");
  const [tries, setTries] = useState(0);
  const [voiceOk, setVoiceOk] = useState(() => hasVoiceFor(lang));
  const rtl = RTL.includes(lang.split("-")[0]);

  const phrase = (k: number) => {
    const [text, roman] = (PHRASES[lang]?.[k] ?? "").split("|");
    return { text, roman, es: SPANISH[k] };
  };
  const turn = turns[step];
  const done = step >= turns.length;

  useEffect(() => {
    const t = window.setTimeout(() => setVoiceOk(hasVoiceFor(lang)), 800);
    return () => window.clearTimeout(t);
  }, [lang]);

  // NOVA dice su frase al empezar cada turno
  useEffect(() => {
    setResult(null);
    setRevealed(false);
    setReply(null);
    setTyped("");
    setNotice("");
    setTries(0);
    if (done) {
      avatarState.pulse("happy", 1500);
      avatarState.pulse("wave", 2500);
      return;
    }
    if (turn.nova === undefined) return;
    const t = window.setTimeout(() => void speakIn(phrase(turn.nova!).text, lang), 450);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, done]);

  const check = (heard: string) => {
    if (!heard.trim() || !turn) return;
    setNotice("");
    // También vale escribir la pronunciación (por ejemplo, pinyin «wo hen hao»)
    // Los números también valen en cifras: el reconocimiento de voz suele escribir «2» en vez de «two»
    const asDigit = (k: number) => (k >= 20 && k <= 29 && normalize(heard).replace(/[^0-9]/g, "") === String(k - 19) ? 1 : 0);
    const best = Math.max(...turn.expect.flatMap((k) => [similarity(heard, phrase(k).text), phrase(k).roman ? similarity(heard, phrase(k).roman!) : 0, asDigit(k)]));
    const status = best >= 0.8 ? "ok" : best >= 0.55 ? "almost" : "bad";
    setResult({ status, heard });
    if (status !== "ok") {
      // Primer error: NOVA pide repetir para mejorar. Desde el segundo, dice y pronuncia la respuesta correcta.
      const n = tries + 1;
      setTries(n);
      const right = phrase(turn.expect[0]).text;
      if (n < 2) void speak(status === "almost" ? "¡Casi! Repítelo otra vez para mejorar." : "Te equivocaste. Inténtalo otra vez para mejorar.");
      else void speak("Escucha cómo se dice y repítelo.").then(() => speakIn(right, lang, 0.85));
    }
    if (status === "ok") {
      if (turn.after === undefined) void speak("¡Muy bien!");
      if (!result || result.status !== "ok") setScore((s) => s + 1);
      avatarState.pulse("happy", 1400);
      if (turn.after !== undefined) {
        setReply(turn.after);
        window.setTimeout(() => void speakIn(phrase(turn.after!).text, lang), 300);
      }
    }
  };

  const speakAnswer = async () => {
    setNotice("");
    setResult(null);
    try {
      const heard = await listen(setListening, lang);
      if (heard.trim()) check(heard);
      else setNotice("No escuché nada. Pulsa el botón y habla enseguida, cerca del micrófono.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No pude escucharte. Intenta de nuevo o escribe tu respuesta.");
    }
  };

  const reveal = () => {
    setRevealed(true);
    void speakIn(phrase(turn.expect[0]).text, lang, 0.85);
  };

  const novaLine = !done && (reply !== null ? phrase(reply) : turn.nova !== undefined ? phrase(turn.nova) : null);

  return (
    <div className="class-layout">
      <div className="class-stage">
        <div className="card class-nova">
          <NovaAvatar className="class-face" />
          <div className="class-bubble" role="status" aria-live="polite">
            {done ? (
              <p>¡Terminaste! Acertaste {score} de {turns.length}.</p>
            ) : novaLine ? (
              <>
                <p className="phrase" lang={lang} dir={rtl ? "rtl" : "ltr"}>{novaLine.text}</p>
                {novaLine.roman && <p className="roman">{novaLine.roman}</p>}
                <p className="meaning">{novaLine.es}</p>
              </>
            ) : (
              <p className="meaning">Te escucho…</p>
            )}
          </div>
        </div>
        <CameraMirror />
      </div>

      <div className="card class-turn">
        <div className="class-turn-head">
          <span className="chip">{languageName} · {scenario.title}</span>
          <span className="muted">{done ? "Clase terminada" : `Paso ${step + 1} de ${turns.length}`} · {score} correctas</span>
        </div>

        {!voiceOk && (
          <p className="practice-note">
            Tu dispositivo todavía no tiene la voz de {languageName}. En Chrome o Edge suele venir incluida; en Android puedes instalarla en
            Ajustes → Texto a voz. Puedes seguir la clase leyendo las frases.
          </p>
        )}

        {done ? (
          <div className="practice-actions">
            <button className="btn" onClick={() => setStep(0)}>Repetir la clase</button>
            <button className="btn ghost" onClick={onExit}>Elegir otra conversación</button>
          </div>
        ) : (
          <>
            <p className="class-tip">{turn.tip}</p>

            <div className="practice-actions">
              {hasMic() && (
                <button className="btn" onClick={speakAnswer} aria-pressed={listening}>
                  {listening ? "Te escucho… habla ahora" : "🎤 Responder hablando"}
                </button>
              )}
              {turn.nova !== undefined && (
                <button className="btn ghost sm" onClick={() => void speakIn(phrase(turn.nova!).text, lang, 0.7)} disabled={!voiceOk}>
                  Escuchar a NOVA otra vez
                </button>
              )}
              <button className="btn ghost sm" onClick={reveal}>Ver la respuesta</button>
            </div>

            <form
              className="class-type"
              onSubmit={(e) => {
                e.preventDefault();
                check(typed);
              }}
            >
              <input
                lang={lang}
                dir={rtl ? "rtl" : "ltr"}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={hasMic() ? "…o escribe tu respuesta (también vale la pronunciación)" : "Escribe tu respuesta (también vale la pronunciación)"}
                autoComplete="off"
              />
              <button className="btn ghost sm">Comprobar</button>
            </form>
            {!hasMic() && <p className="muted small">Para responder hablando usa Chrome o Edge.</p>}

            {notice && <p className="practice-note" role="status">{notice}</p>}

            {result && (
              <div className={`feedback ${result.status === "ok" ? "ok" : "bad"}`} role="status">
                <span>
                  {result.status === "ok"
                    ? `¡Muy bien! Te entendí: «${result.heard}»`
                    : result.status === "almost"
                      ? `¡Casi! Te entendí: «${result.heard}». ${tries >= 2 ? "Escucha cómo se dice y repítelo." : "Repítelo otra vez para mejorar."}`
                      : `Te entendí: «${result.heard}». ${tries >= 2 ? "Mira cómo se dice y repítelo." : "Te equivocaste: inténtalo otra vez para mejorar."}`}
                </span>
              </div>
            )}

            {(revealed || (result && result.status !== "ok" && tries >= 2)) && (
              <div className="class-answer">
                <span className="muted">Se dice:</span>
                {turn.expect.slice(0, revealed ? turn.expect.length : 1).map((k) => (
                  <span key={k} className="answer-line">
                    <b lang={lang} dir={rtl ? "rtl" : "ltr"}>{phrase(k).text}</b>
                    {phrase(k).roman && <span className="roman"> · {phrase(k).roman}</span>}
                    <span className="muted"> ({phrase(k).es})</span>
                  </span>
                ))}
              </div>
            )}

            <div className="practice-nav">
              <button className="btn ghost sm" onClick={onExit}>← Otras conversaciones</button>
              {result?.status === "ok" ? (
                <button className="btn sm" onClick={() => setStep((s) => s + 1)}>Siguiente →</button>
              ) : (
                <span className="muted small">Responde bien para continuar</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Lengua de Señas Colombiana ---------- */
function LscClass() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const word = LSC_WORDS[i % LSC_WORDS.length];
  const mark = (ok: boolean) => {
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) avatarState.pulse("happy", 1200);
    setI((x) => x + 1);
  };
  return (
    <div className="class-layout">
      <div className="class-stage">
        <div className="card class-nova">
          <NovaAvatar className="class-face" />
          <div className="class-bubble" role="status">
            <p className="meaning">Haz la seña de</p>
            <p className="phrase">{word}</p>
          </div>
        </div>
        <CameraMirror />
      </div>
      <div className="card class-turn">
        <div className="class-turn-head">
          <span className="chip">Lengua de Señas Colombiana</span>
          {score.total > 0 && <span className="muted">{score.ok} de {score.total} bien hechas</span>}
        </div>
        <p className="class-tip">
          Enciende la cámara y haz la seña de «{word}». Revisa la forma de la mano, el movimiento, el lugar y la expresión de la cara,
          y compárala con el video de tu lección.
        </p>
        <div className="practice-actions">
          <button className="btn" onClick={() => mark(true)}>La hice bien</button>
          <button className="btn ghost" onClick={() => mark(false)}>Necesito repasarla</button>
          <Link className="btn ghost sm" to="/cursos/idioma-lengua-de-senas-colombiana">Ver las lecciones con video</Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Cámara (espejo) ---------- */
export function CameraMirror() {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState("");
  const supported = typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

  const stop = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setOn(false);
  };

  const start = async () => {
    setError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      stream.current = s;
      setOn(true);
      if (video.current) {
        video.current.srcObject = s;
        await video.current.play().catch(() => undefined);
      }
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError"
          ? "No diste permiso a la cámara. Actívalo en el candado de la barra de direcciones y vuelve a intentarlo."
          : name === "NotFoundError"
            ? "No encontramos una cámara en este dispositivo."
            : "No pudimos abrir la cámara. Revisa que otra aplicación no la esté usando.",
      );
    }
  };

  useEffect(() => stop, []);
  useEffect(() => {
    if (on && video.current && stream.current && video.current.srcObject !== stream.current) {
      video.current.srcObject = stream.current;
      void video.current.play().catch(() => undefined);
    }
  }, [on]);

  return (
    <div className="card class-camera">
      <div className="camera-frame">
        <video ref={video} className={on ? "" : "hidden"} muted playsInline autoPlay aria-label="Tu cámara" />
        {!on && <span className="camera-off" aria-hidden="true">📷</span>}
      </div>
      {supported ? (
        <button className={`btn ${on ? "ghost" : ""} sm`} onClick={on ? stop : () => void start()}>
          {on ? "Apagar cámara" : "Encender cámara"}
        </button>
      ) : (
        <p className="muted small">Este navegador no permite usar la cámara.</p>
      )}
      {error && <p className="small error-text">{error}</p>}
      <p className="muted small">Tu video no se graba ni se envía a ningún lado: solo lo ves tú.</p>
    </div>
  );
}
