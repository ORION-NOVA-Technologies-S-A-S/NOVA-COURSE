import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { avatarState } from "./avatarState";
import { getCurrentLesson, greeting, reply, type NovaAction, type NovaReply } from "./brain";
import { NovaAvatar } from "./NovaAvatar";
import { hasMic, hasTTS, listen, speak, stopSpeech, voiceEnabled, setVoiceEnabled } from "./voice";

interface Msg {
  from: "nova" | "me";
  text: string;
  actions?: NovaAction[];
}

/** Abre el chat de NOVA desde cualquier parte (opcionalmente con una pregunta). */
export function openNova(ask?: string) {
  window.dispatchEvent(new CustomEvent("nova:open", { detail: { ask } }));
}

export function NovaChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(voiceEnabled());
  const [status, setStatus] = useState("");
  const [nudge, setNudge] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Estado visible junto al avatar
  useEffect(
    () =>
      avatarState.subscribe(() => {
        setStatus(
          avatarState.has("talk") ? "Hablando…" : avatarState.has("think") ? "Pensando…" : avatarState.has("listen") ? "Te escucho…" : "",
        );
      }),
    [],
  );

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    const t = window.setTimeout(() => setNudge(true), 5000);
    return () => window.clearTimeout(t);
  }, []);

  const novaSays = useCallback((r: NovaReply) => {
    setMsgs((m) => [...m, { from: "nova", text: r.text, actions: r.actions }]);
    void speak(r.say ?? r.text);
  }, []);

  const ask = useCallback(
    async (q: string) => {
      const question = q.trim();
      if (!question) return;
      setMsgs((m) => [...m, { from: "me", text: question }]);
      setBusy(true);
      stopSpeech();
      avatarState.set("think", true);
      try {
        const r = await reply(question, user);
        avatarState.set("think", false);
        avatarState.pulse("happy", 1200);
        novaSays(r);
      } catch {
        avatarState.set("think", false);
        novaSays({ text: "Tuve un problema para consultar la información. Intenta de nuevo en un momento." });
      } finally {
        setBusy(false);
      }
    },
    [user, novaSays],
  );

  const openChat = useCallback(
    (question?: string) => {
      setOpen(true);
      setNudge(false);
      if (question) {
        void ask(question);
      } else if (msgs.length === 0) {
        avatarState.pulse("wave", 3000);
        avatarState.pulse("happy", 1200);
        novaSays(greeting(user));
      }
      window.setTimeout(() => inputRef.current?.focus(), 150);
    },
    [ask, msgs.length, novaSays, user],
  );

  useEffect(() => {
    const onOpen = (e: Event) => openChat((e as CustomEvent<{ ask?: string }>).detail?.ask);
    window.addEventListener("nova:open", onOpen);
    return () => window.removeEventListener("nova:open", onOpen);
  }, [openChat]);

  const runAction = (a: NovaAction) => {
    if (a.to) {
      navigate(a.to);
      if (window.innerWidth < 700) setOpen(false);
    } else if (a.ask) void ask(a.ask);
    else if (a.read) {
      const l = getCurrentLesson();
      if (l) novaSays({ text: `Te leo «${l.title}».`, say: l.content });
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = text;
    setText("");
    void ask(q);
  };

  const mic = async () => {
    try {
      const heard = await listen(setListening);
      if (heard) void ask(heard);
    } catch (err) {
      novaSays({ text: err instanceof Error ? err.message : "No pude escucharte." });
    }
  };

  const toggleVoice = () => {
    const on = !voiceOn;
    setVoiceEnabled(on);
    setVoiceOn(on);
  };

  const close = () => {
    stopSpeech();
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <button className={`nova-fab ${nudge ? "nudge" : ""}`} onClick={() => openChat()} aria-label="Hablar con NOVA, la asistente">
          <NovaAvatar className="fab-face" />
          <span className="fab-label">¿Te ayudo?</span>
        </button>
      )}
      {open && (
        <section className="nova-chat" role="dialog" aria-label="Chat con NOVA">
          <header className="nova-head">
            <NovaAvatar className="head-face" />
            <div className="nova-title">
              <b>NOVA</b>
              <small>{status || "Asistente de NOVA COURSE"}</small>
            </div>
            {hasTTS() && (
              <button
                className="nova-icon"
                onClick={toggleVoice}
                aria-pressed={voiceOn}
                aria-label={voiceOn ? "Silenciar la voz de NOVA" : "Activar la voz de NOVA"}
                title={voiceOn ? "Silenciar la voz" : "Activar la voz"}
              >
                {voiceOn ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M22 9l-6 6M16 9l6 6" /></svg>
                )}
              </button>
            )}
            <button className="nova-icon" onClick={close} aria-label="Cerrar el chat">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>

          <div className="nova-log" ref={logRef} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`nova-msg ${m.from}`}>
                <p>{m.text}</p>
                {m.actions && m.actions.length > 0 && (
                  <div className="nova-actions">
                    {m.actions.map((a, j) => (
                      <button key={j} onClick={() => runAction(a)} disabled={busy}>{a.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="nova-msg nova typing"><span /><span /><span /></div>}
          </div>

          {getCurrentLesson() && (
            <div className="nova-lesson-bar">
              <button onClick={() => runAction({ label: "", read: true })}>Léeme esta lección</button>
              <button onClick={() => void ask("Resume este tema")}>Resúmela</button>
            </div>
          )}

          <form className="nova-form" onSubmit={submit}>
            <input
              id="nova-input"
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escríbele a NOVA…"
              autoComplete="off"
              aria-label="Mensaje para NOVA"
            />
            {hasMic() && (
              <button type="button" className="nova-mic" onClick={mic} aria-pressed={listening} aria-label={listening ? "Dejar de escuchar" : "Hablarle a NOVA"} title="Hablarle a NOVA">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></svg>
              </button>
            )}
            <button className="btn sm" disabled={busy || !text.trim()}>Enviar</button>
          </form>
        </section>
      )}
    </>
  );
}
