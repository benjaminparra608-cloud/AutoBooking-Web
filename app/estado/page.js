'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import BottomNav from '../../components/BottomNav';

export default function EstadoBuscadorPage() {
  const router = useRouter();
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const clean = patente.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
    if (clean.length < 5) {
      setError('Por favor ingresa una patente chilena válida (ej. KLMN34 o AB1234)');
      return;
    }
    router.push(`/estado/${clean}`);
  }

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto px-4 py-20 w-full flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            AutoBooking Live Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">
            Seguimiento en Vivo de tu Auto
          </h1>
          <p className="text-white/50 text-xs sm:text-sm font-light max-w-md mx-auto">
            Ingresa la patente de tu vehículo para ver el avance técnico de tu reparación en tiempo real.
          </p>
        </div>

        <div className="bg-[#0d121c]/90 border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-2 font-medium uppercase tracking-wider">
                Patente del Vehículo
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={7}
                  value={patente}
                  onChange={(e) => {
                    setPatente(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="ej. KLMN-34"
                  className="w-full bg-white/[0.03] border-2 border-white/[0.1] focus:border-blue-500 rounded-xl px-4 py-3.5 text-center text-2xl font-mono font-bold tracking-widest text-white placeholder-white/20 outline-none uppercase transition-all shadow-inner"
                />
              </div>
              {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              Consultar Estado en Vivo
            </button>
          </form>

          {/* Acceso Rápido Demo */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <span className="text-[11px] text-white/40 block mb-2">O prueba con patentes activas de demostración:</span>
            <div className="flex justify-center gap-2 flex-wrap">
              {['KLMN-34', 'ABCD-12', 'FGHJ-56'].map((demoPatente) => (
                <button
                  key={demoPatente}
                  type="button"
                  onClick={() => router.push(`/estado/${demoPatente.replace('-', '')}`)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-mono text-xs font-semibold transition-all cursor-pointer"
                >
                  {demoPatente}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
