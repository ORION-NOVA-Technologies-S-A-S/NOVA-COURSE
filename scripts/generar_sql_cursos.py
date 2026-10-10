"""Genera supabase/02_cursos.sql a partir de backend/app/data/catalog.py.

Uso:  python scripts/generar_sql_cursos.py
Edita catalog.py para agregar o cambiar cursos y vuelve a generar el archivo.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))
from app.data.catalog import COURSES, DEFAULT_PRICE_COP, FREE_MODULES  # noqa: E402


def sources_json(c) -> str:
    return json.dumps([{"title": t, "publisher": p, "url": u, "use": w} for t, p, u, w in c["sources"]], ensure_ascii=False)


def q(v: str) -> str:
    return "'" + v.replace("'", "''") + "'"


lines = [
    "-- =====================================================================",
    "-- NOVA COURSE · 15 cursos · 10 módulos · 12 temas (1.800 temas) · módulos 1 a 5 gratis",
    "-- Pega este archivo en Supabase > SQL Editor y pulsa \"Run\" (después de 01_esquema.sql).",
    "-- No borra ni sobrescribe el contenido que ya hayas editado.",
    "-- Archivo generado por scripts/generar_sql_cursos.py",
    "-- =====================================================================",
    "begin;",
    "",
    "insert into public.courses (slug, title, category, color, summary, price_cop, free_modules, sources) values",
]
rows = []
for c in COURSES:
    rows.append(f"  ({q(c['slug'])}, {q(c['title'])}, {q(c['category'])}, {q(c['color'])}, {q(c['summary'])}, "
                f"{c.get('price_cop', DEFAULT_PRICE_COP)}, {FREE_MODULES}, {q(sources_json(c))}::jsonb)")
lines.append(",\n".join(rows))
lines.append("on conflict (slug) do update set title = excluded.title, category = excluded.category,\n"
             "  color = excluded.color, summary = excluded.summary, free_modules = excluded.free_modules,\n"
             "  sources = excluded.sources;")
lines.append("")
lines.append("insert into public.modules (course_id, position, title)")
lines.append("select c.id, v.pos, v.title from (values")
mrows = []
for c in COURSES:
    for i, (mt, _) in enumerate(c["modules"], 1):
        mrows.append(f"  ({q(c['slug'])}, {i}, {q(mt)})")
lines.append(",\n".join(mrows))
lines.append(") as v(slug, pos, title) join public.courses c on c.slug = v.slug")
lines.append("on conflict (course_id, position) do update set title = excluded.title;")
lines.append("")
lines.append("insert into public.topics (module_id, position, title)")
lines.append("select m.id, v.tpos, v.title from (values")
trows = []
for c in COURSES:
    for i, (_, topics) in enumerate(c["modules"], 1):
        for j, t in enumerate(topics, 1):
            trows.append(f"  ({q(c['slug'])}, {i}, {j}, {q(t)})")
lines.append(",\n".join(trows))
lines.append(") as v(slug, mpos, tpos, title)")
lines.append("join public.courses c on c.slug = v.slug")
lines.append("join public.modules m on m.course_id = c.id and m.position = v.mpos")
lines.append("on conflict (module_id, position) do update set title = excluded.title;")
lines.append("")
lines.append("""-- Contenido base de cada tema (plantilla; reemplázalo desde el panel de administración)
insert into public.topic_contents (topic_id, content)
select t.id, format(
'## %1$s

Bienvenido al tema %2$s del módulo **%3$s** del curso **%4$s**.

### Objetivo de aprendizaje
Al terminar esta lección comprenderás los fundamentos de «%1$s», su papel dentro del curso de %4$s y cómo aplicarlo en una situación real.

### Conceptos clave
1. **Definición:** el significado y el alcance de «%1$s».
2. **Importancia:** su relación con el resto del módulo «%3$s».
3. **Aplicación:** ejemplos prácticos en el entorno laboral y cotidiano.

### Desarrollo
Lee el material, toma notas de las ideas principales y relaciónalas con lo que viste en los temas anteriores. Si algo no queda claro, repasa el tema anterior antes de continuar.

### Actividad práctica
Escribe un ejemplo propio relacionado con «%1$s» y compártelo con la comunidad de Orion Nova Academy.

### Autoevaluación
- ¿Puedo explicar este tema con mis propias palabras?
- ¿Sé dónde aplicarlo?
- ¿Qué duda me queda para investigar?', t.title, t.position, m.title, c.title)
from public.topics t
join public.modules m on m.id = t.module_id
join public.courses c on c.id = m.course_id
on conflict (topic_id) do nothing;

commit;

-- Comprobación: debe mostrar 15 | 150 | 1800 | 1800 | 63
select (select count(*) from public.courses) as cursos,
       (select count(*) from public.modules) as modulos,
       (select count(*) from public.topics) as temas,
       (select count(*) from public.topic_contents) as contenidos,
       (select sum(jsonb_array_length(sources)) from public.courses) as fuentes;""")
out = ROOT / "supabase" / "02_cursos.sql"
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Generado {out} ({out.stat().st_size // 1024} KB)")
