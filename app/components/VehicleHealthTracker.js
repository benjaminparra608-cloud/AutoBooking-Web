'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  VEHICULOS_CHILE,
  COMPONENTES_DESGASTE_BASE,
  calcularGastoCombustible
} from '../lib/vehicleCatalog';
import { whatsappUrl } from '../lib/config';

const LOCAL_STORAGE_TRACKER_KEY = 'autobooking_vehicle_tracker_v1';

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
  const [selectedVehiculoId, setSelectedVehiculoId] = useState('chevrolet-sail');
  const [patenteInput, setPatenteInput] = useState('BB-CL-20');
  const [busquedaVehiculo, setBusquedaVehiculo] = useState('');
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  const [odometroTotal, setOdometroTotal] = useState(62400);
  const [kmViajeActual, setKmViajeActual] = useState(48.5);

  const [desgasteComponentes, setDesgasteComponentes] = useState({
    aceite_filtros: 2200,
    pastillas_freno: 27600,
    neumaticos: 38000,
    bujias: 18200,
    correa_distribucion: 24000,
    suspension: 11000,
    bateria: 32000
  });

  const [componenteAjustando, setComponenteAjustando] = useState(null);
  const [nuevoKmComponente, setNuevoKmComponente] = useState(0);

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [velocidadActualKmh, setVelocidadActualKmh] = useState(0);
  const lastCoordsRef = useRef(null);
  const watchIdRef = useRef(null);

  const [isSimulating, setIsSimulating] = useState(false);

  const vehiculoActual =
    VEHICULOS_CHILE.find((v) => v.id === selectedVehiculoId) || VEHICULOS_CHILE[0];

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

  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        sumarKilometros(0.4);
        setVelocidadActualKmh(Math.floor(Math.random() * 20) + 55);
      }, 2000);
    } else if (!isGpsActive) {
      setVelocidadActualKmh(0);
    }
    return () => clearInterval(timer);
  }, [isSimulating, isGpsActive]);

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
            setVelocidadActualKmh(Math.round(speed * 3.6));
          }
          if (lastCoordsRef.current) {
            const dist = calcularDistanciaKm(
              lastCoordsRef.current.lat,
              lastCoordsRef.current.lon,
              latitude,
              longitude
            );
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
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }
  }

  const gastoViaje = calcularGastoCombustible(kmViajeActual, vehiculoActual);

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

  const vehiculosFiltrados = VEHICULOS_CHILE.filter(
    (v) =>
      v.marca.toLowerCase().includes(busquedaVehiculo.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busquedaVehiculo.toLowerCase())
  );

  return (
    <section id="monitor-desgaste" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">

        {/* ENCABEZADO */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-2">
            Telemetría Predictiva
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Monitor de Desgaste & Odómetro GPS
          </h2>
          <p className="text-sm text-white/35 mt-2 max-w-xl mx-auto font-light">
            Seguimiento en tiempo real de la vida útil de tus componentes automotrices y consumo de combustible.
          </p>
        </div>

        {/* COCKPIT PRINCIPAL */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
            {/* Vehículo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h1.5a1.125 1.125 0 011.125 1.125v4.5H14.25m-2.25 5.625h-3.75m0-11.25H4.5A2.25 2.25 0 002.25 9.75v4.5h6m0-5.625h6m-6 0V18.75" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-blue-400">
                    {patenteInput ? patenteInput.toUpperCase() : 'SIN-PAT'}
                  </span>
                  <span className="text-xs text-white/40 font-light">{vehiculoActual.anos}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {vehiculoActual.marca} {vehiculoActual.modelo}
                </h3>
                <span className="text-xs text-white/35 font-light">
                  {vehiculoActual.motor} · {vehiculoActual.combustible}
                </span>
              </div>
            </div>

            {/* Selector botón */}
            <button
              onClick={() => setShowSelectorModal(true)}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] text-xs font-medium py-2 px-4 rounded-full transition-all cursor-pointer self-stretch sm:self-auto text-center"
            >
              Cambiar vehículo (40 fichas) →
            </button>
          </div>

          {/* MÉTRICAS EN CUADRÍCULA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Odómetro Total</span>
              <div className="text-lg sm:text-xl font-mono font-bold text-white mt-1">
                {odometroTotal.toLocaleString('es-CL')} <span className="text-xs font-sans text-white/30 font-normal">km</span>
              </div>
              <span className="text-[10px] text-blue-400/80 font-medium">Activo</span>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Combustible</span>
              <div className="text-lg sm:text-xl font-mono font-bold text-white mt-1">
                {gastoViaje.litros} <span className="text-xs font-sans text-white/30 font-normal">L</span>
              </div>
              <span className="text-[10px] text-white/30">{vehiculoActual.rendimientoMixto} km/L mixto</span>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Gasto Estimado</span>
              <div className="text-lg sm:text-xl font-mono font-bold text-white mt-1">
                ${gastoViaje.costoTotalCLP.toLocaleString('es-CL')}
              </div>
              <span className="text-[10px] text-white/30 font-mono">${gastoViaje.costoPorKmCLP} CLP/km</span>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Velocímetro</span>
              <div className="text-lg sm:text-xl font-mono font-bold text-blue-400 mt-1">
                {velocidadActualKmh} <span className="text-xs font-sans text-white/30 font-normal">km/h</span>
              </div>
              <span className="text-[10px] text-white/30">
                {isGpsActive ? 'GPS en vivo' : isSimulating ? 'Simulación' : 'Pausado'}
              </span>
            </div>
          </div>

          {/* CONTROLES */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-white/40 font-light w-full sm:w-auto">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>
                Distancia medida este viaje: <strong className="text-white font-mono">{kmViajeActual} km</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={toggleGps}
                className={`flex-1 sm:flex-none text-xs font-semibold py-2 px-4 rounded-full transition-all cursor-pointer ${
                  isGpsActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isGpsActive ? 'Detener GPS' : 'Activar GPS en Vivo'}
              </button>

              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex-1 sm:flex-none text-xs font-medium py-2 px-4 rounded-full border transition-all cursor-pointer ${
                  isSimulating
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border-white/[0.08]'
                }`}
              >
                {isSimulating ? 'Pausar Simulación' : 'Simular Trayecto (+km)'}
              </button>
            </div>
          </div>

          {gpsError && (
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs text-center font-light">
              {gpsError}
            </div>
          )}
        </div>

        {/* LISTA DE COMPONENTES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-400/80">
              Desgaste por Componente
            </span>
            <span className="text-[11px] text-white/30 font-light">
              Toca el icono de ajuste para resetear tu último cambio
            </span>
          </div>

          {COMPONENTES_DESGASTE_BASE.map((comp) => {
            const kmActuales = desgasteComponentes[comp.id] || 0;
            const porcentaje = Math.min(100, Math.round((kmActuales / comp.intervaloKm) * 100));

            let barBg = 'bg-blue-500';
            let isUrgent = false;

            if (porcentaje >= 85) {
              barBg = 'bg-rose-500';
              isUrgent = true;
            } else if (porcentaje >= 60) {
              barBg = 'bg-amber-500';
            }

            const kmMaxFormatted = `${comp.intervaloKm / 1000} mil`;

            return (
              <div
                key={comp.id}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 leading-tight">
                      {comp.nombre}
                    </h4>
                    <span className="text-[11px] text-white/30 font-light">
                      Intervalo sugerido: {comp.intervaloKm.toLocaleString('es-CL')} km
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium text-white/60 bg-white/[0.03] border border-white/[0.06]">
                      {kmActuales.toLocaleString('es-CL')} / {kmMaxFormatted}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAbrirAjuste(comp)}
                      title="Ajustar kilometraje"
                      className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-white/40 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* BARRA DE PROGRESO */}
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${barBg}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                {isUrgent && (
                  <div className="mt-3 pt-2.5 border-t border-rose-900/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <span className="text-rose-400 font-light text-[11px]">
                      Desgaste crítico ({porcentaje}% alcanzado). Requiere inspección.
                    </span>
                    <a
                      href={whatsappUrl(
                        `Hola AutoBooking! Mi monitor de desgaste indica que debo cambiar ${comp.nombre} para mi auto (${vehiculoActual.marca} ${vehiculoActual.modelo}). ¿Disponibilidad a domicilio?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] py-1 px-3 rounded-full transition-all shrink-0"
                    >
                      Agendar {comp.servicioAsociado} →
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL DE AJUSTE */}
      {componenteAjustando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1117] border border-white/[0.10] rounded-2xl p-7 max-w-md w-full relative shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                Ajustar {componenteAjustando.nombre}
              </h3>
              <button
                onClick={() => setComponenteAjustando(null)}
                className="w-7 h-7 rounded-full bg-white/[0.06] text-white/50 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-white/40 mb-4 font-light leading-relaxed">
              Indica cuántos kilómetros han pasado desde el último cambio o presiona <strong>&ldquo;Reiniciar a 0 km&rdquo;</strong> si instalaste una pieza nueva.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-white/30 block mb-1">
                  Kilómetros acumulados en esta pieza:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={nuevoKmComponente}
                    onChange={(e) => setNuevoKmComponente(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">
                    km
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleReiniciarComponente(componenteAjustando.id)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 font-medium text-xs py-2.5 px-3 rounded-full border border-white/[0.08] transition-all cursor-pointer"
                >
                  Reiniciar a 0 km
                </button>
                <button
                  type="button"
                  onClick={handleGuardarAjuste}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-3 rounded-full transition-all cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SELECCIÓN DE VEHÍCULO */}
      {showSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1117] border border-white/[0.10] rounded-2xl p-7 max-w-2xl w-full relative shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Selecciona tu Vehículo</h3>
                <span className="text-xs text-white/40 font-light">40 fichas del parque automotriz chileno</span>
              </div>
              <button
                onClick={() => setShowSelectorModal(false)}
                className="w-7 h-7 rounded-full bg-white/[0.06] text-white/50 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar marca o modelo (Sail, Swift, Hilux)..."
                value={busquedaVehiculo}
                onChange={(e) => setBusquedaVehiculo(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.10] rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Ingresa tu Patente (BB-CL-20)..."
                value={patenteInput}
                onChange={(e) => setPatenteInput(e.target.value.toUpperCase())}
                className="bg-white/[0.04] border border-white/[0.10] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-white/20 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
              {vehiculosFiltrados.map((v) => {
                const isSelected = v.id === selectedVehiculoId;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVehiculoId(v.id);
                      setShowSelectorModal(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/50 text-white'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] text-white/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-semibold text-white">
                          {v.marca} {v.modelo}
                        </strong>
                        <span className="text-[10px] text-white/30">({v.anos})</span>
                      </div>
                      <span className="text-[11px] text-white/35 block mt-0.5 font-light">
                        Motor {v.motor} · Rinde {v.rendimientoMixto} km/L · Batería {v.bateriaCodigo}
                      </span>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-mono text-blue-400 block font-medium">
                        {v.combustible}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] text-emerald-400 font-medium">✓ Activo</span>
                      ) : (
                        <span className="text-[10px] text-white/30">Elegir →</span>
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
