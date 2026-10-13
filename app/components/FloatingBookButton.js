import React from "react";

// Botón flotante persistente, solo en pantallas md+ (en mobile ya cumple este
// rol el ítem "Agendar" de BottomNav, así que evitamos duplicarlo ahí).
export default function FloatingBookButton() {
  return (
    <a
      href="#agendar"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Agendar
    </a>
  );
}
