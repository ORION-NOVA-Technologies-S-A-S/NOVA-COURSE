-- =====================================================================
-- NOVA COURSE · Perfil con foto
-- Agrega foto, teléfono y "sobre mí" al perfil, y crea el espacio "avatars"
-- donde cada persona guarda su foto. Pégalo en Supabase > SQL Editor y pulsa "Run".
-- Se puede ejecutar varias veces sin problema.
-- =====================================================================
begin;

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists bio text;

alter table public.profiles drop constraint if exists profiles_bio_len;
alter table public.profiles add constraint profiles_bio_len check (bio is null or char_length(bio) <= 500);
alter table public.profiles drop constraint if exists profiles_phone_len;
alter table public.profiles add constraint profiles_phone_len check (phone is null or char_length(phone) <= 30);

-- Cada persona edita solo estos datos de su perfil (el rol sigue bloqueado)
revoke update on public.profiles from anon, authenticated;
grant update (full_name, document_id, avatar_url, phone, bio) on public.profiles to authenticated;

-- Espacio público de fotos de perfil: máximo 2 MB, solo imágenes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Cada persona solo puede subir, cambiar o borrar fotos dentro de su propia carpeta (su id)
drop policy if exists "avatar propio ver" on storage.objects;
create policy "avatar propio ver" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar propio subir" on storage.objects;
create policy "avatar propio subir" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar propio cambiar" on storage.objects;
create policy "avatar propio cambiar" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar propio borrar" on storage.objects;
create policy "avatar propio borrar" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

commit;

-- Comprobación: debe mostrar "avatars | true"
select id, public from storage.buckets where id = 'avatars';
