'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import VehicleHealthTracker from '../components/VehicleHealthTracker';

export default function TelemetriaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE TELEMETRÍA */}
      <section className="pt-28 pb-10 px-4 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 border-b border-indigo-900/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-700/60 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>📡</span> Telemetría & Conectividad Vehicular
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Historial Clínico Automotriz &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 font-serif italic font-normal">
              Monitor de Desgaste en Vivo
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3 font-light">
            Monitorea el kilometraje proyectado por odómetro GPS, vida útil de pastillas de freno, porcentaje de degradación del aceite y estado de carga de tu batería.
          </p>
        </div>
      </section>

      {/* COMPONENTE DE TELEMETRÍA E HISTORIAL CLÍNICO */}
      <main className="py-6">
        <VehicleHealthTracker />
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-slate-400 border-t border-slate-900 py-10 px-4 text-center text-xs">
        <p className="mb-2">© 2026 AutoBooking Chile — Plataforma de Telemetría y Mantención Predictiva.</p>
        <p className="text-slate-500">
          Toda la información se sincroniza de forma segura con tu cuenta de cliente y el taller central.
        </p>
      </footer>
    </div>
  );
}
