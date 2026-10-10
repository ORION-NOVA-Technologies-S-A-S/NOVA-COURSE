# NOVA COURSE · Orion Nova Academy

CURSOS DE NOVA GRATUITO Y CON SUSCRIPCIÓN

Plataforma de cursos de **ORION NOVA TECHNOLOGIES**: 15 cursos, 5 módulos por curso y 12 temas por módulo (900 temas).
Los módulos 1, 2 y 3 son gratis. Los módulos 4 y 5 y el certificado se pagan.

| Parte | Tecnología |
|---|---|
| Web (frontend) | React + TypeScript (Vite) |
| Servidor (backend) | Python + FastAPI: pagos Wompi y certificado PDF |
| Base de datos | PostgreSQL en Supabase (proyecto **NOVA COURSE**) |

Supabase guarda las cuentas, los cursos, las lecciones y el avance. Las reglas de seguridad están dentro de la base de datos:
nadie ve los módulos 4 y 5 sin pagar, y solo el servidor Python puede activar un curso pagado.

---

## Paso 1. Cargar la base de datos (una sola vez)

En Supabase, entra al proyecto **NOVA COURSE** y ve a **SQL Editor → New query**.

1. Abre `supabase/01_esquema.sql`, copia todo, pégalo y pulsa **Run**.
2. Abre `supabase/02_cursos.sql`, copia todo, pégalo y pulsa **Run**. Al final debe mostrar `15 | 75 | 900 | 900`.

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

- **Módulos 1-3**: cualquier persona registrada ve el contenido.
- **Módulos 4-5**: solo quien tiene el plan `premium` en ese curso. Lo activa únicamente el servidor tras confirmar el pago con Wompi.
- **Certificado**: se emite al tener el curso pagado y los 60 temas marcados. Incluye código único y QR.
  Cualquiera puede verificarlo en `/verificar/CÓDIGO`.

## Agregar o cambiar cursos

Edita `backend/app/data/catalog.py` (cada curso: 5 módulos de 12 temas), ejecuta
`python scripts/generar_sql_cursos.py` y vuelve a correr `supabase/02_cursos.sql`.
Eso no borra el contenido que ya escribiste desde el panel de administración.

## Estructura

```
supabase/01_esquema.sql        tablas, seguridad y funciones
supabase/02_cursos.sql         15 cursos y 900 temas
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
