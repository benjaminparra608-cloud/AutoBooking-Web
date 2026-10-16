-- ========================================================
-- TABLAS PARA AUTOBOOKING (CITAS Y ÓRDENES DE TRABAJO)
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. TABLA CITAS
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

alter table public.citas enable row level security;

drop policy if exists "Permitir lectura publica citas" on public.citas;
create policy "Permitir lectura publica citas" on public.citas for select using (true);

drop policy if exists "Permitir insercion citas" on public.citas;
create policy "Permitir insercion citas" on public.citas for insert with check (true);

drop policy if exists "Permitir actualizacion citas" on public.citas;
create policy "Permitir actualizacion citas" on public.citas for update using (true);

drop policy if exists "Permitir eliminacion citas" on public.citas;
create policy "Permitir eliminacion citas" on public.citas for delete using (true);

-- 2. TABLA ÓRDENES DE TRABAJO (OT)
create table if not exists public.ordenes_trabajo (
  id uuid default gen_random_uuid() primary key,
  numero_ot text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cita_id text,
  patente text not null,
  marca text not null,
  modelo text not null,
  ano text,
  km text,
  cliente_nombre text not null,
  cliente_telefono text not null,
  cliente_email text,
  mecanico_asignado text default 'Sin Asignar',
  estado text default 'ingresado' not null, -- ingresado | en_proceso | espera_repuestos | listo_entrega | entregado
  diagnostico text default '',
  trabajos jsonb default '[]'::jsonb,
  repuestos jsonb default '[]'::jsonb,
  checklist jsonb default '{"luces":true,"combustible":"1/2","ruedaRepuesto":true,"rayones":"Sin observaciones","documentos":true}'::jsonb,
  total_mano_obra numeric default 0,
  total_repuestos numeric default 0,
  total_general numeric default 0,
  fecha_estimada text,
  fecha_entrega text,
  notas_internas text default ''
);

alter table public.ordenes_trabajo enable row level security;

drop policy if exists "Permitir lectura publica ordenes" on public.ordenes_trabajo;
create policy "Permitir lectura publica ordenes" on public.ordenes_trabajo for select using (true);

drop policy if exists "Permitir insercion ordenes" on public.ordenes_trabajo;
create policy "Permitir insercion ordenes" on public.ordenes_trabajo for insert with check (true);

drop policy if exists "Permitir actualizacion ordenes" on public.ordenes_trabajo;
create policy "Permitir actualizacion ordenes" on public.ordenes_trabajo for update using (true);

drop policy if exists "Permitir eliminacion ordenes" on public.ordenes_trabajo;
create policy "Permitir eliminacion ordenes" on public.ordenes_trabajo for delete using (true);

-- 3. DATOS DE PRUEBA
insert into public.citas (patente, marca, modelo, km, servicio, fecha, horario, nombre, email, telefono, comuna, direccion, comentario, estado)
values
  ('ABCD-12', 'Toyota', 'RAV4', '48500', 'Mantenciones por KM', current_date::text, 'Mañana (9:00–13:00)', 'Rodrigo Morales', 'rodrigo.m@example.com', '+56987654321', 'Providencia', 'Av. Pedro de Valdivia 1234', 'Revisar pastillas de freno delanteras.', 'pendiente'),
  ('GHJK-78', 'Chevrolet', 'Sail', '62000', 'Instalación y Venta de Baterías', current_date::text, 'Tarde (14:00–19:00)', 'Camila Soto', 'camila.soto@example.com', '+56976543210', 'Ñuñoa', 'Av. Irarrázaval 2800', 'Auto no parte desde la mañana.', 'confirmada')
on conflict do nothing;

insert into public.ordenes_trabajo (numero_ot, patente, marca, modelo, ano, km, cliente_nombre, cliente_telefono, cliente_email, mecanico_asignado, estado, diagnostico, total_mano_obra, total_repuestos, total_general)
values
  ('OT-2026-001', 'KLMN-34', 'Hyundai', 'Tucson', '2019', '85000', 'Felipe Araya', '+56965432109', 'felipe.araya@example.com', 'Carlos Henríquez', 'en_proceso', 'Código P0135 sensor de oxígeno.', 75000, 64500, 139500),
  ('OT-2026-002', 'GHJK-78', 'Chevrolet', 'Sail', '2018', '62000', 'Camila Soto', '+56976543210', 'camila.soto@example.com', 'Andrés Silva', 'listo_entrega', 'Cambio de batería Hankook 55Ah.', 30000, 72000, 102000)
on conflict do nothing;
