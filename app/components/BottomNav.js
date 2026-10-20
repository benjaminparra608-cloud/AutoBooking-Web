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
    <div className="fixed bottom-0 left-0 w-full bg-[#080a0d]/95 backdrop-blur-2xl border-t border-white/[0.08] z-50 md:hidden flex flex-col shadow-[0_-8px_25px_rgba(0,0,0,0.7)]">

      {/* Selector de modo Clientes / Taller / SaaS */}
      <div className="flex border-b border-white/[0.06] bg-black/40">
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center py-2 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
            isCliente
              ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.03]'
              : 'text-white/30 hover:text-white/60'
          }`}
        >
          Clientes
        </Link>
        <Link
          href="/taller"
          className={`flex-1 flex items-center justify-center py-2 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
            isTaller
              ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.03]'
              : 'text-white/30 hover:text-white/60'
          }`}
        >
          Taller
        </Link>
        <Link
          href="/planes"
          className={`flex-1 flex items-center justify-center py-2 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
            isPlanes
              ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.03]'
              : 'text-white/30 hover:text-white/60'
          }`}
        >
          SaaS
        </Link>
      </div>

      {/* Accesos rápidos según sección */}
      <div className="flex justify-around items-center pb-3 pt-2 px-1">
        {isPlanes ? (
          <>
            <a href="#planes" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span className="text-[10px] font-medium">Planes</span>
            </a>
            <a href="#caracteristicas" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span className="text-[10px] font-medium">Ventajas</span>
            </a>
            <a href="#demo" className="flex flex-col items-center p-1.5 text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span className="text-[10px] font-semibold">Demo</span>
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-1.5 text-white/40 hover:text-emerald-400 transition-colors">
              <svg className="w-4 h-4 mb-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
              </svg>
              <span className="text-[10px] font-medium">WhatsApp</span>
            </a>
          </>
        ) : isCliente ? (
          <>
            {/* 1. Inicio */}
            <Link href="/" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-[10px] font-medium">Inicio</span>
            </Link>

            {/* 2. Tienda Online */}
            <Link href="/tienda" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-[10px] font-medium">Tienda</span>
            </Link>

            {/* 3. Baterías */}
            <Link href="/baterias" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span className="text-[10px] font-medium">Baterías</span>
            </Link>

            {/* 4. Diagnóstico */}
            <Link href="/diagnostico" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
              <span className="text-[10px] font-medium">Diagnóstico</span>
            </Link>

            {/* 5. Agendar */}
            <a href="/#agendar" className="flex flex-col items-center p-1.5 text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-semibold">Agendar</span>
            </a>
          </>
        ) : (
          <>
            {/* Accesos rápidos del taller */}
            <Link href="/taller?tab=citas" className="flex flex-col items-center p-1.5 text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-medium">Citas</span>
            </Link>
            <Link href="/taller?tab=ordenes" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[10px] font-medium">OTs</span>
            </Link>
            <Link href="/taller?tab=detailing" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-[10px] font-medium">Detailing</span>
            </Link>
            <Link href="/taller?tab=inventario" className="flex flex-col items-center p-1.5 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5" />
              </svg>
              <span className="text-[10px] font-medium">Stock</span>
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-1.5 text-white/40 hover:text-emerald-400 transition-colors">
              <svg className="w-4 h-4 mb-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
              </svg>
              <span className="text-[10px] font-medium">Ayuda</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
