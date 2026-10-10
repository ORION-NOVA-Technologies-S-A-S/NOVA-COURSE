import { useEffect, useRef, useState } from "react";
import { avatarState } from "./avatarState";
import { openNova } from "./NovaChat";
import { NovaAvatar } from "./NovaAvatar";
import { speak } from "./voice";

/** NOVA grande en la portada: saluda y abre el chat al tocarla. */
export function NovaStage() {
  const [bubble, setBubble] = useState("");
  const timer = useRef(0);

  const say = (t: string) => {
    setBubble(t);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBubble(""), 4500);
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      avatarState.pulse("wave", 3000);
      avatarState.pulse("happy", 1200);
      say("¡Hola! Soy NOVA. Tócame y te ayudo a elegir tu curso.");
    }, 1500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
  }, []);

  const hi = () => {
    avatarState.pulse("wave", 3000);
    avatarState.pulse("happy", 1200);
    say("¡Hola! ¿Qué te gustaría aprender hoy?");
    void speak("Hola, soy Nova. ¿Qué te gustaría aprender hoy?");
    window.setTimeout(() => openNova(), 900);
  };

  return (
    <div
      className="nova-stage"
      role="button"
      tabIndex={0}
      aria-label="Hablar con NOVA"
      onClick={hi}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          hi();
        }
      }}
    >
      {bubble && <div className="nova-bubble" role="status">{bubble}</div>}
      <div className="nova-ring" />
      <NovaAvatar className="stage-face" />
      <span className="nova-hint">Toca a NOVA</span>
    </div>
  );
}
