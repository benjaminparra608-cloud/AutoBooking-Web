'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingBookButton() {
  const pathname = usePathname();

  // En /emergencia ya existe el botón flotante principal "Solicitar SOS",
  // y en /taller o /planes no aplica el botón flotante de agendar visita de cliente.
  if (
    pathname?.startsWith('/emergencia') ||
    pathname?.startsWith('/taller') ||
    pathname?.startsWith('/planes')
  ) {
    return null;
  }

  return (
    <a
      href="/#agendar"
      className="hidden md:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3.5 px-5 rounded-full shadow-xl shadow-blue-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-700/50"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Agendar visita
    </a>
  );
}
