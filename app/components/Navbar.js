'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isTaller = pathname === '/taller';
  const isCliente = !isTaller;

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 hidden md:block">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo con monograma AB estilizado */}
        <Link href="/" className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/25 border border-blue-400/30">
            AB
          </span>
          Auto<span className="text-cyan-400">Booking</span>
        </Link>

        {/* Selector de modo: Cliente / Taller */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-full p-1 gap-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              isCliente
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚗</span>
            Servicios al Cliente
          </Link>
          <Link
            href="/taller"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              isTaller
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔧</span>
            Panel Taller
          </Link>
        </div>

        {/* Botón de acción rápido (solo en página cliente) */}
        {isCliente && (
          <div>
            <a
              href="#agendar"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md shadow-blue-600/30 transition-all"
            >
              Agendar ahora
            </a>
          </div>
        )}

        {/* Espacio espejo en taller para balancear el layout */}
        {isTaller && (
          <div className="w-[130px]" />
        )}
      </div>
    </nav>
  );
}