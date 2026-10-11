import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { getCourse, lessonContents } from "../data";
import type { CourseDetail } from "../types";
import { avatarState } from "../nova/avatarState";
import { NovaAvatar } from "../nova/NovaAvatar";
import { hasMic, listen, speak, stopSpeech } from "../nova/voice";
import { buildQuiz, optionFromSpeech, questionsFromContent, reviewExplanation, type ChoiceQuestion, type Question } from "../repaso/preguntas";
import { CameraMirror } from "./ClassPage";

const LETTERS = ["A", "B", "C", "D"];

type Outcome = { ok: boolean; text: string; tips?: string[] };

/** Repaso con NOVA para cualquier curso: preguntas, explicación oral y corrección inmediata. */
export function ReviewClass({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [moduleIndex, setModuleIndex] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCourse(null);
    setModuleIndex(null);
    setQuestions(null);
    getCourse(slug, user?.id ?? null)
      .then(setCourse)
      .catch(() => setError("No pudimos cargar el curso."));
  }, [slug, user?.id]);

  const start = async (i: number) => {
    if (!course) return;
    setModuleIndex(i);
    setQuestions(null);
    const mod = course.modules[i];
    const contents = await lessonContents(mod.topics.map((t) => t.id));
    const custom = contents.flatMap((c) => {
      const t = mod.topics.find((x) => x.id === c.topic_id)!;
      return questionsFromContent(c.content, { id: t.id, title: t.title });
    });
    setQuestions(buildQuiz(course.modules, i, custom));
  };

  if (error) return <p className="error">{error}</p>;
  if (!course) return <p className="muted">Cargando curso…</p>;

  if (moduleIndex === null || !questions)
    return (
      <div className="card review-pick">
        <h3>¿Qué módulo quieres repasar con NOVA?</h3>
        <p className="muted small">NOVA te hace preguntas del módulo, te corrige al instante y al final te pide que le expliques un tema en voz alta.</p>
        <div className="review-modules">
          {course.modules.map((m, i) => (
            <button key={m.id} className="review-module" disabled={!m.unlocked} onClick={() => void start(i)}>
              <span className="mod-num">{m.position}</span>
              <span>
                <b>{m.title}</b>
                <span className="muted small">{m.unlocked ? `${m.topics.length} temas` : "🔒 Desbloquea el curso completo"}</span>
              </span>
            </button>
          ))}
        </div>
        {moduleIndex !== null && !questions && <p className="muted">Preparando preguntas…</p>}
      </div>
    );

  return (
    <Quiz
      key={`${slug}-${moduleIndex}`}
      course={course}
      moduleTitle={`Módulo ${course.modules[moduleIndex].position}: ${course.modules[moduleIndex].title}`}
      questions={questions}
      onExit={() => {
        stopSpeech();
        setModuleIndex(null);
        setQuestions(null);
      }}
      onRestart={() => void start(moduleIndex)}
    />
  );
}

function Quiz({ course, moduleTitle, questions, onExit, onRestart }: { course: CourseDetail; moduleTitle: string; questions: Question[]; onExit: () => void; onRestart: () => void }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<{ title: string; topicId?: number }[]>([]);
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [notice, setNotice] = useState("");
  const [tries, setTries] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [retry, setRetry] = useState<Outcome | null>(null);
  const [mustPick, setMustPick] = useState(false);
  const q = questions[step];
  const done = step >= questions.length;
  const lessonOf = useMemo(() => new Map(course.modules.flatMap((m) => m.topics.map((t) => [t.id, m.unlocked] as const))), [course]);

  // NOVA lee cada pregunta en voz alta
  useEffect(() => {
    setPicked(null);
    setOutcome(null);
    setTyped("");
    setNotice("");
    setTries(0);
    setWrongPicks([]);
    setRetry(null);
    setMustPick(false);
    if (done) {
      avatarState.pulse("happy", 1500);
      avatarState.pulse("wave", 2500);
      void speak(`Terminaste el repaso. Acertaste ${score} de ${questions.length}.`);
      return;
    }
    const t = window.setTimeout(() => {
      const opts = q.kind === "choice" ? " " + q.options.map((o, i) => `${LETTERS[i]}: ${o}.`).join(" ") : "";
      void speak(q.prompt + opts);
    }, 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const finish = (ok: boolean, text: string, tips?: string[]) => {
    setOutcome({ ok, text, tips });
    setRetry(null);
    if (ok) {
      setScore((s) => s + 1);
      avatarState.pulse("happy", 1400);
    }
    void speak(ok ? text : `${text} ${tips?.join(" ") ?? ""}`);
  };

  /** Primer error: NOVA no da la respuesta, pide que lo intente de nuevo. Al segundo error, explica la correcta. */
  const wrong = (text: string, tips?: string[]) => {
    const n = tries + 1;
    setTries(n);
    if (n === 1 && q.topicTitle) setMistakes((m) => [...m, { title: q.topicTitle!, topicId: q.topicId }]);
    avatarState.pulse("think", 1200);
    setRetry({ ok: false, text, tips });
    void speak(`${text} ${tips?.join(" ") ?? ""}`);
    return n;
  };

  /** NOVA muestra la correcta y el estudiante debe elegirla para seguir. */
  const revealChoice = () => {
    if (q.kind !== "choice") return;
    setMustPick(true);
    const text = `La respuesta correcta es la ${LETTERS[q.correct]}: «${q.options[q.correct]}». ${q.explanation} Ahora elígela tú para continuar.`;
    setRetry({ ok: false, text });
    void speak(text);
  };

  const answerChoice = (i: number) => {
    if (outcome || q.kind !== "choice" || wrongPicks.includes(i)) return;
    setPicked(i);
    const cq = q as ChoiceQuestion;
    if (i === cq.correct) {
      if (mustPick) {
        setOutcome({ ok: true, text: "¡Eso es! Ya la tienes. Repasa este tema para la próxima." });
        setRetry(null);
        avatarState.pulse("happy", 1200);
        void speak("¡Eso es! Ya la tienes.");
        return;
      }
      return finish(true, `${tries === 0 ? "¡Correcto!" : "¡Ahora sí, correcto!"} ${cq.explanation}`);
    }
    setWrongPicks((w) => [...w, i]);
    const n = wrong("Te equivocaste. Piénsalo otra vez y vuelve a intentarlo para mejorar.");
    if (n >= 2) revealChoice();
  };

  const answerExplain = (text: string) => {
    if (q.kind !== "explain" || !text.trim() || outcome) return;
    const r = reviewExplanation(text, q.keywords);
    if (r.ok) return finish(true, r.example ? "¡Muy bien explicado! Mencionaste las ideas clave y diste un ejemplo." : "¡Bien explicado! Mencionaste las ideas clave.", r.example ? [] : r.tips);
    const n = wrong("Tu explicación todavía está incompleta. Repítela para mejorar:", r.tips);
    if (n >= 2) finish(false, "Buen intento. Lee la lección de este tema y vuelve a explicarlo luego.", r.tips);
  };

  const talk = async () => {
    setNotice("");
    try {
      const heard = await listen(setListening, "es-CO");
      if (!heard.trim()) return setNotice("No escuché nada. Pulsa el botón y habla enseguida, cerca del micrófono.");
      if (q.kind === "choice") {
        const i = optionFromSpeech(heard, q.options);
        if (i < 0) return setNotice(`Te entendí «${heard}», pero no sé qué opción es. Di «la A», «la B»… o toca la respuesta.`);
        answerChoice(i);
      } else {
        setTyped(heard);
        answerExplain(heard);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No pude escucharte.");
    }
  };

  return (
    <div className="class-layout">
      <div className="class-stage">
        <div className="card class-nova">
          <NovaAvatar className="class-face" />
          <div className="class-bubble" role="status" aria-live="polite">
            {done ? (
              <p>¡Terminaste! Acertaste {score} de {questions.length}.</p>
            ) : outcome ? (
              <p className={outcome.ok ? "nova-ok" : "nova-bad"}>{outcome.ok ? "¡Muy bien! 🎉" : "Te corrijo 👇"}</p>
            ) : retry ? (
              <p className="nova-bad">¡Inténtalo otra vez! 💪</p>
            ) : (
              <p className="meaning">{q.kind === "explain" ? "Te escucho: explícame el tema." : "Elige o di la respuesta."}</p>
            )}
          </div>
        </div>
        <CameraMirror />
      </div>

      <div className="card class-turn">
        <div className="class-turn-head">
          <span className="chip">{course.title} · {moduleTitle}</span>
          <span className="muted">{done ? "Repaso terminado" : `Pregunta ${step + 1} de ${questions.length}`} · {score} correctas</span>
        </div>

        {done ? (
          <>
            <p className="class-tip">{score === questions.length ? "¡Perfecto! Dominas este módulo." : score >= questions.length * 0.7 ? "¡Muy bien! Repasa los temas en los que fallaste." : "Vale la pena repasar el módulo antes de seguir."}</p>
            {mistakes.length > 0 && (
              <div className="class-answer">
                <span className="muted">Repasa estos temas:</span>
                {mistakes.map((m, i) =>
                  m.topicId && lessonOf.get(m.topicId) ? (
                    <Link key={i} to={`/leccion/${m.topicId}`}>📖 {m.title}</Link>
                  ) : (
                    <span key={i}>📖 {m.title}</span>
                  ),
                )}
              </div>
            )}
            <div className="practice-actions">
              <button className="btn" onClick={onRestart}>Repetir con otras preguntas</button>
              <button className="btn ghost" onClick={onExit}>Elegir otro módulo</button>
            </div>
          </>
        ) : (
          <>
            <p className="class-tip">{q.prompt}</p>

            {q.kind === "choice" ? (
              <div className="options review-options">
                {q.options.map((o, i) => (
                  <button
                    key={i}
                    disabled={Boolean(outcome) || wrongPicks.includes(i) || (mustPick && i !== q.correct)}
                    className={outcome || mustPick ? (i === q.correct ? "right" : wrongPicks.includes(i) || i === picked ? "wrong" : "") : wrongPicks.includes(i) ? "wrong" : ""}
                    onClick={() => answerChoice(i)}
                  >
                    <b>{LETTERS[i]}.</b> {o}
                  </button>
                ))}
              </div>
            ) : (
              <form
                className="class-type"
                onSubmit={(e) => {
                  e.preventDefault();
                  answerExplain(typed);
                }}
              >
                <textarea value={typed} onChange={(e) => setTyped(e.target.value)} rows={3} placeholder="Habla con el micrófono o escribe tu explicación aquí" disabled={Boolean(outcome)} />
                <button className="btn ghost sm" disabled={Boolean(outcome) || !typed.trim()}>Revisar mi explicación</button>
              </form>
            )}

            <div className="practice-actions">
              {hasMic() && !outcome && (
                <button className="btn" onClick={talk} aria-pressed={listening}>
                  {listening ? "Te escucho… habla ahora" : q.kind === "explain" ? "🎤 Explicar hablando" : "🎤 Responder hablando"}
                </button>
              )}
              {!outcome && <button className="btn ghost sm" onClick={() => void speak(q.prompt)}>Repetir la pregunta</button>}
              {!outcome && !mustPick && tries > 0 && q.kind === "choice" && (
                <button className="btn ghost sm" onClick={revealChoice}>Ver la respuesta</button>
              )}
            </div>
            {notice && <p className="practice-note" role="status">{notice}</p>}

            {retry && !outcome && (
              <div className="feedback bad" role="status">
                <span>
                  🔁 {retry.text}
                  {retry.tips && retry.tips.length > 0 && <ul className="review-tips">{retry.tips.map((t) => <li key={t}>{t}</li>)}</ul>}
                </span>
              </div>
            )}

            {outcome && (
              <div className={`feedback ${outcome.ok ? "ok" : "bad"}`} role="status">
                <span>
                  {outcome.text}
                  {outcome.tips && outcome.tips.length > 0 && (
                    <ul className="review-tips">{outcome.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                  )}
                </span>
              </div>
            )}

            <div className="practice-nav">
              <button className="btn ghost sm" onClick={onExit}>← Otros módulos</button>
              {outcome ? (
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
