/**
 * Ilustraciones de cada curso (dibujos propios de NOVA COURSE, sin derechos de terceros).
 * Trazo blanco sobre la portada de color del curso; tamaño libre (viewBox 120×120).
 */
import type { ReactNode } from "react";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const soft = "rgba(255,255,255,.22)";

const ART: Record<string, ReactNode> = {
  // Pluma vectorial con curva y muestras de color
  "diseno-grafico": (
    <>
      <path {...S} d="M20 92 C 40 40, 80 100, 100 30" />
      <circle cx="20" cy="92" r="5" fill="currentColor" /><circle cx="100" cy="30" r="5" fill="currentColor" />
      <path {...S} d="M58 22 l14 14 -22 34 -14 -14 z" fill={soft} />
      <path {...S} d="M36 56 l-6 20 20 -6" />
      <rect x="70" y="78" width="12" height="12" rx="3" fill="currentColor" opacity=".9" />
      <rect x="86" y="78" width="12" height="12" rx="3" fill="currentColor" opacity=".6" />
      <rect x="86" y="94" width="12" height="12" rx="3" fill="currentColor" opacity=".35" />
    </>
  ),
  // Ventana de código </>
  "programacion-de-software": (
    <>
      <rect {...S} x="14" y="22" width="92" height="74" rx="10" fill={soft} />
      <path {...S} d="M14 38 h92" />
      <circle cx="24" cy="30" r="2.5" fill="currentColor" /><circle cx="32" cy="30" r="2.5" fill="currentColor" /><circle cx="40" cy="30" r="2.5" fill="currentColor" />
      <path {...S} d="M46 56 l-12 12 12 12 M74 56 l12 12 -12 12 M66 52 l-12 32" />
    </>
  ),
  // Servidor y red
  "ingenieria-de-sistemas": (
    <>
      <rect {...S} x="18" y="18" width="48" height="22" rx="5" fill={soft} />
      <rect {...S} x="18" y="46" width="48" height="22" rx="5" fill={soft} />
      <rect {...S} x="18" y="74" width="48" height="22" rx="5" fill={soft} />
      <circle cx="56" cy="29" r="3" fill="currentColor" /><circle cx="56" cy="57" r="3" fill="currentColor" /><circle cx="56" cy="85" r="3" fill="currentColor" />
      <path {...S} d="M66 57 h18 M84 30 v54" />
      <circle {...S} cx="96" cy="30" r="8" /><circle {...S} cx="96" cy="84" r="8" />
      <path {...S} d="M84 30 h4 M84 84 h4" />
    </>
  ),
  // Chip con conexiones neuronales
  "inteligencia-artificial": (
    <>
      <rect {...S} x="34" y="34" width="52" height="52" rx="10" fill={soft} />
      <path {...S} d="M48 20 v14 M60 20 v14 M72 20 v14 M48 86 v14 M60 86 v14 M72 86 v14 M20 48 h14 M20 60 h14 M20 72 h14 M86 48 h14 M86 60 h14 M86 72 h14" />
      <circle cx="50" cy="52" r="4" fill="currentColor" /><circle cx="70" cy="50" r="4" fill="currentColor" /><circle cx="60" cy="70" r="4" fill="currentColor" />
      <path {...S} strokeWidth="2.5" d="M50 52 L70 50 L60 70 Z" />
    </>
  ),
  // Balanza de la justicia
  derecho: (
    <>
      <path {...S} d="M60 16 v84 M40 100 h40 M24 34 h72" />
      <circle cx="60" cy="16" r="4" fill="currentColor" />
      <path {...S} d="M24 34 l-12 30 h24 z M96 34 l-12 30 h24 z" fill={soft} />
    </>
  ),
  // Sol, panel solar y aerogenerador
  "energias-renovables": (
    <>
      <circle {...S} cx="30" cy="28" r="10" fill={soft} />
      <path {...S} d="M30 10 v4 M30 42 v4 M12 28 h4 M44 28 h4 M17 15 l3 3 M40 38 l3 3 M43 15 l-3 3" />
      <path {...S} d="M14 98 l12 -30 h36 l-12 30 z" fill={soft} />
      <path {...S} d="M20 83 h36 M38 68 l-12 30" />
      <path {...S} d="M88 104 V52" />
      <path {...S} d="M88 52 l-4 -26 M88 52 l20 14 M88 52 l-22 12" />
      <circle cx="88" cy="52" r="4" fill="currentColor" />
    </>
  ),
  // Brazo robótico
  robotica: (
    <>
      <rect {...S} x="22" y="92" width="40" height="12" rx="4" fill={soft} />
      <path {...S} d="M42 92 L42 72 L72 44" strokeWidth="7" />
      <circle cx="42" cy="72" r="6" fill="currentColor" /><circle cx="72" cy="44" r="6" fill="currentColor" />
      <path {...S} d="M72 44 L92 30" strokeWidth="6" />
      <path {...S} d="M92 30 l10 -10 M92 30 l14 2" />
      <circle {...S} cx="96" cy="74" r="8" fill={soft} />
    </>
  ),
  // Libro abierto con la Ñ
  "licenciatura-lengua-castellana": (
    <>
      <path {...S} d="M60 30 C 46 22, 28 22, 14 28 V 96 C 28 90, 46 90, 60 98 C 74 90, 92 90, 106 96 V 28 C 92 22, 74 22, 60 30 Z" fill={soft} />
      <path {...S} d="M60 30 V98" />
      <text x="37" y="72" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor" fontFamily="Georgia, serif">Ñ</text>
      <path {...S} strokeWidth="2.5" d="M72 46 h22 M72 56 h22 M72 66 h16" />
    </>
  ),
  // Silbato y balón
  "educacion-fisica": (
    <>
      <circle {...S} cx="78" cy="74" r="26" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M78 48 v52 M52 74 h52 M60 56 c10 10 10 26 0 36 M96 56 c-10 10 -10 26 0 36" />
      <path {...S} d="M14 32 h26 a12 12 0 1 1 -12 12" fill={soft} />
      <path {...S} d="M40 32 l10 -8" />
    </>
  ),
  // Átomo
  fisica: (
    <>
      <ellipse {...S} cx="60" cy="60" rx="46" ry="17" />
      <ellipse {...S} cx="60" cy="60" rx="46" ry="17" transform="rotate(60 60 60)" />
      <ellipse {...S} cx="60" cy="60" rx="46" ry="17" transform="rotate(-60 60 60)" />
      <circle cx="60" cy="60" r="8" fill="currentColor" />
    </>
  ),
  // Mancuerna
  "ejercicios-fisicos": (
    <>
      <path {...S} d="M38 60 h44" strokeWidth="6" />
      <rect {...S} x="18" y="38" width="14" height="44" rx="4" fill={soft} />
      <rect {...S} x="88" y="38" width="14" height="44" rx="4" fill={soft} />
      <rect {...S} x="8" y="46" width="10" height="28" rx="3" />
      <rect {...S} x="102" y="46" width="10" height="28" rx="3" />
    </>
  ),
  // Gráfico de barras y torta
  "visualizacion-de-datos": (
    <>
      <path {...S} d="M14 100 h66" />
      <rect {...S} x="20" y="66" width="12" height="34" rx="2" fill={soft} />
      <rect {...S} x="40" y="46" width="12" height="54" rx="2" fill={soft} />
      <rect {...S} x="60" y="28" width="12" height="72" rx="2" fill="currentColor" opacity=".85" />
      <circle {...S} cx="94" cy="36" r="16" fill={soft} />
      <path d="M94 36 V20 A16 16 0 0 1 110 36 Z" fill="currentColor" />
    </>
  ),
  // Cilindros de datos
  "big-data": (
    <>
      <ellipse {...S} cx="60" cy="24" rx="34" ry="10" fill={soft} />
      <path {...S} d="M26 24 v24 c0 6 15 10 34 10 s34 -4 34 -10 V24" />
      <path {...S} d="M26 48 v24 c0 6 15 10 34 10 s34 -4 34 -10 V48" />
      <path {...S} d="M26 72 v22 c0 6 15 10 34 10 s34 -4 34 -10 V72" />
      <circle cx="82" cy="40" r="3" fill="currentColor" /><circle cx="82" cy="64" r="3" fill="currentColor" /><circle cx="82" cy="88" r="3" fill="currentColor" />
    </>
  ),
  // Nube con flechas de subida y bajada
  "cloud-computing": (
    <>
      <path {...S} d="M32 84 a20 20 0 0 1 2 -40 a26 26 0 0 1 50 -6 a22 22 0 0 1 6 46 z" fill={soft} />
      <path {...S} d="M50 100 V66 M40 76 l10 -10 10 10" />
      <path {...S} d="M74 66 V100 M64 90 l10 10 10 -10" />
    </>
  ),
  // Campana de recepción y llave de habitación
  "administracion-hotelera-y-turistica": (
    <>
      <path {...S} d="M22 86 a38 38 0 0 1 76 0 z" fill={soft} />
      <path {...S} d="M14 94 h92 M60 48 v-8 M52 40 h16" />
      <circle cx="60" cy="38" r="3" fill="currentColor" />
      <path {...S} strokeWidth="2.5" d="M38 76 a24 24 0 0 1 14 -18" />
    </>
  ),
};

/** Burbujas de conversación: cursos de idiomas */
const LANGUAGE_ART = (
  <>
    <path {...S} d="M14 22 h56 a8 8 0 0 1 8 8 v28 a8 8 0 0 1 -8 8 H40 l-14 12 v-12 h-12 a8 8 0 0 1 -8 -8 V30 a8 8 0 0 1 8 -8 z" fill={soft} />
    <path {...S} d="M58 58 h48 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-6 v12 l-14 -12 H58 a8 8 0 0 1 -8 -8 V66 a8 8 0 0 1 8 -8 z" />
    <path {...S} strokeWidth="2.5" d="M22 38 h40 M22 48 h28 M64 74 h36 M64 84 h24" />
  </>
);

/** Mano abierta: Lengua de Señas Colombiana */
const SIGN_ART = (
  <>
    <path {...S} d="M42 104 c-10 -10 -22 -26 -26 -36 c-2 -6 6 -10 10 -4 l12 14 V26 a6 6 0 0 1 12 0 v34 V18 a6 6 0 0 1 12 0 v42 V24 a6 6 0 0 1 12 0 v38 V36 a6 6 0 0 1 12 0 v38 c0 16 -8 30 -20 30 z" fill={soft} />
    <path {...S} strokeWidth="2.5" d="M100 22 q8 8 0 16 M108 16 q14 14 0 28" />
  </>
);

export function CourseArt({ slug, lang, className = "" }: { slug: string; lang?: string | null; className?: string }) {
  const art = lang === "lsc" ? SIGN_ART : lang ? LANGUAGE_ART : ART[slug];
  if (!art) return null;
  return (
    <svg className={`course-art ${className}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
