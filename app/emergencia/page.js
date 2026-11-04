'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import AutoBotAssistant from '../components/AutoBotAssistant';
import {
  EMERGENCY_SERVICES,
  EMERGENCY_SYMPTOM_WIZARD,
  EMERGENCY_COVERAGE_REGIONS,
  EMERGENCY_FAQS,
} from '../lib/emergencyCatalog';
import {
  getEmergenciasSOS,
  createEmergenciaSOS,
  updateEmergenciaSOSStatus,
  getDriverProfile,
  isSupabaseConfigured,
} from '../lib/supabase';
import { whatsappUrl } from '../lib/config';

function formatCLP(value) {
  return '$' + Number(value || 0).toLocaleString('es-CL');
}

function ServiceIcon({ type, className = 'w-6 h-6' }) {
  switch (type) {
    case 'tow_flat':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      );
    case 'tow_wheel':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case 'battery':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
        </svg>
      );
    case 'tire':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 6v6M3 12h6m6 0h6" />
        </svg>
      );
    case 'fuel':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      );
    case 'key':
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      );
  }
}

const RADAR_STEPS = [
  { step: 1, label: 'Orden Recibida', sub: 'Validada en central 24/7' },
  { step: 2, label: 'Unidad Asignada', sub: 'Operador verificado' },
  { step: 3, label: 'En Ruta GPS', sub: 'En camino a tu punto' },
  { step: 4, label: 'En el Lugar', sub: 'Asistencia en curso' },
];

export default function EmergenciaPage() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosStep, setSosStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState('grua-hidraulica');
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);
  const [hasSupabase, setHasSupabase] = useState(false);

  const [sosForm, setSosForm] = useState({
    comuna: 'Las Condes',
    direccion: '',
    referencia: '',
    patente: '',
    vehiculo: '',
    nombre: '',
    telefono: '+56 9 ',
    esSubterraneo: false,
    gpsCoords: null,
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');
  const [submittingSos, setSubmittingSos] = useState(false);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedSymptomId, setSelectedSymptomId] = useState(EMERGENCY_SYMPTOM_WIZARD[0].id);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    setHasSupabase(isSupabaseConfigured());
    async function initData() {
      const [sosList, profile] = await Promise.all([
        getEmergenciasSOS(),
        getDriverProfile(),
      ]);
      if (Array.isArray(sosList)) {
        setRecentRequests(sosList);
      }
      if (profile) {
        setSosForm((prev) => ({
          ...prev,
          nombre: profile.nombre || prev.nombre,
          telefono: profile.telefono || prev.telefono,
          comuna: (profile.comuna || prev.comuna).split(',')[0].trim(),
        }));
      }
    }
    initData();
  }, []);

  const currentService =
    EMERGENCY_SERVICES.find((s) => s.id === selectedServiceId) || EMERGENCY_SERVICES[0];

  const currentSymptom =
    EMERGENCY_SYMPTOM_WIZARD.find((s) => s.id === selectedSymptomId) ||
    EMERGENCY_SYMPTOM_WIZARD[0];

  const recommendedFromSymptom =
    EMERGENCY_SERVICES.find((s) => s.id === currentSymptom.recommendedServiceId) ||
    EMERGENCY_SERVICES[0];

  function openSosWithService(serviceId) {
    setSelectedServiceId(serviceId);
    setSosStep(1);
    setSosModalOpen(true);
  }

  function handleDetectGps() {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('Tu navegador no soporta geolocalización automática.');
      return;
    }
    setGpsLoading(true);
    setGpsStatus('Obteniendo coordenadas GPS de alta precisión...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setSosForm((prev) => ({
          ...prev,
          gpsCoords: `${lat}, ${lng}`,
          direccion: prev.direccion || `Ubicación GPS (${lat}, ${lng})`,
        }));
        setGpsLoading(false);
        setGpsStatus(`Coordenadas capturadas: ${lat}, ${lng}`);
      },
      () => {
        setGpsLoading(false);
        setGpsStatus('No pudimos leer el GPS automáticamente. Ingresa la calle o referencia manualmente.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  const finalEstimatedPrice =
    currentService.priceFrom + (sosForm.esSubterraneo && currentService.id === 'grua-hidraulica' ? 30000 : 0);

  async function handleConfirmSosDispatch() {
    setSubmittingSos(true);
    const createdReq = await createEmergenciaSOS({
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      eta: currentService.eta,
      price: finalEstimatedPrice,
      comuna: sosForm.comuna,
      direccion: sosForm.direccion || 'Por confirmar en mapa',
      referencia: sosForm.referencia,
      gpsCoords: sosForm.gpsCoords,
      esSubterraneo: sosForm.esSubterraneo,
      patente: (sosForm.patente || 'SIN-PATENTE').toUpperCase(),
      vehiculo: sosForm.vehiculo || 'Vehículo particular',
      conductorNombre: sosForm.nombre || 'Conductor AutoBooking',
      conductorTelefono: sosForm.telefono,
    });

    setRecentRequests((prev) => [createdReq, ...prev.filter((r) => r.id !== createdReq.id)]);
    setSubmittingSos(false);

    const msg = [
      `🚨 *SOLICITUD DE EMERGENCIA SOS 24/7 (${createdReq.id})*`,
      `• *Servicio requerido:* ${currentService.title}`,
      `• *Valor base confirmado:* ${formatCLP(finalEstimatedPrice)}`,
      `• *Tiempo estimado:* ${currentService.eta}`,
      `• *Comuna:* ${sosForm.comuna}`,
      `• *Dirección / Punto:* ${sosForm.direccion || 'Envío ubicación actual'}`,
      sosForm.referencia ? `• *Referencia:* ${sosForm.referencia}` : null,
      sosForm.gpsCoords ? `• *GPS:* https://maps.google.com/?q=${encodeURIComponent(sosForm.gpsCoords)}` : null,
      `• *Vehículo / Patente:* ${sosForm.vehiculo || 'Auto'} (${(sosForm.patente || 'Por indicar').toUpperCase()})`,
      sosForm.esSubterraneo ? `• *Alerta acceso:* Estacionamiento subterráneo / baja altura` : null,
      `• *Conductor:* ${sosForm.nombre || 'Conductor AutoBooking'} (${sosForm.telefono})`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(whatsappUrl(msg), '_blank', 'noopener,noreferrer');
    setSosModalOpen(false);
  }

  async function handleAdvanceRadarStage(req) {
    const nextStage = ((req.etapaRadar || 2) % 4) + 1;
    const statusMap = {
      1: 'Orden recibida en central',
      2: 'Unidad asignada en preparación',
      3: 'Grúa / Móvil en ruta por GPS',
      4: 'Operador en el punto de asistencia',
    };
    const updated = await updateEmergenciaSOSStatus(req.id, {
      etapaRadar: nextStage,
      status: statusMap[nextStage],
    });
    if (updated) {
      setRecentRequests((prev) => prev.map((r) => (r.id === req.id ? updated : r)));
    }
  }

  const activeRequest = recentRequests[0] || null;

  return (
    <div className="min-h-screen bg-[#080a0d] text-white pb-28 md:pb-16 selection:bg-rose-500 selection:text-white">
      <Navbar />

      {/* ========================================================= */}
      {/* 1. HERO PRINCIPAL DE EMERGENCIA 24/7                      */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-white/[0.06]">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[780px] h-[420px] bg-gradient-to-tr from-rose-600/20 via-red-500/10 to-blue-600/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-rose-400 font-medium">Emergencia Automotriz 24/7</span>
            {hasSupabase && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                ● Supabase Live Sync
              </span>
            )}
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Emergencia automotriz 24/7 · Sin seguro</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-white mb-5">
              Auxilio vehicular 24/7 en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-amber-300">
                Santiago, Valparaíso y Concepción
              </span>
              , con o sin seguro.
            </h1>

            <p className="text-base sm:text-lg text-white/65 font-normal leading-relaxed mb-8 max-w-2xl">
              ¿Tu auto quedó en pana, sin batería o con un neumático pinchado? Conectamos tu urgencia en
              minutos con grúas hidráulicas, rescate en subterráneos, cerrajería y asistencia en ruta con{' '}
              <strong className="text-white font-semibold">precio cerrado antes de despachar</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              <button
                type="button"
                onClick={() => openSosWithService('grua-hidraulica')}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm sm:text-base px-7 py-4 rounded-2xl shadow-[0_12px_35px_rgba(225,29,72,0.35)] hover:shadow-[0_16px_45px_rgba(225,29,72,0.5)] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>Pedir auxilio ahora</span>
                <span>→</span>
              </button>

              <a
                href="#catalogo-sos"
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.10] text-white/90 font-semibold text-sm sm:text-base px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <span>Ver servicios y precios</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                'Sin contratos ni letra chica',
                'Precios claros antes de confirmar',
                'Proveedores verificados en ruta',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-white/75"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 text-[11px] font-bold">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RADAR EN VIVO DE SEGUIMIENTO SOS (CONECTADO A SUPABASE)   */}
          {/* ========================================================= */}
          {activeRequest && (
            <div className="mt-10 bg-gradient-to-br from-rose-950/40 via-[#0d1117] to-[#0d1117] border border-rose-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-black text-xs shrink-0">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                        Radar de Despacho SOS en Vivo · {activeRequest.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {activeRequest.status}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                      {activeRequest.serviceTitle} — {activeRequest.comuna} ({activeRequest.patente})
                    </h3>
                    <p className="text-xs text-white/55">
                      Operador asignado:{' '}
                      <strong className="text-white">
                        {activeRequest.operadorAsignado || 'Unidad Móvil SOS #04'}
                      </strong>{' '}
                      · Unidad: <span className="font-mono">{activeRequest.gruaPatente || 'GRUA-84'}</span> ·
                      Tarifa cerrada: <strong className="text-rose-300">{formatCLP(activeRequest.price)}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAdvanceRadarStage(activeRequest)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white cursor-pointer"
                    title="Actualizar estado del radar"
                  >
                    Actualizar Radar ↻
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
                  >
                    Nueva Solicitud
                  </button>
                </div>
              </div>

              {/* Barra de 4 etapas del rescate */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RADAR_STEPS.map((st) => {
                  const currentStage = activeRequest.etapaRadar || 2;
                  const done = st.step <= currentStage;
                  const isCurrent = st.step === currentStage;
                  return (
                    <div
                      key={st.step}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-rose-500/15 border-rose-500 text-white'
                          : done
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white/90'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Etapa 0{st.step}
                        </span>
                        <span className="text-xs font-black">
                          {done ? '✓' : '○'}
                        </span>
                      </div>
                      <strong className="text-xs font-bold block">{st.label}</strong>
                      <span className="text-[10px] opacity-75 block">{st.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. RESPUESTA RÁPIDA: ¿QUÉ HAGO SI MI AUTO QUEDÓ EN PANA?  */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 -mt-6 relative z-20">
        <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400 block">
                Respuesta rápida de seguridad vial
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                ¿Qué hago si mi auto quedó en pana y no tengo seguro?
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                En Chile puedes pedir asistencia vehicular por evento sin membresía ni póliza. Sigue este
                protocolo de 4 pasos mientras despachamos tu unidad:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    step: '1',
                    title: 'Asegura el perímetro',
                    desc: 'Enciende luces de emergencia (hazards), ponte el chaleco reflectante antes de bajar e instala triángulos a 50 metros.',
                  },
                  {
                    step: '2',
                    title: 'Identifica el síntoma',
                    desc: 'Observa si el motor gira, si hay testigos rojos en el tablero (batería/temperatura) o si tienes una rueda baja.',
                  },
                  {
                    step: '3',
                    title: 'Comparte tu punto exacto',
                    desc: 'Usa nuestro detector GPS o indícanos la comuna, calle y si estás en vía pública o estacionamiento subterráneo.',
                  },
                  {
                    step: '4',
                    title: 'Confirma tarifa cerrada',
                    desc: 'Conoce el costo exacto desde $24.990 antes de que salga el móvil. Sin cobros sorpresa al terminar.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3.5 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <strong className="text-xs font-bold text-white block mb-0.5">{item.title}</strong>
                      <span className="text-xs text-white/55 leading-snug block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-80 shrink-0 bg-gradient-to-b from-blue-950/40 to-[#080a0d] border border-blue-500/25 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                  <span>AutoAI · Ingeniero Virtual</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  ¿No sabes qué le pasa a tu auto?
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Selecciona el síntoma que ves o escuchas y te diremos al instante si necesitas puente de
                  batería, grúa cama plana o levante.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <span>Diagnosticar mi emergencia</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CATÁLOGO DE SERVICIOS DE EMERGENCIA CON PRECIO CERRADO */}
      {/* ========================================================= */}
      <section id="catalogo-sos" className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block mb-2">
              Servicios de emergencia disponibles 24/7
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ¿Qué tipo de emergencia tienes hoy?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/50 max-w-md">
            Valores base transparentes con despacho inmediato en zonas urbanas. Selecciona una tarjeta para
            cotizar y pedir ayuda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EMERGENCY_SERVICES.map((service) => (
            <div
              key={service.id}
              className="group bg-[#0d1117] hover:bg-[#111722] border border-white/[0.08] hover:border-rose-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ServiceIcon type={service.iconType} className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Llega en {service.eta}
                    </span>
                    <span className="text-[10px] text-rose-300/80 font-medium mt-1">{service.badge}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-rose-200 transition-colors">
                  {service.title}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-xs text-white/40">desde</span>
                  <span className="text-2xl font-black text-rose-400">
                    {formatCLP(service.priceFrom)}
                  </span>
                  <span className="text-[11px] text-white/35">IVA incl.</span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed mb-4">{service.description}</p>

                <ul className="space-y-1.5 mb-6 border-t border-white/[0.06] pt-4">
                  {service.includes.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-white/65">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openSosWithService(service.id)}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.05] group-hover:bg-rose-600 border border-white/[0.08] group-hover:border-rose-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Solicitar {service.shortTitle}</span>
                <span>→</span>
              </button>
            </div>
          ))}

          {/* 7ma Tarjeta: ¿No sabes qué le pasa a tu auto? */}
          <div className="bg-gradient-to-br from-[#0d1526] via-[#0d1117] to-rose-950/30 border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-[11px] font-semibold text-blue-300">
                  Orientación gratuita
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                ¿No sabes qué le pasa a tu auto?
              </h3>
              <p className="text-xs text-white/65 leading-relaxed mb-4">
                Describe el ruido, olor o testigo encendido en el tablero. Nuestro asistente interactivo te
                recomienda qué servicio pedir para no gastar de más en una grúa si solo necesitas puente de
                batería.
              </p>

              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 space-y-2 mb-6">
                <div className="text-[11px] font-semibold text-blue-300">Casos frecuentes que resolvemos:</div>
                <p className="text-[11px] text-white/55">
                  • &ldquo;Doy contacto y suena un clic repetitivo&rdquo;
                  <br />
                  • &ldquo;Quedé atrapado en el piso -2 del mall en P (Parking)&rdquo;
                  <br />
                  • &ldquo;Se encendió el testigo rojo de temperatura o aceite&rdquo;
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Abrir Asistente de Síntomas</span>
                <span>→</span>
              </button>
              <Link
                href="/diagnostico"
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-white/70 font-medium text-xs transition-all flex items-center justify-center"
              >
                Ir al Escáner de Códigos OBD2
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CÓMO FUNCIONA: AYUDA EN 4 PASOS                        */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
              Cómo funciona
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ayuda en 4 pasos, sin llamadas eternas ni esperas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: '01',
                title: 'Cuéntanos qué pasó',
                desc: 'Elige el servicio que necesitas o describe el síntoma si no estás seguro del origen de la falla.',
              },
              {
                num: '02',
                title: 'Comparte tu ubicación',
                desc: 'Activa tu GPS con un botón o indica tu comuna, calle e indicaciones de acceso (ej. subterráneo).',
              },
              {
                num: '03',
                title: 'Conoce el precio y confirma',
                desc: 'Ves el valor cerrado y el tiempo estimado de llegada antes de autorizar la salida del móvil.',
              },
              {
                num: '04',
                title: 'Recibe ayuda en minutos',
                desc: 'Un especialista verificado va directo a tu punto con monitoreo por Radar y WhatsApp en tiempo real.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden"
              >
                <span className="text-3xl font-black text-rose-500/30 block mb-3">{item.num}</span>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. COBERTURA EN 3 REGIONES + COMUNAS DE ALTA DEMANDA      */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block">
              Cobertura Nacional Activa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              ¿Dónde atendemos emergencias automotrices?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Contamos con unidades de rescate y técnicos móviles posicionados estratégicamente en el Gran
              Santiago, Valparaíso/Viña del Mar y Gran Concepción.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-white block">3</span>
                <span className="text-[11px] text-white/50">Regiones activas</span>
              </div>
              <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-rose-400 block">24/7</span>
                <span className="text-[11px] text-white/50">Todos los días</span>
              </div>
              <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-emerald-400 block">30–60</span>
                <span className="text-[11px] text-white/50">Minutos llegada</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {EMERGENCY_COVERAGE_REGIONS.map((reg, idx) => (
                <button
                  key={reg.region}
                  type="button"
                  onClick={() => setSelectedRegionIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRegionIdx === idx
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                      : 'bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {reg.region}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-white/50 mb-4 pb-3 border-b border-white/[0.06]">
              <span>Comunas con mayor demanda y despacho prioritario:</span>
              <span className="text-emerald-400 font-semibold">
                ETA promedio: {EMERGENCY_COVERAGE_REGIONS[selectedRegionIdx].eta}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {EMERGENCY_COVERAGE_REGIONS[selectedRegionIdx].comunas.map((comuna) => (
                <button
                  key={comuna}
                  type="button"
                  onClick={() => {
                    setSosForm((prev) => ({ ...prev, comuna }));
                    setSosModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-rose-500/15 border border-white/[0.07] hover:border-rose-500/40 text-xs text-white/75 hover:text-rose-200 transition-all cursor-pointer"
                >
                  📍 {comuna}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. ASISTENCIA SIN SEGURO + ¿Y SI NO ES URGENTE?           */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
                Asistencia sin seguro y sin letra chica
              </span>
              <h2 className="text-2xl font-black text-white mb-3">
                ¿No tienes seguro automotriz? No importa.
              </h2>
              <p className="text-sm text-white/65 leading-relaxed mb-6">
                Más del 60% de los vehículos en Chile circulan sin asistencia en ruta activa o sus pólizas
                tienen topes de kilometraje y largas esperas telefónicas. En AutoBooking pagas{' '}
                <strong className="text-white">solo cuando lo necesitas</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Atención por evento sin mensualidades',
                'Facturación o boleta para reembolso posterior',
                'Especialistas en autos híbridos, AWD y gama alta',
                'Soporte humano directo por WhatsApp 24/7',
              ].map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs text-white/80"
                >
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/35 to-[#0d1117] border border-blue-500/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
                Mantenimiento Programado
              </span>
              <h3 className="text-xl font-bold text-white mb-2">¿Y si tu problema no es urgente?</h3>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-6">
                Si tu auto está estacionado seguro en casa y prefieres agendar una visita programada para
                mañana (cambio de batería con calma, mantención por kilometraje, frenos o escáner OBD2),
                agenda en horario normal y ahorra en el recargo de urgencia.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/#agendar"
                className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Agendar servicio programado a domicilio</span>
                <span>→</span>
              </Link>
              <Link
                href="/baterias"
                className="w-full py-3 px-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 font-medium text-xs transition-all flex items-center justify-center"
              >
                Ver catálogo de baterías con instalación
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. PREGUNTAS FRECUENTES SOBRE EMERGENCIAS                 */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block mb-2">
            Resolvemos tus dudas al instante
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Preguntas frecuentes sobre emergencias automotrices
          </h2>
        </div>

        <div className="space-y-3">
          {EMERGENCY_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={faq.q}
                className="bg-[#0d1117] border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center text-white/60 transition-transform ${
                      isOpen ? 'rotate-180 text-rose-400' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-white/65 leading-relaxed border-t border-white/[0.05] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. BANNER FINAL CTA DE EMERGENCIA                         */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="bg-gradient-to-r from-rose-950/70 via-[#130d14] to-[#0d1117] border border-rose-500/35 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ¿Necesitas ayuda con tu auto ahora mismo?
            </h2>
            <p className="text-sm text-white/70">
              No esperes en la berma. Pide asistencia en 60 segundos y recibe el contacto de tu unidad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openSosWithService('grua-hidraulica')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-rose-600/30 transition-all shrink-0 cursor-pointer"
          >
            Pedir auxilio 24/7 ahora →
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTÓN FLOTANTE INFERIOR DERECHO: SOLICITAR SOS            */}
      {/* ========================================================= */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setSosModalOpen(true)}
          className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full shadow-[0_10px_30px_rgba(225,29,72,0.5)] border border-rose-400/40 flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span>Solicitar SOS · Ayuda en minutos</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* MODAL INTERACTIVO DE 3 PASOS: DESPACHO DE EMERGENCIA SOS  */}
      {/* ========================================================= */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1117] border border-white/[0.12] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block">
                  Central de Despacho SOS 24/7 · Paso {sosStep} de 3
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {sosStep === 1 && '1. ¿Qué servicio de urgencia necesitas?'}
                  {sosStep === 2 && '2. ¿Dónde se encuentra el vehículo?'}
                  {sosStep === 3 && '3. Confirma tarifa cerrada y despacho'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSosModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/70 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {sosStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {EMERGENCY_SERVICES.map((srv) => {
                    const active = srv.id === selectedServiceId;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-rose-500/15 border-rose-500 text-white'
                            : 'bg-white/[0.02] border-white/[0.08] text-white/70 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{srv.shortTitle}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-emerald-300">
                            {srv.eta}
                          </span>
                        </div>
                        <div className="text-sm font-black text-rose-400">
                          desde {formatCLP(srv.priceFrom)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sosForm.esSubterraneo}
                    onChange={(e) =>
                      setSosForm((prev) => ({ ...prev, esSubterraneo: e.target.checked }))
                    }
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <span className="text-xs text-white/80">
                    El vehículo está en un <strong>estacionamiento subterráneo</strong>, rampa o tiene la
                    caja automática trabada en Parking.
                  </span>
                </label>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSosStep(2)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Continuar a Ubicación →
                  </button>
                </div>
              </div>
            )}

            {sosStep === 2 && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={gpsLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📍 {gpsLoading ? 'Detectando satélites GPS...' : 'Detectar mi ubicación exacta por GPS'}</span>
                </button>
                {gpsStatus && <p className="text-[11px] text-emerald-400 text-center">{gpsStatus}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Comuna / Sector</label>
                    <input
                      type="text"
                      value={sosForm.comuna}
                      onChange={(e) => setSosForm({ ...sosForm, comuna: e.target.value })}
                      placeholder="Ej. Las Condes, Viña del Mar..."
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Patente del vehículo</label>
                    <input
                      type="text"
                      value={sosForm.patente}
                      onChange={(e) => setSosForm({ ...sosForm, patente: e.target.value.toUpperCase() })}
                      placeholder="Ej. PJKW-84"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-white/60 block mb-1">
                    Calle, intersección o kilómetro de autopista
                  </label>
                  <input
                    type="text"
                    value={sosForm.direccion}
                    onChange={(e) => setSosForm({ ...sosForm, direccion: e.target.value })}
                    placeholder="Ej. Av. Apoquindo 4500, frente a estación de metro"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Marca y Modelo</label>
                    <input
                      type="text"
                      value={sosForm.vehiculo}
                      onChange={(e) => setSosForm({ ...sosForm, vehiculo: e.target.value })}
                      placeholder="Ej. Mazda CX-5 / Peugeot 3008"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Tu teléfono móvil</label>
                    <input
                      type="tel"
                      value={sosForm.telefono}
                      onChange={(e) => setSosForm({ ...sosForm, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSosStep(1)}
                    className="px-4 py-3 rounded-xl bg-white/[0.05] text-white/70 text-xs font-semibold cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosStep(3)}
                    className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Ver Precio Cerrado →
                  </button>
                </div>
              </div>
            )}

            {sosStep === 3 && (
              <div className="space-y-4">
                <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Servicio seleccionado:</span>
                    <span className="text-xs font-bold text-white">{currentService.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Tiempo estimado de llegada:</span>
                    <span className="text-xs font-bold text-emerald-400">{currentService.eta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Ubicación de rescate:</span>
                    <span className="text-xs font-semibold text-white">
                      {sosForm.comuna} — {sosForm.direccion || 'Coordenadas GPS'}
                    </span>
                  </div>
                  <div className="border-t border-white/[0.08] pt-3 mt-2 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-white">Tarifa base cerrada:</span>
                    <span className="text-2xl font-black text-rose-400">
                      {formatCLP(finalEstimatedPrice)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-white/50 leading-relaxed">
                  Al presionar confirmar se guardará tu orden SOS en Supabase, se activará el Radar de
                  Seguimiento en vivo y se abrirá WhatsApp con la central 24/7.
                </p>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSosStep(2)}
                    className="px-4 py-3 rounded-xl bg-white/[0.05] text-white/70 text-xs font-semibold cursor-pointer"
                  >
                    ← Editar ubicación
                  </button>
                  <button
                    type="button"
                    disabled={submittingSos}
                    onClick={handleConfirmSosDispatch}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
                  >
                    {submittingSos ? 'Registrando despacho SOS...' : '🚨 Confirmar y Despachar Unidad Ahora'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE ASISTENTE DE SÍNTOMAS IA                         */}
      {/* ========================================================= */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1117] border border-white/[0.12] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
                  AutoAI · Asistente Técnico Inteligente
                </span>
                <h3 className="text-lg font-black text-white">
                  ¿Qué síntoma presenta tu vehículo?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWizardOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/70 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto pr-1">
              {EMERGENCY_SYMPTOM_WIZARD.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSymptomId(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    selectedSymptomId === item.id
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-white/[0.02] border-white/[0.08] text-white/70 hover:bg-white/[0.05]'
                  }`}
                >
                  {item.symptom}
                </button>
              ))}
            </div>

            <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-4 space-y-2 mb-5">
              <div className="text-xs font-bold text-blue-300">
                Diagnóstico preliminar: {currentSymptom.diagnosis}
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                <strong>Recomendación de seguridad:</strong> {currentSymptom.tip}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
                <span className="text-xs text-white/60">
                  Servicio ideal: <strong className="text-white">{recommendedFromSymptom.title}</strong>
                </span>
                <span className="text-sm font-black text-rose-400">
                  desde {formatCLP(recommendedFromSymptom.priceFrom)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setWizardOpen(false);
                openSosWithService(recommendedFromSymptom.id);
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
            >
              Pedir {recommendedFromSymptom.shortTitle} ahora →
            </button>
          </div>
        </div>
      )}

      <AutoBotAssistant />
      <BottomNav />
    </div>
  );
}
