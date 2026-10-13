-- =====================================================================
-- NOVA COURSE · 06 · Niveles A1-C2 y certificados por nivel y por módulo
-- Pega este archivo en Supabase > SQL Editor y pulsa "Run".
-- Ejecútalo ANTES de volver a ejecutar 02_cursos_parte2_idiomas.sql (que ahora trae los módulos 11 y 12 de C2).
-- Se puede ejecutar varias veces sin dañar nada.
--
--  · Idiomas: certificado por nivel (A1, A2, B1, B2, C1, C2). Se gana al terminar
--    los temas de los módulos de ese nivel y aprobar las clases con NOVA del nivel.
--  · Demás cursos: certificado por módulo. Se gana al terminar los 12 temas del
--    módulo y aprobar el repaso con NOVA de ese módulo (70 % o más).
--  · El certificado del curso completo sigue igual.
-- =====================================================================
begin;

-- ---------- 1. Hasta 12 módulos por curso (C2 = módulos 11 y 12 de idiomas) ----------
alter table public.modules drop constraint if exists modules_position_check;
alter table public.modules add constraint modules_position_check check (position between 1 and 12);

-- ---------- 2. Certificados con alcance: curso, nivel o módulo ----------
alter table public.certificates add column if not exists scope text not null default 'course';
alter table public.certificates add column if not exists scope_key text not null default '';
alter table public.certificates add column if not exists scope_label text;
alter table public.certificates drop constraint if exists certificates_scope_check;
alter table public.certificates add constraint certificates_scope_check check (scope in ('course', 'level', 'module'));
alter table public.certificates drop constraint if exists certificates_user_id_course_id_key;
create unique index if not exists certificates_user_course_scope
  on public.certificates (user_id, course_id, scope, scope_key);

-- ---------- 3. Clases con NOVA aprobadas ----------
create table if not exists public.class_progress (
  user_id   uuid not null references auth.users (id) on delete cascade,
  course_id integer not null references public.courses (id) on delete cascade,
  activity  text not null,          -- 'saludar', 'b1-di', 'lsc-a1', 'modulo-3'…
  level     text,                   -- 'A1'…'C2' o null
  score     smallint not null,
  total     smallint not null,
  passed_at timestamptz not null default now(),
  primary key (user_id, course_id, activity)
);
alter table public.class_progress enable row level security;
drop policy if exists "clases propias" on public.class_progress;
create policy "clases propias" on public.class_progress for select to authenticated using (user_id = auth.uid());
revoke all on public.class_progress from anon;
grant select on public.class_progress to authenticated;

-- ---------- 4. Funciones de apoyo ----------
-- Nivel de un módulo de idioma según su título ("A1 · Primeros pasos" → 'A1')
create or replace function public.module_level(p_title text)
returns text language sql immutable as $$
  select substring(p_title from '^(A1|A2|B1|B2|C1|C2)\s*·');
$$;

-- Nombre del nivel
create or replace function public.level_name(p_level text)
returns text language sql immutable as $$
  select case when p_level in ('A1', 'A2') then 'Básico'
              when p_level in ('B1', 'B2') then 'Intermedio'
              when p_level in ('C1', 'C2') then 'Avanzado' end;
$$;

-- Clases con NOVA que hay que aprobar en cada nivel
create or replace function public.level_activities(p_lang text, p_level text)
returns text[] language sql immutable as $$
  select case
    when p_lang = 'lsc' then array['lsc-' || lower(p_level)]
    when p_level = 'A1' then array['saludar', 'presentarte', 'numeros', 'familia', 'dias', 'colores']
    when p_level = 'A2' then array['cafeteria', 'restaurante', 'viaje', 'tiempo']
    when p_level in ('B1', 'B2', 'C1', 'C2') then array[lower(p_level) || '-di', lower(p_level) || '-repite']
    else array[]::text[] end;
$$;

-- Código único del certificado
create or replace function public.new_certificate_code()
returns text language plpgsql volatile set search_path = public as $$
declare
  v_code text;
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  loop
    v_code := 'ONT-' || (select string_agg(substr(v_alphabet, 1 + floor(random() * 32)::int, 1), '')
                           from generate_series(1, 8));
    exit when not exists (select 1 from public.certificates where code = v_code);
  end loop;
  return v_code;
end $$;

-- ---------- 5. Guardar una clase aprobada ----------
create or replace function public.record_class_pass(p_slug text, p_activity text, p_level text, p_score integer, p_total integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_course record;
  v_pos integer;
  v_plan text;
begin
  if v_uid is null then raise exception 'Debes iniciar sesión'; end if;
  select id, lang, free_modules into v_course from public.courses where slug = p_slug;
  if v_course.id is null then raise exception 'Curso no encontrado'; end if;
  if p_activity !~ '^[a-z0-9-]{1,40}$' then raise exception 'Actividad no válida'; end if;
  if p_level is not null and p_level not in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') then raise exception 'Nivel no válido'; end if;
  if p_total is null or p_total < 1 or p_total > 200 or p_score is null or p_score < 0 or p_score > p_total then
    raise exception 'Resultado no válido';
  end if;

  if p_activity ~ '^modulo-[0-9]+$' then
    -- Repaso de un módulo: 70 % o más, y el módulo debe estar disponible para el estudiante
    v_pos := substring(p_activity from '[0-9]+')::integer;
    if not exists (select 1 from public.modules where course_id = v_course.id and position = v_pos) then
      raise exception 'Módulo no encontrado';
    end if;
    select plan into v_plan from public.enrollments where user_id = v_uid and course_id = v_course.id;
    if v_pos > v_course.free_modules and coalesce(v_plan, '') <> 'premium' then
      raise exception 'Este módulo es premium';
    end if;
    if p_score * 100 < p_total * 70 then
      raise exception 'Necesitas 70 %% o más para aprobar el repaso (sacaste % de %)', p_score, p_total;
    end if;
  elsif p_activity ~ '^lsc-' then
    if p_score * 10 < p_total * 7 then
      raise exception 'Necesitas 7 de 10 señas bien hechas para aprobar';
    end if;
  end if;

  insert into public.class_progress as cp (user_id, course_id, activity, level, score, total)
  values (v_uid, v_course.id, p_activity, p_level, p_score, p_total)
  on conflict (user_id, course_id, activity) do update
    set score = greatest(cp.score, excluded.score), total = excluded.total,
        level = coalesce(excluded.level, cp.level), passed_at = now()
    where excluded.score * cp.total >= cp.score * excluded.total;
  return true;
end $$;

-- ---------- 6. Avance por nivel (idiomas) ----------
create or replace function public.level_status(p_slug text)
returns table (level text, level_name text, first_module smallint, last_module smallint,
               topics_total bigint, topics_done bigint, activities_required text[], activities_done text[],
               needs_premium boolean, certificate_code text)
language sql stable security definer set search_path = public as $$
  with c as (select id, lang, free_modules from public.courses where slug = p_slug),
  e as (select plan from public.enrollments, c where user_id = auth.uid() and course_id = c.id),
  m as (
    select public.module_level(mo.title) as level, mo.id, mo.position
    from public.modules mo, c where mo.course_id = c.id and public.module_level(mo.title) is not null
  )
  select l.level, public.level_name(l.level), min(m.position)::smallint, max(m.position)::smallint,
         (select count(*) from public.topics t where t.module_id = any (array_agg(m.id))),
         (select count(*) from public.topic_progress tp join public.topics t on t.id = tp.topic_id
           where tp.user_id = auth.uid() and t.module_id = any (array_agg(m.id))),
         public.level_activities((select lang from c), l.level),
         array(select cp.activity from public.class_progress cp, c
                where cp.user_id = auth.uid() and cp.course_id = c.id
                  and cp.activity = any (public.level_activities(c.lang, l.level))),
         max(m.position) > (select free_modules from c) and coalesce((select plan from e), '') <> 'premium',
         (select ce.code from public.certificates ce, c
           where ce.user_id = auth.uid() and ce.course_id = c.id and ce.scope = 'level' and ce.scope_key = l.level)
  from (select distinct level from m) l join m on m.level = l.level
  group by l.level
  order by l.level;
$$;

-- ---------- 7. Certificado de un nivel ----------
create or replace function public.issue_level_certificate(p_slug text, p_level text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_st record;
  v_course record;
  v_name text;
  v_doc text;
  v_code text;
  v_missing text[];
begin
  if v_uid is null then raise exception 'Debes iniciar sesión'; end if;
  select id, title, lang into v_course from public.courses where slug = p_slug;
  if v_course.id is null or v_course.lang is null then raise exception 'Este curso no tiene niveles'; end if;

  select code into v_code from public.certificates
   where user_id = v_uid and course_id = v_course.id and scope = 'level' and scope_key = p_level;
  if v_code is not null then return v_code; end if;

  select * into v_st from public.level_status(p_slug) s where s.level = p_level;
  if v_st.level is null then raise exception 'Nivel no encontrado'; end if;
  if v_st.needs_premium then
    raise exception 'El nivel % está en los módulos premium: desbloquea el curso completo', p_level;
  end if;
  if v_st.topics_done < v_st.topics_total then
    raise exception 'Te faltan % temas del nivel % (módulos % a %)', v_st.topics_total - v_st.topics_done, p_level,
      v_st.first_module, v_st.last_module;
  end if;
  v_missing := array(select a from unnest(v_st.activities_required) a where a <> all (v_st.activities_done));
  if cardinality(v_missing) > 0 then
    raise exception 'Te faltan % clases con NOVA del nivel %', cardinality(v_missing), p_level;
  end if;

  select nullif(trim(full_name), ''), document_id into v_name, v_doc from public.profiles where id = v_uid;
  if v_name is null then raise exception 'Escribe tu nombre completo en tu perfil para emitir el certificado'; end if;

  v_code := public.new_certificate_code();
  insert into public.certificates (code, user_id, course_id, student_name, document_id, hours, scope, scope_key, scope_label)
  values (v_code, v_uid, v_course.id, v_name, v_doc, least(v_st.topics_total, 32000)::smallint, 'level', p_level,
          'Nivel ' || p_level || ' · ' || public.level_name(p_level));
  return v_code;
end $$;

-- ---------- 8. Avance por módulo (todos los cursos) ----------
create or replace function public.module_status(p_slug text)
returns table (pos smallint, title text, unlocked boolean, topics_total bigint, topics_done bigint,
               review_score smallint, review_total smallint, certificate_code text)
language sql stable security definer set search_path = public as $$
  with c as (select id, free_modules from public.courses where slug = p_slug),
  e as (select plan from public.enrollments, c where user_id = auth.uid() and course_id = c.id)
  select mo.position, mo.title,
         mo.position <= c.free_modules or coalesce((select plan from e), '') = 'premium',
         (select count(*) from public.topics t where t.module_id = mo.id),
         (select count(*) from public.topic_progress tp join public.topics t on t.id = tp.topic_id
           where tp.user_id = auth.uid() and t.module_id = mo.id),
         cp.score, cp.total,
         (select ce.code from public.certificates ce
           where ce.user_id = auth.uid() and ce.course_id = c.id and ce.scope = 'module' and ce.scope_key = mo.position::text)
  from c join public.modules mo on mo.course_id = c.id
  left join public.class_progress cp on cp.user_id = auth.uid() and cp.course_id = c.id and cp.activity = 'modulo-' || mo.position
  order by mo.position;
$$;

-- ---------- 9. Certificado de un módulo ----------
create or replace function public.issue_module_certificate(p_slug text, p_position integer)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_course integer;
  v_st record;
  v_name text;
  v_doc text;
  v_code text;
begin
  if v_uid is null then raise exception 'Debes iniciar sesión'; end if;
  select id into v_course from public.courses where slug = p_slug;
  if v_course is null then raise exception 'Curso no encontrado'; end if;

  select code into v_code from public.certificates
   where user_id = v_uid and course_id = v_course and scope = 'module' and scope_key = p_position::text;
  if v_code is not null then return v_code; end if;

  select * into v_st from public.module_status(p_slug) s where s.pos = p_position;
  if v_st.pos is null then raise exception 'Módulo no encontrado'; end if;
  if not v_st.unlocked then raise exception 'El módulo % es premium: desbloquea el curso completo', p_position; end if;
  if v_st.topics_done < v_st.topics_total then
    raise exception 'Te faltan % temas del módulo %', v_st.topics_total - v_st.topics_done, p_position;
  end if;
  if v_st.review_score is null then
    raise exception 'Aprueba el repaso con NOVA del módulo % (70 %% o más)', p_position;
  end if;

  select nullif(trim(full_name), ''), document_id into v_name, v_doc from public.profiles where id = v_uid;
  if v_name is null then raise exception 'Escribe tu nombre completo en tu perfil para emitir el certificado'; end if;

  v_code := public.new_certificate_code();
  insert into public.certificates (code, user_id, course_id, student_name, document_id, hours, scope, scope_key, scope_label)
  values (v_code, v_uid, v_course, v_name, v_doc, least(v_st.topics_total, 32000)::smallint, 'module', p_position::text,
          'Módulo ' || p_position || ': ' || v_st.title);
  return v_code;
end $$;

-- ---------- 10. Mis certificados ----------
create or replace function public.my_certificates()
returns table (code text, course_slug text, course_title text, scope text, scope_key text, scope_label text,
               hours smallint, issued_at timestamptz)
language sql stable security definer set search_path = public as $$
  select ce.code, c.slug, c.title, ce.scope, ce.scope_key, ce.scope_label, ce.hours, ce.issued_at
  from public.certificates ce join public.courses c on c.id = ce.course_id
  where ce.user_id = auth.uid()
  order by c.title, case ce.scope when 'level' then 1 when 'module' then 2 else 3 end,
           ce.scope_key;
$$;

-- ---------- 11. El certificado del curso completo y "Mis cursos" solo miran el de curso ----------
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
         (select ce.code from public.certificates ce
           where ce.user_id = e.user_id and ce.course_id = c.id and ce.scope = 'course')
  from public.enrollments e
  join public.courses c on c.id = e.course_id
  where e.user_id = auth.uid()
  order by c.title;
$$;

create or replace function public.issue_certificate(p_course_slug text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_course integer;
  v_plan text;
  v_done bigint;
  v_total bigint;
  v_code text;
  v_name text;
  v_doc text;
begin
  if v_uid is null then raise exception 'Debes iniciar sesión'; end if;
  select id into v_course from public.courses where slug = p_course_slug;
  if v_course is null then raise exception 'Curso no encontrado'; end if;

  select code into v_code from public.certificates where user_id = v_uid and course_id = v_course and scope = 'course';
  if v_code is not null then return v_code; end if;

  select plan into v_plan from public.enrollments where user_id = v_uid and course_id = v_course;
  if coalesce(v_plan, '') <> 'premium' then
    raise exception 'El certificado del curso completo requiere desbloquear los módulos 6 en adelante';
  end if;

  select count(*) into v_total from public.topics t join public.modules m on m.id = t.module_id
   where m.course_id = v_course;
  select count(*) into v_done from public.topic_progress tp
    join public.topics t on t.id = tp.topic_id join public.modules m on m.id = t.module_id
   where tp.user_id = v_uid and m.course_id = v_course;
  if v_done < v_total then
    raise exception 'Te faltan % temas para obtener el certificado', v_total - v_done;
  end if;

  select nullif(trim(full_name), ''), document_id into v_name, v_doc from public.profiles where id = v_uid;
  if v_name is null then raise exception 'Escribe tu nombre completo en tu perfil para emitir el certificado'; end if;

  v_code := public.new_certificate_code();
  -- 1 hora por tema
  insert into public.certificates (code, user_id, course_id, student_name, document_id, hours, scope, scope_key)
  values (v_code, v_uid, v_course, v_name, v_doc, least(v_total, 32000)::smallint, 'course', '');
  return v_code;
end $$;

-- ---------- 12. Verificación pública: ahora dice qué certifica (curso, nivel o módulo) ----------
drop function if exists public.verify_certificate(text);
create function public.verify_certificate(p_code text)
returns table (code text, student text, course text, hours smallint, issued_at timestamptz,
               scope text, scope_label text, course_slug text)
language sql stable security definer set search_path = public as $$
  select ce.code, ce.student_name, c.title, ce.hours, ce.issued_at, ce.scope, ce.scope_label, c.slug
  from public.certificates ce join public.courses c on c.id = ce.course_id
  where ce.code = upper(trim(p_code));
$$;

-- ---------- 13. Permisos ----------
revoke execute on function public.record_class_pass(text, text, text, integer, integer) from public, anon;
revoke execute on function public.level_status(text) from public, anon;
revoke execute on function public.issue_level_certificate(text, text) from public, anon;
revoke execute on function public.module_status(text) from public, anon;
revoke execute on function public.issue_module_certificate(text, integer) from public, anon;
revoke execute on function public.my_certificates() from public, anon;
revoke execute on function public.new_certificate_code() from public, anon, authenticated;
revoke execute on function public.my_courses() from public, anon;
revoke execute on function public.issue_certificate(text) from public, anon;
grant execute on function public.record_class_pass(text, text, text, integer, integer) to authenticated;
grant execute on function public.level_status(text) to authenticated;
grant execute on function public.issue_level_certificate(text, text) to authenticated;
grant execute on function public.module_status(text) to authenticated;
grant execute on function public.issue_module_certificate(text, integer) to authenticated;
grant execute on function public.my_certificates() to authenticated;
grant execute on function public.my_courses() to authenticated;
grant execute on function public.issue_certificate(text) to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

commit;

-- Comprobación: debe mostrar la columna "scope" y la tabla de clases
select count(*) as certificados, count(*) filter (where scope = 'course') as de_curso,
       (select count(*) from public.class_progress) as clases_aprobadas
from public.certificates;
