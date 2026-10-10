import { useEffect, useRef } from "react";
import { AVATAR_DEFS, AVATAR_SVG } from "./avatarMarkup";
import { avatarState } from "./avatarState";

/** El humanoide NOVA. Su animación la controla avatarState (hablar, pensar, escuchar…). */
export function NovaAvatar({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      ref.current.innerHTML = AVATAR_SVG;
      avatarState.refresh();
    }
  }, []);
  return <span ref={ref} className={`nova-avatar ${className}`} aria-hidden="true" />;
}

/** Degradados del dibujo; se incluyen una sola vez en la página. */
export function NovaAvatarDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs dangerouslySetInnerHTML={{ __html: AVATAR_DEFS }} />
    </svg>
  );
}
