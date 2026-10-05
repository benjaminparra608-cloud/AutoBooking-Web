import React from 'react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 hidden md:block">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo con monograma AB estilizado */}
        <a href="#" className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/25 border border-blue-400/30">
            AB
          </span>
          Auto<span className="text-cyan-400">Booking</span>
        </a>

        {/* Enlaces de navegación */}
        <div className="flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">Cómo funciona</a>
          <a href="#servicios" className="hover:text-cyan-400 transition-colors">Servicios</a>
          <a href="#cobertura" className="hover:text-cyan-400 transition-colors">Cobertura</a>
        </div>

        {/* Botón de acción rápido */}
        <div>
          <a
            href="#agendar"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md shadow-blue-600/30 transition-all"
          >
            Agendar ahora
          </a>
        </div>
      </div>
    </nav>
  );
}