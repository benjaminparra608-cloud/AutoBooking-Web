'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import BatteryFinder from '../components/BatteryFinder';
import { whatsappUrl } from '../lib/config';

export default function BateriasPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE BATERÍAS */}
      <section className="pt-28 pb-8 px-4 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-b border-amber-900/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/90 border border-amber-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>⚡</span> Servicio Especializado de Baterías
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Línea de Baterías de Alta Rotación{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 font-serif italic font-normal">
              con Instalación In Situ
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3 font-light">
            Modelos exactos para el parque automotriz chileno. Diagnóstico de alternador y sistema de carga computarizado incluido con cada recambio.
          </p>

          {/* BANNER DE PANNE URGENTE */}
          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">🚨</span>
              <div>
                <strong className="text-white text-xs sm:text-sm block">¿Te quedaste en panne ahora mismo?</strong>
                <span className="text-[11px] text-slate-400">Despacho express prioritario a tu ubicación en Santiago.</span>
              </div>
            </div>
            <a
              href={whatsappUrl("¡Auxilio! Me quedé en panne de batería y necesito recambio a domicilio urgente")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-full transition-all shrink-0 shadow-lg shadow-amber-500/20"
            >
              Pedir Auxilio Inmediato →
            </a>
          </div>
        </div>
      </section>

      {/* COMPONENTE MAESTRO DE BATERÍAS */}
      <main>
        <BatteryFinder />
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-slate-400 border-t border-slate-900 py-10 px-4 text-center text-xs">
        <p className="mb-2">© 2026 AutoBooking Chile — Especialistas en Baterías Automotrices a Domicilio.</p>
        <p className="text-slate-500">
          Garantía directa de 18 a 24 meses por escrito en cada instalación.
        </p>
      </footer>
    </div>
  );
}
