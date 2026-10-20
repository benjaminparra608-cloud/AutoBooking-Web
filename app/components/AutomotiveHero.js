'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SERVICES, ZONES, whatsappUrl } from '../lib/config';

export default function AutomotiveHero({ onQuickStart }) {
  const [quickPatente, setQuickPatente] = useState('');
  const [quickComuna, setQuickComuna] = useState('');
  const [quickServicio, setQuickServicio] = useState('');

  const todasLasComunas = ZONES.flatMap((z) => z.comunas);
  const waUrl = whatsappUrl('Hola AutoBooking, me gustaría cotizar una atención mecánica a domicilio en Santiago');

  function handleFormSubmit(e) {
    e.preventDefault();
    if (onQuickStart) {
      onQuickStart({
        patente: quickPatente,
        comuna: quickComuna,
        servicio: quickServicio,
      });
    } else {
      const elem = document.getElementById('agendar');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="relative bg-[#080a0d] overflow-hidden border-b border-white/[0.06] flex flex-col">
      {/* Fondo con gradiente sutil y rejilla técnica */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#0c1424,#080a0d_50%,#0a0e1a)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Auras de iluminación ambiental */}
      <div className="absolute top-0 -left-24 w-[480px] h-[480px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-blue-950/25 rounded-full blur-[100px] pointer-events-none" />

      {/* CONTENIDO PRINCIPAL DEL HERO */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* — COLUMNA IZQUIERDA: PROPUESTA DE VALOR (7 COLS) — */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Micro-prueba social superior */}
            <div className="inline-flex items-center gap-2.5 text-xs font-medium text-white/85 bg-white/[0.04] border border-white/[0.09] rounded-full px-4 py-1.5 backdrop-blur-sm">
              <span className="flex text-amber-400 text-xs">★★★★★</span>
              <span className="text-white font-semibold">4.9 / 5</span>
              <span className="text-white/30">·</span>
              <span className="text-white/70">Más de 2.800 conductores en Santiago</span>
            </div>

            {/* H1 Semántico Único con Anclaje Geográfico Inmediato */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black text-white tracking-tight leading-[1.08]">
              Mecánica Automotriz a Domicilio{' '}
              <span className="block text-white/50 font-light italic mt-1.5 sm:mt-2 text-2xl sm:text-4xl lg:text-[2.7rem]">
                en todo Santiago, sin salir de tu casa.
              </span>
            </h1>

            {/* Subtítulo con alto contraste y claridad de oferta (WCAG Compliant) */}
            <p className="text-base sm:text-lg text-white/75 max-w-xl font-light leading-relaxed">
              Mantenimiento por kilometraje, cambio de pastillas y discos, instalación de baterías y escáner computarizado multimarca directamente en tu hogar u oficina con mecánicos certificados.
            </p>

            {/* 1+1 Dominant CTAs (Ley de Hick) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href="#agendar"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Agendar visita a domicilio</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium text-sm px-6 py-4 rounded-full transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
                </svg>
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>

            {/* Garantías de confianza adyacentes a la decisión */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-white/65 font-light pt-2">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Cobertura en 24 comunas de Santiago</span>
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Diagnóstico computarizado con escáner</span>
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Boleta o Factura electrónica con garantía</span>
              </span>
            </div>
          </div>

          {/* — COLUMNA DERECHA: MINI-BOOKING WIDGET (ELIMINA EL SCROLL FRICTION) (5 COLS) — */}
          <div className="lg:col-span-5">
            <div className="bg-[#0d1117] border border-white/[0.10] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              {/* Glow sutil dentro del formulario */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400/90 block">
                    Atención personalizada
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Cotiza y Agenda en 1 Minuto
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En línea</span>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3.5 relative z-10">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                    Placa Patente
                  </label>
                  <input
                    type="text"
                    value={quickPatente}
                    onChange={(e) => setQuickPatente(e.target.value.toUpperCase())}
                    placeholder="Ej: AB-CD-12"
                    className="w-full bg-white/[0.03] border border-white/[0.10] focus:border-blue-500/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none font-mono tracking-wider transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                    Comuna de Atención (Santiago)
                  </label>
                  <select
                    value={quickComuna}
                    onChange={(e) => setQuickComuna(e.target.value)}
                    className="w-full bg-[#080a0d] border border-white/[0.10] focus:border-blue-500/80 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#080a0d] text-white/40">Selecciona tu comuna...</option>
                    {todasLasComunas.map((c) => (
                      <option key={c} value={c} className="bg-[#080a0d] text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                    Servicio Requerido
                  </label>
                  <select
                    value={quickServicio}
                    onChange={(e) => setQuickServicio(e.target.value)}
                    className="w-full bg-[#080a0d] border border-white/[0.10] focus:border-blue-500/80 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#080a0d] text-white/40">Selecciona el tipo de servicio...</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-[#080a0d] text-white">{s}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
                >
                  <span>Continuar con fecha y horario</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <p className="text-[11px] text-white/55 text-center pt-1 font-light">
                  Sin pagos anticipados · Confirmación técnica por WhatsApp
                </p>
              </form>
            </div>
          </div>

        </div>

        {/* ── FRANJA INFERIOR: 3 PILARES ESTABLES (SIN SLIDER ROTATIVO) ── */}
        <div className="border-t border-white/[0.08] mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="#servicios"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-blue-500/30 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 block font-semibold">01 · A Domicilio</span>
                <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">Mecánica & Mantención</h4>
                <p className="text-xs text-white/55 font-light truncate">Frenos, aceite y revisión general en tu casa.</p>
              </div>
            </a>

            <Link
              href="/diagnostico"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-blue-500/30 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/45 block font-semibold">02 · Escáner OBD2</span>
                <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">Diagnóstico Computarizado</h4>
                <p className="text-xs text-white/55 font-light truncate">Lectura de códigos y sensores en tiempo real.</p>
              </div>
            </Link>

            <Link
              href="/baterias"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-blue-500/30 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/45 block font-semibold">03 · Baterías & Tienda</span>
                <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">Baterías con Instalación</h4>
                <p className="text-xs text-white/55 font-light truncate">Bosch, Varta y Hankook a tu puerta.</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
