'use client';

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import BookingWizard from "./components/BookingWizard";
import BottomNav from "./components/BottomNav";
import { SERVICES, ZONES, whatsappUrl } from "./lib/config";
import FAQ from "./components/FAQ";
// Diccionario con descripciones y detalles para el modal de cada servicio
const SERVICE_DETAILS = {
  "Instalación y Venta de Baterías": {
    icon: "🔋",
    description: "Reemplazamos tu batería a domicilio con diagnóstico del sistema de carga incluido. Olvídate de quedar en panne.",
    badge: "Servicio a domicilio"
  },
  "Servicio de frenos": {
    icon: "🛑",
    description: "Inspección y cambio de pastillas, discos y líquido de frenos directamente en la comodidad de tu hogar u oficina.",
    badge: "Seguridad garantizada"
  },
  "Diagnósticos Eléctricos": {
    icon: "⚡",
    description: "Revisión avanzada del sistema eléctrico, alternador, partida y fusibles con equipos profesionales de alta precisión.",
    badge: "Alta precisión"
  },
  "Car Audio": {
    icon: "🔊",
    description: "Instalación de pantallas táctiles, parlantes, cámaras de retroceso y sistemas de sonido personalizados para tu vehículo.",
    badge: "Entretenimiento y confort"
  },
  "Mantenciones por KM": {
    icon: "🛠️",
    description: "Cambio de aceite, filtros (aire, aceite, cabina) y revisión general según el kilometraje recomendado por el fabricante.",
    badge: "Mantén tu garantía"
  },
  "Escaner Automotriz": {
    icon: "💻",
    description: "Lectura y borrado de códigos de falla (DTC), análisis de sensores en tiempo real y diagnóstico completo del motor.",
    badge: "Diagnóstico computarizado"
  },
  "Inspección Técnica Pre-Compra": {
    icon: "🔍",
    description: "Evaluación exhaustiva de más de 100 puntos (carrocería, motor, escáner e historial) antes de que compres un auto usado.",
    badge: "Compra con seguridad"
  }
};

export default function LandingPage() {
  const [selectedService, setSelectedService] = useState(null);
  const heroWa = whatsappUrl("Hola, quiero cotizar un servicio para mi auto");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative">
      {/* Barra de navegación superior para pantallas grandes */}
      <Navbar />

      {/* 1. HERO SECTION */}
      <header className="bg-gradient-to-b from-blue-700 via-blue-950 to-slate-950 border-b border-blue-900 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-white">
            Auto<span className="text-cyan-400">Booking</span>
          </h1>
          <h2 className="text-2xl font-medium mb-6 text-slate-200">
            Agenda con facilidad, sin moverte de casa.
          </h2>
          <p className="text-lg mb-8 text-slate-300">
            Mecánica automotriz a domicilio. Cuide su inversión ahorrando tiempo y dinero.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#agendar"
              className="bg-white text-blue-950 font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-slate-100 transition duration-300"
            >
              Agendar mi visita
            </a>
            <a
              href={heroWa}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 border border-slate-700 text-cyan-400 font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-slate-800 transition duration-300 inline-flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* 2. ¿CÓMO FUNCIONA? */}
      <section id="como-funciona" className="py-16 px-4 max-w-5xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-10 text-white">¿Cómo funciona?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800">
            <div className="text-blue-400 text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold mb-2 text-white">1. Cotiza y Agenda</h4>
            <p className="text-slate-400">Elige tu servicio y el horario que más te acomode.</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800">
            <div className="text-blue-400 text-4xl mb-4">🔧</div>
            <h4 className="text-xl font-bold mb-2 text-white">2. Confirmación</h4>
            <p className="text-slate-400">Asignamos un mecánico experto para tu vehículo.</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800">
            <div className="text-blue-400 text-4xl mb-4">🚗</div>
            <h4 className="text-xl font-bold mb-2 text-white">3. Reparación</h4>
            <p className="text-slate-400">Vamos a tu casa u oficina para realizar el trabajo.</p>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS SERVICIOS (Carrusel Interactivo con Modal) */}
      <section id="servicios" className="py-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-white">Encuentra servicios</h3>
            <a href="#agendar" className="text-sm font-semibold text-cyan-400 hover:underline">
              Ver todos
            </a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {SERVICES.map((servicio, index) => {
              const details = SERVICE_DETAILS[servicio] || { icon: "🚗" };

              return (
                <div
                  key={index}
                  onClick={() => setSelectedService(servicio)}
                  className="snap-start shrink-0 w-36 sm:w-40 bg-slate-900 rounded-3xl p-5 flex flex-col items-center justify-center text-center border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg hover:scale-105"
                >
                  <div className="text-5xl mb-4 drop-shadow-md">{details.icon}</div>
                  <span className="font-medium text-sm text-slate-200 leading-tight">
                    {servicio}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL / MENÚ FLOTANTE AL HACER CLIC EN UN SERVICIO */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl flex flex-col md:flex-row gap-6 items-center">
            {/* Botón de cerrar */}
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Lado izquierdo: Visual / Ícono grande */}
            <div className="w-full md:w-1/2 bg-slate-950 rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-slate-800/60">
              <span className="text-7xl mb-3 drop-shadow-lg">
                {SERVICE_DETAILS[selectedService]?.icon || "🚗"}
              </span>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
                {SERVICE_DETAILS[selectedService]?.badge || "Servicio AutoBooking"}
              </span>
            </div>

            {/* Lado derecho: Descripción y acción */}
            <div className="w-full md:w-1/2 flex flex-col text-left">
              <h3 className="text-2xl font-bold text-white mb-3">{selectedService}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {SERVICE_DETAILS[selectedService]?.description || "Servicio técnico automotriz especializado a domicilio."}
              </p>

              <a
                href="#agendar"
                onClick={() => setSelectedService(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-center transition-all shadow-lg shadow-blue-600/30"
              >
                Agendar este servicio
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. COBERTURA */}
      <section id="cobertura" className="py-16 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-3 text-center text-white">¿Dónde operamos?</h3>
        <p className="text-center text-slate-400 mb-10">
          Atendemos estas comunas de Santiago, agrupadas por zona:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ZONES.map((zone) => (
            <div key={zone.name} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-cyan-400 font-bold text-lg mb-3">Zona {zone.name}</h4>
              <div className="flex flex-wrap gap-2">
                {zone.comunas.map((comuna) => (
                  <span
                    key={comuna}
                    className="bg-slate-950 border border-slate-800 rounded-full px-3 py-1 text-sm text-slate-300 shadow-sm"
                  >
                    {comuna}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">
          ¿No ves tu comuna en la lista? Escríbenos por WhatsApp igual y te confirmamos.
        </p>
      </section>
     {/* 5. PREGUNTAS FRECUENTES (NUEVO) */}
      <import FAQ/>
      {/* 6. AGENDA TU HORA */}
      <section id="agendar" className="py-16 px-4 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-center text-white">Agenda tu hora</h3>
          <p className="text-center text-slate-400 mb-10">
            ¿Nos escribes fuera de horario? Deja tus datos y te confirmamos apenas abramos.
          </p>
          <BookingWizard />
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">© 2026 AutoBooking. Todos los derechos reservados.</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}