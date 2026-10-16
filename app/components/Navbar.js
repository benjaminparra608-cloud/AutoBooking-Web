'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCart();
  const isTaller = pathname === '/taller';
  const isPlanes = pathname === '/planes';
  const isCliente = !isTaller && !isPlanes;

  return (
    <>
      {/* Barra Móvil Superior Compacta */}
      <nav className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5 flex md:hidden items-center justify-between shadow-lg">
        <Link href="/" className="text-base font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/30 border border-cyan-300/40">
            AB
          </span>
          <span className="text-sm">
            Auto<span className="text-cyan-400 font-extrabold">Booking</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Botón Carrito en Móvil */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold p-2 rounded-full flex items-center justify-center transition-all cursor-pointer"
            aria-label="Abrir Carrito"
          >
            <span className="text-sm">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Agendar o Volver en Móvil */}
          {isCliente ? (
            <a
              href="#agendar"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-full shadow-md transition-all flex items-center gap-1"
            >
              <span>Agendar</span>
              <span>→</span>
            </a>
          ) : (
            <Link
              href="/"
              className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 rounded-full border border-slate-700"
            >
              Inicio
            </Link>
          )}
        </div>
      </nav>

      {/* Barra de navegación superior para pantallas grandes */}
      <nav className="sticky top-3 z-50 w-full px-4 hidden md:block">
      <div className="max-w-6xl mx-auto bg-slate-950/90 backdrop-blur-xl border border-slate-700/70 shadow-[0_10px_35px_rgba(0,0,0,0.7)] rounded-full px-5 py-2 flex items-center justify-between transition-all">
        
        {/* LOGO & ENLACES DE NAVEGACIÓN PRIMARIOS */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-black tracking-tight text-white flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/30 border border-cyan-300/40 group-hover:scale-105 transition-transform">
              AB
            </span>
            <span>
              Auto<span className="text-cyan-400 font-extrabold">Booking</span>
            </span>
          </Link>

          {/* Menú de Anclaje Rápido en Home */}
          {isCliente && (
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
              <a href="#servicios" className="hover:text-cyan-400 transition-colors">
                Servicios
              </a>
              <a href="#diagnostico-sintomas" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>🩺</span>
                <span>Diagnóstico</span>
              </a>
              <a href="#tienda" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-300">
                <span>🛍️</span>
                <span>Tienda Online</span>
              </a>
              <a href="#cobertura" className="hover:text-cyan-400 transition-colors">
                Cobertura
              </a>
              <a href="#cotizador" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>⚡</span>
                <span>Cotizador</span>
              </a>
            </div>
          )}
        </div>

        {/* SELECTOR DE MODO: CLIENTES / PANEL TALLER / PLANES SAAS */}
        <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full p-1 gap-1 shadow-inner">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isCliente
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚗</span>
            <span>Clientes</span>
          </Link>
          <Link
            href="/taller"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isTaller
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔧</span>
            <span>Panel Taller</span>
          </Link>
          <Link
            href="/planes"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isPlanes
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>💼</span>
            <span>Planes SaaS</span>
          </Link>
        </div>

        {/* BOTÓN DE ACCIÓN / BADGE DE REGIÓN */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 hidden xl:flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <span>🇨🇱</span>
            <span>Santiago, CL</span>
          </span>

          {/* Botón Carrito en Navbar */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            title="Abrir Carrito de Repuestos"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {isCliente ? (
            <a
              href="#agendar"
              className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs py-2 px-5 rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <span>Agendar Visita</span>
              <span className="text-cyan-600 font-black">→</span>
            </a>
          ) : isPlanes ? (
            <a
              href="#demo"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs py-2 px-5 rounded-full shadow-lg transition-all"
            >
              Pedir Demo Gratis
            </a>
          ) : (
            <a
              href="/"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs py-2 px-4 rounded-full transition-all"
            >
              Volver a la Web
            </a>
          )}
        </div>

      </div>
    </nav>
  </>
);
}