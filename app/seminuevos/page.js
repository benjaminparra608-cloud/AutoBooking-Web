'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import AutoBotAssistant from '../components/AutoBotAssistant';
import {
  getMarketplaceCars,
  createMarketplaceCar,
  isSupabaseConfigured,
} from '../lib/supabase';
import { whatsappUrl } from '../lib/config';

function formatCLP(n) {
  return '$' + Number(n || 0).toLocaleString('es-CL');
}

export default function SeminuevosMarketplacePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('Todos');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedCarReport, setSelectedCarReport] = useState(null);
  const [hasSupabase, setHasSupabase] = useState(false);

  const [form, setForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    version: '',
    anio: '2022',
    kilometraje: '35000',
    transmision: 'Automática',
    combustible: 'Gasolina 95',
    precio: '16990000',
    comuna: 'Las Condes',
    vendedor_nombre: '',
    vendedor_telefono: '+56 9 ',
    resumen_tecnico: '',
  });

  useEffect(() => {
    setHasSupabase(isSupabaseConfigured());
    async function load() {
      setLoading(true);
      const list = await getMarketplaceCars();
      setCars(list);
      setLoading(false);
    }
    load();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQ =
        !q ||
        c.marca?.toLowerCase().includes(q) ||
        c.modelo?.toLowerCase().includes(q) ||
        c.patente?.toLowerCase().includes(q) ||
        c.comuna?.toLowerCase().includes(q);
      const matchesFuel =
        selectedFuel === 'Todos' ||
        (c.combustible || '').toLowerCase().includes(selectedFuel.toLowerCase());
      return matchesQ && matchesFuel;
    });
  }, [cars, searchQuery, selectedFuel]);

  async function handlePublishCar(e) {
    e.preventDefault();
    if (!form.patente.trim() || !form.marca.trim() || !form.modelo.trim()) return;
    const created = await createMarketplaceCar(form);
    setCars((prev) => [created, ...prev]);
    setPublishModalOpen(false);
    setForm({
      patente: '',
      marca: '',
      modelo: '',
      version: '',
      anio: '2022',
      kilometraje: '35000',
      transmision: 'Automática',
      combustible: 'Gasolina 95',
      precio: '16990000',
      comuna: 'Las Condes',
      vendedor_nombre: '',
      vendedor_telefono: '+56 9 ',
      resumen_tecnico: '',
    });
  }

  return (
    <div className="min-h-screen bg-[#080a0d] text-white pb-28 md:pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 md:pt-12">
        {/* Hero / Header */}
        <div className="bg-gradient-to-br from-[#0d1526] via-[#0d1117] to-[#080a0d] border border-white/[0.08] rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                <span>🛡️ Compra-Venta Certificada · Sello Pre-Compra 100 Puntos</span>
                {hasSupabase && <span className="text-[10px] text-emerald-400">· Cloud Sync</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Autos Seminuevos Auditados con Escáner OBD2 y Pasaporte QR
              </h1>

              <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-2xl">
                Cada vehículo publicado cuenta con dictamen mecánico, verificación de kilometraje real en
                ECU, medición de espesor de pintura sin choques estructurales e historial trazable.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/25 cursor-pointer transition-all"
                >
                  + Publicar mi auto con Sello Pre-Compra
                </button>
                <Link
                  href="/#agendar"
                  className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white/90 font-semibold text-xs sm:text-sm transition-all"
                >
                  Solicitar Inspección a un auto externo ($49.000)
                </Link>
              </div>
            </div>

            {/* Sello 100 puntos resumen */}
            <div className="lg:col-span-4 bg-[#080a0d]/80 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Estándar AutoBooking
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black">
                  100 Puntos
                </span>
              </div>
              <ul className="space-y-2 text-xs text-white/75">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Escáner computarizado de motor, caja, ABS y Airbag</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verificación anti-adulteración de odómetro</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Micrómetro digital de pintura y chasis sin siniestros</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Pasaporte Digital QR transferible al nuevo dueño</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtro */}
        <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por marca, modelo, patente o comuna (ej. Mazda CX-5, RAV4, Las Condes)..."
            className="flex-1 bg-[#080a0d] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['Todos', 'Gasolina', 'Híbrido', 'Diésel'].map((fuel) => (
              <button
                key={fuel}
                type="button"
                onClick={() => setSelectedFuel(fuel)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  selectedFuel === fuel
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/[0.04] text-white/60 hover:text-white'
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Vehículos Certificados */}
        {loading ? (
          <div className="text-center py-12 text-sm text-white/50">
            Cargando catálogo certificado desde Supabase...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-[#0d1117] hover:bg-[#111722] border border-white/[0.08] hover:border-blue-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all shadow-lg"
              >
                <div>
                  {/* Top row: Patente + Score */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.12] font-mono text-xs font-black tracking-widest text-white">
                        🇨🇱 {car.patente}
                      </span>
                      <span className="text-xs text-white/50">📍 {car.comuna}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                      <span>✓ Sello {car.puntaje_inspeccion}/100</span>
                    </div>
                  </div>

                  {/* Título y Precio */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <div>
                      <h2 className="text-xl font-black text-white">
                        {car.marca} {car.modelo} ({car.anio})
                      </h2>
                      <p className="text-xs text-white/55">{car.version}</p>
                    </div>
                    <div className="text-2xl font-black text-blue-400">
                      {formatCLP(car.precio)}
                    </div>
                  </div>

                  {/* Chips de especificaciones */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11px] text-white/75">
                      🛣️ {Number(car.kilometraje).toLocaleString('es-CL')} km reales
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11px] text-white/75">
                      ⚙️ {car.transmision}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11px] text-white/75">
                      ⛽ {car.combustible}
                    </span>
                  </div>

                  {/* Dictamen técnico */}
                  <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      Dictamen de Inspección Pre-Compra
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed">{car.resumen_tecnico}</p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setSelectedCarReport(car)}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-white cursor-pointer"
                  >
                    Ver Informe 100 Pts
                  </button>
                  <Link
                    href={`/historial/${encodeURIComponent(car.patente)}`}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-blue-300 text-center"
                  >
                    Pasaporte QR
                  </Link>
                  <a
                    href={whatsappUrl(
                      `Hola, me interesa el vehículo certificado ${car.marca} ${car.modelo} (${car.patente}) publicado en AutoBooking por ${formatCLP(car.precio)}.`,
                      car.vendedor_telefono
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white text-center"
                  >
                    Contactar Dueño →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: INFORME DETALLADO DE 100 PUNTOS                    */}
      {/* ========================================================= */}
      {selectedCarReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                  Certificado de Auditoría Técnica AutoBooking
                </span>
                <h3 className="text-lg font-black text-white">
                  {selectedCarReport.marca} {selectedCarReport.modelo} ({selectedCarReport.patente})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCarReport(null)}
                className="w-8 h-8 rounded-full bg-white/[0.06] text-white/70 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { area: '1. Escáner Electrónico OBD2 (Motor, TCM, ABS, SRS)', score: '100% Sin códigos DTC' },
                { area: '2. Estructura, Chasis y Espesor de Pintura Digital', score: 'Aprobado sin siniestros' },
                { area: '3. Compresión, Refrigeración y Ausencia de Fugas', score: 'Óptimo' },
                { area: '4. Frenos, Suspensión, Tren Delantero y Neumáticos', score: 'Verificado en ruta' },
                { area: '5. Verificación Legal y Kilometraje Real en Módulos', score: `${Number(selectedCarReport.kilometraje).toLocaleString('es-CL')} km certificados` },
              ].map((row) => (
                <div
                  key={row.area}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between gap-2"
                >
                  <span className="text-white/80 font-medium">{row.area}</span>
                  <span className="text-emerald-400 font-bold shrink-0">✓ {row.score}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/historial/${encodeURIComponent(selectedCarReport.patente)}`}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center"
              >
                Abrir Pasaporte QR Completo
              </Link>
              <button
                type="button"
                onClick={() => setSelectedCarReport(null)}
                className="px-5 py-3 rounded-xl bg-white/[0.06] text-white/80 font-semibold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PUBLICAR VEHÍCULO EN SUPABASE                      */}
      {/* ========================================================= */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handlePublishCar}
            className="bg-[#0d1117] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
                  Vitrina Certificada AutoBooking
                </span>
                <h3 className="text-lg font-black text-white">Publicar Vehículo con Sello Pre-Compra</h3>
              </div>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Patente</label>
                <input
                  type="text"
                  required
                  value={form.patente}
                  onChange={(e) => setForm({ ...form, patente: e.target.value.toUpperCase() })}
                  placeholder="Ej. PJKW-84"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Precio Venta (CLP)</label>
                <input
                  type="number"
                  required
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Marca</label>
                <input
                  type="text"
                  required
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                  placeholder="Ej. Mazda"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Modelo</label>
                <input
                  type="text"
                  required
                  value={form.modelo}
                  onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                  placeholder="Ej. CX-5 AWD"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Año</label>
                <input
                  type="number"
                  value={form.anio}
                  onChange={(e) => setForm({ ...form, anio: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Kilometraje</label>
                <input
                  type="number"
                  value={form.kilometraje}
                  onChange={(e) => setForm({ ...form, kilometraje: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Comuna</label>
                <input
                  type="text"
                  value={form.comuna}
                  onChange={(e) => setForm({ ...form, comuna: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Tu nombre</label>
                <input
                  type="text"
                  required
                  value={form.vendedor_nombre}
                  onChange={(e) => setForm({ ...form, vendedor_nombre: e.target.value })}
                  placeholder="Nombre del titular"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/60 block mb-1">WhatsApp contacto</label>
                <input
                  type="tel"
                  required
                  value={form.vendedor_telefono}
                  onChange={(e) => setForm({ ...form, vendedor_telefono: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-white/60 block mb-1">
                Resumen de estado mecánico y mantenciones
              </label>
              <textarea
                rows={2}
                value={form.resumen_tecnico}
                onChange={(e) => setForm({ ...form, resumen_tecnico: e.target.value })}
                placeholder="Ej. Único dueño, mantenciones al día, neumáticos nuevos..."
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
            >
              Publicar Vehículo en Vitrina Certificada
            </button>
          </form>
        </div>
      )}

      <AutoBotAssistant />
      <BottomNav />
    </div>
  );
}
