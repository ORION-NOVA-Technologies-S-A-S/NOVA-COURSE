# NOVA COURSE · Orion Nova Academy

CURSOS DE NOVA GRATUITO Y CON SUSCRIPCIÓN

Plataforma de cursos de **ORION NOVA TECHNOLOGIES**: 168 cursos (137 generales y 31 de idiomas), 10 módulos por curso y 12 temas por módulo (20.160 temas, 120 horas por curso).
Los módulos 1 al 5 son gratis. Los módulos 6 al 10 y el certificado (120 horas) se pagan.
**Idiomas:** 30 idiomas (A1 a C1) y la Lengua de Señas Colombiana, con práctica de escucha, lectura, dictado y pronunciación con la voz de NOVA (`backend/app/data/idiomas.py` y `frontend/src/idiomas/`).
Cada curso tiene una sección de **Fuentes y referencias** con documentos oficiales verificados (`backend/app/data/fuentes.py`).

| Parte | Tecnología |
|---|---|
| Web (frontend) | React + TypeScript (Vite) |
| Servidor (backend) | Python + FastAPI: pagos Wompi y certificado PDF |
| Base de datos | PostgreSQL en Supabase (proyecto **NOVA COURSE**) |

Supabase guarda las cuentas, los cursos, las lecciones y el avance. Las reglas de seguridad están dentro de la base de datos:
nadie ve los módulos 6 al 10 sin pagar, y solo el servidor Python puede activar un curso pagado.

---

## Paso 1. Cargar la base de datos (una sola vez)

En Supabase, entra al proyecto **NOVA COURSE** y ve a **SQL Editor → New query**.

1. Abre `supabase/01_esquema.sql`, copia todo, pégalo y pulsa **Run**.
2. Abre `supabase/02_cursos_parte1.sql` (cursos generales), cópialo, pégalo y pulsa **Run**.
3. Abre `supabase/02_cursos_parte2_idiomas.sql` (idiomas), cópialo, pégalo y pulsa **Run**.
4. Abre `supabase/02_cursos_parte3.sql` (datos, educación e ingeniería) y pulsa **Run**.
5. Abre `supabase/02_cursos_parte4.sql` (negocios, salud, deporte y tecnología) y pulsa **Run**. Al final debe mostrar `168 | 1680 | 20160 | 20160 | 443`.

## Actualizar una base ya creada

6. Abre `supabase/04_perfil.sql` y pulsa **Run** (activa la foto de perfil). Debe mostrar `avatars | true`.
7. Abre `supabase/05_pagos_wompi_link.sql` y pulsa **Run** (pagos con tu link de Wompi). Debe mostrar el link de pago.

Si ya tenías cargadas las partes 1 y 2, basta con ejecutar **02_cursos_parte3.sql** y **02_cursos_parte4.sql**. Todos los archivos se pueden volver a correr sin duplicar nada.
No se pierden usuarios, avances, pagos ni certificados.

## Paso 2. Configurar el registro de usuarios

En Supabase ve a **Authentication → URL Configuration**:
- **Site URL**: la dirección de tu web (por ejemplo `https://nova-course.onrender.com`).
- **Redirect URLs**: agrega esa misma dirección con `/**` al final, y `http://localhost:5173/**` para pruebas.

Supabase pide confirmar el correo al registrarse. El correo gratuito de Supabase envía pocos mensajes por hora;
para mucho tráfico configura tu propio correo en **Authentication → Emails → SMTP Settings**.

## Paso 3. Probar en tu computador

Necesitas **Node.js 20+** y **Python 3.11+**.

```bash
# Web
cd frontend
npm install
npm run dev            # abre http://localhost:5173
```

El archivo `frontend/.env` ya tiene la URL y la publishable key de NOVA COURSE.
Con eso ya funcionan: registro, ingreso, catálogo, lecciones gratis, avance y verificación de certificados.

Para pagos y PDF del certificado, en otra terminal:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate     Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env    # Mac/Linux: cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

En `backend/.env` completa **DATABASE_URL**: en Supabase pulsa **Connect** (arriba), elige **Session pooler**,
copia la dirección y cambia `[YOUR-PASSWORD]` por la contraseña de la base de datos de NOVA COURSE.
**Esa dirección es privada**: nunca la pongas en la web ni la compartas.

## Paso 4. Hacerte administrador

1. Regístrate en la web con tu correo.
2. Abre `supabase/03_administrador.sql`, cambia el correo por el tuyo y ejecútalo en el **SQL Editor**.
3. Vuelve a entrar a la web: aparece el menú **Admin**, donde escribes el contenido real de cada tema,
   agregas el video de YouTube y cambias el precio de cada curso.

## Paso 5. Publicar en internet (gratis en Render)

1. Sube esta carpeta a un repositorio de GitHub (por ejemplo en la organización de Orion Nova).
2. Entra a [render.com](https://render.com) → **New → Blueprint** → elige el repositorio. El archivo `render.yaml` crea:
   - `nova-course`: la web.
   - `nova-course-api`: el servidor Python.
3. Render te pedirá `DATABASE_URL` (la del paso 3). Las llaves de Wompi puedes dejarlas vacías por ahora.
4. Si Render te da otras direcciones, actualiza `FRONTEND_URL`, `CORS_ORIGINS` y `VITE_API_URL`, y la **Site URL** de Supabase.

En el plan gratis de Render el servidor de pagos "se duerme" sin visitas y tarda unos 50 segundos en despertar.
La web y las lecciones no se ven afectadas, porque funcionan directo con Supabase.

## Paso 6. Cobrar de verdad con Wompi

1. Crea tu cuenta de comercio en Wompi y ve a **Desarrolladores**.
2. En el servidor pon `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET` y `WOMPI_EVENTS_SECRET`.
3. En Wompi, URL de eventos: `https://nova-course-api.onrender.com/api/payments/wompi/webhook`.
4. Prueba con las llaves de prueba (`pub_test_…`). Para producción usa `WOMPI_API_URL=https://production.wompi.co/v1`
   y `PAYMENTS_DEMO_MODE=false`.

Mientras no haya llaves de Wompi, el botón de pago abre un **modo de prueba** que simula un pago aprobado.

---

## Cómo funcionan las reglas

- **Módulos 1-5**: cualquier persona registrada ve el contenido.
- **Módulos 6-10**: solo quien tiene el plan `premium` en ese curso. Lo activa únicamente el servidor tras confirmar el pago con Wompi.
- **Certificado**: se emite al tener el curso pagado y los 120 temas marcados (120 horas). Incluye código único y QR.
  Cualquiera puede verificarlo en `/verificar/CÓDIGO`.

## Idiomas

- 30 idiomas + Lengua de Señas Colombiana, cada uno con 10 módulos: A1-A2 gratis (módulos 1-5) y B1-C1 de pago (módulos 6-10).
- En las lecciones de los módulos 1 a 5 hay práctica con 40 frases esenciales por idioma (`frontend/src/idiomas/frases.ts`):
  tarjetas con voz, «Escucha y elige», «Lee y elige», dictado (idiomas con alfabeto latino) y «Repítelo en voz alta» con el micrófono.
- Para agregar frases a cualquier tema (por ejemplo, en los módulos 6 a 10), escribe en el contenido desde el panel de administrador:

  ```
  ### Práctica
  - I would like a coffee | Quisiera un café
  - Could you help me? | ¿Podrías ayudarme?
  ```

- La voz depende del navegador: Chrome y Edge traen voces para casi todos los idiomas; en Android se instalan en Ajustes → Texto a voz.
- Los videos (YouTube) se agregan por tema desde el panel de administrador. En Lengua de Señas Colombiana el video es indispensable.
- Recomendación: que un hablante nativo revise las frases de cada idioma.

## Agregar o cambiar cursos

Edita `backend/app/data/catalog.py` (módulos 1-5), `catalog_avanzado.py` (módulos 6-10) o `fuentes.py`, ejecuta
`python scripts/generar_sql_cursos.py` y vuelve a correr los archivos `supabase/02_cursos_parte*.sql`.
Eso no borra el contenido que ya escribiste desde el panel de administración.

## Estructura

```
supabase/01_esquema.sql        tablas, seguridad y funciones
supabase/02_cursos_parte1.sql  cursos generales
supabase/02_cursos_parte2_idiomas.sql  cursos de idiomas
supabase/02_cursos_parte3.sql  datos, educación e ingeniería
supabase/02_cursos_parte4.sql  negocios, salud, deporte y tecnología
supabase/03_administrador.sql  convertir tu cuenta en administrador
frontend/                      web React + TypeScript
backend/                       servidor Python (FastAPI): pagos Wompi y PDF
render.yaml                    publicación en Render
```

## Versión publicada en GitHub Pages

La carpeta `docs/` tiene la web ya compilada, lista para GitHub Pages
(**Settings → Pages → Deploy from a branch → main → /docs**).
Funcionan: registro, ingreso, catálogo, lecciones gratis, avance y verificación de certificados.
Los pagos y el PDF del certificado se activan cuando se publique el servidor Python (paso 5) y se recompile la web
con `VITE_API_URL` apuntando a él.
Recuerda agregar la dirección de GitHub Pages con `/**` al final en Supabase → Authentication → URL Configuration.
