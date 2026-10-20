'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import VehicleHealthTracker from '../components/VehicleHealthTracker';

export default function TelemetriaPage() {
  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE TELEMETRÍA */}
      <section className="pt-32 pb-14 px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0c1424]/60 via-[#080a0d] to-[#080a0d]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            Telemetría & Conectividad Vehicular · AutoBooking
          </p>
          <div className="space-y-2 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
              Historial Clínico Automotriz
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/40 tracking-tight leading-[1.08] italic">
              y monitor de desgaste en vivo.
            </h1>
          </div>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Monitorea el kilometraje proyectado por odómetro GPS, la vida útil de pastillas de freno, el porcentaje de degradación del aceite y el estado de tu batería.
          </p>
        </div>
      </section>

      {/* COMPONENTE DE TELEMETRÍA E HISTORIAL CLÍNICO */}
      <main className="py-12">
        <VehicleHealthTracker />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-8 text-center text-xs text-white/30 font-light">
        <p className="mb-2">© 2026 AutoBooking Chile — Plataforma de Telemetría y Mantención Predictiva.</p>
        <p>Toda la información se sincroniza de forma segura con tu cuenta de cliente y el taller central.</p>
      </footer>
    </div>
  );
}
