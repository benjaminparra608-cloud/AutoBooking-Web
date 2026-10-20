'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import AutomotiveStore from '../components/AutomotiveStore';
import { whatsappUrl } from '../lib/config';

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE LA TIENDA */}
      <section className="pt-28 pb-10 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>🛍️</span> Tienda Oficial AutoBooking
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Repuestos & Upgrades Automotrices{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 font-serif italic font-normal">
              con Instalación a Domicilio
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3 font-light">
            Selecciona tus repuestos certificados con entrega rápida en Santiago o solicita la visita de un mecánico especializado para instalarlo en la puerta de tu casa.
          </p>

          {/* BADGES DE CONFIANZA */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="text-emerald-400">✓</span> 100% Repuestos Originales
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="text-cyan-400">⚡</span> Despacho Express en Santiago
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="text-amber-400">🔧</span> Opción de Instalación Profesional
            </span>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE LA TIENDA */}
      <main className="py-6">
        <AutomotiveStore />
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-slate-400 border-t border-slate-900 py-10 px-4 text-center text-xs">
        <p className="mb-2">© 2026 AutoBooking Chile — Tienda Oficial de Repuestos & Upgrades.</p>
        <p className="text-slate-500">
          ¿Dudas sobre compatibilidad?{' '}
          <a
            href={whatsappUrl("Hola AutoBooking, tengo dudas sobre compatibilidad de un repuesto de la tienda")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline font-semibold"
          >
            Consúltanos por WhatsApp
          </a>
        </p>
      </footer>
    </div>
  );
}
