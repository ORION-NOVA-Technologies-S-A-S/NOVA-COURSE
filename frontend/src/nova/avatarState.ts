/** Estados del humanoide (hablar, pensar, escuchar, saludar, feliz) y su mirada. */
export type AvatarMood = "talk" | "think" | "listen" | "wave" | "happy";

type Listener = () => void;
const listeners = new Set<Listener>();
const active = new Set<AvatarMood>();
const timers: Partial<Record<AvatarMood, number>> = {};

function apply() {
  document.querySelectorAll<SVGElement>("svg.av").forEach((el) => {
    (["talk", "think", "listen", "wave", "happy"] as AvatarMood[]).forEach((m) => el.classList.toggle(m, active.has(m)));
  });
  listeners.forEach((l) => l());
}

export const avatarState = {
  set(mood: AvatarMood, on: boolean, ms?: number) {
    if (on) active.add(mood);
    else active.delete(mood);
    if (timers[mood]) window.clearTimeout(timers[mood]);
    if (on && ms) timers[mood] = window.setTimeout(() => avatarState.set(mood, false), ms);
    apply();
  },
  pulse(mood: AvatarMood, ms: number) {
    avatarState.set(mood, false);
    window.setTimeout(() => avatarState.set(mood, true, ms), 20);
  },
  has: (mood: AvatarMood) => active.has(mood),
  /** Vuelve a aplicar los estados a un avatar recién dibujado. */
  refresh: apply,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

/* La mirada sigue al puntero; si nadie lo mueve, NOVA mira a su alrededor. */
let raf = 0;
let lastMove = Date.now();
function lookAt(x: number, y: number) {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    document.querySelectorAll<SVGElement>("svg.av").forEach((a) => {
      const b = a.getBoundingClientRect();
      if (!b.width) return;
      const dx = Math.max(-1, Math.min(1, (x - (b.left + b.width / 2)) / 260));
      const dy = Math.max(-1, Math.min(1, (y - (b.top + b.height * 0.35)) / 260));
      a.style.setProperty("--ex", dx.toFixed(2));
      a.style.setProperty("--ey", dy.toFixed(2));
    });
  });
}
if (typeof window !== "undefined") {
  document.addEventListener(
    "pointermove",
    (e) => {
      lastMove = Date.now();
      lookAt(e.clientX, e.clientY);
    },
    { passive: true },
  );
  window.setInterval(() => {
    if (document.hidden || Date.now() - lastMove < 4000) return;
    const x = (Math.random() * 2 - 1) * 0.8;
    const y = (Math.random() * 2 - 1) * 0.5;
    document.querySelectorAll<SVGElement>("svg.av").forEach((a) => {
      a.style.setProperty("--ex", x.toFixed(2));
      a.style.setProperty("--ey", y.toFixed(2));
    });
  }, 3200);
}
