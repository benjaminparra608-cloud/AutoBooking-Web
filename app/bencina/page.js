'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import AutoBotAssistant from '../components/AutoBotAssistant';

const PRT_CALENDAR_BY_DIGIT = {
  '9': { mes: 'Enero', orden: 1, estado: 'Revisa vigencia anual' },
  '0': { mes: 'Febrero', orden: 2, estado: 'Revisa vigencia anual' },
  '1': { mes: 'Abril', orden: 4, estado: 'Revisa vigencia anual' },
  '2': { mes: 'Mayo', orden: 5, estado: 'Revisa vigencia anual' },
  '3': { mes: 'Junio', orden: 6, estado: 'Revisa vigencia anual' },
  '4': { mes: 'Julio', orden: 7, estado: 'Revisa vigencia anual' },
  '5': { mes: 'Agosto', orden: 8, estado: 'Revisa vigencia anual' },
  '6': { mes: 'Septiembre', orden: 9, estado: 'Revisa vigencia anual' },
  '7': { mes: 'Octubre', orden: 10, estado: 'Temporada alta PRT' },
  '8': { mes: 'Noviembre', orden: 11, estado: 'Mes en curso · Agenda tu Pre-PRT' },
};

const RESTRICTION_BY_DAY = {
  1: { dia: 'Lunes', digitosPre2011: ['4', '5'], sinSello: ['8', '9', '0', '1'] },
  2: { dia: 'Martes', digitosPre2011: ['6', '7'], sinSello: ['2', '3', '4', '5'] },
  3: { dia: 'Miércoles', digitosPre2011: ['8', '9'], sinSello: ['6', '7', '8', '9'] },
  4: { dia: 'Jueves', digitosPre2011: ['0', '1'], sinSello: ['0', '1', '2', '3'] },
  5: { dia: 'Viernes', digitosPre2011: ['2', '3'], sinSello: ['4', '5', '6', '7'] },
  6: { dia: 'Sábado', digitosPre2011: [], sinSello: [] },
  0: { dia: 'Domingo', digitosPre2011: [], sinSello: [] },
};

const GAS_STATIONS = [
  {
    id: 'st-1',
    brand: 'Copec',
    name: 'Copec Av. Las Condes / Estoril',
    comuna: 'Las Condes',
    address: 'Av. Las Condes 10450',
    updatedAgo: 'Hace 15 min',
    prices: { '93': 1239, '95': 1278, '97': 1324, diesel: 989 },
    services: ['Aire digital gratis', 'Pronto Copec 24/7', 'Cargador EV 50kW'],
  },
  {
    id: 'st-2',
    brand: 'Aramco',
    name: 'Aramco Autoservicio Apoquindo',
    comuna: 'Las Condes',
    address: 'Av. Apoquindo 6210',
    updatedAgo: 'Hace 20 min',
    prices: { '93': 1226, '95': 1265, '97': 1312, diesel: 978 },
    services: ['Descuento Autoservicio -$12/L', 'Aire calibrado', 'Tienda Stop'],
  },
  {
    id: 'st-3',
    brand: 'Shell',
    name: 'Shell V-Power Bilbao / Tobalaba',
    comuna: 'Providencia',
    address: 'Av. Francisco Bilbao 2890',
    updatedAgo: 'Hace 12 min',
    prices: { '93': 1234, '95': 1274, '97': 1321, diesel: 984 },
    services: ['Upa! 24/7', 'Lavado inteligente', 'Lubricentro'],
  },
  {
    id: 'st-4',
    brand: 'Copec',
    name: 'Copec Salvador / Santa Isabel',
    comuna: 'Providencia',
    address: 'Av. Salvador 1410',
    updatedAgo: 'Hace 8 min',
    prices: { '93': 1229, '95': 1269, '97': 1318, diesel: 981 },
    services: ['Aire digital', 'Cajero automático', 'Punto BlueExpress'],
  },
  {
    id: 'st-5',
    brand: 'Shell',
    name: 'Shell Autoservicio Irarrázaval',
    comuna: 'Ñuñoa',
    address: 'Av. Irarrázaval 3420',
    updatedAgo: 'Hace 18 min',
    prices: { '93': 1219, '95': 1258, '97': 1304, diesel: 972 },
    services: ['Mejor precio zona oriente', 'Autoservicio 24h', 'Aire y Agua'],
  },
  {
    id: 'st-6',
    brand: 'Aramco',
    name: 'Aramco Vicuña Mackenna Poniente',
    comuna: 'La Florida',
    address: 'Av. Vicuña Mackenna 7450',
    updatedAgo: 'Hace 25 min',
    prices: { '93': 1214, '95': 1252, '97': 1299, diesel: 968 },
    services: ['Más económica zona sur', 'Lavado túnel', 'Aire digital'],
  },
  {
    id: 'st-7',
    brand: 'Copec',
    name: 'Copec Libertad / 10 Norte',
    comuna: 'Viña del Mar',
    address: 'Av. Libertad 980, Viña del Mar',
    updatedAgo: 'Hace 14 min',
    prices: { '93': 1242, '95': 1284, '97': 1332, diesel: 994 },
    services: ['Pronto 24/7', 'Cargador Voltex EV', 'Aire calibrado'],
  },
  {
    id: 'st-8',
    brand: 'Shell',
    name: 'Shell Paicaví / Los Carrera',
    comuna: 'Concepción',
    address: 'Av. Paicaví 1120, Concepción',
    updatedAgo: 'Hace 19 min',
    prices: { '93': 1248, '95': 1289, '97': 1338, diesel: 998 },
    services: ['Upa!', 'Aire digital', 'Atención 24/7'],
  },
];

function extractLastNumericDigit(plate) {
  const digits = String(plate || '').replace(/\D/g, '');
  if (!digits) return '4'; // default demo digit
  return digits[digits.length - 1];
}

function formatCLP(n) {
  return '$' + Math.round(Number(n || 0)).toLocaleString('es-CL');
}

export default function BencinaUtilidadesPage() {
  const [patente, setPatente] = useState('PJKW-84');
  const [anioVehiculo, setAnioVehiculo] = useState(2022);
  const [fuelType, setFuelType] = useState('95'); // '93' | '95' | '97' | 'diesel'
  const [selectedComuna, setSelectedComuna] = useState('Todas');
  const [tankLiters, setTankLiters] = useState(55);
  const [fillsPerMonth, setFillsPerMonth] = useState(3);

  const lastDigit = useMemo(() => extractLastNumericDigit(patente), [patente]);
  const prtInfo = PRT_CALENDAR_BY_DIGIT[lastDigit] || PRT_CALENDAR_BY_DIGIT['4'];

  const todayDayIdx = new Date().getDay();
  const todayRestriction = RESTRICTION_BY_DAY[todayDayIdx] || RESTRICTION_BY_DAY[1];
  const isRestrictedIfPre2011 = todayRestriction.digitosPre2011.includes(lastDigit);

  const filteredStations = useMemo(() => {
    const list =
      selectedComuna === 'Todas'
        ? GAS_STATIONS
        : GAS_STATIONS.filter((s) => s.comuna === selectedComuna);
    return [...list].sort((a, b) => (a.prices[fuelType] || 0) - (b.prices[fuelType] || 0));
  }, [selectedComuna, fuelType]);

  const cheapestStation = filteredStations[0] || GAS_STATIONS[0];
  const priciestStation =
    filteredStations[filteredStations.length - 1] || GAS_STATIONS[GAS_STATIONS.length - 1];

  const minTankCost = (cheapestStation.prices[fuelType] || 1250) * tankLiters;
  const maxTankCost = (priciestStation.prices[fuelType] || 1300) * tankLiters;
  const yearlySavings = Math.max(0, (maxTankCost - minTankCost) * fillsPerMonth * 12);

  return (
    <div className="min-h-screen bg-[#080a0d] text-white pb-28 md:pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 md:pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3">
              <span>⛽ Utilidades Diarias del Conductor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Bencineras en Línea, Restricción & Calendario PRT
            </h1>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              Compara el precio por litro en tiempo real, calcula cuánto cuesta llenar tu estanque y
              consulta por patente tu mes oficial de Revisión Técnica y Restricción Vehicular.
            </p>
          </div>
          <Link
            href="/cuenta"
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-white shrink-0 self-start md:self-auto"
          >
            Ir a Mi Guantera Digital →
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. CONSULTA INSTANTÁNEA POR PATENTE (PRT + RESTRICCIÓN)   */}
        {/* ========================================================= */}
        <section className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
                Verificador Oficial por Patente
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Consulta tu mes de Revisión Técnica y Restricción
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Ingresa tu patente y año del vehículo para verificar según su último dígito numérico el
                calendario oficial del Ministerio de Transportes (MTT).
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Patente del vehículo</label>
                  <input
                    type="text"
                    value={patente}
                    onChange={(e) => setPatente(e.target.value.toUpperCase())}
                    placeholder="Ej. PJKW-84"
                    className="w-full bg-[#080a0d] border border-white/[0.15] rounded-xl px-3.5 py-2.5 font-mono text-sm font-black uppercase tracking-widest text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Año inscripción</label>
                  <select
                    value={anioVehiculo}
                    onChange={(e) => setAnioVehiculo(Number(e.target.value))}
                    className="w-full bg-[#080a0d] border border-white/[0.15] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white"
                  >
                    <option value={2024}>2012 o más reciente (Sello Verde Exento)</option>
                    <option value={2010}>2011 o anterior (Sello Verde Afecto)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Resultado 1: Calendario Revisión Técnica */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      Calendario PRT (MTT)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-black">
                      Dígito {lastDigit}
                    </span>
                  </div>
                  <div className="text-xs text-white/55">Mes oficial que te corresponde:</div>
                  <div className="text-2xl font-black text-white mt-0.5">{prtInfo.mes}</div>
                  <p className="text-[11px] text-white/50 mt-2 leading-relaxed">
                    Evita rechazos por gases, holguras o frenos con nuestra inspección Pre-PRT a domicilio.
                  </p>
                </div>

                <Link
                  href="/#agendar"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-all"
                >
                  Agendar Pre-Revisión Técnica →
                </Link>
              </div>

              {/* Resultado 2: Estado de Restricción Vehicular */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Restricción RM ({todayRestriction.dia})
                    </span>
                    {anioVehiculo >= 2012 || !isRestrictedIfPre2011 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                        ✓ Libre Circulación
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                        ⚠️ Con Restricción Hoy
                      </span>
                    )}
                  </div>

                  <div className="text-base font-bold text-white">
                    {anioVehiculo >= 2012
                      ? 'Exento por año de inscripción (Sello Verde 2012+)'
                      : isRestrictedIfPre2011
                      ? `Restricción activa 07:30 a 21:00 hrs (Dígito ${lastDigit})`
                      : `Sin restricción hoy para el dígito ${lastDigit}`}
                  </div>
                  <p className="text-[11px] text-white/50 mt-2 leading-relaxed">
                    Dígitos afectos hoy ({todayRestriction.dia}) para catalíticos pre-2011:{' '}
                    <strong className="text-white">
                      {todayRestriction.digitosPre2011.length > 0
                        ? todayRestriction.digitosPre2011.join(' y ')
                        : 'Ninguno (Fin de semana)'}
                    </strong>
                    .
                  </p>
                </div>

                <Link
                  href="/cuenta"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white/80 font-semibold text-xs text-center transition-all"
                >
                  Guardar alerta en Mi Cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. COMPARADOR DE PRECIOS DE BENCINA + CALCULADORA ESTANQUE*/}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista de Estaciones de Combustible */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Selector de octanaje */}
              <div className="flex items-center gap-1.5 bg-[#080a0d] p-1 rounded-2xl border border-white/[0.08]">
                {[
                  { id: '93', label: '93 Oct' },
                  { id: '95', label: '95 Oct' },
                  { id: '97', label: '97 Oct' },
                  { id: 'diesel', label: 'Diésel' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFuelType(f.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      fuelType === f.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Filtro de comuna */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Comuna:</span>
                <select
                  value={selectedComuna}
                  onChange={(e) => setSelectedComuna(e.target.value)}
                  className="bg-[#080a0d] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-semibold text-white cursor-pointer"
                >
                  <option value="Todas">Todas las comunas</option>
                  <option value="Las Condes">Las Condes</option>
                  <option value="Providencia">Providencia</option>
                  <option value="Ñuñoa">Ñuñoa</option>
                  <option value="La Florida">La Florida</option>
                  <option value="Viña del Mar">Viña del Mar</option>
                  <option value="Concepción">Concepción</option>
                </select>
              </div>
            </div>

            {/* Tarjetas de estaciones ordenadas por mejor precio */}
            <div className="space-y-3">
              {filteredStations.map((st, idx) => {
                const pricePerLiter = st.prices[fuelType];
                const fullTankHere = pricePerLiter * tankLiters;
                const isBest = idx === 0;
                return (
                  <div
                    key={st.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isBest
                        ? 'bg-gradient-to-r from-emerald-950/30 via-[#0d1117] to-[#0d1117] border-emerald-500/40'
                        : 'bg-[#0d1117] border-white/[0.08]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white text-[11px] font-bold">
                          {st.brand}
                        </span>
                        {isBest && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                            ★ Mejor Precio por Litro
                          </span>
                        )}
                        <span className="text-[11px] text-white/40">
                          📍 {st.comuna} · {st.updatedAgo}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{st.name}</h3>
                      <p className="text-xs text-white/50">{st.address}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {st.services.map((srv) => (
                          <span
                            key={srv}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/60"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-white/[0.06] pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-2xl font-black text-emerald-400">
                          {formatCLP(pricePerLiter)}
                          <span className="text-xs font-normal text-white/45"> /L</span>
                        </div>
                        <div className="text-[11px] text-white/55">
                          Estanque ({tankLiters}L):{' '}
                          <strong className="text-white">{formatCLP(fullTankHere)}</strong>
                        </div>
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${st.brand} ${st.address} ${st.comuna}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-blue-600 text-xs font-semibold text-white transition-colors"
                      >
                        Abrir en Mapa →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculadora lateral de llenado de estanque + SOS Combustible */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-1">
                  Simulador de Gasto
                </span>
                <h3 className="text-lg font-black text-white">
                  Calculadora de Estanque ({fuelType === 'diesel' ? 'Diésel' : `Gasolina ${fuelType}`})
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/60">Capacidad de tu estanque:</span>
                  <strong className="text-white">{tankLiters} Litros</strong>
                </div>
                <input
                  type="range"
                  min={30}
                  max={90}
                  step={5}
                  value={tankLiters}
                  onChange={(e) => setTankLiters(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/35 mt-1">
                  <span>30L (Citycar)</span>
                  <span>55L (SUV)</span>
                  <span>90L (Pickup)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/60">Llenados al mes:</span>
                  <strong className="text-white">{fillsPerMonth} cargas/mes</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={fillsPerMonth}
                  onChange={(e) => setFillsPerMonth(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/55">Llenar en la más económica:</span>
                  <strong className="text-emerald-400 font-bold">{formatCLP(minTankCost)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/55">Gasto mensual estimado:</span>
                  <strong className="text-white">{formatCLP(minTankCost * fillsPerMonth)}</strong>
                </div>
                <div className="border-t border-white/[0.06] pt-2.5 flex justify-between text-xs">
                  <span className="text-white/60">Ahorro anual optimizando ruta:</span>
                  <strong className="text-amber-400 font-black">{formatCLP(yearlySavings)}/año</strong>
                </div>
              </div>
            </div>

            {/* Tarjeta de Emergencia: ¿Te quedaste sin bencina en ruta? */}
            <div className="bg-gradient-to-br from-rose-950/40 to-[#0d1117] border border-rose-500/30 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block">
                Rescate en Ruta 24/7
              </span>
              <h3 className="text-base font-bold text-white">
                ¿Te quedaste sin combustible antes de llegar a la estación?
              </h3>
              <p className="text-xs text-white/65 leading-relaxed">
                Despachamos un móvil con bidón certificado antiestático (Gasolina 93/95/97 o Diésel) en
                30–45 minutos donde estés detenido.
              </p>
              <Link
                href="/emergencia"
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Pedir Carga de Combustible SOS ($24.990)</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AutoBotAssistant />
      <BottomNav />
    </div>
  );
}
