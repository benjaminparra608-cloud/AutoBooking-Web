'use client';

import React, { useState, useEffect } from 'react';
import { whatsappUrl } from '../lib/config';

const SLIDES = [
  {
    id: '01',
    label: '01',
    tag: 'Mecánica de Precisión',
    badge: 'ESTÁNDAR OFICIAL A DOMICILIO',
    title: 'Mecánica de Precisión sin salir de casa.',
    subtitle: 'Mantenimiento por kilometraje, cambio de frenos y diagnóstico integral con técnicos certificados en la comodidad de tu hogar u oficina.',
    ctaPrimary: 'Agendar mi visita',
    ctaPrimaryHref: '#agendar',
    ctaSecondary: 'Explorar Tienda Online',
    ctaSecondaryHref: '#tienda',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    glowColor: 'rgba(6, 182, 212, 0.15)',
    icon: '🔧',
    summary: 'Servicio técnico automotriz certificado a tu puerta en Santiago.'
  },
  {
    id: '02',
    label: '02',
    tag: 'Diagnóstico Electrónico',
    badge: 'ESCÁNER COMPUTARIZADO OBD2',
    title: 'Tecnología de Escáner y Análisis en Vivo.',
    subtitle: 'Lectura de códigos de falla (DTC), revisión de sensores, alternador y baterías con equipamiento profesional de alta precisión para todas las marcas.',
    ctaPrimary: 'Diagnóstico por Síntomas',
    ctaPrimaryHref: '#diagnostico-sintomas',
    ctaSecondary: 'Ver Cobertura Comunal',
    ctaSecondaryHref: '#cobertura',
    bgGradient: 'from-cyan-950 via-slate-900 to-slate-950',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    icon: '💻',
    summary: 'Detección precisa antes de reparar. Transparencia total.'
  },
  {
    id: '03',
    label: '03',
    tag: 'Tienda & Equipamiento',
    badge: 'REPUESTOS & UPGRADES PREMIUM',
    title: 'Repuestos Genuinos con Instalación Incluida.',
    subtitle: 'Baterías AGM, pastillas cerámicas Brembo, lubricantes sintéticos Motul y pantallas CarPlay inalámbricas listas para tu vehículo.',
    ctaPrimary: 'Ver Productos en Tienda',
    ctaPrimaryHref: '#tienda',
    ctaSecondary: 'Cotizador Rápido',
    ctaSecondaryHref: '#cotizador',
    bgGradient: 'from-slate-900 via-blue-950 to-slate-950',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    icon: '⚡',
    summary: 'Catálogo online con opción de instalación a domicilio.'
  }
];

export default function AutomotiveHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotación automática suave cada 7 segundos si el usuario no tiene el mouse encima
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = SLIDES[activeSlide];
  const waUrl = whatsappUrl("Hola AutoBooking, me gustaría cotizar una atención a domicilio para mi vehículo");

  return (
    <header
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 min-h-[660px] flex flex-col justify-between pt-8 pb-8 transition-colors duration-700"
    >
      {/* Luces y fondos cinemáticos de escenario automotriz */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07] pointer-events-none" />
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: current.glowColor }}
      />
      <div className="absolute -bottom-10 right-10 w-80 h-80 rounded-full blur-[120px] bg-blue-600/10 pointer-events-none" />

      {/* CONTENIDO PRINCIPAL DEL HERO */}
      <div className="max-w-6xl mx-auto px-4 w-full relative z-10 py-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Columna Izquierda: Tipografía Editorial y CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Badge de Categoría con Acabado Automotriz */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold uppercase tracking-widest text-slate-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-extrabold">{current.badge}</span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400">Chile</span>
            </div>

            {/* Gran Título Editorial */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] transition-all duration-500">
              {current.title.split('. ')[0]}.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 font-serif italic font-normal block sm:inline">
                {current.title.split('. ')[1] || ''}
              </span>
            </h1>

            {/* Subtítulo descriptivo */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed">
              {current.subtitle}
            </p>

            {/* Botones de Acción Estilo Cápsula Luxury */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={current.ctaPrimaryHref}
                className="bg-white hover:bg-slate-100 text-slate-950 font-black text-sm py-3.5 px-8 rounded-full shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{current.ctaPrimary}</span>
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                  →
                </span>
              </a>

              <a
                href={current.ctaSecondaryHref}
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/90 font-bold text-sm py-3.5 px-7 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>{current.ctaSecondary}</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 text-emerald-400 font-bold text-sm py-3.5 px-5 rounded-full transition-all flex items-center justify-center gap-2"
                title="Atención inmediata vía WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas Flotantes con Mockup y Features (Estilo Delta) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {/* Card 1: Pase Digital y Agendamiento 24/7 */}
            <a
              href="#agendar"
              className="group bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-cyan-500/50 p-4 sm:p-5 rounded-3xl transition-all shadow-xl hover:shadow-cyan-500/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  🎫
                </div>
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Innovación Exclusiva</span>
                  <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
                    Pase Digital de Agendamiento
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    Confirmación inmediata con enlace a Google Calendar y OT.
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors text-base font-bold ml-2">
                →
              </span>
            </a>

            {/* Card 2: Tienda de Repuestos & Upgrades */}
            <a
              href="#tienda"
              className="group bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-amber-500/50 p-4 sm:p-5 rounded-3xl transition-all shadow-xl hover:shadow-amber-500/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  🛍️
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Catálogo Online</span>
                  <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-amber-300 transition-colors">
                    Repuestos & Baterías de Alta Gama
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    Bosch, Brembo, Motul y CarPlay con opción de instalación a domicilio.
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors text-base font-bold ml-2">
                →
              </span>
            </a>

            {/* Card 3: Garantía Técnica y Respaldo */}
            <div className="bg-gradient-to-r from-slate-900/60 to-slate-950/60 border border-slate-800/60 p-4 rounded-3xl flex items-center gap-4 text-xs text-slate-400">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xl flex items-center justify-center shrink-0">
                🛡️
              </div>
              <div>
                <strong className="text-slate-200 block text-xs font-semibold">100% Garantía Técnica Certificada</strong>
                <span>Emitimos Factura o Boleta Electrónica con trazabilidad de repuestos.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* NAVEGADOR DE CAPÍTULOS / SLIDES INFERIOR (Estilo Delta 01 - 02 - 03) */}
      <div className="max-w-6xl mx-auto px-4 w-full relative z-10 pt-4">
        <div className="border-t border-slate-800/90 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium hidden md:block">
            Explora las soluciones de AutoBooking:
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full md:w-auto">
            {SLIDES.map((slide, index) => {
              const isActive = index === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`text-left group transition-all p-2 rounded-2xl cursor-pointer ${
                    isActive
                      ? 'bg-slate-900/90 border border-slate-700/80 shadow-md'
                      : 'hover:bg-slate-900/40 border border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Línea de progreso superior */}
                  <div className="h-0.5 w-full bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isActive ? 'bg-cyan-400 w-full' : 'w-0'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-cyan-400">{slide.label}</span>
                    <span className="text-xs font-bold text-white truncate max-w-[140px] block">
                      {slide.tag}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 hidden sm:block">
                    {slide.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
