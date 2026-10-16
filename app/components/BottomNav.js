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
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-medium">Inicio</span>
            </a>

            {/* 2. Servicios */}
            <a href="#servicios" className="flex flex-col items-center p-2 text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-medium">Servicios</span>
            </a>

            {/* 2.2 Tienda Online */}
            <a href="#tienda" className="flex flex-col items-center p-2 text-amber-400 hover:text-amber-300 transition-colors">
              <span className="text-base mb-0.5">🛍️</span>
              <span className="text-[10px] font-medium font-bold">Tienda</span>
            </a>

            {/* 2.5 Cotizar */}
            <a href="#cotizador" className="flex flex-col items-center p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-[10px] font-medium">Cotizar</span>
            </a>

            {/* 3. Agendar */}
            <a href="#agendar" className="flex flex-col items-center p-2 text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-medium">Agendar</span>
            </a>

            {/* 4. Chat / WhatsApp */}
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-2 text-slate-400 hover:text-green-400 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-[10px] font-medium">Chat</span>
            </a>
          </>
        ) : (
          <>
            {/* Accesos rápidos del taller — placeholders hasta que se implementen */}
            <span className="flex flex-col items-center p-2 text-slate-500">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-[10px] font-medium">Citas</span>
            </span>
            <span className="flex flex-col items-center p-2 text-slate-500">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-[10px] font-medium">Gestión</span>
            </span>
            <span className="flex flex-col items-center p-2 text-slate-500">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-[10px] font-medium">Reportes</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
