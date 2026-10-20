'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import SymptomDiagnostic from '../components/SymptomDiagnostic';
import { useRouter } from 'next/navigation';

export default function DiagnosticoPage() {
  const router = useRouter();

  function handleSelectService(servicio) {
    router.push(`/#agendar`);
  }

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE DIAGNÓSTICO */}
      <section className="pt-32 pb-14 px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0c1424]/60 via-[#080a0d] to-[#080a0d]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            Asistente Mecánico Virtual · AutoBooking
          </p>
          <div className="space-y-2 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
              Diagnóstico Asistido por Síntomas
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/40 tracking-tight leading-[1.08] italic">
              en tiempo real.
            </h1>
          </div>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            ¿Tu auto produce un ruido extraño, vibra o encendió un testigo en el panel? Nuestro asistente interactivo te orienta sobre la posible causa antes de agendar.
          </p>
        </div>
      </section>

      {/* COMPONENTE DE DIAGNÓSTICO POR SÍNTOMAS */}
      <main className="py-12">
        <SymptomDiagnostic onSelectService={handleSelectService} />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-8 text-center text-xs text-white/30 font-light">
        <p className="mb-2">© 2026 AutoBooking Chile — Diagnóstico y Escáner Automotriz Computarizado.</p>
        <p>Servicio a domicilio con escáner OBD2 multimarca y técnicos certificados.</p>
      </footer>
    </div>
  );
}
