-- =====================================================================
-- NOVA COURSE · Pagos con el link de Wompi (Nequi, PSE, tarjetas, Bancolombia)
-- Funciona SIN el servidor de Python: la base de datos consulta directamente a Wompi.
--   1. El estudiante paga en el link de Wompi.
--   2. Escribe el número de la transacción en la plataforma.
--   3. La base de datos le pregunta a Wompi si ese pago está APROBADO, si es de tu link
--      y si el valor alcanza. Si todo cuadra, abre el curso completo al instante.
--      Si no se puede confirmar que sea de tu link, queda "en revisión" para que lo apruebes.
-- Pégalo en Supabase > SQL Editor y pulsa "Run". Se puede ejecutar varias veces.
-- =====================================================================

-- Extensión para que la base de datos pueda consultar la API de Wompi
create extension if not exists http with schema extensions;

begin;

-- ---------- Configuración (link de pago) ----------
create table if not exists public.settings (
  key   text primary key,
  value text not null
);
alter table public.settings enable row level security;
drop policy if exists "ajustes publicos" on public.settings;
create policy "ajustes publicos" on public.settings for select to anon, authenticated using (key like 'public_%');
grant select on public.settings to anon, authenticated;

insert into public.settings (key, value) values
  ('public_wompi_link_url', 'https://checkout.wompi.co/l/4CnTOr'),
  ('public_wompi_link_id',  '4CnTOr'),
  ('wompi_api_url',         'https://production.wompi.co/v1')
on conflict (key) do update set value = excluded.value;

-- ---------- Pagos: estado "en revisión" y datos de Wompi ----------
alter table public.payments add column if not exists customer_email text;
alter table public.payments add column if not exists payment_method text;
alter table public.payments add column if not exists reviewed_at timestamptz;
alter table public.payments drop constraint if exists payments_status_check;
alter table public.payments add constraint payments_status_check
  check (status in ('PENDING', 'REVIEW', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'));
create unique index if not exists payments_provider_tx_unique on public.payments (provider_tx_id) where provider_tx_id is not null;

-- Abre el curso completo
create or replace function public.grant_premium(p_user uuid, p_course integer)
returns void language sql security definer set search_path = public as $$
  insert into public.enrollments (user_id, course_id, plan, upgraded_at)
  values (p_user, p_course, 'premium', now())
  on conflict (user_id, course_id) do update set plan = 'premium', upgraded_at = now();
$$;
revoke all on function public.grant_premium(uuid, integer) from public, anon, authenticated;

-- ---------- El estudiante confirma su pago con el número de transacción ----------
create or replace function public.claim_wompi_payment(p_slug text, p_tx_id text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_uid uuid := auth.uid();
  v_course public.courses;
  v_tx text := trim(p_tx_id);
  v_prev public.payments;
  v_link text;
  v_api text;
  v_resp extensions.http_response;
  v_data jsonb;
  v_status text;
  v_amount bigint;
  v_ok_link boolean;
  v_new_status text;
begin
  if v_uid is null then raise exception 'Inicia sesión para confirmar tu pago'; end if;
  if v_tx !~ '^[A-Za-z0-9_-]{5,80}$' then raise exception 'Ese número de transacción no es válido. Cópialo tal como aparece en el comprobante de Wompi.'; end if;

  select * into v_course from public.courses where slug = p_slug and is_published;
  if not found then raise exception 'Curso no encontrado'; end if;

  if exists (select 1 from public.enrollments where user_id = v_uid and course_id = v_course.id and plan = 'premium') then
    return jsonb_build_object('status', 'approved', 'message', 'Ya tienes el curso completo.');
  end if;

  -- Un mismo pago no se puede usar dos veces
  select * into v_prev from public.payments where provider_tx_id = v_tx;
  if found then
    if v_prev.user_id = v_uid and v_prev.course_id = v_course.id then
      return jsonb_build_object('status', lower(v_prev.status), 'message', 'Ese pago ya está registrado.');
    end if;
    raise exception 'Ese pago ya fue usado para desbloquear otro curso.';
  end if;

  select value into v_link from public.settings where key = 'public_wompi_link_id';
  select value into v_api from public.settings where key = 'wompi_api_url';

  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT', '15');
  select * into v_resp from extensions.http_get(v_api || '/transactions/' || v_tx);
  if v_resp.status = 404 then raise exception 'No encontramos esa transacción en Wompi. Revisa el número.'; end if;
  if v_resp.status <> 200 then raise exception 'Wompi no respondió. Intenta de nuevo en un momento.'; end if;

  v_data := (v_resp.content::jsonb) -> 'data';
  v_status := v_data ->> 'status';
  v_amount := coalesce((v_data ->> 'amount_in_cents')::bigint, 0);

  if v_status = 'PENDING' then raise exception 'Wompi todavía está procesando tu pago. Espera un minuto y vuelve a intentarlo.'; end if;
  if v_status <> 'APPROVED' then raise exception 'Wompi reporta este pago como % (no aprobado).', v_status; end if;
  if coalesce(v_data ->> 'currency', 'COP') <> 'COP' or v_amount < v_course.price_cop::bigint * 100 then
    raise exception 'El valor pagado ($%) es menor que el precio del curso ($%).',
      replace(to_char(v_amount / 100, 'FM999,999,999'), ',', '.'), replace(to_char(v_course.price_cop, 'FM999,999,999'), ',', '.');
  end if;

  -- Si Wompi confirma que el pago entró por tu link, se aprueba solo; si no, queda en revisión
  v_ok_link := (v_data ->> 'payment_link_id') = v_link;
  v_new_status := case when v_ok_link then 'APPROVED' else 'REVIEW' end;

  insert into public.payments (reference, user_id, course_id, amount_cents, currency, status, provider, provider_tx_id,
                               customer_email, payment_method, updated_at)
  values ('LINK-' || v_tx, v_uid, v_course.id, v_amount, 'COP', v_new_status, 'wompi_link', v_tx,
          v_data ->> 'customer_email', v_data ->> 'payment_method_type', now());

  if v_ok_link then
    perform public.grant_premium(v_uid, v_course.id);
    return jsonb_build_object('status', 'approved', 'message', '¡Pago confirmado! Ya tienes el curso completo.');
  end if;
  return jsonb_build_object('status', 'review', 'message', 'Recibimos tu pago. Lo revisamos y te abrimos el curso en breve.');
end $$;
revoke all on function public.claim_wompi_payment(text, text) from public, anon;
grant execute on function public.claim_wompi_payment(text, text) to authenticated;

-- ---------- Administrador: pagos para revisar ----------
create or replace function public.admin_payments(p_only_review boolean default true)
returns table (id integer, created_at timestamptz, status text, student text, email text, course text,
               amount_cop bigint, method text, tx_id text, customer_email text)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Solo para administradores'; end if;
  return query
    select p.id, p.created_at, p.status, pr.full_name, u.email::text, c.title, p.amount_cents / 100, p.payment_method,
           p.provider_tx_id, p.customer_email
    from public.payments p
    join public.courses c on c.id = p.course_id
    join auth.users u on u.id = p.user_id
    left join public.profiles pr on pr.id = p.user_id
    where (not p_only_review) or p.status = 'REVIEW'
    order by p.created_at desc
    limit 100;
end $$;
revoke all on function public.admin_payments(boolean) from public, anon;
grant execute on function public.admin_payments(boolean) to authenticated;

create or replace function public.admin_review_payment(p_id integer, p_approve boolean)
returns text language plpgsql security definer set search_path = public as $$
declare v_pay public.payments;
begin
  if not public.is_admin() then raise exception 'Solo para administradores'; end if;
  select * into v_pay from public.payments where id = p_id for update;
  if not found then raise exception 'Pago no encontrado'; end if;
  update public.payments set status = case when p_approve then 'APPROVED' else 'DECLINED' end,
         reviewed_at = now(), updated_at = now()
   where id = p_id;
  if p_approve then perform public.grant_premium(v_pay.user_id, v_pay.course_id); end if;
  return case when p_approve then 'Aprobado: el curso quedó desbloqueado.' else 'Pago rechazado.' end;
end $$;
revoke all on function public.admin_review_payment(integer, boolean) from public, anon;
grant execute on function public.admin_review_payment(integer, boolean) to authenticated;

commit;

-- Comprobación: debe mostrar el link de pago
select value as link_de_pago from public.settings where key = 'public_wompi_link_url';
