'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  VEHICULOS_CHILE,
  COMPONENTES_DESGASTE_BASE,
  PRECIOS_COMBUSTIBLE_CHILE,
  calcularGastoCombustible
} from '../lib/vehicleCatalog';
import { whatsappUrl } from '../lib/config';

// Claves de persistencia en localStorage
const LOCAL_STORAGE_TRACKER_KEY = 'autobooking_vehicle_tracker_v1';

// Fórmula de Haversine para calcular distancia en km entre dos puntos GPS
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function VehicleHealthTracker() {
  // Vehículo seleccionado
  const [selectedVehiculoId, setSelectedVehiculoId] = useState('chevrolet-sail');
  const [patenteInput, setPatenteInput] = useState('BB-CL-20');
  const [busquedaVehiculo, setBusquedaVehiculo] = useState('');
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  // Odómetro total del auto y km recorridos en esta sesión/viaje
  const [odometroTotal, setOdometroTotal] = useState(62400);
  const [kmViajeActual, setKmViajeActual] = useState(48.5);

  // Kilometraje acumulado de cada componente desde su último cambio
  const [desgasteComponentes, setDesgasteComponentes] = useState({
    aceite_filtros: 2200, // 2.200 / 10.000 (Verde)
    pastillas_freno: 27600, // 27.600 / 30.000 (Rojo)
    neumaticos: 38000, // 38.000 / 50.000 (Amarillo)
    bujias: 18200, // 18.200 / 20.000 (Rojo)
    correa_distribucion: 24000, // 24.000 / 60.000 (Verde)
    suspension: 11000, // 11.000 / 40.000 (Verde)
    bateria: 32000 // 32.000 / 45.000 (Amarillo)
  });

  // Modal para ajustar manualmente un componente
  const [componenteAjustando, setComponenteAjustando] = useState(null);
  const [nuevoKmComponente, setNuevoKmComponente] = useState(0);

  // Estado de Rastreo GPS en tiempo real
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [velocidadActualKmh, setVelocidadActualKmh] = useState(0);
  const lastCoordsRef = useRef(null);
  const watchIdRef = useRef(null);

  // Estado del Simulador de viaje (para pruebas instantáneas)
  const [isSimulating, setIsSimulating] = useState(false);

  const vehiculoActual =
    VEHICULOS_CHILE.find((v) => v.id === selectedVehiculoId) || VEHICULOS_CHILE[0];

  // Cargar estado guardado de localStorage al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TRACKER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedVehiculoId) setSelectedVehiculoId(parsed.selectedVehiculoId);
        if (parsed.patenteInput) setPatenteInput(parsed.patenteInput);
        if (parsed.odometroTotal) setOdometroTotal(parsed.odometroTotal);
        if (parsed.kmViajeActual) setKmViajeActual(parsed.kmViajeActual);
        if (parsed.desgasteComponentes) setDesgasteComponentes(parsed.desgasteComponentes);
      }
    } catch (e) {
      console.warn('Error cargando tracker local:', e);
    }
  }, []);

  // Guardar en localStorage cuando cambie el odómetro o desgaste
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_TRACKER_KEY,
        JSON.stringify({
          selectedVehiculoId,
          patenteInput,
          odometroTotal,
          kmViajeActual,
          desgasteComponentes
        })
      );
    } catch (e) {
      console.warn('Error guardando tracker local:', e);
    }
  }, [selectedVehiculoId, patenteInput, odometroTotal, kmViajeActual, desgasteComponentes]);

  // Función para sumar kilómetros recorridos (afecta combustible, odómetro y desgaste)
  function sumarKilometros(deltaKm) {
    if (deltaKm <= 0) return;
    setOdometroTotal((prev) => Math.round((prev + deltaKm) * 10) / 10);
    setKmViajeActual((prev) => Math.round((prev + deltaKm) * 10) / 10);

    setDesgasteComponentes((prev) => {
      const next = { ...prev };
      for (const key in next) {
        next[key] = Math.round((next[key] + deltaKm) * 10) / 10;
      }
      return next;
    });
  }

  // SIMULADOR DE VIAJE / DEMO
  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        // Simula recorrer ~0.4 km cada 2 segundos (~60-70 km/h)
        sumarKilometros(0.4);
        setVelocidadActualKmh(Math.floor(Math.random() * 20) + 55);
      }, 2000);
    } else if (!isGpsActive) {
      setVelocidadActualKmh(0);
    }
    return () => clearInterval(timer);
  }, [isSimulating, isGpsActive]);

  // RASTREO GPS REAL MEDIANTE GEOLOCATION API
  function toggleGps() {
    if (isGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsGpsActive(false);
      setVelocidadActualKmh(0);
      lastCoordsRef.current = null;
    } else {
      if (!('geolocation' in navigator)) {
        setGpsError('Tu dispositivo o navegador no soporta geolocalización GPS.');
        return;
      }

      setGpsError(null);
      setIsGpsActive(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed } = position.coords;

          if (speed !== null && speed >= 0) {
            setVelocidadActualKmh(Math.round(speed * 3.6)); // m/s a km/h
          }

          if (lastCoordsRef.current) {
            const dist = calcularDistanciaKm(
              lastCoordsRef.current.lat,
              lastCoordsRef.current.lon,
              latitude,
              longitude
            );

            // Filtrar ruido GPS menor a 15 metros y saltos inverosímiles
            if (dist > 0.015 && dist < 5) {
              sumarKilometros(dist);
            }
          }

          lastCoordsRef.current = { lat: latitude, lon: longitude };
        },
        (error) => {
          console.warn('Error GPS:', error);
          setGpsError('Permiso de GPS denegado o señal no disponible.');
          setIsGpsActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000
        }
      );
    }
  }

  // Cálculo de combustible y gasto
  const gastoViaje = calcularGastoCombustible(kmViajeActual, vehiculoActual);

  // Abrir modal de ajuste de componente
  function handleAbrirAjuste(comp) {
    setComponenteAjustando(comp);
    setNuevoKmComponente(desgasteComponentes[comp.id] || 0);
  }

  function handleGuardarAjuste() {
    if (!componenteAjustando) return;
    setDesgasteComponentes((prev) => ({
      ...prev,
      [componenteAjustando.id]: Math.max(0, Number(nuevoKmComponente) || 0)
    }));
    setComponenteAjustando(null);
  }

  function handleReiniciarComponente(compId) {
    setDesgasteComponentes((prev) => ({
      ...prev,
      [compId]: 0
    }));
    setComponenteAjustando(null);
  }

  // Filtrado de la lista de vehículos en el modal
  const vehiculosFiltrados = VEHICULOS_CHILE.filter(
    (v) =>
      v.marca.toLowerCase().includes(busquedaVehiculo.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busquedaVehiculo.toLowerCase())
  );

  return (
    <section id="monitor-desgaste" className="py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Resplandor de fondo estilo cockpit automotriz */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
            <span>📡</span> Telemetría & Historial Clínico Automotriz
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Monitor de Desgaste &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 font-serif italic font-normal">
              Consumo en Tiempo Real
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto font-light">
            Monitorea el ciclo de vida de tus piezas, calcula el consumo exacto de combustible y activa el GPS para acumular desgaste automáticamente mientras conduces.
          </p>
        </div>

        {/* TARJETA PRINCIPAL: FICHA DEL VEHÍCULO Y TELEMETRÍA EN VIVO */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl mb-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            {/* Información del Vehículo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20 shrink-0">
                🚗
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300">
                    {patenteInput ? patenteInput.toUpperCase() : 'SIN-PAT'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{vehiculoActual.anos}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                  {vehiculoActual.marca} {vehiculoActual.modelo}
                </h3>
                <span className="text-xs text-slate-400 block font-light">
                  {vehiculoActual.motor} • {vehiculoActual.combustible}
                </span>
              </div>
            </div>

            {/* Botón de Cambiar Vehículo */}
            <button
              onClick={() => setShowSelectorModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm self-stretch sm:self-auto justify-center"
            >
              <span>🔄</span>
              <span>Cambiar Vehículo (40 Disponibles)</span>
            </button>
          </div>

          {/* CUADRÍCULA DE CONTROL: COMBUSTIBLE, ODÓMETRO & GPS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
            {/* 1. Odómetro Total */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-center shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Odómetro Total
              </span>
              <div className="text-lg sm:text-xl font-mono font-black text-white mt-0.5">
                {odometroTotal.toLocaleString('es-CL')} <span className="text-xs font-sans text-slate-400 font-normal">km</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-medium">Odómetro activo</span>
            </div>

            {/* 2. Litros Consumidos */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-center shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Combustible Consumido
              </span>
              <div className="text-lg sm:text-xl font-mono font-black text-emerald-400 mt-0.5">
                {gastoViaje.litros} <span className="text-xs font-sans text-slate-400 font-normal">L</span>
              </div>
              <span className="text-[10px] text-slate-400">Rinde {vehiculoActual.rendimientoMixto} km/L</span>
            </div>

            {/* 3. Dinero Gastado */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-center shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Gasto Estimado CLP
              </span>
              <div className="text-lg sm:text-xl font-mono font-black text-amber-300 mt-0.5">
                ${gastoViaje.costoTotalCLP.toLocaleString('es-CL')}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">${gastoViaje.costoPorKmCLP} CLP / km</span>
            </div>

            {/* 4. Velocidad / GPS */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-center shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Velocímetro en Vivo
              </span>
              <div className="text-lg sm:text-xl font-mono font-black text-cyan-400 mt-0.5">
                {velocidadActualKmh} <span className="text-xs font-sans text-slate-400 font-normal">km/h</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {isGpsActive ? '🛰️ GPS en vivo' : isSimulating ? '🎮 Simulando ruta' : 'Pausado'}
              </span>
            </div>
          </div>

          {/* CONTROLES DE TELEMETRÍA (BOTONES GPS Y SIMULADOR) */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 w-full sm:w-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Distancia medida este viaje: <strong className="text-white font-mono">{kmViajeActual} km</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Botón GPS Real */}
              <button
                type="button"
                onClick={toggleGps}
                className={`flex-1 sm:flex-none text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                  isGpsActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                <span>{isGpsActive ? '🛑 Detener GPS' : '🛰️ Activar GPS en Vivo'}</span>
              </button>

              {/* Botón Simular Trayecto */}
              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex-1 sm:flex-none text-xs font-bold py-2.5 px-4 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSimulating
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>{isSimulating ? '⏸️ Pausar Simulación' : '▶️ Simular Viaje (+km)'}</span>
              </button>
            </div>
          </div>

          {gpsError && (
            <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800/50 rounded-xl text-rose-300 text-xs text-center">
              ⚠️ {gpsError}
            </div>
          )}
        </div>

        {/* LISTA DE COMPONENTES DE DESGASTE (DISEÑO EXACTO DE LA IMAGEN SUBIDA) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Estado de Desgaste por Componente
            </span>
            <span className="text-[11px] text-slate-500">
              Toca 🎚️ para ajustar o reiniciar tu último cambio
            </span>
          </div>

          {COMPONENTES_DESGASTE_BASE.map((comp) => {
            const kmActuales = desgasteComponentes[comp.id] || 0;
            const porcentaje = Math.min(100, Math.round((kmActuales / comp.intervaloKm) * 100));

            // Estado y color según desgaste:
            // Verde: < 60%
            // Amarillo: 60% - 85%
            // Rojo: > 85% (Urgente)
            let badgeBg = 'bg-emerald-950/70 border-emerald-800/60 text-emerald-400';
            let barBg = 'bg-emerald-500';
            let isUrgent = false;

            if (porcentaje >= 85) {
              badgeBg = 'bg-rose-950/70 border-rose-800/60 text-rose-400';
              barBg = 'bg-rose-500';
              isUrgent = true;
            } else if (porcentaje >= 60) {
              badgeBg = 'bg-amber-950/70 border-amber-800/60 text-amber-300';
              barBg = 'bg-amber-500';
            }

            // Formato de texto para el badge: "27.600 / 30 mil"
            const kmActualFormatted = kmActuales >= 1000 ? `${(kmActuales / 1000).toFixed(1)}k` : `${kmActuales}`;
            const kmMaxFormatted = `${comp.intervaloKm / 1000} mil`;

            return (
              <div
                key={comp.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 rounded-2xl p-4 transition-all shadow-md group relative"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  {/* Ícono y Nombre */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {comp.icono}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {comp.nombre}
                      </h4>
                      <span className="text-[11px] text-slate-400 block font-light">
                        Cambio cada {comp.intervaloKm.toLocaleString('es-CL')} km
                      </span>
                    </div>
                  </div>

                  {/* Badge de Kilometraje y Botón de Ajuste (Sliders 🎚️) */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold tracking-tight shadow-sm ${badgeBg}`}
                    >
                      {kmActuales.toLocaleString('es-CL')} / {kmMaxFormatted}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAbrirAjuste(comp)}
                      title="Ajustar o reiniciar kilometraje de este componente"
                      className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      🎚️
                    </button>
                  </div>
                </div>

                {/* BARRA DE PROGRESO DE DESGASTE (IDÉNTICA A LA IMAGEN) */}
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${barBg}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                {/* BOTÓN DE ACCIÓN RÁPIDA CUANDO EL COMPONENTE ESTÁ GASTADO */}
                {isUrgent && (
                  <div className="mt-3 pt-2.5 border-t border-rose-900/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      ⚠️ Desgaste crítico ({porcentaje}% alcanzado). Requiere reemplazo preventivo.
                    </span>
                    <a
                      href={whatsappUrl(
                        `Hola AutoBooking! Mi monitor de desgaste marca que debo cambiar ${comp.nombre} para mi auto (${vehiculoActual.marca} ${vehiculoActual.modelo}). ¿Tienen disponibilidad para hacerlo a domicilio?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] py-1.5 px-3.5 rounded-lg transition-all shadow-md shrink-0 self-stretch sm:self-auto text-center"
                    >
                      🔧 Agendar {comp.servicioAsociado} →
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NOTA DE SERVICIO A DOMICILIO */}
        <div className="mt-8 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💡</span>
            <span>
              ¿Realizaste una mantención con AutoBooking? El mecánico actualiza tu historial clínico y reinicia tus contadores automáticamente.
            </span>
          </div>
          <a
            href="#agendar"
            className="text-cyan-400 font-bold hover:underline shrink-0 text-xs"
          >
            Agendar con un mecánico experto →
          </a>
        </div>

      </div>

      {/* MODAL DE AJUSTE MANUAL DE KILOMETRAJE DE COMPONENTE */}
      {componenteAjustando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{componenteAjustando.icono}</span>
                <h3 className="text-lg font-bold text-white">
                  Ajustar {componenteAjustando.nombre}
                </h3>
              </div>
              <button
                onClick={() => setComponenteAjustando(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Indica cuántos kilómetros han pasado desde la última vez que cambiaste o revisaste esta pieza, o presiona <strong>&ldquo;Reiniciar a 0 km&rdquo;</strong> si acabas de instalar una nueva.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Kilómetros acumulados en esta pieza:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={nuevoKmComponente}
                    onChange={(e) => setNuevoKmComponente(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-cyan-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                    km
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Límite sugerido por fabricante: {componenteAjustando.intervaloKm.toLocaleString('es-CL')} km.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleReiniciarComponente(componenteAjustando.id)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer border border-cyan-500/20"
                >
                  🔄 Reiniciar a 0 km (Pieza Nueva)
                </button>
                <button
                  type="button"
                  onClick={handleGuardarAjuste}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SELECCIÓN DE VEHÍCULO (40 VEHÍCULOS DE CHILE) */}
      {showSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full relative shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  Selecciona tu Vehículo
                </h3>
                <span className="text-xs text-slate-400">
                  40 fichas técnicas oficiales del parque automotriz chileno
                </span>
              </div>
              <button
                onClick={() => setShowSelectorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Input de Búsqueda y Patente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar marca o modelo (ej: Sail, Swift, Hilux, Yaris)..."
                value={busquedaVehiculo}
                onChange={(e) => setBusquedaVehiculo(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Ingresa tu Patente (ej: BB-CL-20)..."
                value={patenteInput}
                onChange={(e) => setPatenteInput(e.target.value.toUpperCase())}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Lista scrollable de vehículos */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
              {vehiculosFiltrados.map((v) => {
                const isSelected = v.id === selectedVehiculoId;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVehiculoId(v.id);
                      setShowSelectorModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500/80 text-white shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-white">
                          {v.marca} {v.modelo}
                        </strong>
                        <span className="text-[10px] text-slate-400">({v.anos})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Motor {v.motor} • Rinde {v.rendimientoMixto} km/L • Batería {v.bateriaCodigo}
                      </span>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-mono font-bold text-cyan-400 block">
                        {v.combustible}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Seleccionado</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Elegir →</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
