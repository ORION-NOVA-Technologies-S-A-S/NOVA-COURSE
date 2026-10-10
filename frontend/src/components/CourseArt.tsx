/**
 * Ilustraciones de cada curso (dibujos propios de NOVA COURSE, sin derechos de terceros).
 * Trazo blanco sobre la portada de color del curso; tamaño libre (viewBox 120×120).
 */
import type { ReactNode } from "react";
import { ART_MAS } from "./courseArtMas";

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
  // ---------- Ciencias ----------
  quimica: (
    <>
      <path {...S} d="M48 16 h24 M52 16 v30 L26 94 a8 8 0 0 0 7 12 h54 a8 8 0 0 0 7 -12 L68 46 V16" fill={soft} />
      <path {...S} d="M34 80 h52" />
      <circle cx="50" cy="90" r="4" fill="currentColor" /><circle cx="66" cy="86" r="3" fill="currentColor" /><circle cx="58" cy="70" r="3" fill="currentColor" />
      <circle {...S} cx="90" cy="26" r="5" /><circle {...S} cx="100" cy="40" r="3.5" />
    </>
  ),
  biologia: (
    <>
      <path {...S} d="M22 98 C 22 50, 60 18, 102 18 C 102 62, 70 98, 22 98 Z" fill={soft} />
      <path {...S} d="M22 98 L 84 36 M44 76 h20 M56 64 v-18 M68 52 h14 M38 82 v-14" />
    </>
  ),
  matematicas: (
    <>
      <path {...S} d="M14 104 V16 M14 104 H106" />
      <path {...S} d="M18 96 C 40 92, 52 30, 100 22" />
      <text x="74" y="78" textAnchor="middle" fontSize="34" fontWeight="700" fill="currentColor" fontFamily="Georgia, serif">π</text>
      <path {...S} strokeWidth="3" d="M30 30 h12 M36 24 v12 M30 52 h12" />
    </>
  ),
  astronomia: (
    <>
      <circle {...S} cx="84" cy="34" r="14" fill={soft} />
      <ellipse {...S} cx="84" cy="34" rx="26" ry="7" transform="rotate(-20 84 34)" />
      <path {...S} d="M20 72 l44 -18 l6 14 l-44 18 z" fill={soft} />
      <path {...S} d="M38 82 l-10 24 M44 80 l10 26 M30 100 h22" />
      <path {...S} strokeWidth="2.5" d="M30 24 v10 M25 29 h10 M104 80 v8 M100 84 h8" />
    </>
  ),
  geologia: (
    <>
      <path {...S} d="M10 92 L44 36 L60 58 L74 40 L110 92 Z" fill={soft} />
      <path {...S} d="M24 70 h70 M17 82 h86" strokeWidth="2.5" />
      <path {...S} d="M44 36 l-6 -14 M44 36 l6 -16 M44 36 l14 -8" strokeWidth="2.5" />
      <path {...S} d="M10 104 h100" />
    </>
  ),
  ecologia: (
    <>
      <circle {...S} cx="60" cy="44" r="26" fill={soft} />
      <path {...S} d="M60 104 V54 M60 70 l-14 -12 M60 62 l12 -10" />
      <path {...S} d="M18 70 a44 44 0 0 0 30 34 M102 70 a44 44 0 0 1 -30 34" />
      <path {...S} d="M42 100 l6 4 -4 6 M78 100 l-6 4 4 6" strokeWidth="2.5" />
    </>
  ),
  "ciencias-ambientales": (
    <>
      <circle {...S} cx="54" cy="62" r="38" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M26 48 c10 4 16 -4 26 2 s8 14 18 10 M30 82 c8 -6 18 0 24 -6 M64 30 c4 8 14 6 18 14" />
      <path {...S} d="M82 34 C 86 16, 104 10, 112 12 C 112 30, 100 40, 84 40 Z" fill="currentColor" />
    </>
  ),
  genetica: (
    <>
      <path {...S} d="M40 10 C 40 40, 80 40, 80 60 S 40 80, 40 110 M80 10 C 80 40, 40 40, 40 60 S 80 80, 80 110" />
      <path {...S} strokeWidth="2.5" d="M46 22 h28 M52 34 h16 M52 86 h16 M46 98 h28 M48 60 h24" />
    </>
  ),
  microbiologia: (
    <>
      <circle {...S} cx="60" cy="60" r="46" />
      <rect {...S} x="30" y="40" width="36" height="16" rx="8" fill={soft} transform="rotate(-20 48 48)" />
      <path {...S} strokeWidth="2.5" d="M66 38 q8 -6 14 0 t14 0" />
      <circle {...S} cx="76" cy="74" r="10" fill={soft} /><circle cx="76" cy="74" r="3" fill="currentColor" />
      <circle cx="44" cy="82" r="5" fill="currentColor" /><circle cx="56" cy="90" r="3" fill="currentColor" />
    </>
  ),
  bioquimica: (
    <>
      <path {...S} d="M30 36 l14 -8 14 8 v16 l-14 8 -14 -8 z" fill={soft} />
      <path {...S} d="M58 52 l14 8 v16 l-14 8 -14 -8 v-16" />
      <path {...S} d="M72 76 l14 8 v16 l-14 8" />
      <circle cx="44" cy="28" r="4" fill="currentColor" /><circle cx="86" cy="84" r="4" fill="currentColor" /><circle cx="30" cy="52" r="4" fill="currentColor" />
      <path {...S} d="M86 84 l12 -8 M30 36 l-12 -8" />
    </>
  ),
  "ciencias-naturales": (
    <>
      <circle {...S} cx="50" cy="50" r="30" fill={soft} />
      <path {...S} d="M72 72 l30 30" strokeWidth="7" />
      <path {...S} strokeWidth="2.5" d="M38 62 C 38 44, 50 34, 64 34 C 64 50, 54 62, 38 62 Z M38 62 l18 -18" />
    </>
  ),
  // ---------- Ciencias sociales ----------
  sociologia: (
    <>
      <circle {...S} cx="60" cy="34" r="12" fill={soft} /><circle {...S} cx="28" cy="52" r="10" /><circle {...S} cx="92" cy="52" r="10" />
      <path {...S} d="M40 88 a20 20 0 0 1 40 0 M10 96 a18 18 0 0 1 32 -12 M110 96 a18 18 0 0 0 -32 -12" />
      <path {...S} strokeWidth="2.5" d="M38 50 l12 -8 M82 50 l-12 -8" />
    </>
  ),
  psicologia: (
    <>
      <path {...S} d="M40 104 v-18 c-12 -6 -20 -20 -20 -36 a36 36 0 0 1 72 0 c0 4 6 12 8 16 h-8 v12 a8 8 0 0 1 -8 8 h-12 v18" fill={soft} />
      <text x="56" y="62" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor" fontFamily="Georgia, serif">ψ</text>
    </>
  ),
  antropologia: (
    <>
      <path {...S} d="M44 20 h32 M48 20 c-2 10 -18 16 -18 40 c0 24 14 40 30 40 s30 -16 30 -40 c0 -24 -16 -30 -18 -40" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M34 54 h52 M32 72 h56 M44 54 l8 18 8 -18 8 18 8 -18" />
    </>
  ),
  historia: (
    <>
      <path {...S} d="M30 14 h60 M30 106 h60" />
      <path {...S} d="M36 14 c0 26 22 30 22 46 s-22 20 -22 46 M84 14 c0 26 -22 30 -22 46 s22 20 22 46" fill={soft} />
      <path d="M44 98 c4 -10 12 -14 16 -22 c4 8 12 12 16 22 z" fill="currentColor" />
      <circle cx="60" cy="46" r="3" fill="currentColor" />
    </>
  ),
  geografia: (
    <>
      <path {...S} d="M12 30 l30 -10 36 10 30 -10 v70 l-30 10 -36 -10 -30 10 z" fill={soft} />
      <path {...S} d="M42 20 v70 M78 30 v70" strokeWidth="2.5" />
      <path {...S} d="M60 42 a12 12 0 0 1 12 12 c0 10 -12 22 -12 22 s-12 -12 -12 -22 a12 12 0 0 1 12 -12 z" fill="currentColor" />
      <circle cx="60" cy="54" r="4" fill="#fff" opacity=".9" />
    </>
  ),
  "ciencia-politica": (
    <>
      <rect {...S} x="24" y="58" width="72" height="46" rx="6" fill={soft} />
      <path {...S} d="M42 58 h36" strokeWidth="6" />
      <path {...S} d="M46 50 l4 -36 h24 l-4 36" fill="currentColor" opacity=".9" />
      <path {...S} strokeWidth="2.5" d="M54 24 h14 M54 32 h10" stroke="#000" opacity=".35" />
      <path {...S} d="M40 82 h40" strokeWidth="2.5" />
    </>
  ),
  economia: (
    <>
      <ellipse {...S} cx="38" cy="90" rx="22" ry="7" fill={soft} />
      <path {...S} d="M16 90 v-10 c0 4 10 7 22 7 s22 -3 22 -7 v10 M16 80 v-10 c0 4 10 7 22 7 s22 -3 22 -7 v10" />
      <ellipse {...S} cx="38" cy="70" rx="22" ry="7" />
      <path {...S} d="M66 96 l12 -20 12 8 18 -32" />
      <path {...S} d="M96 52 h12 v12" />
    </>
  ),
  "relaciones-internacionales": (
    <>
      <circle {...S} cx="60" cy="60" r="44" fill={soft} />
      <ellipse {...S} cx="60" cy="60" rx="18" ry="44" />
      <path {...S} d="M16 60 h88 M24 38 h72 M24 82 h72" strokeWidth="2.5" />
    </>
  ),
  "trabajo-social": (
    <>
      <path {...S} d="M60 58 c-8 -14 -30 -8 -26 8 c3 12 26 26 26 26 s23 -14 26 -26 c4 -16 -18 -22 -26 -8 z" fill="currentColor" />
      <path {...S} d="M10 88 l18 -4 c8 -2 16 4 24 10 h28 c8 -6 16 -12 24 -10 l6 2 M10 104 h30 l16 -6 h8 l16 6 h30" />
    </>
  ),
  demografia: (
    <>
      <path {...S} d="M60 14 v92" strokeWidth="2.5" />
      <rect x="42" y="18" width="36" height="10" rx="2" fill="currentColor" opacity=".55" />
      <rect x="34" y="34" width="52" height="10" rx="2" fill="currentColor" opacity=".65" />
      <rect x="26" y="50" width="68" height="10" rx="2" fill="currentColor" opacity=".75" />
      <rect x="20" y="66" width="80" height="10" rx="2" fill="currentColor" opacity=".85" />
      <rect x="14" y="82" width="92" height="10" rx="2" fill="currentColor" />
    </>
  ),
  "ciencias-de-la-comunicacion": (
    <>
      <rect {...S} x="46" y="14" width="28" height="50" rx="14" fill={soft} />
      <path {...S} d="M34 52 a26 26 0 0 0 52 0 M60 78 v16 M44 100 h32" />
      <path {...S} strokeWidth="2.5" d="M20 34 a40 40 0 0 0 0 36 M100 34 a40 40 0 0 1 0 36" />
    </>
  ),
  // ---------- Arte, diseño y comunicación ----------
  "diseno-industrial": (
    <>
      <path {...S} d="M36 16 h20 v52 h40 v14 H36 z" fill={soft} />
      <path {...S} d="M40 82 l-6 26 M92 82 l6 26 M56 68 v-10" />
      <path {...S} strokeWidth="2.5" d="M14 24 v80 M10 24 h8 M10 104 h8" />
    </>
  ),
  "diseno-de-interiores": (
    <>
      <path {...S} d="M14 64 a8 8 0 0 1 16 0 v10 h52 v-10 a8 8 0 0 1 16 0 v26 H14 z" fill={soft} />
      <path {...S} d="M30 56 h52 v18 M20 90 v12 M92 90 v12" />
      <path {...S} d="M100 14 l-10 22 h20 z" fill="currentColor" />
      <path {...S} d="M100 36 v16" />
    </>
  ),
  "diseno-de-modas": (
    <>
      <path {...S} d="M60 10 a6 6 0 1 1 -6 6 M60 22 v6 M60 28 l-30 14 h60 z" />
      <path {...S} d="M46 42 l-4 22 l-14 42 h64 l-14 -42 l-4 -22" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M42 64 h36" />
    </>
  ),
  "artes-plasticas": (
    <>
      <path {...S} d="M60 16 c26 0 46 16 46 40 c0 14 -12 16 -20 14 c-8 -2 -14 6 -8 14 c6 10 -4 20 -18 20 c-26 0 -46 -20 -46 -44 S34 16 60 16 z" fill={soft} />
      <circle cx="40" cy="44" r="6" fill="currentColor" /><circle cx="60" cy="34" r="6" fill="currentColor" opacity=".8" /><circle cx="80" cy="42" r="6" fill="currentColor" opacity=".6" /><circle cx="38" cy="68" r="6" fill="currentColor" opacity=".7" />
    </>
  ),
  "artes-visuales": (
    <>
      <rect {...S} x="12" y="20" width="96" height="80" rx="6" />
      <path {...S} d="M24 60 c12 -18 24 -24 36 -24 s24 6 36 24 c-12 18 -24 24 -36 24 s-24 -6 -36 -24 z" fill={soft} />
      <circle cx="60" cy="60" r="11" fill="currentColor" />
    </>
  ),
  musica: (
    <>
      <path {...S} d="M44 88 V30 l50 -12 v58" />
      <path {...S} d="M44 44 l50 -12" />
      <ellipse cx="34" cy="88" rx="12" ry="9" fill="currentColor" />
      <ellipse cx="84" cy="76" rx="12" ry="9" fill="currentColor" />
    </>
  ),
  teatro: (
    <>
      <path {...S} d="M14 24 h48 v30 c0 18 -10 32 -24 32 s-24 -14 -24 -32 z" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M24 44 q6 -4 10 0 M42 44 q6 -4 10 0 M28 64 q10 10 20 0" />
      <path {...S} d="M58 46 h48 v30 c0 18 -10 32 -24 32 s-24 -14 -24 -32 z" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M68 66 q6 4 10 0 M86 66 q6 4 10 0 M72 92 q10 -10 20 0" />
    </>
  ),
  "cine-y-produccion-audiovisual": (
    <>
      <rect {...S} x="16" y="48" width="88" height="56" rx="6" fill={soft} />
      <path {...S} d="M16 48 l84 -24 l6 18 l-84 24" />
      <path {...S} strokeWidth="2.5" d="M34 38 l10 14 M56 32 l10 14 M78 26 l10 14" />
      <path d="M52 64 v28 l24 -14 z" fill="currentColor" />
    </>
  ),
  fotografia: (
    <>
      <path {...S} d="M14 40 h22 l8 -12 h32 l8 12 h22 v58 H14 z" fill={soft} />
      <circle {...S} cx="60" cy="68" r="20" />
      <circle cx="60" cy="68" r="9" fill="currentColor" />
      <circle cx="92" cy="52" r="3" fill="currentColor" />
    </>
  ),
  "animacion-digital": (
    <>
      <rect {...S} x="10" y="22" width="100" height="76" rx="6" />
      <path {...S} strokeWidth="2.5" d="M10 34 h100 M10 86 h100 M24 22 v12 M44 22 v12 M64 22 v12 M84 22 v12 M24 86 v12 M44 86 v12 M64 86 v12 M84 86 v12" />
      <path {...S} strokeWidth="2.5" strokeDasharray="3 6" d="M22 74 q14 -36 30 0 q12 -24 24 0 q8 -14 16 0" />
      <circle cx="92" cy="70" r="7" fill="currentColor" />
    </>
  ),
  "escritura-creativa": (
    <>
      <path {...S} d="M20 22 h52 l16 16 v64 H20 z" fill={soft} />
      <path {...S} strokeWidth="2.5" d="M30 48 h40 M30 60 h40 M30 72 h28" />
      <path {...S} d="M104 14 c-20 6 -34 26 -40 48 l6 2 c10 -18 22 -32 34 -50 z" fill="currentColor" />
      <path {...S} d="M64 62 l-4 12" />
    </>
  ),
  arquitectura: (
    <>
      <path {...S} d="M16 104 V56 L60 22 L104 56 V104 Z" fill={soft} />
      <path {...S} d="M48 104 V76 h24 v28 M30 64 h12 v12 H30 z M78 64 h12 v12 H78 z" />
      <path {...S} strokeWidth="2.5" d="M8 104 h104" />
    </>
  ),
  publicidad: (
    <>
      <path {...S} d="M20 48 h18 l46 -24 v72 l-46 -24 H20 z" fill={soft} />
      <path {...S} d="M30 72 l8 26 h12 l-6 -26" />
      <path {...S} strokeWidth="2.5" d="M96 48 l12 -6 M98 60 h14 M96 72 l12 6" />
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
  const art = lang === "lsc" ? SIGN_ART : lang ? LANGUAGE_ART : ART[slug] ?? ART_MAS[slug];
  if (!art) return null;
  return (
    <svg className={`course-art ${className}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
