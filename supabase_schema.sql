-- ========================================================
-- TABLA DE CITAS Y AGENDAMIENTOS PARA AUTOBOOKING
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. Crear tabla citas
create table if not exists public.citas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patente text not null,
  marca text not null,
  modelo text not null,
  km text,
  servicio text not null,
  fecha text not null,
  horario text not null,
  nombre text not null,
  email text,
  telefono text not null,
  comuna text not null,
  direccion text,
  comentario text,
  estado text default 'pendiente' not null,
  notas_taller text default ''
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.citas enable row level security;

-- 3. Crear políticas para permitir lectura, inserción y actualización desde la app
drop policy if exists "Permitir lectura publica citas" on public.citas;
create policy "Permitir lectura publica citas" on public.citas
  for select using (true);

drop policy if exists "Permitir insercion citas" on public.citas;
create policy "Permitir insercion citas" on public.citas
  for insert with check (true);

drop policy if exists "Permitir actualizacion citas" on public.citas;
create policy "Permitir actualizacion citas" on public.citas
  for update using (true);

drop policy if exists "Permitir eliminacion citas" on public.citas;
create policy "Permitir eliminacion citas" on public.citas
  for delete using (true);

-- 4. Datos iniciales de prueba (opcional)
insert into public.citas (patente, marca, modelo, km, servicio, fecha, horario, nombre, email, telefono, comuna, direccion, comentario, estado)
values
  ('ABCD-12', 'Toyota', 'RAV4', '48500', 'Mantenciones por KM', current_date::text, 'Mañana (9:00–13:00)', 'Rodrigo Morales', 'rodrigo.m@example.com', '+56987654321', 'Providencia', 'Av. Pedro de Valdivia 1234', 'Revisar pastillas de freno delanteras.', 'pendiente'),
  ('GHJK-78', 'Chevrolet', 'Sail', '62000', 'Instalación y Venta de Baterías', current_date::text, 'Tarde (14:00–19:00)', 'Camila Soto', 'camila.soto@example.com', '+56976543210', 'Ñuñoa', 'Av. Irarrázaval 2800', 'Auto no parte desde la mañana.', 'confirmada')
on conflict do nothing;
