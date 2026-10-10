"""Catálogo oficial de cursos de Orion Nova Academy.

Cada curso tiene 10 módulos y cada módulo 12 temas (120 temas por curso).
Los módulos 1 a 5 (nivel básico) son gratuitos; los módulos 6 a 10 (avanzado), el certificado y sus 120 horas son de pago.
Los módulos 6 a 10 están en catalog_avanzado.py y las fuentes de cada curso en fuentes.py.
Edita este archivo y vuelve a correr `python -m app.seed` para actualizar la base de datos.
"""

FREE_MODULES = 5
CERTIFICATE_HOURS = 120
DEFAULT_PRICE_COP = 89_900

COURSES = [
    {
        "slug": "diseno-grafico",
        "title": "Diseño Gráfico",
        "category": "Creatividad",
        "color": "#E0567A",
        "summary": "Domina los fundamentos visuales, la tipografía, el color y las herramientas profesionales para crear piezas de marca, digitales e impresas.",
        "modules": [
            ("Fundamentos del diseño", ["Qué es el diseño gráfico", "Historia del diseño", "Elementos básicos: punto, línea y plano", "Forma y contraforma", "Composición y equilibrio", "Jerarquía visual", "Proporción y escala", "Retículas y alineación", "Espacio negativo", "Gestalt aplicada", "Bocetaje y pensamiento visual", "Proyecto: cartel minimalista"]),
            ("Color y tipografía", ["Teoría del color", "Modelos RGB, CMYK y Pantone", "Armonías cromáticas", "Psicología del color", "Paletas para marca", "Anatomía tipográfica", "Clasificación de familias", "Combinación de fuentes", "Interlineado y tracking", "Legibilidad y lecturabilidad", "Tipografía expresiva", "Proyecto: póster tipográfico"]),
            ("Herramientas digitales", ["Mapa de bits vs. vectores", "Interfaz de editor vectorial", "Pluma y trazados", "Capas y máscaras", "Edición fotográfica básica", "Retoque y corrección de color", "Maquetación editorial", "Estilos y páginas maestras", "Herramientas de código abierto", "Flujo de trabajo y atajos", "Exportación de archivos", "Proyecto: revista de 4 páginas"]),
            ("Identidad de marca", ["Qué es una marca", "Investigación y brief", "Naming y concepto", "Diseño de logotipo", "Variantes y versiones", "Sistema de identidad", "Manual de marca", "Papelería corporativa", "Packaging", "Señalética", "Presentación al cliente", "Proyecto: identidad completa"]),
            ("Diseño digital y portafolio", ["Diseño para redes sociales", "Fundamentos de UI", "Introducción a UX", "Prototipado de interfaces", "Motion graphics básico", "Ilustración digital", "Diseño de infografías", "Accesibilidad visual", "Derechos de autor y licencias", "Preparación para imprenta", "Construcción de portafolio", "Proyecto final de diseño"]),
        ],
    },
    {
        "slug": "programacion-de-software",
        "title": "Programación de Software",
        "category": "Tecnología",
        "color": "#4F6BED",
        "summary": "Aprende a programar desde cero: lógica, Python, estructuras de datos, programación orientada a objetos, web y buenas prácticas profesionales.",
        "modules": [
            ("Lógica de programación", ["Qué es programar", "Algoritmos y pseudocódigo", "Diagramas de flujo", "Variables y tipos de datos", "Operadores", "Condicionales", "Ciclos while y for", "Funciones", "Entrada y salida", "Depuración básica", "Resolución de problemas", "Proyecto: calculadora"]),
            ("Programación con Python", ["Instalación y entorno", "Sintaxis de Python", "Cadenas de texto", "Listas y tuplas", "Diccionarios y conjuntos", "Comprensiones", "Manejo de errores", "Archivos", "Módulos y paquetes", "Entornos virtuales", "Librería estándar", "Proyecto: agenda de contactos"]),
            ("Estructuras de datos y algoritmos", ["Complejidad Big O", "Arreglos", "Pilas", "Colas", "Listas enlazadas", "Árboles", "Grafos", "Tablas hash", "Búsqueda lineal y binaria", "Algoritmos de ordenamiento", "Recursividad", "Proyecto: buscador de rutas"]),
            ("Programación orientada a objetos", ["Clases y objetos", "Atributos y métodos", "Encapsulamiento", "Herencia", "Polimorfismo", "Abstracción e interfaces", "Principios SOLID", "Patrones de diseño", "Pruebas unitarias", "Control de versiones con Git", "Código limpio", "Proyecto: sistema de inventario"]),
            ("Desarrollo web y despliegue", ["HTML y CSS", "JavaScript moderno", "TypeScript", "React", "APIs REST", "Backend con FastAPI", "Bases de datos SQL", "Autenticación", "Docker", "Integración continua", "Despliegue en la nube", "Proyecto final full stack"]),
        ],
    },
    {
        "slug": "ingenieria-de-sistemas",
        "title": "Ingeniería de Sistemas",
        "category": "Tecnología",
        "color": "#2E8BC0",
        "summary": "Comprende cómo se diseñan, construyen y gestionan sistemas de información: arquitectura, redes, bases de datos, seguridad y gestión de proyectos.",
        "modules": [
            ("Fundamentos de sistemas", ["Teoría general de sistemas", "Sistemas de información", "Hardware y arquitectura", "Sistemas numéricos", "Lógica digital", "Sistemas operativos", "Procesos e hilos", "Gestión de memoria", "Sistemas de archivos", "Línea de comandos", "Virtualización", "Proyecto: diagnóstico de un sistema"]),
            ("Redes y comunicaciones", ["Modelo OSI", "Modelo TCP/IP", "Direccionamiento IP", "Subredes", "Enrutamiento", "Conmutación y VLAN", "DNS y DHCP", "Protocolos HTTP y HTTPS", "Redes inalámbricas", "Monitoreo de red", "Cableado estructurado", "Proyecto: red de una pyme"]),
            ("Bases de datos", ["Modelo entidad-relación", "Modelo relacional", "Normalización", "SQL básico", "Consultas avanzadas y JOIN", "Índices", "Transacciones ACID", "Procedimientos y triggers", "PostgreSQL en la práctica", "Bases NoSQL", "Respaldo y recuperación", "Proyecto: base de datos universitaria"]),
            ("Ingeniería de software", ["Ciclo de vida del software", "Levantamiento de requisitos", "Casos de uso", "UML", "Arquitectura de software", "Microservicios", "Metodologías ágiles: Scrum", "Kanban", "Calidad y pruebas", "DevOps", "Documentación técnica", "Proyecto: diseño de un sistema"]),
            ("Seguridad y gestión TI", ["Fundamentos de ciberseguridad", "Criptografía", "Gestión de identidades", "OWASP Top 10", "Seguridad en redes", "Gestión de riesgos", "ITIL", "Gobierno de TI", "Continuidad del negocio", "Auditoría de sistemas", "Ética profesional", "Proyecto final de ingeniería"]),
        ],
    },
    {
        "slug": "inteligencia-artificial",
        "title": "Inteligencia Artificial",
        "category": "Tecnología",
        "color": "#7B5CF0",
        "summary": "Desde los fundamentos matemáticos hasta el aprendizaje profundo, los modelos de lenguaje y el uso responsable de la IA.",
        "modules": [
            ("Introducción a la IA", ["Qué es la inteligencia artificial", "Historia de la IA", "Tipos de IA", "Agentes inteligentes", "Búsqueda no informada", "Búsqueda heurística", "Lógica y representación del conocimiento", "Sistemas expertos", "IA en la vida cotidiana", "Herramientas de IA generativa", "Ética y sesgos", "Proyecto: agente de búsqueda"]),
            ("Matemáticas para IA", ["Vectores y matrices", "Operaciones matriciales", "Derivadas", "Gradiente", "Probabilidad", "Teorema de Bayes", "Distribuciones", "Estadística descriptiva", "Optimización", "Python con NumPy", "Pandas para datos", "Proyecto: análisis exploratorio"]),
            ("Aprendizaje automático", ["Qué es machine learning", "Aprendizaje supervisado", "Regresión lineal", "Regresión logística", "Árboles de decisión", "Random Forest", "Máquinas de soporte vectorial", "Aprendizaje no supervisado", "K-means", "Evaluación de modelos", "Sobreajuste y validación", "Proyecto: modelo predictivo"]),
            ("Aprendizaje profundo", ["Neuronas artificiales", "Redes multicapa", "Retropropagación", "Funciones de activación", "Redes convolucionales", "Visión por computador", "Redes recurrentes", "Transformers", "Transfer learning", "PyTorch básico", "Entrenamiento en GPU", "Proyecto: clasificador de imágenes"]),
            ("IA generativa y aplicaciones", ["Modelos de lenguaje", "Ingeniería de prompts", "Embeddings", "RAG: recuperación aumentada", "Agentes con herramientas", "Generación de imágenes", "Procesamiento de voz", "APIs de IA", "Despliegue de modelos", "Evaluación y seguridad", "Regulación de la IA", "Proyecto final: asistente inteligente"]),
        ],
    },
    {
        "slug": "derecho",
        "title": "Derecho",
        "category": "Ciencias sociales",
        "color": "#8A6D3B",
        "summary": "Introducción al sistema jurídico colombiano: Constitución, derecho civil, penal, laboral, comercial y nuevas áreas como el derecho digital.",
        "modules": [
            ("Introducción al derecho", ["Qué es el derecho", "Fuentes del derecho", "Norma jurídica", "Ramas del derecho", "Jerarquía normativa", "Sistemas jurídicos del mundo", "Historia del derecho colombiano", "Interpretación jurídica", "Personas naturales y jurídicas", "Capacidad jurídica", "Ética del abogado", "Taller: análisis de una norma"]),
            ("Derecho constitucional", ["La Constitución de 1991", "Principios fundamentales", "Derechos fundamentales", "Derechos sociales y colectivos", "Acción de tutela", "Acciones populares y de grupo", "Ramas del poder público", "Organismos de control", "Corte Constitucional", "Bloque de constitucionalidad", "Participación ciudadana", "Taller: redacción de una tutela"]),
            ("Derecho civil", ["Bienes y propiedad", "Posesión y tenencia", "Obligaciones", "Fuentes de las obligaciones", "Contratos: elementos", "Contratos típicos", "Responsabilidad civil", "Familia y matrimonio", "Unión marital de hecho", "Sucesiones", "Prescripción", "Taller: elaboración de un contrato"]),
            ("Derecho penal y procesal", ["Principios del derecho penal", "Teoría del delito", "Tipicidad", "Antijuridicidad", "Culpabilidad", "Penas y medidas", "Sistema penal acusatorio", "Etapas del proceso penal", "Derecho procesal civil", "Pruebas", "Recursos judiciales", "Taller: estudio de caso penal"]),
            ("Derecho laboral, comercial y digital", ["Contrato de trabajo", "Prestaciones sociales", "Seguridad social", "Terminación del contrato", "Sociedades comerciales", "Títulos valores", "Derecho del consumidor", "Protección de datos personales", "Propiedad intelectual", "Comercio electrónico", "Derecho y tecnología", "Proyecto final jurídico"]),
        ],
    },
    {
        "slug": "energias-renovables",
        "title": "Energías Renovables",
        "category": "Ingeniería",
        "color": "#2BAE66",
        "summary": "Conoce las fuentes limpias de energía, cómo se diseñan sistemas solares y eólicos y cómo se gestionan proyectos sostenibles en Colombia.",
        "modules": [
            ("Fundamentos de energía", ["Qué es la energía", "Unidades y conversiones", "Fuentes convencionales", "Matriz energética mundial", "Matriz energética colombiana", "Cambio climático", "Huella de carbono", "Eficiencia energética", "Electricidad básica", "Circuitos AC y DC", "Medición eléctrica", "Taller: auditoría energética del hogar"]),
            ("Energía solar", ["Radiación solar", "Efecto fotovoltaico", "Tipos de paneles", "Inversores", "Baterías y almacenamiento", "Sistemas on-grid", "Sistemas off-grid", "Dimensionamiento", "Orientación e inclinación", "Instalación segura", "Energía solar térmica", "Proyecto: sistema solar residencial"]),
            ("Energía eólica e hidráulica", ["Recurso eólico", "Aerogeneradores", "Parques eólicos", "Energía eólica en La Guajira", "Pequeñas centrales hidroeléctricas", "Turbinas hidráulicas", "Impacto ambiental", "Energía mareomotriz", "Mantenimiento", "Medición de viento", "Estudios de factibilidad", "Proyecto: microcentral eólica"]),
            ("Biomasa, geotermia e hidrógeno", ["Biomasa", "Biocombustibles", "Biogás", "Compostaje energético", "Geotermia", "Hidrógeno verde", "Celdas de combustible", "Almacenamiento de energía", "Redes inteligentes", "Movilidad eléctrica", "Economía circular", "Proyecto: biodigestor rural"]),
            ("Gestión de proyectos energéticos", ["Marco regulatorio colombiano", "Ley 1715 de 2014", "Incentivos tributarios", "Evaluación financiera", "Análisis de ciclo de vida", "Licencias ambientales", "Comunidades energéticas", "Gestión de proyectos", "Software de simulación", "Mercado de energía", "Emprendimiento verde", "Proyecto final energético"]),
        ],
    },
    {
        "slug": "robotica",
        "title": "Robótica",
        "category": "Ingeniería",
        "color": "#E8833A",
        "summary": "Diseña, construye y programa robots: electrónica, microcontroladores, sensores, actuadores, cinemática y robots autónomos.",
        "modules": [
            ("Introducción a la robótica", ["Qué es un robot", "Historia de la robótica", "Tipos de robots", "Partes de un robot", "Robótica en la industria", "Robótica de servicio", "Humanoides", "Seguridad en robótica", "Herramientas del taller", "Diseño de un robot", "Ética de la robótica", "Proyecto: boceto de robot"]),
            ("Electrónica básica", ["Voltaje, corriente y resistencia", "Ley de Ohm", "Componentes pasivos", "Diodos y LEDs", "Transistores", "Protoboard", "Multímetro", "Fuentes de alimentación", "Circuitos integrados", "Soldadura", "Simulación de circuitos", "Proyecto: semáforo electrónico"]),
            ("Microcontroladores", ["Qué es un microcontrolador", "Arduino", "Entradas y salidas digitales", "Entradas analógicas", "PWM", "Comunicación serial", "ESP32", "Raspberry Pi", "Programación en C++", "MicroPython", "Interrupciones", "Proyecto: estación de monitoreo"]),
            ("Sensores y actuadores", ["Sensores de distancia", "Sensores de luz y color", "Acelerómetro y giroscopio", "Encoders", "Motores DC", "Servomotores", "Motores paso a paso", "Puentes H", "Control PID", "Visión con cámara", "Comunicación inalámbrica", "Proyecto: seguidor de línea"]),
            ("Cinemática y robots autónomos", ["Cinemática directa", "Cinemática inversa", "Brazos robóticos", "Robots móviles", "Navegación autónoma", "SLAM", "ROS 2", "Simulación con Gazebo", "IA en robótica", "Interacción humano-robot", "Robots en restaurantes y hoteles", "Proyecto final: robot autónomo"]),
        ],
    },
    {
        "slug": "licenciatura-lengua-castellana",
        "title": "Licenciatura en Lengua Castellana",
        "category": "Educación",
        "color": "#C0392B",
        "summary": "Formación en lingüística, gramática, literatura y didáctica para enseñar el español con métodos actuales.",
        "modules": [
            ("Fundamentos de la lengua", ["Lenguaje, lengua y habla", "Comunicación y sus elementos", "Funciones del lenguaje", "Historia del español", "El español en América", "Variedades lingüísticas", "Fonética y fonología", "Ortografía y acentuación", "Signos de puntuación", "Morfología", "Semántica", "Taller: corrección de textos"]),
            ("Gramática y redacción", ["Clases de palabras", "El sustantivo", "El verbo", "La oración simple", "La oración compuesta", "Concordancia", "Cohesión y coherencia", "Tipologías textuales", "Texto argumentativo", "Texto expositivo", "Redacción académica", "Taller: ensayo argumentativo"]),
            ("Literatura", ["Géneros literarios", "Literatura medieval", "Siglo de Oro", "Romanticismo", "Modernismo", "Literatura colombiana", "Realismo mágico", "Literatura latinoamericana actual", "Poesía y métrica", "Narrativa y narrador", "Dramaturgia", "Taller: análisis literario"]),
            ("Didáctica de la lengua", ["Estándares y DBA", "Enseñanza de la lectura", "Comprensión lectora", "Enseñanza de la escritura", "Oralidad en el aula", "Planeación de clases", "Secuencias didácticas", "Evaluación formativa", "Pruebas Saber", "Inclusión en el aula", "TIC para la enseñanza", "Taller: plan de clase"]),
            ("Investigación y práctica docente", ["Investigación educativa", "Enfoques cualitativos", "Investigación-acción", "Sociolingüística", "Análisis del discurso", "Lectura crítica", "Literatura infantil y juvenil", "Proyectos de aula", "Escritura creativa", "Práctica pedagógica", "Portafolio docente", "Proyecto final pedagógico"]),
        ],
    },
    {
        "slug": "educacion-fisica",
        "title": "Educación Física",
        "category": "Salud y deporte",
        "color": "#16A085",
        "summary": "Pedagogía del movimiento, fisiología, deporte y recreación para formar personas activas y saludables.",
        "modules": [
            ("Fundamentos de la educación física", ["Historia de la educación física", "Objetivos y enfoques", "Cuerpo y movimiento", "Desarrollo motor", "Capacidades físicas", "Capacidades coordinativas", "Esquema corporal", "Juego y aprendizaje", "Educación física en Colombia", "Rol del docente", "Seguridad en la clase", "Taller: diagnóstico motor"]),
            ("Ciencias del movimiento", ["Anatomía básica", "Sistema muscular", "Sistema óseo y articular", "Sistema cardiovascular", "Sistema respiratorio", "Fisiología del ejercicio", "Biomecánica", "Nutrición y actividad física", "Hidratación", "Prevención de lesiones", "Primeros auxilios", "Taller: evaluación física"]),
            ("Deporte y recreación", ["Iniciación deportiva", "Fútbol", "Baloncesto", "Voleibol", "Atletismo", "Natación", "Gimnasia", "Deportes alternativos", "Juegos tradicionales", "Recreación y ocio", "Organización de eventos", "Taller: festival deportivo"]),
            ("Didáctica y planeación", ["Planeación curricular", "Unidades didácticas", "Estilos de enseñanza", "Evaluación en educación física", "Educación física inclusiva", "Adaptaciones curriculares", "Manejo de grupos", "Valores a través del deporte", "Educación física en preescolar", "Educación física en secundaria", "Uso de tecnología", "Taller: unidad didáctica"]),
            ("Entrenamiento y salud", ["Principios del entrenamiento", "Planificación deportiva", "Periodización", "Entrenamiento de fuerza", "Resistencia", "Velocidad", "Flexibilidad", "Actividad física y salud pública", "Adulto mayor activo", "Psicología del deporte", "Gestión deportiva", "Proyecto final de educación física"]),
        ],
    },
    {
        "slug": "fisica",
        "title": "Física",
        "category": "Ciencias",
        "color": "#1F77B4",
        "summary": "Comprende las leyes que rigen el universo: mecánica, energía, ondas, electricidad, magnetismo y física moderna, con ejercicios resueltos.",
        "modules": [
            ("Fundamentos y cinemática", ["Qué es la física", "Magnitudes y unidades", "Notación científica", "Vectores", "Movimiento rectilíneo uniforme", "Movimiento acelerado", "Caída libre", "Movimiento parabólico", "Movimiento circular", "Movimiento relativo", "Análisis de gráficas", "Laboratorio: medición del tiempo de caída"]),
            ("Dinámica y energía", ["Leyes de Newton", "Fuerzas y diagramas", "Fricción", "Dinámica circular", "Trabajo", "Energía cinética", "Energía potencial", "Conservación de la energía", "Potencia", "Cantidad de movimiento", "Colisiones", "Laboratorio: plano inclinado"]),
            ("Fluidos, calor y ondas", ["Densidad y presión", "Principio de Pascal", "Principio de Arquímedes", "Dinámica de fluidos", "Temperatura y calor", "Dilatación térmica", "Leyes de la termodinámica", "Movimiento armónico simple", "Ondas mecánicas", "Sonido", "Óptica geométrica", "Laboratorio: péndulo simple"]),
            ("Electricidad y magnetismo", ["Carga eléctrica", "Ley de Coulomb", "Campo eléctrico", "Potencial eléctrico", "Capacitores", "Corriente y resistencia", "Circuitos eléctricos", "Leyes de Kirchhoff", "Magnetismo", "Inducción electromagnética", "Ondas electromagnéticas", "Laboratorio: circuitos en serie y paralelo"]),
            ("Física moderna", ["Relatividad especial", "Dualidad onda-partícula", "Efecto fotoeléctrico", "Modelo atómico", "Física cuántica básica", "Física nuclear", "Radiactividad", "Partículas elementales", "Astrofísica", "Física de semiconductores", "Física y tecnología", "Proyecto final de física"]),
        ],
    },
    {
        "slug": "ejercicios-fisicos",
        "title": "Ejercicios Físicos",
        "category": "Salud y deporte",
        "color": "#F39C12",
        "summary": "Rutinas guiadas y principios de entrenamiento para mejorar tu fuerza, resistencia y movilidad de forma segura en casa o en el gimnasio.",
        "modules": [
            ("Preparación y bases", ["Beneficios del ejercicio", "Evaluación inicial", "Calentamiento correcto", "Postura y técnica", "Respiración", "Frecuencia cardiaca", "Escala de esfuerzo percibido", "Equipo básico", "Ejercicio en casa", "Descanso y sueño", "Motivación y hábitos", "Rutina: semana de iniciación"]),
            ("Movilidad y flexibilidad", ["Movilidad articular", "Estiramiento dinámico", "Estiramiento estático", "Movilidad de cadera", "Movilidad de hombros", "Columna saludable", "Yoga básico", "Pilates básico", "Autoliberación miofascial", "Equilibrio", "Postura en el trabajo", "Rutina: movilidad diaria"]),
            ("Fuerza con peso corporal", ["Sentadillas", "Zancadas", "Flexiones de pecho", "Planchas", "Puentes de glúteo", "Fondos", "Dominadas asistidas", "Core y abdomen", "Progresiones", "Circuitos", "Entrenamiento funcional", "Rutina: fuerza en casa"]),
            ("Entrenamiento con cargas", ["Mancuernas", "Barras", "Bandas elásticas", "Kettlebells", "Peso muerto", "Press de banca", "Remo", "Press militar", "Series y repeticiones", "Sobrecarga progresiva", "Rutinas divididas", "Rutina: plan de 4 semanas"]),
            ("Cardio y planificación", ["Caminata y trote", "Ciclismo", "Salto de cuerda", "HIIT", "Entrenamiento por intervalos", "Resistencia aeróbica", "Nutrición deportiva básica", "Hidratación y recuperación", "Prevención de lesiones", "Seguimiento del progreso", "Diseña tu propio plan", "Reto final de 30 días"]),
        ],
    },
    {
        "slug": "visualizacion-de-datos",
        "title": "Visualización de Datos",
        "category": "Datos",
        "color": "#0097A7",
        "summary": "Convierte datos en historias claras: principios de percepción, tipos de gráficos, dashboards y herramientas como Python, Power BI y D3.",
        "modules": [
            ("Principios de visualización", ["Por qué visualizar datos", "Percepción visual", "Atributos preatentivos", "Tipos de datos", "Elegir el gráfico correcto", "Barras y columnas", "Líneas y series de tiempo", "Dispersión y correlación", "Distribuciones", "Partes de un todo", "Errores comunes", "Taller: rediseño de un gráfico"]),
            ("Color, diseño y narrativa", ["Uso del color", "Paletas accesibles", "Tipografía en gráficos", "Anotaciones", "Reducción de ruido", "Storytelling con datos", "Estructura de una historia", "Audiencia y contexto", "Datos y ética", "Visualización engañosa", "Presentaciones efectivas", "Taller: historia con datos"]),
            ("Herramientas", ["Hojas de cálculo", "Python con Matplotlib", "Seaborn", "Plotly", "Power BI", "Tableau Public", "Looker Studio", "Limpieza de datos", "Pandas para visualizar", "Exportación y publicación", "Comparación de herramientas", "Taller: primer dashboard"]),
            ("Dashboards", ["Qué es un dashboard", "KPIs y métricas", "Diseño de layout", "Filtros e interactividad", "Modelado de datos", "DAX básico", "Actualización automática", "Dashboards operativos", "Dashboards estratégicos", "Rendimiento", "Pruebas con usuarios", "Taller: dashboard de ventas"]),
            ("Mapas, redes y visualización web", ["Mapas y datos geográficos", "Redes y grafos", "Visualización web con D3", "Gráficos en React", "Visualización en tiempo real", "Big data visual", "Visualización científica", "Infografías", "Accesibilidad", "Portafolio de visualizaciones", "Tendencias", "Proyecto final de visualización"]),
        ],
    },
    {
        "slug": "big-data",
        "title": "Big Data",
        "category": "Datos",
        "color": "#34495E",
        "summary": "Procesa y analiza grandes volúmenes de datos con arquitecturas distribuidas, Spark, bases NoSQL y pipelines modernos.",
        "modules": [
            ("Fundamentos de Big Data", ["Qué es Big Data", "Las 5 V", "Fuentes de datos", "Datos estructurados y no estructurados", "Ciclo de vida del dato", "Roles en datos", "Casos de uso", "Arquitecturas de datos", "Data warehouse", "Data lake", "Lakehouse", "Taller: mapa de datos de una empresa"]),
            ("Almacenamiento distribuido", ["Sistemas distribuidos", "Teorema CAP", "Hadoop y HDFS", "MapReduce", "Bases NoSQL", "MongoDB", "Cassandra", "Bases clave-valor", "Formatos Parquet y Avro", "Particionamiento", "Almacenamiento en la nube", "Taller: modelado NoSQL"]),
            ("Procesamiento con Spark", ["Introducción a Apache Spark", "RDDs", "DataFrames", "Spark SQL", "PySpark", "Transformaciones y acciones", "Optimización", "Spark Streaming", "MLlib", "Databricks", "Monitoreo de jobs", "Taller: análisis de logs"]),
            ("Ingeniería de datos", ["Pipelines ETL y ELT", "Ingesta de datos", "Apache Kafka", "Orquestación con Airflow", "dbt", "Calidad de datos", "Gobierno de datos", "Catálogo y linaje", "Seguridad de datos", "Datos en tiempo real", "Costos y escalabilidad", "Taller: pipeline completo"]),
            ("Analítica de datos", ["Analítica descriptiva", "Analítica predictiva", "Machine learning a escala", "Procesamiento de texto", "Análisis de redes sociales", "Sistemas de recomendación", "IoT y sensores", "Privacidad y ley de datos", "Big Data en Colombia", "Cultura data-driven", "Carrera en datos", "Proyecto final de Big Data"]),
        ],
    },
    {
        "slug": "cloud-computing",
        "title": "Cloud Computing",
        "category": "Tecnología",
        "color": "#3A86FF",
        "summary": "Aprende a desplegar, escalar y asegurar aplicaciones en la nube con AWS, Azure y Google Cloud, contenedores e infraestructura como código.",
        "modules": [
            ("Fundamentos de la nube", ["Qué es la computación en la nube", "Modelos IaaS, PaaS y SaaS", "Nube pública, privada e híbrida", "Proveedores principales", "Regiones y zonas", "Modelo de responsabilidad compartida", "Costos y facturación", "Cuentas y consolas", "CLI de la nube", "Linux para la nube", "Redes básicas en la nube", "Taller: primera máquina virtual"]),
            ("Servicios esenciales", ["Cómputo: máquinas virtuales", "Autoescalado", "Balanceadores de carga", "Almacenamiento de objetos", "Almacenamiento en bloque", "Bases de datos gestionadas", "Redes virtuales", "DNS y CDN", "Identidad y accesos", "Monitoreo y logs", "Copias de seguridad", "Taller: sitio web escalable"]),
            ("Contenedores y serverless", ["Docker", "Imágenes y registros", "Docker Compose", "Kubernetes", "Pods y servicios", "Despliegues en Kubernetes", "Kubernetes gestionado", "Funciones serverless", "API Gateway", "Eventos y colas", "Arquitecturas serverless", "Taller: API en contenedores"]),
            ("DevOps e infraestructura como código", ["Cultura DevOps", "Git y flujos de trabajo", "CI/CD", "GitHub Actions", "Terraform", "Gestión de configuración", "Observabilidad", "Despliegues azul-verde", "Gestión de secretos", "SRE", "FinOps", "Taller: pipeline de despliegue"]),
            ("Seguridad y arquitectura", ["Seguridad en la nube", "Cifrado", "Cumplimiento normativo", "Alta disponibilidad", "Recuperación ante desastres", "Arquitectura bien diseñada", "Multinube", "Migración a la nube", "IA en la nube", "Certificaciones cloud", "Optimización de costos", "Proyecto final cloud"]),
        ],
    },
    {
        "slug": "administracion-hotelera-y-turistica",
        "title": "Administración Hotelera y Turística",
        "category": "Negocios",
        "color": "#B7950B",
        "summary": "Gestiona hoteles, restaurantes y destinos turísticos con enfoque en servicio, operaciones, revenue management y tecnología.",
        "modules": [
            ("Fundamentos del turismo", ["Qué es el turismo", "Historia del turismo", "Tipos de turismo", "Sistema turístico", "Turismo en Colombia", "Destinos del Huila", "Actores del sector", "Normatividad turística", "Registro Nacional de Turismo", "Turismo sostenible", "Tendencias del viajero", "Taller: inventario turístico local"]),
            ("Operación hotelera", ["Estructura de un hotel", "Clasificación hotelera", "Recepción y front desk", "Reservas", "Check-in y check-out", "Ama de llaves", "Mantenimiento", "Seguridad hotelera", "Software hotelero PMS", "Atención de quejas", "Indicadores operativos", "Taller: manual de recepción"]),
            ("Alimentos y bebidas", ["Operación de restaurantes", "Tipos de servicio", "Diseño de carta", "Costeo de recetas", "Manipulación de alimentos", "Bar y bebidas", "Eventos y banquetes", "Control de inventarios", "Gastronomía colombiana", "Servicio al cliente en A&B", "Tecnología en restaurantes", "Taller: carta de un restaurante"]),
            ("Gestión y comercialización", ["Administración hotelera", "Revenue management", "Precios dinámicos", "Canales de distribución", "OTAs", "Marketing turístico", "Marketing digital", "Reputación online", "Fidelización", "Finanzas hoteleras", "Talento humano", "Taller: plan de mercadeo"]),
            ("Innovación y emprendimiento", ["Experiencia del huésped", "Calidad y certificaciones", "Hoteles inteligentes", "Robótica en hotelería", "Turismo de naturaleza", "Turismo comunitario", "Ecoturismo", "Plan de negocio turístico", "Gestión de proyectos turísticos", "Legislación y contratos", "Liderazgo", "Proyecto final hotelero"]),
        ],
    },
]



def _merge() -> None:
    """Une los módulos avanzados y cierra el nivel básico con un proyecto integrador."""
    from .catalog_avanzado import ADVANCED_MODULES
    from .fuentes import SOURCES

    for c in COURSES:
        title5, topics5 = c["modules"][4]
        topics5 = [t.replace("Proyecto final", "Proyecto integrador").replace("Reto final de 30 días", "Reto de 30 días") for t in topics5]
        c["modules"][4] = (title5, topics5)
        if len(c["modules"]) == 5:
            c["modules"].extend(ADVANCED_MODULES[c["slug"]])
        c["sources"] = SOURCES.get(c["slug"], [])


_merge()

def lesson_content(course_title: str, module_title: str, topic_title: str, topic_number: int) -> str:
    """Plantilla base de cada lección (Markdown). Reemplázala por el contenido real desde el panel de administración."""
    return f"""## {topic_title}

Bienvenido al tema {topic_number} del módulo **{module_title}** del curso **{course_title}**.

### Objetivo de aprendizaje
Al terminar esta lección comprenderás los fundamentos de «{topic_title}», su papel dentro del curso de {course_title} y cómo aplicarlo en una situación real.

### Conceptos clave
1. **Definición:** el significado y el alcance de «{topic_title}».
2. **Importancia:** su relación con el resto del módulo «{module_title}».
3. **Aplicación:** ejemplos prácticos en el entorno laboral y cotidiano.

### Desarrollo
Lee el material, toma notas de las ideas principales y relaciónalas con lo que viste en los temas anteriores. Si algo no queda claro, repasa el tema anterior antes de continuar.

### Actividad práctica
Escribe un ejemplo propio relacionado con «{topic_title}» y compártelo con la comunidad de Orion Nova Academy.

### Autoevaluación
- ¿Puedo explicar este tema con mis propias palabras?
- ¿Sé dónde aplicarlo?
- ¿Qué duda me queda para investigar?
"""
