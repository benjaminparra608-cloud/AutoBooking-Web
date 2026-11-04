-- =============================================================================
-- ESQUEMA SQL COMPLETO DE PRODUCCIÓN PARA AUTOBOOKING (SUPABASE POSTGRESQL)
-- Incluye Multi-Tenant (Talleres), Citas, Órdenes de Trabajo (OT + Inspección 360°),
-- Tienda & Baterías, Inventario, Emergencias SOS 24/7, Mi Cuenta del Conductor,
-- Guantera Digital de Vehículos/Documentos, AutoPoints y Marketplace Pre-Compra.
--
-- Ejecuta este script completo en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- =============================================================================

-- 0. TABLA TALLERES (MULTI-TENANT SAAS)
create table if not exists public.talleres (
  id text primary key default ('taller-' || gen_random_uuid()::text),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,
  nombre text not null,
  rut text default '',
  telefono text default '',
  email text default '',
  comuna text default 'Santiago',
  direccion text default '',
  logo_url text default '',
  color_acento text default '#3b82f6',
  plan_suscripcion text default 'pro',
  estado_suscripcion text default 'activa'
);

alter table public.talleres enable row level security;
drop policy if exists "Lectura publica talleres" on public.talleres;
create policy "Lectura publica talleres" on public.talleres for select using (true);
drop policy if exists "Insercion publica talleres" on public.talleres;
create policy "Insercion publica talleres" on public.talleres for insert with check (true);
drop policy if exists "Actualizacion publica talleres" on public.talleres;
create policy "Actualizacion publica talleres" on public.talleres for update using (true);

-- 0.1 TABLA USUARIOS_TALLER (VINCULACIÓN DUEÑOS Y MECÁNICOS)
create table if not exists public.usuarios_taller (
  id uuid primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  taller_id text references public.talleres(id) on delete cascade,
  nombre text not null,
  rol text default 'dueno'
);

alter table public.usuarios_taller enable row level security;
drop policy if exists "Lectura publica usuarios_taller" on public.usuarios_taller;
create policy "Lectura publica usuarios_taller" on public.usuarios_taller for select using (true);
drop policy if exists "Insercion publica usuarios_taller" on public.usuarios_taller;
create policy "Insercion publica usuarios_taller" on public.usuarios_taller for insert with check (true);
drop policy if exists "Actualizacion publica usuarios_taller" on public.usuarios_taller;
create policy "Actualizacion publica usuarios_taller" on public.usuarios_taller for update using (true);

-- 1. TABLA CITAS Y AGENDAMIENTOS
create table if not exists public.citas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  taller_id text default 'taller-demo-1',
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

alter table public.citas add column if not exists taller_id text default 'taller-demo-1';

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
  taller_id text default 'taller-demo-1',
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
  estado text default 'ingresado' not null,
  diagnostico text default '',
  trabajos jsonb default '[]'::jsonb,
  repuestos jsonb default '[]'::jsonb,
  checklist jsonb default '{"luces":true,"combustible":"1/2","ruedaRepuesto":true,"rayones":"Sin observaciones","documentos":true}'::jsonb,
  inspeccion_360 jsonb default '[]'::jsonb,
  total_mano_obra numeric default 0,
  total_repuestos numeric default 0,
  total_general numeric default 0,
  fecha_estimada text,
  fecha_entrega text,
  notas_internas text default ''
);

alter table public.ordenes_trabajo add column if not exists taller_id text default 'taller-demo-1';
alter table public.ordenes_trabajo add column if not exists inspeccion_360 jsonb default '[]'::jsonb;

alter table public.ordenes_trabajo enable row level security;
drop policy if exists "Permitir lectura publica ordenes" on public.ordenes_trabajo;
create policy "Permitir lectura publica ordenes" on public.ordenes_trabajo for select using (true);
drop policy if exists "Permitir insercion ordenes" on public.ordenes_trabajo;
create policy "Permitir insercion ordenes" on public.ordenes_trabajo for insert with check (true);
drop policy if exists "Permitir actualizacion ordenes" on public.ordenes_trabajo;
create policy "Permitir actualizacion ordenes" on public.ordenes_trabajo for update using (true);
drop policy if exists "Permitir eliminacion ordenes" on public.ordenes_trabajo;
create policy "Permitir eliminacion ordenes" on public.ordenes_trabajo for delete using (true);

-- 3. TABLA PEDIDOS DE TIENDA Y BATERÍAS IN SITU
create table if not exists public.pedidos_tienda (
  id text primary key default ('ped-' || gen_random_uuid()::text),
  numero_pedido text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  taller_id text default 'taller-demo-1',
  cliente_nombre text not null,
  cliente_telefono text not null,
  comuna text default 'Santiago',
  direccion text default '',
  patente text default '',
  vehiculo text default '',
  items jsonb default '[]'::jsonb,
  subtotal numeric default 0,
  total_instalacion numeric default 0,
  costo_despacho numeric default 0,
  total_general numeric default 0,
  requiere_instalacion boolean default false,
  estado text default 'nuevo' not null,
  ot_generada_id text,
  mecanico_asignado text,
  notas text default ''
);

alter table public.pedidos_tienda enable row level security;
drop policy if exists "Acceso publico pedidos_tienda" on public.pedidos_tienda;
create policy "Acceso publico pedidos_tienda" on public.pedidos_tienda for all using (true) with check (true);

-- 4. TABLA INVENTARIO DE BATERÍAS Y REPUESTOS
create table if not exists public.inventario_taller (
  id text primary key,
  taller_id text default 'taller-demo-1',
  codigo text not null,
  nombre text not null,
  categoria text not null,
  stock integer default 0,
  stock_minimo integer default 2,
  precio_venta numeric default 0,
  ubicacion text default 'Bodega Principal',
  icono text default '🔋',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inventario_taller enable row level security;
drop policy if exists "Acceso publico inventario_taller" on public.inventario_taller;
create policy "Acceso publico inventario_taller" on public.inventario_taller for all using (true) with check (true);

-- 5. TABLA EMERGENCIAS SOS 24/7 (FASE 1 PORTAL MOTORES)
create table if not exists public.emergencias_sos (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  taller_id text default 'taller-demo-1',
  service_id text not null,
  service_title text not null,
  eta text default '30–45 min',
  price numeric default 24990,
  comuna text not null,
  direccion text default '',
  referencia text default '',
  gps_coords text,
  es_subterraneo boolean default false,
  patente text default 'SIN-PATENTE',
  vehiculo text default 'Vehículo particular',
  conductor_nombre text default 'Conductor AutoBooking',
  conductor_telefono text default '',
  operador_asignado text default 'Unidad Móvil SOS #04 (Carlos H.)',
  grua_patente text default 'SOS-247',
  etapa_radar integer default 2, -- 1: Recibida, 2: Unidad Asignada, 3: En Ruta GPS, 4: En el Punto / Completada
  status text default 'En despacho prioritario',
  ot_generada_id text
);

alter table public.emergencias_sos enable row level security;
drop policy if exists "Acceso publico emergencias_sos" on public.emergencias_sos;
create policy "Acceso publico emergencias_sos" on public.emergencias_sos for all using (true) with check (true);

-- 6. TABLA PERFIL DEL CONDUCTOR, VERIFICACIÓN Y AUTOPOINTS (FASES 3 Y 4)
create table if not exists public.conductores_perfil (
  id text primary key, -- email o identificador único del conductor
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  email text not null,
  telefono text not null,
  comuna text default 'Las Condes, Santiago',
  verificado boolean default false,
  codigo_referido text default 'AB-CRIS80',
  auto_points integer default 160,
  redeemed_codes jsonb default '[]'::jsonb,
  direcciones jsonb default '[]'::jsonb
);

alter table public.conductores_perfil enable row level security;
drop policy if exists "Acceso publico conductores_perfil" on public.conductores_perfil;
create policy "Acceso publico conductores_perfil" on public.conductores_perfil for all using (true) with check (true);

-- 7. TABLA VEHÍCULOS Y GUANTERA DIGITAL DE DOCUMENTOS DEL CONDUCTOR (FASE 3)
create table if not exists public.vehiculos_conductor (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conductor_email text default 'cristobal.conductor@autobooking.cl',
  patente text not null,
  marca text not null,
  modelo text not null,
  anio integer default 2022,
  kilometraje integer default 40000,
  combustible text default 'Gasolina 95',
  vin text default '',
  documentos jsonb default '[]'::jsonb
);

alter table public.vehiculos_conductor enable row level security;
drop policy if exists "Acceso publico vehiculos_conductor" on public.vehiculos_conductor;
create policy "Acceso publico vehiculos_conductor" on public.vehiculos_conductor for all using (true) with check (true);

-- 8. TABLA MARKETPLACE DE AUTOS CERTIFICADOS CON SELLO PRE-COMPRA 100 PUNTOS
create table if not exists public.autos_marketplace (
  id text primary key default ('mkt-' || gen_random_uuid()::text),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patente text not null,
  marca text not null,
  modelo text not null,
  version text default '',
  anio integer not null,
  kilometraje integer not null,
  transmision text default 'Automática',
  combustible text default 'Gasolina',
  precio numeric not null,
  comuna text default 'Las Condes',
  vendedor_nombre text not null,
  vendedor_telefono text not null,
  puntaje_inspeccion integer default 98,
  certificado_obd2 boolean default true,
  sin_choques boolean default true,
  mantenciones_al_dia boolean default true,
  resumen_tecnico text default 'Aprobado en los 100 puntos de control mecánico, electrónico y estructural.',
  estado text default 'disponible'
);

alter table public.autos_marketplace enable row level security;
drop policy if exists "Acceso publico autos_marketplace" on public.autos_marketplace;
create policy "Acceso publico autos_marketplace" on public.autos_marketplace for all using (true) with check (true);

-- =============================================================================
-- DATOS SEMILLA (SEED DATA) PARA QUE LA PLATAFORMA TENGA INFORMACIÓN INICIAL
-- =============================================================================

insert into public.talleres (id, slug, nombre, rut, telefono, email, comuna, direccion, color_acento, plan_suscripcion, estado_suscripcion)
values
  ('taller-demo-1', 'san-cristobal', 'Taller Mecánico San Cristóbal', '76.890.123-K', '+56982674570', 'contacto@tallersancristobal.cl', 'Providencia', 'Av. Pedro de Valdivia 1420', '#3b82f6', 'pro', 'activa'),
  ('taller-demo-2', 'frenos-express', 'Frenos & Baterías Express', '77.123.456-8', '+56912345678', 'contacto@frenosexpress.cl', 'Las Condes', 'Av. Las Condes 9800', '#10b981', 'movil', 'trial_14_dias'),
  ('taller-demo-3', 'taller-principal', 'Taller Principal AutoBooking', '76.543.210-9', '+56982674570', 'taller@autobooking.cl', 'Santiago', 'Av. Libertador Bernardo O''Higgins 1020', '#3b82f6', 'red', 'activa')
on conflict (id) do nothing;

insert into public.conductores_perfil (id, nombre, email, telefono, comuna, verificado, codigo_referido, auto_points, redeemed_codes)
values
  ('cristobal.conductor@autobooking.cl', 'Cristóbal Morales', 'cristobal.conductor@autobooking.cl', '+56 9 8267 4570', 'Las Condes, Santiago', false, 'AB-CRIS80', 160, '[]'::jsonb)
on conflict (id) do nothing;

insert into public.autos_marketplace (id, patente, marca, modelo, version, anio, kilometraje, transmision, combustible, precio, comuna, vendedor_nombre, vendedor_telefono, puntaje_inspeccion, resumen_tecnico)
values
  ('mkt-demo-1', 'PJKW-84', 'Mazda', 'CX-5', '2.5 GTX AWD Automático', 2022, 42850, 'Automática SkyActiv', 'Gasolina 95', 21490000, 'Las Condes', 'Cristóbal Morales', '+56982674570', 99, 'Inspección 100 puntos aprobada sin códigos DTC en escáner OBD2. Pintura de fábrica verificada con micrómetro digital.'),
  ('mkt-demo-2', 'RTFG-22', 'Toyota', 'RAV4 Hybrid', '2.5 XLE E-CVT', 2023, 28400, 'Automática E-CVT', 'Híbrido', 24990000, 'Vitacura', 'Martín Undurraga', '+56982674570', 100, 'Batería híbrida al 98% de salud certificada. Único dueño, mantenciones selladas en pasaporte QR.'),
  ('mkt-demo-3', 'LZXP-91', 'Peugeot', '3008', '1.6 THP Allure BlueHDi', 2021, 54200, 'Automática EAT8', 'Diésel', 17890000, 'Providencia', 'Francisca Echeverría', '+56982674570', 96, 'Frenos Brembo cerámicos recién instalados y batería AGM Start-Stop nueva con garantía vigente.')
on conflict (id) do nothing;
