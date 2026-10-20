'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import SymptomDiagnostic from '../components/SymptomDiagnostic';
import { useRouter } from 'next/navigation';

export default function DiagnosticoPage() {
  const router = useRouter();

  function handleSelectService(servicio) {
    // Redirigir a la página principal a la sección de agendar con el servicio preseleccionado
    router.push(`/#agendar`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE DIAGNÓSTICO */}
      <section className="pt-28 pb-10 px-4 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950 border-b border-blue-900/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-700/60 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>🩺</span> Asistente Mecánico Virtual
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Diagnóstico Asistido por Síntomas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 font-serif italic font-normal">
              en Tiempo Real
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3 font-light">
            ¿Tu auto hace un ruido extraño, vibra o encendió un testigo en el tablero? Nuestro asistente interactivo te orienta sobre la posible causa antes de agendar.
          </p>
        </div>
      </section>

      {/* COMPONENTE DE DIAGNÓSTICO POR SÍNTOMAS */}
      <main className="py-6">
        <SymptomDiagnostic onSelectService={handleSelectService} />
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-slate-400 border-t border-slate-900 py-10 px-4 text-center text-xs">
        <p className="mb-2">© 2026 AutoBooking Chile — Diagnóstico y Escáner Automotriz Computarizado.</p>
        <p className="text-slate-500">
          Servicio a domicilio con escáner OBD2 multimarca y técnicos certificados.
        </p>
      </footer>
    </div>
  );
}
