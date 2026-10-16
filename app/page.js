'use client';

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import BookingWizard from "./components/BookingWizard";
import BottomNav from "./components/BottomNav";
import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import FloatingBookButton from "./components/FloatingBookButton";
import QuickQuote from "./components/QuickQuote";
import SymptomDiagnostic from "./components/SymptomDiagnostic";
import CoverageChecker from "./components/CoverageChecker";
import AutomotiveHero from "./components/AutomotiveHero";
import AutomotiveStore from "./components/AutomotiveStore";
import { SERVICES, ZONES, whatsappUrl } from "./lib/config";

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
  const [preselectedService, setPreselectedService] = useState(null);
  const [preselectedComuna, setPreselectedComuna] = useState(null);
  const heroWa = whatsappUrl("Hola, quiero cotizar un servicio para mi auto");

  function handleAgendarServicio(servicio) {
    setPreselectedService(servicio);
    setSelectedService(null);
    const elem = document.getElementById('agendar');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleSelectComuna(comuna) {
    setPreselectedComuna(comuna);
    const elem = document.getElementById('agendar');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative">
      {/* Barra de navegación superior para pantallas grandes */}
      <Navbar />

      {/* 1. HERO SECTION CINEMÁTICO AUTOMOTRIZ (ESTILO DELTA LUXURY) */}
      <AutomotiveHero />

      {/* 1.5 TIENDA ONLINE & CARRUSEL DE PRODUCTOS AUTOMOTRICES */}
      <AutomotiveStore />

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

      {/* 2.2 DIAGNÓSTICO POR SÍNTOMAS (ASISTENTE INTELIGENTE) */}
      <SymptomDiagnostic onSelectService={handleAgendarServicio} />

      {/* 2.5 CARACTERÍSTICAS (tarjetas con mockup, estilo Bookr) */}
      <Features />

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

              <button
                type="button"
                onClick={() => handleAgendarServicio(selectedService)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-center transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Agendar este servicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3.5 COTIZADOR RÁPIDO INTERACTIVO */}
      <QuickQuote onSelectService={handleAgendarServicio} />

      {/* 4. COBERTURA */}
      <section id="cobertura" className="py-16 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-3 text-center text-white">¿Dónde operamos?</h3>
        <p className="text-center text-slate-400 mb-8">
          Atendemos las comunas más importantes de Santiago directamente en tu domicilio.
        </p>

        {/* Verificador Inteligente de Cobertura */}
        <div className="mb-12">
          <CoverageChecker onSelectComuna={handleSelectComuna} />
        </div>

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

      {/* 4.5 GALERÍA ANTES/DESPUÉS */}
      <Gallery />

      {/* 4.6 RESEÑAS DE CLIENTES */}
      <Reviews />

      {/* 5. PREGUNTAS FRECUENTES (NUEVO) */}
      <FAQ />

      {/* 6. AGENDA TU HORA */}
      <section id="agendar" className="py-16 px-4 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-center text-white">Agenda tu hora</h3>
          <p className="text-center text-slate-400 mb-10">
            ¿Nos escribes fuera de horario? Deja tus datos y te confirmamos apenas abramos.
          </p>
          <BookingWizard preselectedService={preselectedService} preselectedComuna={preselectedComuna} />
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">© 2026 AutoBooking. Todos los derechos reservados.</p>
        </div>
      </footer>

      <BottomNav />
      <FloatingBookButton />
    </div>
  );
}