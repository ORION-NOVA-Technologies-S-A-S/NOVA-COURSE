"""Genera los archivos SQL de cursos a partir del catálogo.

Parte 1: 50 cursos generales · Parte 2: idiomas · Partes 3 y 4: 87 cursos de datos, educación,
ingeniería, negocios, salud, deporte y tecnología.

Uso:  python scripts/generar_sql_cursos.py
Edita catalog.py para agregar o cambiar cursos y vuelve a generar el archivo.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))
from app.data.catalog import COURSES, DEFAULT_PRICE_COP, FREE_MODULES  # noqa: E402
from app.data.fuentes_mas import SOURCES_MAS  # noqa: E402


def sources_json(c) -> str:
    return json.dumps([{"title": t, "publisher": p, "url": u, "use": w} for t, p, u, w in c["sources"]], ensure_ascii=False)


def q(v: str) -> str:
    return "'" + v.replace("'", "''") + "'"


def build(COURSES, filename: str, header: str) -> None:
    lines = [
        "-- =====================================================================",
        f"-- NOVA COURSE · {header} · {len(COURSES)} cursos · 10 módulos · 12 temas · módulos 1 a 5 gratis",
        "-- Pega este archivo en Supabase > SQL Editor y pulsa \"Run\" (después de 01_esquema.sql).",
        "-- Orden: 01_esquema.sql, 02_cursos_parte1.sql, 02_cursos_parte2_idiomas.sql, 02_cursos_parte3.sql, 02_cursos_parte4.sql",
        "-- No borra ni sobrescribe el contenido que ya hayas editado.",
        "-- Archivo generado por scripts/generar_sql_cursos.py",
        "-- =====================================================================",
        "begin;",
        "",
        "insert into public.courses (slug, title, category, color, summary, price_cop, free_modules, sources, lang) values",
    ]
    rows = []
    for c in COURSES:
        rows.append(f"  ({q(c['slug'])}, {q(c['title'])}, {q(c['category'])}, {q(c['color'])}, {q(c['summary'])}, "
                    f"{c.get('price_cop', DEFAULT_PRICE_COP)}, {FREE_MODULES}, {q(sources_json(c))}::jsonb, {q(c['lang']) if c.get('lang') else 'null'})")
    lines.append(",\n".join(rows))
    lines.append("on conflict (slug) do update set title = excluded.title, category = excluded.category,\n"
                 "  color = excluded.color, summary = excluded.summary, free_modules = excluded.free_modules,\n"
                 "  sources = excluded.sources, lang = excluded.lang;")
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

-- Comprobación: al terminar las cuatro partes debe mostrar {EXPECTED}
select (select count(*) from public.courses) as cursos,
       (select count(*) from public.modules) as modulos,
       (select count(*) from public.topics) as temas,
       (select count(*) from public.topic_contents) as contenidos,
       (select sum(jsonb_array_length(sources)) from public.courses) as fuentes;""")
    n_topics = sum(len(t) for c in ALL for _, t in c["modules"])
    EXPECTED = f"{len(ALL)} | {sum(len(c['modules']) for c in ALL)} | {n_topics} | {n_topics} | {sum(len(c['sources']) for c in ALL)}"
    lines = [ln.replace("{EXPECTED}", EXPECTED) for ln in lines]
    out = ROOT / "supabase" / filename
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generado {out} ({out.stat().st_size // 1024} KB)")


ALL = COURSES
NUEVOS = [c for c in ALL if c["slug"] in SOURCES_MAS]
PARTE3 = {"Datos", "Educación", "Ingeniería"}
build([c for c in ALL if not c.get("lang") and c["slug"] not in SOURCES_MAS], "02_cursos_parte1.sql", "Parte 1: cursos generales")
build([c for c in ALL if c.get("lang")], "02_cursos_parte2_idiomas.sql", "Parte 2: idiomas")
build([c for c in NUEVOS if c["category"] in PARTE3], "02_cursos_parte3.sql", "Parte 3: datos, educación e ingeniería")
build([c for c in NUEVOS if c["category"] not in PARTE3], "02_cursos_parte4.sql", "Parte 4: negocios, salud, deporte y tecnología")
