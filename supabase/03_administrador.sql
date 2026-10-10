-- Convierte tu cuenta en ADMINISTRADOR (para editar temas, videos y precios).
-- 1) Primero regístrate en la web con tu correo.
-- 2) Cambia el correo de abajo por el tuyo, pega esto en Supabase > SQL Editor y pulsa "Run".
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = lower('TU-CORREO@gmail.com'));

-- Debe mostrar tu nombre con role = admin
select p.full_name, u.email, p.role
from public.profiles p join auth.users u on u.id = p.id
where p.role = 'admin';
