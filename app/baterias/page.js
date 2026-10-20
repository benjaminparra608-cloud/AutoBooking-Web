'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import BatteryFinder from '../components/BatteryFinder';
import { whatsappUrl } from '../lib/config';

export default function BateriasPage() {
  const panneWa = whatsappUrl("¡Auxilio! Me quedé en panne de batería y necesito recambio a domicilio urgente");

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE BATERÍAS */}
      <section className="pt-32 pb-14 px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0c1424]/60 via-[#080a0d] to-[#080a0d]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            Servicio Especializado · AutoBooking
          </p>
          <div className="space-y-2 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
              Baterías de Mayor Rotación
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/40 tracking-tight leading-[1.08] italic">
              con instalación in situ.
            </h1>
          </div>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Formatos normalizados para el parque automotriz chileno. Diagnóstico computarizado de alternador y sistema de carga incluido sin costo con tu recambio.
          </p>

          {/* BANNER DE PANNE URGENTE */}
          <div className="mt-8 max-w-2xl mx-auto p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <strong className="text-white text-sm block font-semibold">¿Quedaste en panne ahora mismo?</strong>
                <span className="text-xs text-white/40 font-light">Despacho express prioritario a tu ubicación en Santiago.</span>
              </div>
            </div>
            <a
              href={panneWa}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-5 rounded-full transition-all shrink-0 whitespace-nowrap shadow-md shadow-blue-600/20"
            >
              Pedir auxilio inmediato →
            </a>
          </div>
        </div>
      </section>

      {/* COMPONENTE MAESTRO DE BATERÍAS */}
      <main>
        <BatteryFinder />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-8 text-center text-xs text-white/30 font-light">
        <p className="mb-2">© 2026 AutoBooking Chile — Especialistas en Baterías Automotrices a Domicilio.</p>
        <p>Garantía directa de 18 a 24 meses por escrito en cada instalación.</p>
      </footer>
    </div>
  );
}
