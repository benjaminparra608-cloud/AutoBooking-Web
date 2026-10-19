'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { whatsappUrl } from '../lib/config';

export default function BottomNav() {
  const waLink = whatsappUrl("Hola, necesito ayuda con mi vehículo");
  const pathname = usePathname();
  const isTaller = pathname === '/taller';
  const isPlanes = pathname === '/planes';
  const isCliente = !isTaller && !isPlanes;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 z-50 md:hidden flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">

      {/* Selector de sección (franja superior del nav móvil) */}
      <div className="flex border-b border-slate-800">
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors ${
            isCliente
              ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-950/60'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>🚗</span>
          Clientes
        </Link>
        <Link
          href="/taller"
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors ${
            isTaller
              ? 'text-cyan-400 border-b-2 border-cyan-500 bg-slate-950/60'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>🔧</span>
          Taller
        </Link>
        <Link
          href="/planes"
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors ${
            isPlanes
              ? 'text-amber-400 border-b-2 border-amber-500 bg-slate-950/60'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>💼</span>
          Planes SaaS
        </Link>
      </div>

      {/* Accesos rápidos — cambian según la sección activa */}
      <div className="flex justify-around items-center pb-3 pt-1.5 px-1">
        {isPlanes ? (
          <>
            <a href="#planes" className="flex flex-col items-center p-2 text-slate-400 hover:text-amber-400 transition-colors">
              <span className="text-base mb-0.5">🏷️</span>
              <span className="text-[10px] font-medium">Planes</span>
            </a>
            <a href="#caracteristicas" className="flex flex-col items-center p-2 text-slate-400 hover:text-amber-400 transition-colors">
              <span className="text-base mb-0.5">⚡</span>
              <span className="text-[10px] font-medium">Ventajas</span>
            </a>
            <a href="#demo" className="flex flex-col items-center p-2 text-amber-400 hover:text-amber-300 transition-colors">
              <span className="text-base mb-0.5">🚀</span>
              <span className="text-[10px] font-medium font-bold">Pedir Demo</span>
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-2 text-slate-400 hover:text-green-400 transition-colors">
              <span className="text-base mb-0.5">💬</span>
              <span className="text-[10px] font-medium">WhatsApp</span>
            </a>
          </>
        ) : isCliente ? (
          <>
            {/* 1. Inicio */}
            <a href="#" className="flex flex-col items-center p-2 text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-medium">Inicio</span>
            </a>

            {/* 2. Telemetría & Desgaste */}
            <a href="#monitor-desgaste" className="flex flex-col items-center p-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              <span className="text-base mb-0.5">📡</span>
              <span className="text-[10px] font-bold">Desgaste</span>
            </a>

            {/* 3. Tienda Online */}
            <a href="#tienda" className="flex flex-col items-center p-2 text-amber-400 hover:text-amber-300 transition-colors">
              <span className="text-base mb-0.5">🛍️</span>
              <span className="text-[10px] font-medium font-bold">Tienda</span>
            </a>

            {/* 4. Cotizar */}
            <a href="#cotizador" className="flex flex-col items-center p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-[10px] font-medium">Cotizar</span>
            </a>

            {/* 5. Agendar */}
            <a href="#agendar" className="flex flex-col items-center p-2 text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-medium">Agendar</span>
            </a>

            {/* 6. Chat / WhatsApp */}
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-2 text-slate-400 hover:text-green-400 transition-colors">
              <span className="text-base mb-0.5">💬</span>
              <span className="text-[10px] font-medium">Chat</span>
            </a>
          </>
        ) : (
          <>
            {/* Accesos rápidos del taller */}
            <Link href="/taller?tab=citas" className="flex flex-col items-center p-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              <span className="text-base mb-0.5">📅</span>
              <span className="text-[10px] font-medium">Citas</span>
            </Link>
            <Link href="/taller?tab=ordenes" className="flex flex-col items-center p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <span className="text-base mb-0.5">📋</span>
              <span className="text-[10px] font-medium">OTs</span>
            </Link>
            <Link href="/taller?tab=detailing" className="flex flex-col items-center p-2 text-amber-400 hover:text-amber-300 transition-colors">
              <span className="text-base mb-0.5">✨</span>
              <span className="text-[10px] font-medium font-bold">Detailing</span>
            </Link>
            <Link href="/taller?tab=inventario" className="flex flex-col items-center p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <span className="text-base mb-0.5">📦</span>
              <span className="text-[10px] font-medium">Stock</span>
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-2 text-slate-400 hover:text-green-400 transition-colors">
              <span className="text-base mb-0.5">💬</span>
              <span className="text-[10px] font-medium">Ayuda</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
