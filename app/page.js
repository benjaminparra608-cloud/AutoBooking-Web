'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import AutomotiveHero from './components/AutomotiveHero';
import BrandMarquee from './components/BrandMarquee';
import CoverageChecker from './components/CoverageChecker';
import BookingWizard from './components/BookingWizard';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import { SERVICES, ZONES, whatsappUrl } from './lib/config';

const SERVICE_DETAILS = {
  'Instalación y Venta de Baterías': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    description: 'Reemplazamos tu batería a domicilio con diagnóstico del sistema de carga incluido. Olvídate de quedar en panne.',
    badge: 'Servicio a domicilio',
  },
  'Servicio de frenos': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    description: 'Inspección y cambio de pastillas, discos y líquido de frenos directamente en la comodidad de tu hogar u oficina.',
    badge: 'Seguridad garantizada',
  },
  'Diagnósticos Eléctricos': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Revisión avanzada del sistema eléctrico, alternador, partida y fusibles con equipos profesionales de alta precisión.',
    badge: 'Alta precisión',
  },
  'Car Audio': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
    description: 'Instalación de pantallas táctiles, parlantes, cámaras de retroceso y sistemas de sonido personalizados para tu vehículo.',
    badge: 'Entretenimiento y confort',
  },
  'Mantenciones por KM': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    description: 'Cambio de aceite, filtros (aire, aceite, cabina) y revisión general según el kilometraje recomendado por el fabricante.',
    badge: 'Mantén tu garantía',
  },
  'Escaner Automotriz': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    description: 'Lectura y borrado de códigos de falla (DTC), análisis de sensores en tiempo real y diagnóstico completo del motor.',
    badge: 'Diagnóstico computarizado',
  },
  'Inspección Técnica Pre-Compra': {
    icon: (
      <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    description: 'Evaluación exhaustiva de más de 100 puntos (carrocería, motor, escáner e historial) antes de que compres un auto usado.',
    badge: 'Compra con seguridad',
  },
};

const SPECIALIZED_MODULES = [
  {
    title: 'Tienda de Repuestos',
    subtitle: 'Catálogo Online Certificado',
    description: 'Aceites Motul 5W30, pastillas cerámicas Brembo, pantallas CarPlay y bujías Iridium con instalación a domicilio.',
    href: '/tienda',
    action: 'Explorar catálogo',
    icon: (
      <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: 'Baterías de Mayor Rotación',
    subtitle: 'Parque Automotriz Chileno',
    description: 'Formatos DIN, JIS y AGM más demandados en Chile. Hankook, Bosch y Varta instaladas en tu domicilio.',
    href: '/baterias',
    action: 'Ver baterías & precios',
    icon: (
      <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'Diagnóstico por Síntomas',
    subtitle: 'Asistente Mecánico Virtual',
    description: '¿Ruidos al frenar o luces en el panel? Descubre la posible falla y su nivel de urgencia antes de agendar.',
    href: '/diagnostico',
    action: 'Iniciar diagnóstico',
    icon: (
      <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Historial Clínico & GPS',
    subtitle: 'Telemetría Predictiva',
    description: 'Odómetro GPS en tiempo real, vida útil de pastillas, degradación del aceite y estado de batería.',
    href: '/telemetria',
    action: 'Ver mi odómetro',
    icon: (
      <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [preselectedService, setPreselectedService] = useState(null);
  const [preselectedComuna, setPreselectedComuna] = useState(null);
  const heroWa = whatsappUrl('Hola, quiero cotizar un servicio para mi auto');

  function handleAgendarServicio(servicio) {
    setPreselectedService(servicio);
    setSelectedService(null);
    const elem = document.getElementById('agendar');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }

  function handleSelectComuna(comuna) {
    setPreselectedComuna(comuna);
    const elem = document.getElementById('agendar');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }

  const detail = selectedService ? SERVICE_DETAILS[selectedService] : null;

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-32 md:pb-12">
      <Navbar />

      {/* ── HERO ── */}
      <AutomotiveHero />

      {/* ── MARCAS ── */}
      <BrandMarquee />

      {/* ══════════════════════════════════════════
          SERVICIOS TÉCNICOS (Carrusel horizontal)
      ══════════════════════════════════════════ */}
      <section id="servicios" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-2">
                Atención a domicilio
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Servicios Técnicos
              </h2>
            </div>
            <a href="/#agendar" className="text-sm text-blue-400/70 hover:text-blue-300 transition-colors flex items-center gap-1.5 group">
              Agendar un servicio
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Carrusel */}
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {SERVICES.map((servicio, index) => {
              const details = SERVICE_DETAILS[servicio];
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedService(servicio)}
                  className="snap-start shrink-0 w-44 sm:w-48 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-blue-500/30 rounded-2xl p-6 flex flex-col items-start text-left transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:border-blue-500/30 transition-colors">
                    {details?.icon}
                  </div>
                  <span className="text-sm font-medium text-white/70 group-hover:text-white/90 leading-snug transition-colors">
                    {servicio}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MODAL DE SERVICIO ── */}
      {selectedService && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1117] border border-white/[0.10] rounded-2xl p-8 max-w-xl w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5">
              {detail.icon}
            </div>

            <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400/70 mb-2 block">
              {detail.badge}
            </span>
            <h3 className="text-xl font-bold text-white mb-3">{selectedService}</h3>
            <p className="text-sm text-white/45 leading-relaxed mb-7 font-light">
              {detail.description}
            </p>

            <button
              type="button"
              onClick={() => handleAgendarServicio(selectedService)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer"
            >
              Agendar este servicio →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          ¿CÓMO FUNCIONA?
      ══════════════════════════════════════════ */}
      <section id="como-funciona" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            Proceso
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-14">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
            {[
              {
                num: '01',
                title: 'Cotiza y Agenda',
                desc: 'Selecciona tu servicio y el horario que más te acomode en pocos minutos desde cualquier dispositivo.',
                icon: (
                  <svg className="w-5 h-5 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-6 3h.008v.008H7.5v-.008zm0-3h.008v.008H7.5v-.008zm0-3h.008v.008H7.5v-.008z" />
                  </svg>
                ),
              },
              {
                num: '02',
                title: 'Asignamos tu técnico',
                desc: 'Te confirmamos el mecánico experto y la hora exacta de llegada. Sin esperas ni sorpresas.',
                icon: (
                  <svg className="w-5 h-5 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                num: '03',
                title: 'Servicio en tu domicilio',
                desc: 'Llegamos a tu casa u oficina con herramientas y repuestos para realizar el trabajo sin que te muevas.',
                icon: (
                  <svg className="w-5 h-5 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                ),
              },
            ].map((step) => (
              <div key={step.num} className="bg-[#080a0d] p-8 text-left hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-[11px] font-bold text-blue-500/60">{step.num}</span>
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white/80 mb-2">{step.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HUB DE SOLUCIONES ESPECIALIZADAS
      ══════════════════════════════════════════ */}
      <section className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
              Ecosistema AutoBooking
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Soluciones Especializadas
            </h2>
            <p className="text-sm text-white/35 mt-3 font-light">
              Accede directamente a nuestros módulos dedicados: tienda, baterías, diagnóstico y telemetría.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SPECIALIZED_MODULES.map((mod, idx) => (
              <Link
                key={idx}
                href={mod.href}
                className="group flex flex-col bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-blue-500/30 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:border-blue-500/25 transition-colors">
                  {mod.icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">
                  {mod.subtitle}
                </span>
                <h3 className="text-sm font-semibold text-white/80 group-hover:text-white leading-snug mb-3 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-white/30 leading-relaxed font-light flex-1">
                  {mod.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-blue-400/60 group-hover:text-blue-300 transition-colors">
                  {mod.action}
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COBERTURA COMUNAL
      ══════════════════════════════════════════ */}
      <section id="cobertura" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
              Red de atención
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ¿Dónde operamos?
            </h2>
            <p className="text-sm text-white/35 mt-3 max-w-lg mx-auto font-light">
              Cubrimos las comunas principales de la Región Metropolitana con talleres móviles equipados.
            </p>
          </div>

          <div className="mb-10">
            <CoverageChecker onSelectComuna={handleSelectComuna} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ZONES.map((zone) => (
              <div key={zone.name} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400/70 mb-4 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Zona {zone.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {zone.comunas.map((comuna) => (
                    <span
                      key={comuna}
                      className="text-[11px] bg-white/[0.04] border border-white/[0.07] rounded-full px-2.5 py-1 text-white/45"
                    >
                      {comuna}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-white/25 text-xs mt-8">
            ¿No ves tu comuna?{' '}
            <a
              href={whatsappUrl('Hola AutoBooking, consulto cobertura para mi comuna')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400/60 hover:text-blue-300 underline underline-offset-2"
            >
              Consúltanos por WhatsApp
            </a>{' '}
            y coordinamos tu visita.
          </p>
        </div>
      </section>

      {/* ── RESEÑAS ── */}
      <Reviews />

      {/* ── FAQ ── */}
      <FAQ />

      {/* ══════════════════════════════════════════
          AGENDAR (WIZARD)
      ══════════════════════════════════════════ */}
      <section id="agendar" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
              Reserva online
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Agenda tu hora
            </h2>
            <p className="text-sm text-white/35 mt-3 font-light">
              Confirma tu cita en simples pasos. El taller llega a tu puerta.
            </p>
          </div>
          <BookingWizard preselectedService={preselectedService} preselectedComuna={preselectedComuna} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-[#050608] border-t border-white/[0.05]">
        {/* Franja de redes */}
        <div className="border-b border-white/[0.05] py-5 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-white/50 font-light">Síguenos en redes sociales</span>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-white/50 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-white/50 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Columnas */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">AB</span>
                <span className="text-white font-bold tracking-tight">Auto<span className="text-blue-400">Booking</span></span>
              </div>
              <p className="text-xs text-white/30 leading-relaxed font-light">
                Mecánica automotriz y repuestos certificados a domicilio en Santiago de Chile.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Servicios</h4>
              <ul className="space-y-2.5">
                {[
                  ['Baterías', '/baterias'],
                  ['Tienda de Repuestos', '/tienda'],
                  ['Diagnóstico OBD2', '/diagnostico'],
                  ['Telemetría GPS', '/telemetria'],
                  ['Servicios Mecánicos', '/#servicios'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs text-white/35 hover:text-white/70 transition-colors font-light">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Plataforma</h4>
              <ul className="space-y-2.5">
                {[
                  ['Panel de Talleres', '/taller'],
                  ['Planes SaaS', '/planes'],
                  ['Cobertura', '/#cobertura'],
                  ['FAQ', '/#faq'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs text-white/35 hover:text-white/70 transition-colors font-light">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Contacto</h4>
              <p className="text-xs text-white/30 leading-relaxed font-light mb-2">
                Santiago, Región Metropolitana<br />
                Lun–Sáb: 08:30 a 19:30 hrs
              </p>
              <a
                href={heroWa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors font-light"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
                </svg>
                WhatsApp +56 9 1234 5678
              </a>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/20">© 2026 AutoBooking Chile. Todos los derechos reservados.</p>
            <div className="flex gap-5">
              {['Términos y Condiciones', 'Garantía Técnica', 'Privacidad'].map((item) => (
                <a key={item} href="#" className="text-[11px] text-white/20 hover:text-white/50 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}