"""Cursos de idiomas de NOVA COURSE.

30 idiomas con niveles A1 a C2 del Marco Común Europeo de Referencia (MCER) en 12 módulos:
módulos 1-5 (A1-A2) gratis, módulos 6-12 (B1-C2) de pago con certificado.
Además, la Lengua de Señas Colombiana (LSC).
La web asigna a cada tema una habilidad (vocabulario, gramática, escucha, pronunciación, lectura,
escritura, conversación o cultura) a partir de su título y la muestra como insignia.
"""

# (slug, nombre, código de voz BCP-47, color, escritura, examen oficial, temas propios del sistema de escritura)
LANGUAGES = [
    ("ingles", "Inglés", "en-US", "#1F6FEB", "latin", "Cambridge English, IELTS y TOEFL", []),
    ("frances", "Francés", "fr-FR", "#2D5BD3", "latin", "DELF y DALF", ["Vocales nasales y acentos del francés"]),
    ("portugues", "Portugués", "pt-BR", "#1A9E5B", "latin", "CELPE-Bras y CAPLE", ["Vocales nasales y diferencias Brasil-Portugal"]),
    ("aleman", "Alemán", "de-DE", "#C9A227", "latin", "Goethe-Zertifikat y TestDaF", ["La diéresis y la ß"]),
    ("italiano", "Italiano", "it-IT", "#2E9E6B", "latin", "CILS, CELI y PLIDA", ["Consonantes dobles"]),
    ("chino-mandarin", "Chino mandarín", "zh-CN", "#D7263D", "hanzi", "HSK", ["Pinyin: cómo se escribe el sonido", "Los cuatro tonos", "Trazos y radicales de los caracteres"]),
    ("japones", "Japonés", "ja-JP", "#E0457B", "kana", "JLPT (Japanese-Language Proficiency Test)", ["Hiragana", "Katakana", "Introducción a los kanji"]),
    ("coreano", "Coreano", "ko-KR", "#3D5AFE", "hangul", "TOPIK", ["El alfabeto hangul: vocales", "El alfabeto hangul: consonantes y sílabas"]),
    ("arabe", "Árabe", "ar-SA", "#0E8A6A", "arabe", "exámenes de árabe estándar moderno (como el ALPT)", ["El alfabeto árabe y la escritura de derecha a izquierda", "Formas de las letras según su posición"]),
    ("ruso", "Ruso", "ru-RU", "#B23A48", "cirilico", "TORFL (ТРКИ)", ["El alfabeto cirílico"]),
    ("hindi", "Hindi", "hi-IN", "#F28C28", "devanagari", "exámenes de hindi de institutos culturales de la India", ["La escritura devanagari"]),
    ("turco", "Turco", "tr-TR", "#D64545", "latin", "exámenes de turco de Yunus Emre Enstitüsü", ["Armonía vocálica"]),
    ("neerlandes", "Neerlandés", "nl-NL", "#F07F13", "latin", "CNaVT y NT2", []),
    ("sueco", "Sueco", "sv-SE", "#1565C0", "latin", "Swedex y TISUS", ["Las letras å, ä y ö"]),
    ("noruego", "Noruego", "nb-NO", "#C62828", "latin", "Norskprøven", ["Las letras æ, ø y å"]),
    ("danes", "Danés", "da-DK", "#B71C1C", "latin", "Prøve i Dansk", ["Las letras æ, ø y å y el stød"]),
    ("polaco", "Polaco", "pl-PL", "#D81B60", "latin", "Certificados oficiales de polaco como lengua extranjera", ["Letras con signos diacríticos"]),
    ("griego", "Griego", "el-GR", "#1E88E5", "griego", "Certificado de Conocimiento de la Lengua Griega", ["El alfabeto griego"]),
    ("hebreo", "Hebreo", "he-IL", "#3949AB", "hebreo", "exámenes de hebreo de universidades israelíes", ["El alefato y la escritura de derecha a izquierda"]),
    ("vietnamita", "Vietnamita", "vi-VN", "#E53935", "latin", "exámenes de competencia en vietnamita", ["Los seis tonos del vietnamita"]),
    ("tailandes", "Tailandés", "th-TH", "#5E35B1", "thai", "CU-TFL", ["El alfabeto tailandés", "Los cinco tonos"]),
    ("indonesio", "Indonesio", "id-ID", "#C62828", "latin", "UKBI", []),
    ("suajili", "Suajili", "sw-KE", "#2E7D32", "latin", "exámenes de suajili de universidades de África Oriental", ["Las clases de sustantivos"]),
    ("ucraniano", "Ucraniano", "uk-UA", "#1976D2", "cirilico", "exámenes oficiales de ucraniano como lengua extranjera", ["El alfabeto cirílico ucraniano"]),
    ("rumano", "Rumano", "ro-RO", "#F9A825", "latin", "exámenes del Instituto Cultural Rumano", ["Las letras ă, â, î, ș y ț"]),
    ("checo", "Checo", "cs-CZ", "#1565C0", "latin", "CCE (Certificate in Czech)", ["Signos diacríticos y la letra ř"]),
    ("finlandes", "Finlandés", "fi-FI", "#0D47A1", "latin", "YKI", ["Vocales largas y armonía vocálica"]),
    ("persa", "Persa", "fa-IR", "#00897B", "arabe", "exámenes de persa de la Fundación Saadi", ["El alfabeto persa y la escritura de derecha a izquierda"]),
    ("catalan", "Catalán", "ca-ES", "#E6A100", "latin", "certificados de catalán (CIFALC)", []),
    ("bengali", "Bengalí", "bn-IN", "#00796B", "bengali", "exámenes de bengalí de universidades de la India y Bangladés", ["La escritura bengalí"]),
]

LEVEL_SUMMARY = (
    "Aprende {name} desde cero hasta el nivel C2 del Marco Común Europeo: vocabulario, gramática, "
    "escucha, pronunciación con la voz de NOVA, lectura, escritura y conversación. Módulos 1 a 5 (A1-A2) gratis."
)


def _alphabet_topics(script: str, name: str, extra: list[str]) -> list[str]:
    """Primeros temas del módulo 1 según el sistema de escritura."""
    base = extra[:] if extra else []
    if not base:
        base = [f"El alfabeto y los sonidos del {name.lower()}" if script == "latin" else f"El sistema de escritura del {name.lower()}"]
    return base


def language_modules(name: str, script: str, exam: str, script_topics: list[str]) -> list[tuple[str, list[str]]]:
    n = name.lower()
    first = _alphabet_topics(script, name, script_topics)
    m1 = first + [
        "Sonidos y pronunciación básica" if len(first) < 2 else "Práctica de pronunciación",
        "Saludos y despedidas",
        "Presentarse",
        "Números del 1 al 20",
        "Preguntas básicas",
        "Pronombres personales",
        f"Ser y estar en {n}",
        "Países y nacionalidades",
        "Expresiones de cortesía",
        "Escucha: un diálogo de presentación",
        "Conversación: preséntate",
    ]
    # Si el idioma tiene varios temas de escritura, se quitan los menos esenciales para dejar 12 temas
    for optional in ("Práctica de pronunciación", "Países y nacionalidades", "Expresiones de cortesía"):
        if len(m1) > 12 and optional in m1:
            m1.remove(optional)
    assert len(m1) == 12, (name, len(m1))
    return [
        ("A1 · Primeros pasos", m1),
        ("A1 · Vida diaria", ["La familia", "La casa", "La rutina diaria", "Días de la semana y meses", "La hora", "Comidas y bebidas",
                              "El presente de los verbos más usados", "Sustantivos y artículos", "Adjetivos básicos", "Gustos y preferencias",
                              "Escucha: la rutina de una persona", "Escritura: un mensaje corto"]),
        ("A2 · La ciudad y las compras", ["Lugares de la ciudad", "Pedir y dar direcciones", "Transporte", "Compras y precios", "La ropa y los colores",
                                          "En el restaurante", "Números grandes", "Hablar del pasado", "Preposiciones de lugar",
                                          "Escucha: pedir en un restaurante", "Lectura: menús y letreros", "Conversación: comprar algo"]),
        ("A2 · Viajes y salud", ["Viajes y hoteles", "En el aeropuerto", "El clima", "El cuerpo y la salud", "Emergencias", "Hablar de planes y del futuro",
                                 "Comparar cosas", "Adverbios de frecuencia", "Escucha: anuncios en la estación", "Lectura: un correo de reserva",
                                 "Escritura: una postal", "Conversación: en la recepción del hotel"]),
        ("A2 · Integración del nivel básico", ["Repaso de gramática A1-A2", "Las 500 palabras más usadas", "Comprensión auditiva A2", "Comprensión lectora A2",
                                              "Expresión escrita A2", "Expresión oral A2", f"Países donde se habla {n}", "Festividades y tradiciones",
                                              "Música y cine", "Errores comunes de los hispanohablantes", "Cómo estudiar un idioma cada día",
                                              f"Proyecto integrador: presentación personal en {n}"]),
        ("B1 · Comunicación independiente", ["Contar experiencias", "Narrar historias en pasado", "Dar opiniones", "Estar de acuerdo y en desacuerdo",
                                             "Trabajo y estudios", "Tecnología y redes sociales", "Conectores del discurso", "Oraciones condicionales",
                                             "Escucha: un pódcast", "Lectura: un artículo de prensa", "Escritura: un correo formal", "Conversación: una entrevista"]),
        ("B1 · Sociedad y cultura", ["Medio ambiente", "Noticias y actualidad", "La educación", "Tradiciones y costumbres", "La voz pasiva",
                                     "El estilo indirecto", "Expresiones idiomáticas", "Registro formal e informal", "Escucha: un noticiero",
                                     "Lectura: un cuento corto", "Escritura: una reseña", "Conversación: un debate"]),
        ("B2 · Uso profesional", ["Entrevistas de trabajo", "Reuniones", "Presentaciones en público", "Negociación", "Correos de negocios",
                                  "Vocabulario de tu profesión", "Gramática avanzada: tiempos compuestos", "Gramática avanzada: modos y matices",
                                  "Escucha: una conferencia", "Lectura: un informe", "Escritura: un informe profesional", "Conversación: una reunión de trabajo"]),
        ("B2 · Fluidez y matices", ["Humor y doble sentido", "Refranes", f"Variantes regionales del {n}", "Lenguaje coloquial", "Entonación y ritmo",
                                    "Matices de significado", f"Literatura en {n}", "Cine y series", "Escucha: una película", "Lectura: un texto literario",
                                    "Escritura: un ensayo de opinión", "Conversación libre"]),
        ("C1 · Dominio del idioma", ["Textos académicos", "Argumentación avanzada", "Lenguaje especializado", "Traducción e interpretación básica",
                                     f"Exámenes oficiales: {exam}", "Estrategias para el examen", "Comprensión auditiva C1", "Comprensión lectora C1",
                                     "Expresión escrita C1", "Expresión oral C1", "Plan para seguir aprendiendo",
                                     f"Proyecto integrador C1: exposición oral y ensayo en {n}"]),
        ("C2 · Maestría del idioma", ["Matices y precisión del vocabulario", "Expresiones idiomáticas avanzadas", "Ironía, humor y sobrentendidos",
                                      "Registro literario y académico", f"Variedades sociales del {n}", "Gramática de alto nivel",
                                      "Escucha: debates y conferencias reales", "Lectura: literatura y prensa especializada", "Escritura: artículo de opinión",
                                      "Expresión oral: improvisación", "Mediación entre idiomas", "Conversación con hablantes nativos"]),
        ("C2 · Certificación y proyecto final", [f"Examen de nivel C2: {exam}", "Estrategias para el examen C2", "Simulacro de comprensión auditiva C2",
                                                "Simulacro de comprensión lectora C2", "Simulacro de expresión escrita C2", "Simulacro de expresión oral C2",
                                                "Traducción de textos complejos", "Interpretación de una charla", "Escritura creativa avanzada",
                                                "Portafolio del estudiante", "Plan de aprendizaje permanente", f"Proyecto final: ensayo y exposición en {n}"]),
    ]


LSC_MODULES = [
    ("A1 · Primeros pasos en LSC", ["La comunidad sorda en Colombia", "Qué es la Lengua de Señas Colombiana", "Configuración de las manos", "Movimiento, ubicación y orientación",
                                    "Expresión facial y corporal", "El alfabeto manual", "Saludos y despedidas", "Presentarse", "Números del 1 al 20",
                                    "Cortesía", "Video: un diálogo de presentación", "Práctica: preséntate en LSC"]),
    ("A1 · Vida diaria", ["La familia", "La casa", "Días, meses y la hora", "Comidas y bebidas", "Colores", "Verbos de uso diario", "Preguntas básicas",
                          "Pronombres y el uso del espacio", "Gustos y emociones", "Rutina diaria", "Video: la rutina de una persona", "Práctica: cuenta tu día"]),
    ("A2 · Comunidad y entorno", ["La ciudad", "Direcciones", "Transporte", "Compras", "El trabajo", "La escuela", "Clasificadores", "Hablar del pasado",
                                  "Hablar del futuro", "Video: pedir información", "Práctica: comprar algo", "Práctica: dar direcciones"]),
    ("A2 · Salud, emergencias y servicios", ["El cuerpo y la salud", "En el médico", "Emergencias", "Servicios públicos", "Derechos de las personas sordas",
                                             "El papel del intérprete", "Comparar cosas", "Cantidades y precios", "Video: una cita médica",
                                             "Práctica: pedir ayuda", "Práctica: describir síntomas", "Repaso de vocabulario"]),
    ("A2 · Integración del nivel básico", ["Repaso de gramática visual", "Vocabulario esencial", "Comprensión de videos A2", "Expresión en LSC A2",
                                           "Historia de la educación de las personas sordas en Colombia", "Cultura sorda", "Arte y poesía en señas",
                                           "Errores comunes de oyentes", "Glosas: cómo escribir las señas", "Convivencia con personas sordas",
                                           "Cómo seguir practicando", "Proyecto integrador: presentación personal en LSC"]),
    ("B1 · Comunicación independiente", ["Contar experiencias", "Narrar historias", "Dar opiniones", "Estar de acuerdo y en desacuerdo", "Tecnología y accesibilidad",
                                         "Conectores en LSC", "Condiciones e hipótesis", "Uso avanzado del espacio", "Video: una entrevista", "Video: una noticia",
                                         "Práctica: un relato", "Práctica: una entrevista"]),
    ("B1 · Sociedad y cultura sorda", ["Organizaciones de personas sordas", "Ley 982 de 2005", "Educación bilingüe para sordos", "Identidad sorda", "Expresiones idiomáticas en LSC",
                                       "Registro formal e informal", "Señas regionales", "Humor sordo", "Video: un debate", "Video: un cuento en señas",
                                       "Práctica: reseña de un video", "Práctica: un debate"]),
    ("B2 · Uso profesional", ["LSC en la atención al cliente", "LSC en salud", "LSC en educación", "LSC en entidades públicas", "Vocabulario de tu profesión",
                              "Reuniones accesibles", "Presentaciones en público", "Ética de la interpretación", "Video: una conferencia",
                              "Práctica: atender a un usuario", "Práctica: una exposición", "Práctica: una reunión"]),
    ("B2 · Fluidez y matices", ["Ritmo y fluidez", "Matices con la expresión facial", "Señas icónicas y arbitrarias", "Variación entre generaciones",
                                "Literatura en LSC", "Teatro y cine sordo", "Señas internacionales", "Comparación con otras lenguas de señas",
                                "Video: una obra de teatro", "Video: poesía en señas", "Práctica: narración libre", "Conversación libre"]),
    ("C1 · Dominio y servicio", ["Interpretación LSC-español: fundamentos", "Interpretación consecutiva", "Interpretación simultánea", "Guía-interpretación para sordociegos",
                                 "Lenguaje especializado", "Accesibilidad de contenidos digitales", "Investigación sobre la LSC", "Comprensión de videos C1",
                                 "Expresión en LSC C1", "Formación continua del intérprete", "Plan de servicio a la comunidad sorda",
                                 "Proyecto integrador C1: exposición en LSC"]),
    ("C2 · Maestría en LSC", ["Matices y precisión en las señas", "Expresiones idiomáticas avanzadas en LSC", "Humor e ironía en la cultura sorda",
                              "Registro académico en LSC", "Variación social y regional", "Gramática espacial avanzada", "Video: debates de la comunidad sorda",
                              "Video: literatura en LSC", "Glosas de textos complejos", "Improvisación en LSC", "Mediación LSC-español",
                              "Conversación con personas sordas"]),
    ("C2 · Certificación y proyecto final", ["Evaluación de nivel C2 en LSC", "Estrategias para la evaluación", "Simulacro de comprensión de videos C2",
                                            "Simulacro de expresión en LSC C2", "Interpretación de una conferencia", "Interpretación en contextos de salud",
                                            "Interpretación en contextos jurídicos", "Creación de contenido accesible", "Portafolio del estudiante",
                                            "Ética y liderazgo en la comunidad sorda", "Plan de aprendizaje permanente", "Proyecto final: exposición y narración en LSC"]),
]

# Fuentes verificadas el 10 de octubre de 2026: (título, entidad, enlace, para qué sirve)
CEFR = ("Marco Común Europeo de Referencia para las Lenguas (MCER)", "Consejo de Europa",
        "https://www.coe.int/en/web/common-european-framework-reference-languages", "Niveles A1 a C2 y lo que se debe lograr en cada uno")
OMNIGLOT = ("Omniglot: sistemas de escritura e idiomas", "Omniglot", "https://www.omniglot.com/", "Alfabetos y sistemas de escritura")
LANGUAGE_SOURCES = {
    "ingles": [("LearnEnglish", "British Council", "https://learnenglish.britishcouncil.org/", "Práctica de escucha, gramática y vocabulario"),
               ("Cambridge English", "Universidad de Cambridge", "https://www.cambridgeenglish.org/", "Exámenes oficiales de inglés")],
    "aleman": [("Goethe-Institut Kolumbien", "Goethe-Institut", "https://www.goethe.de/ins/co/es/index.html", "Cursos y exámenes oficiales de alemán en Colombia")],
    "portugues": [("Camões, Instituto da Cooperação e da Língua", "Gobierno de Portugal", "https://www.instituto-camoes.pt/", "Lengua y cultura portuguesa")],
    "italiano": [("Società Dante Alighieri", "La Dante", "https://www.dante.global/", "Lengua y certificación PLIDA")],
    "chino-mandarin": [("Chinese Tests Service (HSK)", "Chinese Testing International", "https://www.chinesetest.cn/", "Examen oficial HSK")],
    "japones": [("JLPT: Japanese-Language Proficiency Test", "The Japan Foundation", "https://www.jlpt.jp/e/", "Examen oficial de japonés")],
    "coreano": [("Instituto Rey Sejong (cursos en línea)", "King Sejong Institute Foundation", "https://www.iksi.or.kr/", "Cursos oficiales de coreano")],
}
LSC_SOURCES = [
    ("INSOR Educativo: recursos para comunidades sordas", "Instituto Nacional para Sordos – Colombia Aprende",
     "https://colombiaaprende.edu.co/contenidos/plataforma/recursos-educativos-accesibles-para-comunidades-sordas", "Videos y materiales en LSC"),
    ("Ley 982 de 2005", "Normograma MinTIC", "https://normograma.mintic.gov.co/mintic/compilacion/docs/ley_0982_2005.htm",
     "Derechos de las personas sordas y sordociegas en Colombia"),
]


def language_courses(default_price: int) -> list[dict]:
    courses = []
    for slug, name, code, color, script, exam, script_topics in LANGUAGES:
        courses.append({
            "slug": f"idioma-{slug}",
            "title": name,
            "category": "Idiomas",
            "color": color,
            "summary": LEVEL_SUMMARY.format(name=name.lower()),
            "price_cop": default_price,
            "lang": code,
            "modules": language_modules(name, script, exam, script_topics),
            "sources": [CEFR, *LANGUAGE_SOURCES.get(slug, []), *([OMNIGLOT] if script != "latin" else [])],
        })
    courses.append({
        "slug": "idioma-lengua-de-senas-colombiana",
        "title": "Lengua de Señas Colombiana (LSC)",
        "category": "Idiomas",
        "color": "#6D4C41",
        "summary": "Aprende la Lengua de Señas Colombiana para comunicarte con la comunidad sorda: alfabeto manual, vocabulario, gramática visual "
                   "y cultura sorda, del nivel básico (A1) al de maestría (C2). Módulos 1 a 5 gratis.",
        "price_cop": default_price,
        "lang": "lsc",
        "modules": LSC_MODULES,
        "sources": LSC_SOURCES,
    })
    return courses
