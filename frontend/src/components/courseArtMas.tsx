/**
 * Ilustraciones de los 87 cursos de datos, educación, ingeniería, negocios, salud, deporte y tecnología.
 * Dibujos propios (trazo blanco, viewBox 120×120), mismo estilo que CourseArt.tsx.
 */
import type { ReactNode } from "react";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const T = { ...S, strokeWidth: 2.5 };
const soft = "rgba(255,255,255,.22)";
const dot = (cx: number, cy: number, r = 4) => <circle cx={cx} cy={cy} r={r} fill="currentColor" />;

export const ART_MAS: Record<string, ReactNode> = {
  // ---------------- Datos ----------------
  "ciencia-de-datos": (
    <>
      <rect {...S} x="14" y="18" width="92" height="84" rx="10" fill={soft} />
      {dot(34, 76)}{dot(46, 60)}{dot(60, 66)}{dot(72, 44)}{dot(88, 36)}
      <path {...T} d="M26 84 L96 30" strokeDasharray="5 6" />
    </>
  ),
  estadistica: (
    <>
      <path {...S} d="M10 98 C 34 98, 40 24, 60 24 S 86 98, 110 98" fill={soft} />
      <path {...T} d="M60 24 V98 M38 64 V98 M82 64 V98" strokeDasharray="4 5" />
      <path {...S} d="M8 100 h104" />
    </>
  ),
  "analisis-de-datos": (
    <>
      <rect {...S} x="16" y="64" width="16" height="34" rx="3" fill={soft} />
      <rect {...S} x="40" y="46" width="16" height="52" rx="3" fill={soft} />
      <rect {...S} x="64" y="56" width="16" height="42" rx="3" fill={soft} />
      <circle {...S} cx="88" cy="36" r="14" /><path {...S} d="M98 46 l12 12" />
    </>
  ),
  "aprendizaje-automatico": (
    <>
      {dot(22, 30)}{dot(22, 60)}{dot(22, 90)}{dot(60, 42)}{dot(60, 78)}{dot(98, 60, 6)}
      <path {...T} d="M22 30 L60 42 L98 60 M22 30 L60 78 M22 60 L60 42 M22 60 L60 78 L98 60 M22 90 L60 42 M22 90 L60 78" />
      <circle {...S} cx="98" cy="60" r="12" fill={soft} />
    </>
  ),
  "mineria-de-datos": (
    <>
      <path {...S} d="M28 100 l26 -44 26 44 z" fill={soft} />
      <path {...S} d="M70 18 l30 30 M86 14 q18 6 18 20 M70 18 q-4 14 8 22" />
      <path {...S} d="M78 34 l-20 22" />
      {dot(48, 86, 3)}{dot(60, 80, 3)}{dot(54, 92, 3)}
    </>
  ),
  "inteligencia-de-negocios": (
    <>
      <rect {...S} x="12" y="18" width="96" height="70" rx="8" fill={soft} />
      <path {...S} d="M24 72 l18 -20 14 10 24 -28 16 10" />
      <path {...S} d="M48 88 l-8 16 h40 l-8 -16" />
      <circle {...S} cx="30" cy="34" r="6" />
    </>
  ),
  econometria: (
    <>
      <path {...S} d="M16 100 V18 M16 100 h92" />
      {dot(32, 82, 3)}{dot(44, 74, 3)}{dot(54, 78, 3)}{dot(66, 58, 3)}{dot(80, 54, 3)}{dot(92, 38, 3)}
      <path {...S} d="M24 88 L102 32" />
      <path {...T} d="M70 92 v-10 M70 82 c0 -6 12 -6 12 0 c0 6 -12 4 -12 10 c0 6 12 6 12 0" />
    </>
  ),
  "bases-de-datos": (
    <>
      <ellipse {...S} cx="60" cy="26" rx="36" ry="12" fill={soft} />
      <path {...S} d="M24 26 v68 c0 7 16 12 36 12 s36 -5 36 -12 V26" />
      <path {...S} d="M24 50 c0 7 16 12 36 12 s36 -5 36 -12 M24 72 c0 7 16 12 36 12 s36 -5 36 -12" />
    </>
  ),
  "analitica-predictiva": (
    <>
      <path {...S} d="M12 86 l20 -14 16 8 20 -22" />
      <path {...S} d="M68 58 l36 -30" strokeDasharray="6 6" />
      <path {...S} d="M68 58 l36 -6 v-24 z" fill={soft} strokeWidth="2" />
      <path {...S} d="M12 104 h96" />
    </>
  ),
  bioestadistica: (
    <>
      <path {...S} d="M30 14 c30 16 30 30 0 46 c-30 16 -30 30 0 46 M60 14 c-30 16 -30 30 0 46 c30 16 30 30 0 46" />
      <path {...T} d="M26 30 h38 M26 90 h38" />
      <rect {...S} x="78" y="70" width="10" height="30" rx="2" fill={soft} />
      <rect {...S} x="94" y="52" width="10" height="48" rx="2" fill={soft} />
    </>
  ),

  // ---------------- Educación ----------------
  pedagogia: (
    <>
      <path {...S} d="M10 44 L60 22 L110 44 L60 66 Z" fill={soft} />
      <path {...S} d="M30 54 v24 c0 10 60 10 60 0 V54" />
      <path {...S} d="M104 46 v30" />{dot(104, 80)}
    </>
  ),
  "educacion-infantil": (
    <>
      <rect {...S} x="12" y="64" width="30" height="30" rx="4" fill={soft} />
      <rect {...S} x="46" y="64" width="30" height="30" rx="4" />
      <rect {...S} x="29" y="30" width="30" height="30" rx="4" fill={soft} />
      <path {...S} d="M22 84 l5 -12 5 12 M58 72 v14 M66 72 q-10 0 -10 7 q0 7 10 7 M40 40 h8 v14" />
      <path {...S} d="M88 96 c0 -20 4 -34 14 -42 M96 70 c-10 -2 -14 -10 -8 -16 c6 4 8 10 8 16" />
    </>
  ),
  "educacion-primaria": (
    <>
      <path {...S} d="M18 34 c14 -6 28 -6 42 2 c14 -8 28 -8 42 -2 v62 c-14 -6 -28 -6 -42 2 c-14 -8 -28 -8 -42 -2 z" fill={soft} />
      <path {...S} d="M60 36 v62" />
      <path {...T} d="M28 52 h22 M28 64 h22 M70 52 h22 M70 64 h16" />
      <path {...S} d="M96 14 l4 8 8 1 -6 6 2 8 -8 -4 -8 4 2 -8 -6 -6 8 -1 z" />
    </>
  ),
  "educacion-secundaria": (
    <>
      <path {...S} d="M30 70 l38 -38 14 14 -38 38 -18 4 z" fill={soft} />
      <path {...S} d="M62 38 l14 14" />
      <path {...S} d="M16 100 h88" />
      <path {...T} d="M70 76 l10 -18 10 18 M74 70 h12 M92 30 l4 -12 4 12" />
    </>
  ),
  "educacion-especial": (
    <>
      <circle {...S} cx="46" cy="22" r="8" />
      <path {...S} d="M44 32 v30 h24 l10 22" />
      <path {...S} d="M44 46 h22" />
      <path {...S} d="M58 66 a26 26 0 1 1 -32 26" />
      <path {...S} d="M94 30 c-8 -10 -22 0 0 18 c22 -18 8 -28 0 -18 z" fill={soft} />
    </>
  ),
  "educacion-inclusiva": (
    <>
      <circle {...S} cx="30" cy="40" r="10" fill={soft} /><circle {...S} cx="60" cy="32" r="10" /><circle {...S} cx="90" cy="40" r="10" fill={soft} />
      <path {...S} d="M14 80 c0 -14 10 -22 16 -22 M46 74 c0 -18 6 -28 14 -28 s14 10 14 28 M106 80 c0 -14 -10 -22 -16 -22" />
      <path {...S} d="M20 96 h80" />
      <path {...T} d="M30 96 v-8 M60 96 v-12 M90 96 v-8" />
    </>
  ),
  didactica: (
    <>
      <rect {...S} x="14" y="16" width="92" height="62" rx="6" fill={soft} />
      <path {...S} d="M60 78 v18 M40 104 l20 -8 20 8" />
      <path {...S} d="M26 60 l14 -18 12 10 16 -20" />
      <path {...T} d="M78 34 h18 M78 46 h18 M78 58 h12" />
    </>
  ),
  psicopedagogia: (
    <>
      <path {...S} d="M44 104 v-16 c-14 -6 -24 -20 -24 -36 c0 -22 18 -36 40 -36 s40 14 40 36 c0 6 -2 10 -4 14 l8 14 h-10 v14 h-16 v10" fill={soft} />
      <path {...T} d="M46 46 c0 -8 14 -8 14 0 c0 8 14 8 14 0 M50 62 h20" />
      <path {...S} d="M60 30 v6" />
    </>
  ),
  "administracion-educativa": (
    <>
      <path {...S} d="M14 104 V48 L60 18 L106 48 V104 Z" fill={soft} />
      <path {...S} d="M30 62 h14 v14 H30 z M76 62 h14 v14 H76 z M52 104 V78 h16 v26" />
      <path {...S} d="M60 18 v-8 h14 v6 h-14" />
    </>
  ),
  "tecnologia-educativa": (
    <>
      <rect {...S} x="26" y="12" width="68" height="96" rx="10" fill={soft} />
      <path {...S} d="M36 48 L60 38 L84 48 L60 58 Z" />
      <path {...S} d="M44 52 v12 c0 6 32 6 32 0 V52" />
      {dot(60, 96, 3)}
    </>
  ),
  "educacion-bilingue": (
    <>
      <path {...S} d="M12 20 h50 a8 8 0 0 1 8 8 v24 a8 8 0 0 1 -8 8 H34 l-12 10 v-10 h-2 a8 8 0 0 1 -8 -8 z" fill={soft} />
      <path {...S} d="M58 66 h42 a8 8 0 0 1 8 8 v20 a8 8 0 0 1 -8 8 h-4 v10 l-12 -10 H58 a8 8 0 0 1 -8 -8 V74 a8 8 0 0 1 8 -8 z" />
      <path {...T} d="M28 50 l8 -20 8 20 M31 44 h10 M66 76 h28 M80 76 v20 M70 86 q10 10 20 0" />
    </>
  ),
  "educacion-virtual": (
    <>
      <rect {...S} x="18" y="22" width="84" height="56" rx="6" fill={soft} />
      <path {...S} d="M8 88 h104 l-8 10 H16 z" />
      <path {...S} d="M52 38 v24 l20 -12 z" fill="currentColor" />
    </>
  ),
  "orientacion-escolar": (
    <>
      <circle {...S} cx="60" cy="60" r="44" fill={soft} />
      <path {...S} d="M74 46 l-8 28 -20 0 8 -28 z" />
      <path {...S} d="M60 16 v10 M60 94 v10 M16 60 h10 M94 60 h10" />
      {dot(60, 60, 4)}
    </>
  ),

  // ---------------- Ingeniería ----------------
  "ingenieria-de-software": (
    <>
      <rect {...S} x="12" y="16" width="40" height="28" rx="5" fill={soft} />
      <rect {...S} x="68" y="16" width="40" height="28" rx="5" />
      <rect {...S} x="40" y="76" width="40" height="28" rx="5" fill={soft} />
      <path {...S} d="M32 44 v16 h56 V44 M60 60 v16" />
      <path {...T} d="M24 30 h16 M80 30 h16 M52 90 h16" />
    </>
  ),
  "ingenieria-informatica": (
    <>
      <rect {...S} x="30" y="30" width="60" height="60" rx="8" fill={soft} />
      <rect {...S} x="46" y="46" width="28" height="28" rx="3" />
      <path {...T} d="M42 30 v-14 M60 30 v-14 M78 30 v-14 M42 90 v14 M60 90 v14 M78 90 v14 M30 42 h-14 M30 60 h-14 M30 78 h-14 M90 42 h14 M90 60 h14 M90 78 h14" />
    </>
  ),
  "ingenieria-electronica": (
    <>
      <path {...S} d="M8 60 h20 l6 -14 10 28 10 -28 10 28 6 -14 h14" />
      <path {...S} d="M84 46 v28 M92 50 v20" />
      <path {...S} d="M92 60 h20" />
      <path {...T} d="M20 92 h80 M20 92 v-12 M100 92 v-12" />
      <rect {...S} x="44" y="18" width="32" height="16" rx="3" fill={soft} />
    </>
  ),
  "ingenieria-electrica": (
    <>
      <path {...S} d="M60 10 L36 104 M60 10 L84 104 M44 72 h32 M48 54 h24 M52 36 h16" />
      <path {...S} d="M16 34 h32 M72 34 h32" />
      <path {...S} d="M98 64 l-10 18 h10 l-8 18" />
      {dot(16, 34, 3)}{dot(104, 34, 3)}
    </>
  ),
  "ingenieria-industrial": (
    <>
      <path {...S} d="M12 104 V60 l24 -14 v14 l24 -14 v14 l24 -14 V104 z" fill={soft} />
      <path {...S} d="M84 104 V24 h14 v80" />
      <path {...S} d="M8 104 h104" />
      <path {...T} d="M24 80 h12 M48 80 h12 M72 80 h4" />
      <path {...T} d="M92 18 q6 -8 12 -2 q6 -6 10 2" />
    </>
  ),
  "ingenieria-civil": (
    <>
      <path {...S} d="M8 82 h104" />
      <path {...S} d="M18 82 Q60 20 102 82" />
      <path {...T} d="M32 82 V60 M46 82 V46 M60 82 V42 M74 82 V46 M88 82 V60" />
      <path {...S} d="M24 82 v20 M96 82 v20" />
      <path {...S} d="M8 104 q14 -6 28 0 t28 0 t28 0 t20 0" strokeWidth="2" />
    </>
  ),
  "ingenieria-mecanica": (
    <>
      <circle {...S} cx="46" cy="64" r="22" fill={soft} /><circle {...S} cx="46" cy="64" r="8" />
      <path {...S} d="M46 34 v8 M46 86 v8 M16 64 h8 M68 64 h8 M25 43 l6 6 M61 79 l6 6 M25 85 l6 -6 M61 49 l6 -6" />
      <circle {...S} cx="88" cy="32" r="14" /><circle {...S} cx="88" cy="32" r="4" />
      <path {...S} d="M88 12 v6 M88 46 v6 M68 32 h6 M102 32 h6" />
    </>
  ),
  "ingenieria-mecatronica": (
    <>
      <path {...S} d="M18 104 h36 M36 104 V80" />
      <circle {...S} cx="36" cy="74" r="7" fill={soft} />
      <path {...S} d="M40 68 L66 38" />
      <circle {...S} cx="70" cy="34" r="7" fill={soft} />
      <path {...S} d="M76 36 l20 14 M96 50 l10 -4 M96 50 l6 10" />
      <rect {...S} x="74" y="78" width="30" height="22" rx="3" />
      <path {...T} d="M80 86 h6 M92 86 h6 M80 94 h18" />
    </>
  ),
  "ingenieria-ambiental": (
    <>
      <path {...S} d="M60 104 c-24 0 -38 -16 -38 -36 c0 -26 22 -44 38 -58 c16 14 38 32 38 58 c0 20 -14 36 -38 36 z" fill={soft} />
      <path {...S} d="M60 104 V50 M60 74 l-16 -12 M60 62 l14 -10" />
      <path {...S} d="M82 26 a6 6 0 1 1 8 8" strokeWidth="2.5" />
    </>
  ),
  "ingenieria-quimica": (
    <>
      <path {...S} d="M16 100 l18 -36 V30 h20 v34 l18 36 z" fill={soft} />
      <path {...S} d="M30 30 h28 M24 86 h42" />
      <path {...S} d="M72 64 h18 v-34 h14 v74 h-14" />
      <path {...T} d="M90 48 h14" />{dot(42, 78, 3)}{dot(52, 70, 3)}
    </>
  ),
  "ingenieria-biomedica": (
    <>
      <path {...S} d="M60 102 C 20 76, 8 50, 22 32 c 12 -14 30 -10 38 4 c 8 -14 26 -18 38 -4 c 14 18 2 44 -38 70 z" fill={soft} />
      <path {...S} d="M18 60 h20 l8 -16 10 30 8 -22 6 8 h32" />
    </>
  ),
  "ingenieria-de-telecomunicaciones": (
    <>
      <path {...S} d="M60 50 L40 104 M60 50 L80 104 M46 88 h28 M50 74 h20" />
      {dot(60, 46, 5)}
      <path {...S} d="M44 30 a22 22 0 0 0 0 32 M76 30 a22 22 0 0 1 0 32 M30 18 a40 40 0 0 0 0 56 M90 18 a40 40 0 0 1 0 56" />
    </>
  ),
  "ingenieria-aeroespacial": (
    <>
      <path {...S} d="M60 10 c16 14 20 40 16 66 H44 c-4 -26 0 -52 16 -66 z" fill={soft} />
      <circle {...S} cx="60" cy="40" r="8" />
      <path {...S} d="M44 60 l-14 22 h16 M76 60 l14 22 h-16" />
      <path {...S} d="M52 84 l-4 20 M60 84 v24 M68 84 l4 20" strokeWidth="2.5" />
    </>
  ),
  "ingenieria-de-minas": (
    <>
      <path {...S} d="M8 104 l34 -54 24 30 14 -18 32 42 z" fill={soft} />
      <path {...S} d="M70 14 q22 6 30 28 M70 14 q-6 18 14 26" />
      <path {...S} d="M86 28 L52 66" />
      <path {...S} d="M34 104 v-16 a10 10 0 0 1 20 0 v16" />
    </>
  ),
  "ingenieria-de-petroleos": (
    <>
      <path {...S} d="M28 104 L48 30 L68 104 M36 76 h24 M42 54 h12" />
      <path {...S} d="M48 30 h-8 M48 30 h8" />
      <path {...S} d="M90 46 c-10 14 -14 22 -14 30 a14 14 0 0 0 28 0 c0 -8 -4 -16 -14 -30 z" fill={soft} />
      <path {...S} d="M8 104 h104" />
    </>
  ),
  "ingenieria-agricola": (
    <>
      <circle {...S} cx="36" cy="82" r="18" fill={soft} /><circle {...S} cx="36" cy="82" r="6" />
      <circle {...S} cx="92" cy="90" r="10" />
      <path {...S} d="M36 64 V40 h30 l12 24 h18 v26 M54 82 h28 M66 40 v24 h30" />
      <path {...T} d="M100 26 v20 M100 36 q-8 -2 -8 -10 M100 32 q8 -2 8 -10" />
    </>
  ),

  // ---------------- Negocios ----------------
  "administracion-de-empresas": (
    <>
      <rect {...S} x="14" y="40" width="92" height="62" rx="8" fill={soft} />
      <path {...S} d="M44 40 v-12 a6 6 0 0 1 6 -6 h20 a6 6 0 0 1 6 6 v12" />
      <path {...S} d="M14 66 h92" />
      <rect {...S} x="52" y="60" width="16" height="12" rx="2" />
    </>
  ),
  contabilidad: (
    <>
      <rect {...S} x="22" y="12" width="76" height="96" rx="8" fill={soft} />
      <rect {...S} x="32" y="22" width="56" height="20" rx="3" />
      <path {...S} d="M38 56 h6 M57 56 h6 M76 56 h6 M38 72 h6 M57 72 h6 M76 72 h6 M38 88 h6 M57 88 h6 M76 88 h6" />
      <path {...T} d="M72 32 h10" />
    </>
  ),
  finanzas: (
    <>
      <path {...S} d="M12 98 h96" />
      <path {...S} d="M16 84 l22 -20 18 12 26 -30 22 -14" />
      <path {...S} d="M92 32 h12 v12" />
      <circle {...S} cx="34" cy="32" r="16" fill={soft} />
      <path {...T} d="M34 22 v20 M40 26 c-2 -3 -12 -3 -12 2 c0 6 12 4 12 10 c0 5 -10 5 -12 2" />
    </>
  ),
  mercadeo: (
    <>
      <circle {...S} cx="54" cy="62" r="40" fill={soft} />
      <circle {...S} cx="54" cy="62" r="24" />
      <circle {...S} cx="54" cy="62" r="8" />
      <path {...S} d="M54 62 L100 16 M88 16 h12 v12" />
    </>
  ),
  "comercio-internacional": (
    <>
      <path {...S} d="M10 76 h100 l-14 22 H24 z" fill={soft} />
      <rect {...S} x="26" y="54" width="24" height="22" rx="2" />
      <rect {...S} x="54" y="54" width="24" height="22" rx="2" fill={soft} />
      <rect {...S} x="40" y="32" width="24" height="22" rx="2" />
      <path {...S} d="M90 76 V30 h14" />
      <path {...T} d="M8 108 q12 -6 24 0 t24 0 t24 0 t24 0" />
    </>
  ),
  "negocios-internacionales": (
    <>
      <circle {...S} cx="60" cy="56" r="40" fill={soft} />
      <path {...S} d="M20 56 h80 M60 16 c-16 18 -16 62 0 80 c16 -18 16 -62 0 -80" />
      <path {...S} d="M30 100 l14 -10 h14 l8 6 M90 100 l-14 -10 h-12" strokeWidth="3" />
    </>
  ),
  emprendimiento: (
    <>
      <path {...S} d="M60 12 c18 12 24 34 16 60 H44 c-8 -26 -2 -48 16 -60 z" fill={soft} />
      <circle {...S} cx="60" cy="40" r="7" />
      <path {...S} d="M44 72 l-12 14 h16 M76 72 l12 14 h-16" />
      <path {...S} d="M60 80 v20" />
      <path {...T} d="M18 30 l4 4 M98 30 l4 -4 M14 56 h6 M100 56 h6" />
    </>
  ),
  "gestion-de-proyectos": (
    <>
      <path {...S} d="M14 18 V102 h94" />
      <rect {...S} x="22" y="26" width="34" height="12" rx="3" fill={soft} />
      <rect {...S} x="42" y="46" width="40" height="12" rx="3" fill={soft} />
      <rect {...S} x="64" y="66" width="36" height="12" rx="3" fill={soft} />
      <path {...T} d="M56 32 v14 M82 52 v14" />
      <path {...S} d="M92 86 l4 6 8 -10" />
    </>
  ),
  "recursos-humanos": (
    <>
      <circle {...S} cx="60" cy="34" r="14" fill={soft} />
      <path {...S} d="M34 82 c0 -18 12 -28 26 -28 s26 10 26 28" />
      <circle {...S} cx="22" cy="54" r="9" /><circle {...S} cx="98" cy="54" r="9" />
      <path {...S} d="M6 92 c0 -14 8 -22 16 -22 M114 92 c0 -14 -8 -22 -16 -22" />
      <path {...S} d="M30 100 h60" />
    </>
  ),
  logistica: (
    <>
      <rect {...S} x="8" y="36" width="60" height="46" rx="4" fill={soft} />
      <path {...S} d="M68 52 h22 l16 16 v14 H68" />
      <circle {...S} cx="28" cy="88" r="9" /><circle {...S} cx="88" cy="88" r="9" />
      <path {...T} d="M24 50 h22 M24 62 h16" />
    </>
  ),
  "gestion-empresarial": (
    <>
      <path {...S} d="M14 104 V56 h26 v48 M40 104 V34 h28 v70 M68 104 V66 h28 v38" fill={soft} />
      <path {...S} d="M8 104 h104" />
      <path {...T} d="M48 46 h12 M48 58 h12 M48 70 h12 M22 68 h10 M22 80 h10 M76 78 h12 M76 90 h12" />
      <path {...S} d="M80 30 l10 -10 10 10" />
    </>
  ),
  "economia-empresarial": (
    <>
      <path {...S} d="M60 16 v84 M24 30 h72" />
      <path {...S} d="M24 30 l-14 30 h28 z M96 30 l-14 30 h28 z" fill={soft} />
      <path {...S} d="M40 100 h40" />
      <path {...T} d="M16 52 h16 M88 52 h16" />
    </>
  ),
  "gestion-de-operaciones": (
    <>
      <circle {...S} cx="60" cy="60" r="20" fill={soft} /><circle {...S} cx="60" cy="60" r="6" />
      <path {...S} d="M60 32 v-8 M60 96 v-8 M32 60 h-8 M96 60 h-8" />
      <path {...S} d="M24 36 a44 44 0 0 1 64 -14 M96 84 a44 44 0 0 1 -64 14" />
      <path {...S} d="M86 12 l4 12 -12 2 M34 108 l-4 -12 12 -2" />
    </>
  ),
  "administracion-publica": (
    <>
      <path {...S} d="M12 42 L60 14 L108 42 Z" fill={soft} />
      <path {...S} d="M20 46 h80 M24 50 v40 M44 50 v40 M64 50 v40 M84 50 v40 M96 50 v40" />
      <path {...S} d="M14 92 h92 M8 104 h104" />
    </>
  ),
  "gestion-de-la-innovacion": (
    <>
      <path {...S} d="M44 82 c-12 -8 -18 -20 -18 -32 a34 34 0 0 1 68 0 c0 12 -6 24 -18 32 v8 H44 z" fill={soft} />
      <path {...S} d="M46 98 h28 M50 108 h20" />
      <path {...S} d="M60 82 V58 l-8 -8 M60 58 l8 -8" />
      <path {...T} d="M14 30 l8 4 M106 30 l-8 4 M60 4 v6" />
    </>
  ),

  // ---------------- Salud ----------------
  medicina: (
    <>
      <path {...S} d="M30 14 v30 a20 20 0 0 0 40 0 V14" />
      <path {...S} d="M50 64 v14 a20 20 0 0 0 40 0 V64" />
      <circle {...S} cx="90" cy="56" r="10" fill={soft} />
      <path {...T} d="M24 14 h12 M64 14 h12" />
    </>
  ),
  enfermeria: (
    <>
      <path {...S} d="M24 50 c0 -22 16 -34 36 -34 s36 12 36 34 z" fill={soft} />
      <path {...S} d="M24 50 h72" />
      <path {...S} d="M54 24 h12 v8 h8 v12 h-8 v8 h-12 v-8 h-8 v-12 h8 z" />
      <path {...S} d="M36 64 c0 26 48 26 48 0" />
      <path {...S} d="M30 104 c0 -14 14 -20 30 -20 s30 6 30 20" />
    </>
  ),
  odontologia: (
    <>
      <path {...S} d="M30 18 c-14 4 -18 22 -12 38 c4 12 6 22 8 36 c2 12 14 12 16 0 l6 -20 c2 -6 10 -6 12 0 l6 20 c2 12 14 12 16 0 c2 -14 4 -24 8 -36 c6 -16 2 -34 -12 -38 c-10 -2 -18 4 -30 4 s-14 -6 -24 -4 z" fill={soft} />
      <path {...T} d="M40 36 q10 -6 18 0" />
    </>
  ),
  farmacia: (
    <>
      <rect {...S} x="20" y="40" width="44" height="22" rx="11" transform="rotate(-35 42 51)" fill={soft} />
      <path {...S} d="M42 30 l14 22" />
      <circle {...S} cx="84" cy="76" r="22" />
      <path {...S} d="M70 62 l28 28" />
      <path {...T} d="M18 98 h16 M26 90 v16" />
    </>
  ),
  "nutricion-y-dietetica": (
    <>
      <path {...S} d="M60 104 c-26 0 -40 -20 -40 -42 c0 -18 12 -28 26 -28 c6 0 10 2 14 4 c4 -2 8 -4 14 -4 c14 0 26 10 26 28 c0 22 -14 42 -40 42 z" fill={soft} />
      <path {...S} d="M60 38 c0 -12 4 -20 12 -24" />
      <path {...S} d="M64 26 c8 -10 20 -8 24 -2 c-8 6 -18 6 -24 2 z" />
    </>
  ),
  fisioterapia: (
    <>
      <circle {...S} cx="42" cy="20" r="9" />
      <path {...S} d="M42 30 v34 l-14 36 M42 64 l16 36 M42 40 l-20 14 M42 40 l24 6" />
      <path {...S} d="M66 46 l8 -4" />
      <rect {...S} x="74" y="34" width="10" height="20" rx="3" fill={soft} />
      <path {...S} d="M84 44 h16" />
      <rect {...S} x="100" y="34" width="10" height="20" rx="3" fill={soft} />
    </>
  ),
  "terapia-ocupacional": (
    <>
      <path {...S} d="M36 104 c-8 -8 -16 -20 -18 -30 c-2 -6 4 -8 8 -4 l8 10 V40 a6 6 0 0 1 12 0 v28 V32 a6 6 0 0 1 12 0 v36 V38 a6 6 0 0 1 12 0 v32 c0 18 -8 34 -24 34 z" fill={soft} />
      <rect {...S} x="76" y="24" width="22" height="22" rx="3" />
      <rect {...S} x="86" y="56" width="22" height="22" rx="3" fill={soft} />
    </>
  ),
  bacteriologia: (
    <>
      <path {...S} d="M40 104 h40 M60 104 V88" />
      <path {...S} d="M44 88 h32 M50 88 l-6 -26 32 -40 10 8 -30 38 6 20" fill={soft} />
      <path {...S} d="M70 30 l12 10" />
      <circle {...S} cx="96" cy="82" r="12" />{dot(92, 80, 2.5)}{dot(100, 86, 2.5)}
      <path {...T} d="M20 70 h16" />
    </>
  ),
  "salud-publica": (
    <>
      <path {...S} d="M60 108 c-26 -12 -40 -30 -40 -56 V24 l40 -14 40 14 v28 c0 26 -14 44 -40 56 z" fill={soft} />
      <path {...S} d="M52 38 h16 v14 h14 v16 h-14 v14 h-16 v-14 h-14 v-16 h14 z" />
    </>
  ),
  "psicologia-clinica": (
    <>
      <path {...S} d="M24 70 v-30 a10 10 0 0 1 10 -10 h18 v40 z" fill={soft} />
      <path {...S} d="M18 70 h70 v12 H18 z M24 82 v22 M82 82 v22" />
      <circle {...S} cx="92" cy="30" r="10" />
      <path {...S} d="M92 40 v26 l-10 4 M92 52 l-12 -6" />
      <path {...T} d="M54 30 q10 -12 22 -6" />
    </>
  ),
  optometria: (
    <>
      <path {...S} d="M8 60 c20 -30 84 -30 104 0 c-20 30 -84 30 -104 0 z" fill={soft} />
      <circle {...S} cx="60" cy="60" r="18" />
      <circle cx="60" cy="60" r="7" fill="currentColor" />
      <path {...T} d="M24 100 h12 M44 100 h8 M60 100 h6 M74 100 h4" />
    </>
  ),
  fonoaudiologia: (
    <>
      <path {...S} d="M44 22 c-18 0 -28 14 -28 30 c0 12 8 18 8 30 c0 14 10 22 22 22 c10 0 16 -8 16 -16 c0 -10 -10 -12 -10 -22 c0 -6 6 -8 6 -16 c0 -10 -6 -16 -14 -16" fill={soft} />
      <path {...S} d="M74 42 a20 20 0 0 1 0 32 M86 32 a34 34 0 0 1 0 52 M98 22 a48 48 0 0 1 0 72" />
    </>
  ),

  // ---------------- Deporte ----------------
  "ciencias-del-deporte": (
    <>
      <circle {...S} cx="46" cy="58" r="34" fill={soft} />
      <path {...S} d="M46 24 c-12 12 -12 56 0 68 M14 50 c20 8 44 8 64 0 M14 68 c20 -8 44 -8 64 0" />
      <path {...S} d="M92 44 v36 h-6 M84 44 h16 M92 44 l12 -20" />
      <circle {...S} cx="104" cy="88" r="8" />
    </>
  ),
  "entrenamiento-deportivo": (
    <>
      <rect {...S} x="22" y="22" width="76" height="86" rx="8" fill={soft} />
      <rect {...S} x="44" y="14" width="32" height="14" rx="4" />
      <path {...S} d="M36 48 l8 8 M44 48 l-8 8 M72 72 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0" />
      <path {...S} d="M44 56 Q 60 90 76 72" strokeDasharray="5 6" />
      <path {...S} d="M70 66 l6 6 -8 2" />
    </>
  ),
  "preparacion-fisica": (
    <>
      <rect {...S} x="14" y="40" width="12" height="40" rx="3" fill={soft} />
      <rect {...S} x="28" y="32" width="12" height="56" rx="3" />
      <rect {...S} x="80" y="32" width="12" height="56" rx="3" />
      <rect {...S} x="94" y="40" width="12" height="40" rx="3" fill={soft} />
      <path {...S} d="M40 60 h40 M6 60 h8 M106 60 h8" />
    </>
  ),
  "gestion-deportiva": (
    <>
      <path {...S} d="M38 16 h44 v20 c0 16 -10 28 -22 28 s-22 -12 -22 -28 z" fill={soft} />
      <path {...S} d="M38 22 h-14 c0 14 6 22 16 24 M82 22 h14 c0 14 -6 22 -16 24" />
      <path {...S} d="M60 64 v16 M44 96 v-16 h32 v16" />
      <path {...S} d="M36 104 h48" />
    </>
  ),
  "fisiologia-del-ejercicio": (
    <>
      <path {...S} d="M60 98 C 24 76, 12 54, 24 36 c 10 -14 28 -12 36 2 c 8 -14 26 -16 36 -2 c 12 18 0 40 -36 62 z" fill={soft} />
      <path {...S} d="M20 62 h18 l6 -14 10 26 8 -20 6 8 h32" />
    </>
  ),
  "biomecanica-deportiva": (
    <>
      <circle {...S} cx="68" cy="16" r="8" />
      <path {...S} d="M64 26 l-10 32 l18 18 l-6 30 M54 58 l-18 14 l-14 -4 M60 36 l20 8 l10 -12 M60 36 l-20 0" />
      <path {...T} d="M8 104 h104" />
      <path {...T} d="M90 70 a22 22 0 0 0 -14 -18" strokeDasharray="4 4" />
      {dot(54, 58, 3.5)}{dot(72, 76, 3.5)}
    </>
  ),
  recreacion: (
    <>
      <path {...S} d="M60 16 c26 0 44 18 44 40 H16 c0 -22 18 -40 44 -40 z" fill={soft} />
      <path {...S} d="M60 16 c-12 8 -16 24 -16 40 M60 16 c12 8 16 24 16 40" />
      <path {...S} d="M60 56 v44" />
      <path {...S} d="M20 104 q20 -10 40 0 t40 0" />
    </>
  ),
  "entrenamiento-personal": (
    <>
      <circle {...S} cx="38" cy="22" r="9" />
      <path {...S} d="M38 32 v36 M38 68 l-12 36 M38 68 l12 36 M38 42 l-18 20 M38 42 l24 -8" />
      <rect {...S} x="62" y="22" width="8" height="24" rx="2" fill={soft} />
      <path {...S} d="M78 66 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0" />
      <path {...S} d="M94 56 v10 l6 6" />
    </>
  ),

  // ---------------- Tecnología ----------------
  "desarrollo-de-software": (
    <>
      <rect {...S} x="10" y="18" width="70" height="52" rx="6" fill={soft} />
      <path {...S} d="M30 36 l-10 8 10 8 M60 36 l10 8 -10 8 M50 32 l-10 26" />
      <rect {...S} x="74" y="48" width="36" height="58" rx="6" />
      <path {...T} d="M84 60 h16 M84 70 h16 M84 80 h10" />
      {dot(92, 96, 2.5)}
    </>
  ),
  ciberseguridad: (
    <>
      <path {...S} d="M60 108 c-26 -12 -40 -30 -40 -56 V24 l40 -14 40 14 v28 c0 26 -14 44 -40 56 z" fill={soft} />
      <rect {...S} x="44" y="52" width="32" height="26" rx="4" />
      <path {...S} d="M50 52 v-8 a10 10 0 0 1 20 0 v8" />
      {dot(60, 64, 3.5)}
    </>
  ),
  "redes-y-telecomunicaciones": (
    <>
      <circle {...S} cx="60" cy="60" r="12" fill={soft} />
      <circle {...S} cx="20" cy="24" r="9" /><circle {...S} cx="100" cy="24" r="9" />
      <circle {...S} cx="20" cy="96" r="9" /><circle {...S} cx="100" cy="96" r="9" />
      <path {...S} d="M27 31 l24 20 M93 31 l-24 20 M27 89 l24 -20 M93 89 l-24 -20 M29 24 h62 M29 96 h62" />
    </>
  ),
  "internet-de-las-cosas": (
    <>
      <path {...S} d="M24 68 L60 40 L96 68 V104 H24 Z" fill={soft} />
      <rect {...S} x="50" y="76" width="20" height="28" rx="2" />
      <path {...S} d="M44 26 a24 24 0 0 1 32 0 M34 16 a38 38 0 0 1 52 0" />
      {dot(60, 34, 4)}
    </>
  ),
  "computacion-forense": (
    <>
      <rect {...S} x="10" y="18" width="70" height="52" rx="6" fill={soft} />
      <path {...S} d="M30 84 h30 M45 70 v14" />
      <circle {...S} cx="80" cy="66" r="18" />
      <path {...S} d="M93 79 l17 17" strokeWidth="5" />
      <path {...T} d="M74 60 c0 -4 8 -4 8 0 v4 M72 70 c4 4 12 4 16 0" />
    </>
  ),
  "administracion-de-sistemas": (
    <>
      <rect {...S} x="14" y="16" width="56" height="20" rx="4" fill={soft} />
      <rect {...S} x="14" y="42" width="56" height="20" rx="4" fill={soft} />
      <rect {...S} x="14" y="68" width="56" height="20" rx="4" fill={soft} />
      {dot(60, 26, 3)}{dot(60, 52, 3)}{dot(60, 78, 3)}
      <rect {...S} x="74" y="62" width="38" height="42" rx="5" />
      <path {...S} d="M82 76 l8 6 -8 6 M94 92 h10" />
    </>
  ),
  "desarrollo-de-aplicaciones-moviles": (
    <>
      <rect {...S} x="32" y="8" width="56" height="104" rx="10" fill={soft} />
      <path {...S} d="M52 16 h16" />
      <rect {...S} x="42" y="28" width="16" height="16" rx="4" /><rect {...S} x="62" y="28" width="16" height="16" rx="4" />
      <rect {...S} x="42" y="50" width="16" height="16" rx="4" /><rect {...S} x="62" y="50" width="16" height="16" rx="4" />
      {dot(60, 100, 3)}
    </>
  ),
  "realidad-virtual-y-aumentada": (
    <>
      <path {...S} d="M14 44 h92 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 H76 l-8 -10 h-16 l-8 10 H14 a6 6 0 0 1 -6 -6 V50 a6 6 0 0 1 6 -6 z" fill={soft} />
      <circle {...S} cx="36" cy="62" r="8" /><circle {...S} cx="84" cy="62" r="8" />
      <path {...S} d="M20 44 l10 -18 h60 l10 18" />
      <path {...T} d="M30 96 l10 -8 M60 100 v-10 M90 96 l-10 -8" />
    </>
  ),
  devops: (
    <>
      <path {...S} d="M60 60 c-12 -16 -22 -24 -34 -24 a24 24 0 0 0 0 48 c12 0 22 -8 34 -24 c12 -16 22 -24 34 -24 a24 24 0 0 1 0 48 c-12 0 -22 -8 -34 -24 z" fill={soft} />
      <path {...S} d="M96 30 l-6 6 8 4" />
      <path {...S} d="M24 90 l6 -6 -8 -4" />
    </>
  ),
  "automatizacion-industrial": (
    <>
      <rect {...S} x="12" y="18" width="54" height="72" rx="5" fill={soft} />
      <path {...T} d="M22 30 h34 M22 40 h10 M38 40 h18" />
      {dot(26, 56, 4)}{dot(42, 56, 4)}{dot(26, 74, 4)}{dot(42, 74, 4)}
      <path {...S} d="M66 50 h14 M66 70 h14" />
      <circle {...S} cx="94" cy="60" r="16" /><circle {...S} cx="94" cy="60" r="5" />
      <path {...S} d="M94 38 v-6 M94 82 v6 M116 60 h-6" />
      <path {...S} d="M8 104 h104" />
    </>
  ),
  blockchain: (
    <>
      <rect {...S} x="8" y="44" width="28" height="28" rx="5" fill={soft} />
      <rect {...S} x="46" y="44" width="28" height="28" rx="5" />
      <rect {...S} x="84" y="44" width="28" height="28" rx="5" fill={soft} />
      <path {...S} d="M36 58 h10 M74 58 h10" />
      <path {...T} d="M22 44 v-14 h76 v14 M60 72 v16" />
      {dot(60, 92, 4)}
    </>
  ),
  "soporte-tecnico": (
    <>
      <path {...S} d="M22 62 v-10 a38 38 0 0 1 76 0 v10" />
      <rect {...S} x="14" y="60" width="18" height="28" rx="6" fill={soft} />
      <rect {...S} x="88" y="60" width="18" height="28" rx="6" fill={soft} />
      <path {...S} d="M97 88 c0 12 -12 18 -26 18 h-6" />
      <rect {...S} x="50" y="100" width="16" height="10" rx="4" />
    </>
  ),
  "sistemas-de-informacion": (
    <>
      <ellipse {...S} cx="34" cy="26" rx="20" ry="8" fill={soft} />
      <path {...S} d="M14 26 v28 c0 5 9 8 20 8 s20 -3 20 -8 V26" />
      <rect {...S} x="68" y="18" width="40" height="30" rx="5" />
      <path {...T} d="M76 38 l8 -8 8 6 10 -10" />
      <rect {...S} x="38" y="76" width="44" height="30" rx="5" fill={soft} />
      <path {...S} d="M34 62 v8 h26 v6 M88 48 v22 h-28" />
    </>
  ),
};
