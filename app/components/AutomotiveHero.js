'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { whatsappUrl } from '../lib/config';

const SLIDES = [
  {
    id: '01',
    tag: 'Mecánica de Precisión',
    badge: 'SERVICIO A DOMICILIO · SANTIAGO',
    title: 'Mecánica de Precisión',
    accent: 'sin salir de casa.',
    subtitle: 'Mantenimiento por kilometraje, cambio de frenos y diagnóstico integral con técnicos certificados directamente en tu domicilio u oficina.',
    ctaPrimary: 'Agendar visita',
    ctaPrimaryHref: '/#agendar',
    ctaSecondary: 'Ver servicios',
    ctaSecondaryHref: '/#servicios',
    stat1: { value: '+2.800', label: 'Servicios realizados' },
    stat2: { value: '4.9★', label: 'Calificación promedio' },
  },
  {
    id: '02',
    tag: 'Diagnóstico Electrónico',
    badge: 'ESCÁNER OBD2 · DIAGNÓSTICO COMPUTARIZADO',
    title: 'Tecnología de Escáner',
    accent: 'en tiempo real.',
    subtitle: 'Lectura de códigos de falla, análisis de sensores y revisión completa del sistema eléctrico con equipamiento de taller profesional multimarca.',
    ctaPrimary: 'Diagnóstico asistido',
    ctaPrimaryHref: '/diagnostico',
    ctaSecondary: 'Ver cobertura',
    ctaSecondaryHref: '/#cobertura',
    stat1: { value: '100%', label: 'Diagnóstico digital' },
    stat2: { value: '72h', label: 'Garantía de resultado' },
  },
  {
    id: '03',
    tag: 'Repuestos & Upgrades',
    badge: 'CATÁLOGO OFICIAL · MARCAS PREMIUM',
    title: 'Repuestos Genuinos',
    accent: 'con instalación incluida.',
    subtitle: 'Baterías AGM Bosch y Hankook, pastillas cerámicas Brembo, lubricantes Motul 5W30 y pantallas CarPlay inalámbricas para tu vehículo.',
    ctaPrimary: 'Explorar tienda',
    ctaPrimaryHref: '/tienda',
    ctaSecondary: 'Ver baterías',
    ctaSecondaryHref: '/baterias',
    stat1: { value: '+40', label: 'Productos en stock' },
    stat2: { value: '18M', label: 'Garantía de fábrica' },
  },
];

export default function AutomotiveHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const DURATION = 7000;

  useEffect(() => {
    if (isPaused) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActiveSlide((p) => (p + 1) % SLIDES.length);
        clearInterval(tick);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [activeSlide, isPaused]);

  const current = SLIDES[activeSlide];
  const waUrl = whatsappUrl('Hola AutoBooking, me gustaría cotizar una atención a domicilio para mi vehículo');

  return (
    <header
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#080a0d] overflow-hidden border-b border-white/[0.06] min-h-[680px] flex flex-col"
    >
      {/* Fondo con gradiente sutil y rejilla */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#0c1424,#080a0d_50%,#0a0e1a)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Glow azul lateral */}
      <div className="absolute top-0 -left-24 w-[480px] h-[480px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-blue-950/30 rounded-full blur-[100px] pointer-events-none" />

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 lg:px-8">

        {/* GRID PRINCIPAL — texto + tarjetas */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-24">

          {/* — COLUMNA IZQUIERDA — */}
          <div className="space-y-8">
            {/* Badge de categoría */}
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-blue-400 bg-blue-950/40 border border-blue-800/50 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {current.badge}
            </div>

            {/* Título editorial */}
            <div className="space-y-2">
              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.05]">
                {current.title}
              </h1>
              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-light text-white/50 tracking-tight leading-[1.05] italic">
                {current.accent}
              </h1>
            </div>

            {/* Subtítulo */}
            <p className="text-base lg:text-lg text-white/50 max-w-lg font-light leading-relaxed">
              {current.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={current.ctaPrimaryHref}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25"
              >
                {current.ctaPrimary}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href={current.ctaSecondaryHref}
                className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white/80 font-medium text-sm px-7 py-3.5 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                {current.ctaSecondary}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-400 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-200 sm:px-5"
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>

            {/* Stats en línea */}
            <div className="flex gap-8 pt-4 border-t border-white/[0.06]">
              <div>
                <p className="text-2xl font-black text-white">{current.stat1.value}</p>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">{current.stat1.label}</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">{current.stat2.value}</p>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">{current.stat2.label}</p>
              </div>
            </div>
          </div>

          {/* — COLUMNA DERECHA — Tarjetas Feature */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Card 1 */}
            <Link
              href="/#agendar"
              className="group flex items-center gap-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-0.5">Exclusivo</p>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Pase Digital de Agendamiento</h3>
                <p className="text-xs text-white/35 mt-0.5 truncate">Confirmación inmediata con enlace a Google Calendar y OT.</p>
              </div>
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Card 2 */}
            <Link
              href="/tienda"
              className="group flex items-center gap-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mb-0.5">Catálogo Online</p>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Repuestos & Baterías de Alta Gama</h3>
                <p className="text-xs text-white/35 mt-0.5 truncate">Bosch, Brembo, Motul y CarPlay con instalación a domicilio.</p>
              </div>
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Card 3 — Trust */}
            <div className="flex items-center gap-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
              <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60">100% Garantía Técnica Certificada</p>
                <p className="text-[11px] text-white/30 mt-0.5">Factura o boleta electrónica con trazabilidad completa de repuestos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TABS INFERIORES DE NAVEGACIÓN DE SLIDES */}
        <div className="border-t border-white/[0.06] py-5">
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {SLIDES.map((slide, index) => {
              const isActive = index === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => { setActiveSlide(index); setProgress(0); }}
                  className={`text-left group transition-all duration-300 cursor-pointer p-3 rounded-xl ${
                    isActive ? 'bg-white/[0.05]' : 'opacity-40 hover:opacity-70 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="h-[2px] w-full bg-white/10 rounded-full mb-3 overflow-hidden">
                    {isActive && (
                      <div
                        className="h-full bg-blue-500 rounded-full transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] font-bold text-blue-500/80">{slide.id}</span>
                    <span className="text-xs font-semibold text-white/80 truncate">{slide.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
