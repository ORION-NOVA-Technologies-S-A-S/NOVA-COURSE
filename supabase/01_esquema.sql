-- =====================================================================
-- ORION NOVA ACADEMY · Esquema para Supabase (PostgreSQL)
-- Pega este archivo completo en Supabase > SQL Editor y pulsa "Run".
-- Versión 2: 10 módulos por curso (1 a 5 gratis, 6 a 10 de pago) y fuentes por curso.
-- Después ejecuta 02_cursos.sql para cargar los 15 cursos y 900 temas.
-- Se puede ejecutar más de una vez sin dañar datos.
-- =====================================================================

-- ---------- Perfiles de estudiantes (ligados a Supabase Auth) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  document_id text,
  role        text not null default 'student' check (role in ('student', 'admin')),
  created_at  timestamptz not null default now()
);

-- Crea el perfil automáticamente cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, document_id)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'full_name', ''),
          nullif(new.raw_user_meta_data ->> 'document_id', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Catálogo ----------
create table if not exists public.courses (
  id           serial primary key,
  slug         text not null unique,
  title        text not null,
  category     text not null,
  color        text not null default '#4F6BED',
  summary      text not null,
  price_cop    integer not null check (price_cop >= 0),
  free_modules smallint not null default 5,
  sources      jsonb not null default '[]'::jsonb,
  is_published boolean not null default true
);

create table if not exists public.modules (
  id        serial primary key,
  course_id integer not null references public.courses (id) on delete cascade,
  position  smallint not null,
  title     text not null,
  unique (course_id, position)
);

-- Títulos de los temas: públicos (se ven en el temario aunque estén bloqueados)
create table if not exists public.topics (
  id        serial primary key,
  module_id integer not null references public.modules (id) on delete cascade,
  position  smallint not null check (position between 1 and 12),
  title     text not null,
  unique (module_id, position)
);

-- Contenido de los temas: protegido (gratis módulos 1-5, pago módulos 6-10)
create table if not exists public.topic_contents (
  topic_id  integer primary key references public.topics (id) on delete cascade,
  content   text not null,
  video_url text
);

-- ---------- Estudiantes ----------
create table if not exists public.enrollments (
  user_id     uuid not null references auth.users (id) on delete cascade,
  course_id   integer not null references public.courses (id) on delete cascade,
  plan        text not null default 'free' check (plan in ('free', 'premium')),
  created_at  timestamptz not null default now(),
  upgraded_at timestamptz,
  primary key (user_id, course_id)
);

create table if not exists public.topic_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  topic_id     integer not null references public.topics (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.payments (
  id             serial primary key,
  reference      text not null unique,
  user_id        uuid not null references auth.users (id) on delete cascade,
  course_id      integer not null references public.courses (id) on delete cascade,
  amount_cents   bigint not null,
  currency       text not null default 'COP',
  status         text not null default 'PENDING'
                 check (status in ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR')),
  provider       text not null default 'wompi',
  provider_tx_id text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.certificates (
  id           serial primary key,
  code         text not null unique,
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_id    integer not null references public.courses (id) on delete cascade,
  student_name text not null,
  document_id  text,
  hours        smallint not null default 120,
  issued_at    timestamptz not null default now(),
  unique (user_id, course_id)
);

-- ---------- Actualización a 10 módulos (sirve para bases creadas con la versión anterior) ----------
alter table public.courses add column if not exists sources jsonb not null default '[]'::jsonb;
alter table public.courses alter column free_modules set default 5;
alter table public.certificates alter column hours set default 120;
alter table public.modules drop constraint if exists modules_position_check;
alter table public.modules add constraint modules_position_check check (position between 1 and 10);

create index if not exists idx_modules_course on public.modules (course_id);
create index if not exists idx_topics_module on public.topics (module_id);
create index if not exists idx_progress_user on public.topic_progress (user_id);
create index if not exists idx_payments_user on public.payments (user_id);

-- ---------- Reglas de acceso ----------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ¿Puede el usuario actual ver este tema? Módulos 1-5: cualquier usuario registrado. 6-10: plan premium.
create or replace function public.can_access_topic(p_topic_id integer)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1
    from public.topics t
    join public.modules m on m.id = t.module_id
    join public.courses c on c.id = m.course_id
    where t.id = p_topic_id
      and (
        m.position <= c.free_modules
        or exists (select 1 from public.enrollments e
                   where e.user_id = auth.uid() and e.course_id = c.id and e.plan = 'premium')
        or public.is_admin()
      )
  );
$$;

alter table public.profiles       enable row level security;
alter table public.courses        enable row level security;
alter table public.modules        enable row level security;
alter table public.topics         enable row level security;
alter table public.topic_contents enable row level security;
alter table public.enrollments    enable row level security;
alter table public.topic_progress enable row level security;
alter table public.payments       enable row level security;
alter table public.certificates   enable row level security;

-- Catálogo visible para todos
drop policy if exists "catalogo cursos" on public.courses;
create policy "catalogo cursos" on public.courses for select to anon, authenticated
  using (is_published or public.is_admin());
drop policy if exists "catalogo modulos" on public.modules;
create policy "catalogo modulos" on public.modules for select to anon, authenticated using (true);
drop policy if exists "catalogo temas" on public.topics;
create policy "catalogo temas" on public.topics for select to anon, authenticated using (true);

-- Contenido según el plan
drop policy if exists "contenido segun plan" on public.topic_contents;
create policy "contenido segun plan" on public.topic_contents for select to authenticated
  using (public.can_access_topic(topic_id));

-- Administración de contenido y precios
drop policy if exists "admin edita contenido" on public.topic_contents;
create policy "admin edita contenido" on public.topic_contents for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin edita cursos" on public.courses;
create policy "admin edita cursos" on public.courses for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Perfil propio (el rol no se puede cambiar desde la web)
drop policy if exists "perfil propio ver" on public.profiles;
create policy "perfil propio ver" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "perfil propio editar" on public.profiles;
create policy "perfil propio editar" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from anon, authenticated;
grant update (full_name, document_id) on public.profiles to authenticated;

-- Inscripción gratuita propia (el plan premium solo lo activa el servidor de pagos)
drop policy if exists "inscripcion ver" on public.enrollments;
create policy "inscripcion ver" on public.enrollments for select to authenticated using (user_id = auth.uid());
drop policy if exists "inscripcion gratis" on public.enrollments;
create policy "inscripcion gratis" on public.enrollments for insert to authenticated
  with check (user_id = auth.uid() and plan = 'free' and upgraded_at is null);

-- Progreso propio, solo en temas a los que tiene acceso
drop policy if exists "progreso ver" on public.topic_progress;
create policy "progreso ver" on public.topic_progress for select to authenticated using (user_id = auth.uid());
drop policy if exists "progreso marcar" on public.topic_progress;
create policy "progreso marcar" on public.topic_progress for insert to authenticated
  with check (user_id = auth.uid() and public.can_access_topic(topic_id));

-- Pagos y certificados: solo lectura de los propios
drop policy if exists "pagos propios" on public.payments;
create policy "pagos propios" on public.payments for select to authenticated using (user_id = auth.uid());
drop policy if exists "certificados propios" on public.certificates;
create policy "certificados propios" on public.certificates for select to authenticated using (user_id = auth.uid());

grant select on public.courses, public.modules, public.topics to anon, authenticated;
grant select on public.topic_contents, public.enrollments, public.topic_progress,
                public.payments, public.certificates, public.profiles to authenticated;
grant insert on public.enrollments, public.topic_progress to authenticated;
grant update (content, video_url) on public.topic_contents to authenticated;
grant update (price_cop, is_published) on public.courses to authenticated;

-- ---------- Funciones que llama la web ----------

-- Mis cursos con avance
create or replace function public.my_courses()
returns table (slug text, title text, color text, category text, plan text,
               completed_topics bigint, total_topics bigint, certificate_code text)
language sql stable security definer set search_path = public as $$
  select c.slug, c.title, c.color, c.category, e.plan,
         (select count(*) from public.topic_progress tp
            join public.topics t on t.id = tp.topic_id
            join public.modules m on m.id = t.module_id
           where tp.user_id = e.user_id and m.course_id = c.id),
         (select count(*) from public.topics t join public.modules m on m.id = t.module_id
           where m.course_id = c.id),
         (select ce.code from public.certificates ce where ce.user_id = e.user_id and ce.course_id = c.id)
  from public.enrollments e
  join public.courses c on c.id = e.course_id
  where e.user_id = auth.uid()
  order by c.title;
$$;

-- Emite el certificado si el estudiante pagó y completó los 60 temas
create or replace function public.issue_certificate(p_course_slug text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_course integer;
  v_plan text;
  v_done bigint;
  v_total bigint;
  v_code text;
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if v_uid is null then raise exception 'Debes iniciar sesión'; end if;
  select id into v_course from public.courses where slug = p_course_slug;
  if v_course is null then raise exception 'Curso no encontrado'; end if;

  select code into v_code from public.certificates where user_id = v_uid and course_id = v_course;
  if v_code is not null then return v_code; end if;

  select plan into v_plan from public.enrollments where user_id = v_uid and course_id = v_course;
  if coalesce(v_plan, '') <> 'premium' then
    raise exception 'El certificado requiere el curso completo (módulos 6 a 10)';
  end if;

  select count(*) into v_total from public.topics t join public.modules m on m.id = t.module_id
   where m.course_id = v_course;
  select count(*) into v_done from public.topic_progress tp
    join public.topics t on t.id = tp.topic_id join public.modules m on m.id = t.module_id
   where tp.user_id = v_uid and m.course_id = v_course;
  if v_done < v_total then
    raise exception 'Te faltan % temas para obtener el certificado', v_total - v_done;
  end if;

  loop
    v_code := 'ONT-' || (select string_agg(substr(v_alphabet, 1 + floor(random() * 32)::int, 1), '')
                           from generate_series(1, 8));
    exit when not exists (select 1 from public.certificates where code = v_code);
  end loop;

  -- 1 hora por tema (10 módulos × 12 temas = 120 horas)
  insert into public.certificates (code, user_id, course_id, student_name, document_id, hours)
  select v_code, v_uid, v_course, p.full_name, p.document_id, least(v_total, 32000)::smallint
  from public.profiles p where p.id = v_uid;
  return v_code;
end $$;

-- Verificación pública de un certificado (cualquier persona o empresa)
create or replace function public.verify_certificate(p_code text)
returns table (code text, student text, course text, hours smallint, issued_at timestamptz)
language sql stable security definer set search_path = public as $$
  select ce.code, ce.student_name, c.title, ce.hours, ce.issued_at
  from public.certificates ce join public.courses c on c.id = ce.course_id
  where ce.code = upper(trim(p_code));
$$;

revoke execute on function public.my_courses() from public, anon;
revoke execute on function public.issue_certificate(text) from public, anon;
grant execute on function public.my_courses() to authenticated;
grant execute on function public.issue_certificate(text) to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;
grant execute on function public.can_access_topic(integer) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
