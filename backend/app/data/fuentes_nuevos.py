"""Fuentes de los 35 cursos nuevos (ciencias, ciencias sociales, arte, diseño y comunicación).

Cada enlace fue abierto y verificado el 10 de octubre de 2026.
Formato: (título, entidad que lo publica, enlace, para qué sirve en el curso)
"""

SENADO = "Secretaría del Senado de Colombia"

SOURCES_NUEVOS = {
    # ---------- Ciencias ----------
    "quimica": [
        ("Química 2ed (libro gratuito en español)", "OpenStax – Rice University", "https://openstax.org/details/books/qu%C3%ADmica-2ed", "Texto guía del curso"),
        ("Tabla periódica de los elementos", "IUPAC", "https://iupac.org/what-we-do/periodic-table-of-elements/", "Tabla periódica oficial"),
    ],
    "biologia": [
        ("Conceptos en Biología (OpenStax, en español)", "LibreTexts Español", "https://espanol.libretexts.org/Bookshelves/Biologia/Biologia_introductoria_y_general/Libro%3A_Conceptos_en_Biolog%C3%ADa_(OpenStax)", "Texto guía del curso"),
        ("Instituto Humboldt", "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt", "https://www.humboldt.org.co/", "Biodiversidad de Colombia"),
    ],
    "matematicas": [
        ("Matemáticas en Khan Academy", "Khan Academy", "https://es.khanacademy.org/math", "Ejercicios y videos gratuitos"),
        ("Cálculo volumen 1 (libro gratuito en español)", "OpenStax – Rice University", "https://openstax.org/details/books/c%C3%A1lculo-volumen-1", "Cálculo diferencial e integral"),
    ],
    "astronomia": [
        ("NASA Science", "NASA", "https://science.nasa.gov/", "Sistema solar, misiones y universo"),
        ("Simulaciones PhET", "Universidad de Colorado Boulder", "https://phet.colorado.edu/es/", "Simulaciones de gravedad y órbitas"),
    ],
    "geologia": [
        ("Geología de Colombia (libro)", "Servicio Geológico Colombiano", "https://www2.sgc.gov.co/LibroGeologiaColombia/Paginas/Inicio.aspx", "Geología del territorio colombiano"),
        ("U.S. Geological Survey", "USGS", "https://www.usgs.gov/", "Sismos, volcanes y ciencias de la Tierra"),
    ],
    "ecologia": [
        ("Instituto Humboldt", "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt", "https://www.humboldt.org.co/", "Ecosistemas y biodiversidad de Colombia"),
        ("Parques Nacionales Naturales de Colombia", "Gobierno de Colombia", "https://www.parquesnacionales.gov.co/", "Áreas protegidas"),
    ],
    "ciencias-ambientales": [
        ("IDEAM", "Instituto de Hidrología, Meteorología y Estudios Ambientales", "https://www.ideam.gov.co/", "Clima, agua y datos ambientales de Colombia"),
        ("Ley 99 de 1993 (Sistema Nacional Ambiental)", SENADO, "http://www.secretariasenado.gov.co/senado/basedoc/ley_0099_1993.html", "Legislación ambiental"),
        ("Panel Intergubernamental de Cambio Climático", "IPCC – Naciones Unidas", "https://www.ipcc.ch/", "Ciencia del cambio climático"),
    ],
    "genetica": [
        ("Glosario parlante de términos genéticos", "NHGRI – Institutos Nacionales de Salud de EE. UU.", "https://www.genome.gov/es/genetics-glossary", "Vocabulario de genética en español"),
        ("National Center for Biotechnology Information", "NCBI – NIH", "https://www.ncbi.nlm.nih.gov/", "Bases de datos genéticas y bioinformática"),
    ],
    "microbiologia": [
        ("Instituto Nacional de Salud", "INS – Colombia", "https://www.ins.gov.co/", "Vigilancia y laboratorio en salud pública"),
        ("Resistencia a los antimicrobianos", "Organización Mundial de la Salud", "https://www.who.int/es/news-room/fact-sheets/detail/antimicrobial-resistance", "Uso responsable de antibióticos"),
    ],
    "bioquimica": [
        ("PDB-101", "RCSB Protein Data Bank", "https://pdb101.rcsb.org/", "Estructura de proteínas y biomoléculas"),
        ("KEGG PATHWAY Database", "Kanehisa Laboratories", "https://www.genome.jp/kegg/pathway.html", "Rutas metabólicas"),
    ],
    "ciencias-naturales": [
        ("Estándares Básicos de Competencias", "Ministerio de Educación Nacional", "https://www.mineducacion.gov.co/1621/article-340021.html", "Currículo de ciencias naturales"),
        ("Simulaciones PhET", "Universidad de Colorado Boulder", "https://phet.colorado.edu/es/", "Experimentos virtuales"),
    ],
    # ---------- Ciencias sociales ----------
    "sociologia": [
        ("DANE", "Departamento Administrativo Nacional de Estadística", "https://www.dane.gov.co/", "Datos sociales de Colombia"),
        ("CLACSO", "Consejo Latinoamericano de Ciencias Sociales", "https://www.clacso.org/", "Biblioteca y pensamiento social latinoamericano"),
    ],
    "psicologia": [
        ("Colegio Colombiano de Psicólogos", "Colpsic", "https://www.colpsic.org.co/", "Ejercicio profesional en Colombia"),
        ("Ley 1090 de 2006 (ejercicio de la psicología)", SENADO, "http://www.secretariasenado.gov.co/senado/basedoc/ley_1090_2006.html", "Código deontológico y bioético"),
        ("American Psychological Association", "APA", "https://www.apa.org/", "Investigación y normas APA"),
    ],
    "antropologia": [
        ("Instituto Colombiano de Antropología e Historia", "ICANH", "https://icanh.gov.co/", "Antropología, arqueología y patrimonio"),
        ("CLACSO", "Consejo Latinoamericano de Ciencias Sociales", "https://www.clacso.org/", "Pensamiento social latinoamericano"),
    ],
    "historia": [
        ("Archivo General de la Nación", "Gobierno de Colombia", "https://www.archivogeneral.gov.co/", "Fuentes primarias de la historia de Colombia"),
        ("Biblioteca Nacional de Colombia", "Ministerio de las Culturas", "https://bibliotecanacional.gov.co/", "Prensa histórica y libros digitalizados"),
        ("Informe Final de la Comisión de la Verdad", "Comisión de la Verdad", "https://www.comisiondelaverdad.co/", "Memoria del conflicto armado"),
    ],
    "geografia": [
        ("Instituto Geográfico Agustín Codazzi", "IGAC", "https://www.igac.gov.co/", "Cartografía oficial de Colombia"),
        ("QGIS", "Proyecto QGIS", "https://qgis.org/", "Sistemas de información geográfica gratuitos"),
    ],
    "ciencia-politica": [
        ("Constitución Política de Colombia de 1991", SENADO, "http://www.secretariasenado.gov.co/senado/basedoc/constitucion_politica_1991.html", "Sistema político colombiano"),
        ("Registraduría Nacional del Estado Civil", "Organización electoral", "https://www.registraduria.gov.co/", "Elecciones y participación"),
    ],
    "economia": [
        ("Banco de la República", "Banco central de Colombia", "https://www.banrep.gov.co/es", "Política monetaria y datos económicos"),
        ("DANE", "Departamento Administrativo Nacional de Estadística", "https://www.dane.gov.co/", "PIB, inflación y empleo"),
    ],
    "relaciones-internacionales": [
        ("Cancillería de Colombia", "Ministerio de Relaciones Exteriores", "https://www.cancilleria.gov.co/", "Política exterior colombiana"),
        ("Naciones Unidas", "ONU", "https://www.un.org/es/", "Sistema internacional y multilateralismo"),
    ],
    "trabajo-social": [
        ("Consejo Nacional de Trabajo Social", "Colombia", "https://www.consejonacionaldetrabajosocial.org.co/", "Ejercicio profesional y ética"),
        ("Instituto Colombiano de Bienestar Familiar", "ICBF", "https://www.icbf.gov.co/", "Protección de niños y familias"),
    ],
    "demografia": [
        ("DANE", "Departamento Administrativo Nacional de Estadística", "https://www.dane.gov.co/", "Censos y estadísticas vitales"),
        ("Proyecciones demográficas", "CEPAL – CELADE", "https://www.cepal.org/es/subtemas/proyecciones-demograficas", "Población de América Latina"),
        ("UNFPA Colombia", "Fondo de Población de las Naciones Unidas", "https://colombia.unfpa.org/es", "Población y desarrollo"),
    ],
    "ciencias-de-la-comunicacion": [
        ("Fundación para la Libertad de Prensa", "FLIP", "https://flip.org.co/", "Libertad de expresión y periodismo en Colombia"),
        ("Ministerio TIC", "MinTIC", "https://www.mintic.gov.co/portal/inicio/", "Medios, TIC y comunicaciones"),
    ],
    # ---------- Arte, diseño y comunicación ----------
    "diseno-industrial": [
        ("Artesanías de Colombia", "Gobierno de Colombia", "https://artesaniasdecolombia.com.co/", "Diseño con comunidades artesanas"),
        ("Blender", "Blender Foundation", "https://www.blender.org/", "Modelado 3D gratuito"),
    ],
    "diseno-de-interiores": [
        ("Ministerio de Vivienda, Ciudad y Territorio", "Gobierno de Colombia", "https://www.minvivienda.gov.co/", "Normas de vivienda y construcción"),
        ("Artesanías de Colombia", "Gobierno de Colombia", "https://artesaniasdecolombia.com.co/", "Objetos y materiales artesanales"),
    ],
    "diseno-de-modas": [
        ("Inexmoda", "Instituto para la Exportación y la Moda", "https://www.inexmoda.org.co/", "Industria de la moda en Colombia"),
        ("Fashion Revolution", "Fashion Revolution", "https://www.fashionrevolution.org/", "Moda sostenible y transparente"),
    ],
    "artes-plasticas": [
        ("Museo Nacional de Colombia", "Ministerio de las Culturas", "https://www.museonacional.gov.co/", "Colecciones de arte e historia"),
        ("Banrepcultural", "Banco de la República", "https://www.banrepcultural.org/", "Colección de arte y Red de Bibliotecas"),
    ],
    "artes-visuales": [
        ("Museo de Arte Moderno de Bogotá", "MAMBO", "https://www.mambogota.com/", "Arte moderno y contemporáneo"),
        ("Banrepcultural", "Banco de la República", "https://www.banrepcultural.org/", "Exposiciones y colección de arte"),
    ],
    "musica": [
        ("Ministerio de las Culturas, las Artes y los Saberes", "Gobierno de Colombia", "https://www.mincultura.gov.co/", "Plan Nacional de Música y estímulos"),
        ("SAYCO", "Sociedad de Autores y Compositores de Colombia", "https://www.sayco.org/", "Derechos de autor musicales"),
    ],
    "teatro": [
        ("Teatro Mayor Julio Mario Santo Domingo", "Bogotá", "https://www.teatromayor.org/", "Programación de artes escénicas"),
        ("Ministerio de las Culturas, las Artes y los Saberes", "Gobierno de Colombia", "https://www.mincultura.gov.co/", "Estímulos para las artes escénicas"),
    ],
    "cine-y-produccion-audiovisual": [
        ("Proimágenes Colombia", "Fondo para el Desarrollo Cinematográfico", "https://www.proimagenescolombia.com/", "Convocatorias y datos del cine colombiano"),
        ("FICCI – Festival Internacional de Cine de Cartagena", "FICCI", "https://ficcifestival.com/", "Festival de cine"),
    ],
    "fotografia": [
        ("World Press Photo", "World Press Photo Foundation", "https://www.worldpressphoto.org/", "Fotoperiodismo y fotografía documental"),
        ("Biblioteca Nacional de Colombia", "Ministerio de las Culturas", "https://bibliotecanacional.gov.co/", "Archivo fotográfico histórico"),
    ],
    "animacion-digital": [
        ("Pixar en una caja", "Khan Academy y Pixar", "https://es.khanacademy.org/computing/pixar", "Cómo se hace la animación"),
        ("Blender", "Blender Foundation", "https://www.blender.org/", "Animación 3D gratuita"),
    ],
    "escritura-creativa": [
        ("Diccionario de la lengua española", "RAE – ASALE", "https://dle.rae.es/", "Léxico y norma"),
        ("Biblioteca Nacional de Colombia", "Ministerio de las Culturas", "https://bibliotecanacional.gov.co/", "Literatura colombiana digitalizada"),
    ],
    "arquitectura": [
        ("Sociedad Colombiana de Arquitectos", "SCA", "https://sociedadcolombianadearquitectos.org/", "Gremio, concursos y noticias de arquitectura"),
        ("Ministerio de Vivienda, Ciudad y Territorio", "Gobierno de Colombia", "https://www.minvivienda.gov.co/", "Normas urbanas y de construcción"),
    ],
    "publicidad": [
        ("Ley 1480 de 2011 (Estatuto del Consumidor)", SENADO, "http://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html", "Publicidad engañosa y derechos del consumidor"),
        ("Skillshop", "Google", "https://skillshop.withgoogle.com/", "Publicidad digital y certificaciones"),
    ],
}
