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
import BatteryFinder from "./components/BatteryFinder";
import BrandMarquee from "./components/BrandMarquee";
import CartDrawer from "./components/CartDrawer";
import VehicleHealthTracker from "./components/VehicleHealthTracker";
import { CartProvider } from "./context/CartContext";
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
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 md:pb-12 relative">
        {/* Barra de navegación superior para pantallas grandes */}
        <Navbar />

      {/* 1. HERO SECTION CINEMÁTICO AUTOMOTRIZ (ESTILO DELTA LUXURY) */}
      <AutomotiveHero />

      {/* 1.5 TIENDA ONLINE & CARRUSEL DE PRODUCTOS AUTOMOTRICES */}
      <AutomotiveStore />

      {/* 1.6 CATÁLOGO MAESTRO DE BATERÍAS TOP 8 CHILE CON CÓDIGOS DIFERENCIADORES */}
      <BatteryFinder />

      {/* 1.7 MARCAS OFICIALES & OEM PARTNERS */}
      <BrandMarquee />

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

      {/* 2.3 HISTORIAL CLÍNICO & MONITOR DE DESGASTE EN TIEMPO REAL (GPS / TELEMETRÍA) */}
      <VehicleHealthTracker />

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
      <footer className="bg-black text-slate-400 border-t border-slate-900 mt-8">
        {/* Franja de Redes Sociales (Estilo Delta Luxury / Referencia exacta del usuario) */}
        <div className="border-b border-slate-800/80 bg-slate-950/80 py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-white text-base sm:text-lg font-bold tracking-tight">
              Síguenos en Redes sociales
            </span>
            <div className="flex items-center gap-3">
              {/* Facebook Icon */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de AutoBooking"
                className="w-10 h-10 rounded-full bg-[#3b5998] hover:bg-[#2d4373] text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-blue-900/30"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de AutoBooking"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3b5998] via-[#4a76a8] to-[#34699a] hover:opacity-90 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-sky-900/30"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bloque Informativo del Footer */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  AB
                </span>
                <span className="text-white font-black text-lg">
                  Auto<span className="text-cyan-400">Booking</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plataforma líder en servicios mecánicos automotrices y venta de repuestos certificados a domicilio en Santiago de Chile.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Servicios Populares</h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#catalogo-baterias" className="hover:text-amber-400 transition-colors">Baterías Top 8 a Domicilio</a></li>
                <li><a href="#servicios" className="hover:text-cyan-400 transition-colors">Cambio de Frenos Cerámicos</a></li>
                <li><a href="#servicios" className="hover:text-cyan-400 transition-colors">Mantención por Kilometraje</a></li>
                <li><a href="#diagnostico-sintomas" className="hover:text-cyan-400 transition-colors">Diagnóstico con Escáner OBD2</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Tienda & Repuestos</h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#tienda" className="hover:text-cyan-400 transition-colors">Catálogo de Repuestos</a></li>
                <li><a href="#catalogo-baterias" className="hover:text-amber-400 transition-colors">Baterías DIN / JIS / AGM</a></li>
                <li><a href="#tienda" className="hover:text-cyan-400 transition-colors">Aceite Sintético Motul 5W30</a></li>
                <li><a href="#tienda" className="hover:text-cyan-400 transition-colors">CarPlay & Android Auto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Atención & Cobertura</h4>
              <p className="text-xs text-slate-400 mb-2">
                📍 Santiago, Región Metropolitana (Zona Oriente, Central y Poniente).
              </p>
              <p className="text-xs text-slate-400 mb-3">
                🕒 Lunes a Sábado: 08:30 a 19:30 hrs
              </p>
              <a
                href={heroWa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>💬 WhatsApp directo +56 9 1234 5678</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 AutoBooking Chile. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400">Términos y Condiciones</a>
              <a href="#" className="hover:text-slate-400">Garantía Técnica</a>
              <a href="#" className="hover:text-slate-400">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
      <FloatingBookButton />
      <CartDrawer />
    </div>
  </CartProvider>
);
}