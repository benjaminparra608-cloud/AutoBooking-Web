'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import AutomotiveStore from '../components/AutomotiveStore';
import { whatsappUrl } from '../lib/config';

export default function TiendaPage() {
  const waUrl = whatsappUrl("Hola AutoBooking, tengo dudas sobre compatibilidad de un repuesto de la tienda");

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-32 md:pb-12">
      <Navbar />

      {/* HEADER DEDICADO DE LA TIENDA */}
      <section className="pt-32 pb-14 px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0c1424]/60 via-[#080a0d] to-[#080a0d]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            Catálogo Oficial · AutoBooking
          </p>
          <div className="space-y-2 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
              Repuestos & Upgrades
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/40 tracking-tight leading-[1.08] italic">
              con instalación in situ.
            </h1>
          </div>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Repuestos nuevos sellados con certificación de fabricante para entrega rápida en Santiago o instalación profesional en tu domicilio.
          </p>

          {/* BADGES DE CONFIANZA */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-8 text-xs text-white/60">
            <span className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full font-light">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              100% Repuestos Originales
            </span>
            <span className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full font-light">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Despacho Express Santiago
            </span>
            <span className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full font-light">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03" />
              </svg>
              Instalación a Domicilio Opcional
            </span>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE LA TIENDA */}
      <main className="py-12">
        <AutomotiveStore />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-8 text-center text-xs text-white/30 font-light">
        <p className="mb-2">© 2026 AutoBooking Chile — Catálogo Oficial de Repuestos & Upgrades Automotrices.</p>
        <p>
          ¿Dudas sobre compatibilidad para tu vehículo?{' '}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-medium"
          >
            Consúltanos por WhatsApp
          </a>
        </p>
      </footer>
    </div>
  );
}
