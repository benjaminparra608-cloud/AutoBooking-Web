'use client';

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import AutomotiveHero from "./components/AutomotiveHero";
import BrandMarquee from "./components/BrandMarquee";
import CoverageChecker from "./components/CoverageChecker";
import BookingWizard from "./components/BookingWizard";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
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

// 4 Portales Especializados
const SPECIALIZED_MODULES = [
  {
    title: "Tienda de Repuestos & Upgrades",
    subtitle: "Catálogo Online Certificado",
    icon: "🛍️",
    badge: "Despacho & Instalación",
    description: "Aceites sintéticos Motul 5W30, pastillas cerámicas Brembo, pantallas multimedia CarPlay/Android y bujías Iridium.",
    href: "/tienda",
    action: "Explorar Tienda →",
    color: "from-blue-600/20 via-cyan-500/10 to-transparent",
    border: "hover:border-cyan-500/60",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-800/60"
  },
  {
    title: "Baterías de Mayor Rotación",
    subtitle: "Parque Automotriz Chileno",
    icon: "🔋",
    badge: "Auxilio & Test de Alternador",
    description: "Catálogo maestro con los formatos DIN, JIS y AGM más utilizados en Chile (Hankook, Bosch, Varta) instalados en tu casa.",
    href: "/baterias",
    action: "Ver Baterías & Precios →",
    color: "from-amber-600/20 via-orange-500/10 to-transparent",
    border: "hover:border-amber-500/60",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-800/60"
  },
  {
    title: "Diagnóstico por Síntomas",
    subtitle: "Asistente Mecánico Virtual",
    icon: "🩺",
    badge: "Escáner OBD2",
    description: "¿Ruidos al frenar, vibraciones en ralentí o luces en el panel? Descubre la posible falla y su nivel de urgencia antes de agendar.",
    href: "/diagnostico",
    action: "Diagnosticar Fallas →",
    color: "from-sky-600/20 via-blue-500/10 to-transparent",
    border: "hover:border-sky-500/60",
    badgeColor: "bg-sky-950/80 text-sky-300 border-sky-800/60"
  },
  {
    title: "Historial Clínico & Odómetro GPS",
    subtitle: "Telemetría Preventiva",
    icon: "📡",
    badge: "Monitoreo en Vivo",
    description: "Seguimiento en tiempo real de desgaste de componentes, vida útil del aceite, estado de la batería y avisos por kilometraje.",
    href: "/telemetria",
    action: "Ver Mi Odómetro →",
    color: "from-indigo-600/20 via-purple-500/10 to-transparent",
    border: "hover:border-indigo-500/60",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60"
  }
];

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 md:pb-12 relative">
      {/* Barra de navegación superior */}
      <Navbar />

      {/* 1. HERO SECTION CINEMÁTICO AUTOMOTRIZ */}
      <AutomotiveHero />

      {/* 1.2 MARCAS OFICIALES & OEM PARTNERS */}
      <BrandMarquee />

      {/* 2. NUESTROS SERVICIOS PRINCIPALES (Carrusel Interactivo con Modal) */}
      <section id="servicios" className="py-14 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                Atención Mecánica a Domicilio
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Servicios Técnicos Especializados
              </h2>
            </div>
            <a href="#agendar" className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>Agendar cualquier servicio</span>
              <span>↓</span>
            </a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {SERVICES.map((servicio, index) => {
              const details = SERVICE_DETAILS[servicio] || { icon: "🚗" };

              return (
                <div
                  key={index}
                  onClick={() => setSelectedService(servicio)}
                  className="snap-start shrink-0 w-36 sm:w-44 bg-slate-900/90 rounded-3xl p-5 flex flex-col items-center justify-center text-center border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg hover:scale-105 group"
                >
                  <div className="text-5xl mb-4 drop-shadow-md group-hover:scale-110 transition-transform">
                    {details.icon}
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-200 leading-tight group-hover:text-cyan-300 transition-colors">
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl flex flex-col md:flex-row gap-6 items-center animate-in fade-in zoom-in-95 duration-150">
            {/* Botón de cerrar */}
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar modal"
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
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-6 rounded-xl text-center transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Agendar este servicio →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ¿CÓMO FUNCIONA? */}
      <section id="como-funciona" className="py-16 px-4 max-w-5xl mx-auto text-center">
        <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
          Simple, rápido y confiable
        </span>
        <h3 className="text-3xl font-black mb-10 text-white mt-1">¿Cómo funciona AutoBooking?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/80 rounded-3xl shadow-sm border border-slate-800 text-left hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 flex items-center justify-center text-2xl mb-4">
              📱
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">1. Cotiza y Agenda</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Elige tu servicio o repuesto y agenda la fecha y hora que más te acomode en minutos.
            </p>
          </div>
          <div className="p-6 bg-slate-900/80 rounded-3xl shadow-sm border border-slate-800 text-left hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800/50 text-blue-400 flex items-center justify-center text-2xl mb-4">
              👨‍🔧
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">2. Confirmación & Técnico</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Te asignamos un mecánico calificado con herramientas profesionales e instrumental de diagnóstico.
            </p>
          </div>
          <div className="p-6 bg-slate-900/80 rounded-3xl shadow-sm border border-slate-800 text-left hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center text-2xl mb-4">
              🚗
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">3. Servicio en tu Domicilio</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Llegamos a tu casa u oficina para realizar el trabajo sin que pierdas tiempo en traslados.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HUB DE SOLUCIONES Y SECCIONES ESPECIALIZADAS */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>⚡</span> Ecosistema AutoBooking
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Soluciones & Secciones Especializadas
            </h3>
            <p className="text-slate-400 text-sm mt-2 font-light">
              Accede directamente a nuestros módulos dedicados para repuestos, recambio de baterías, diagnóstico guiado por síntomas y control de kilometraje.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SPECIALIZED_MODULES.map((mod, idx) => (
              <Link
                key={idx}
                href={mod.href}
                className={`p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 ${mod.border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Gradiente sutil de fondo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{mod.icon}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {mod.subtitle}
                  </span>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight mb-2.5">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {mod.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>{mod.action}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COBERTURA COMUNAL */}
      <section id="cobertura" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
            Red de Atención en Santiago
          </span>
          <h3 className="text-3xl font-black text-white mt-1">¿Dónde operamos?</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Llegamos a las comunas principales de la Región Metropolitana con talleres móviles equipados.
          </p>
        </div>

        {/* Verificador Inteligente de Cobertura */}
        <div className="mb-10">
          <CoverageChecker onSelectComuna={handleSelectComuna} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ZONES.map((zone) => (
            <div key={zone.name} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
              <h4 className="text-cyan-400 font-bold text-base mb-3 flex items-center gap-2">
                <span>📍</span> Zona {zone.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {zone.comunas.map((comuna) => (
                  <span
                    key={comuna}
                    className="bg-slate-950 border border-slate-800/80 rounded-full px-3 py-1 text-xs text-slate-300 shadow-sm"
                  >
                    {comuna}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-xs mt-6">
          ¿Tu comuna no figura en la lista?{' '}
          <a
            href={whatsappUrl("Hola AutoBooking, me gustaría consultar cobertura para mi comuna")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline font-semibold"
          >
            Consúltanos por WhatsApp
          </a>{' '}
          y coordinamos tu visita.
        </p>
      </section>

      {/* 6. RESEÑAS DE CLIENTES */}
      <Reviews />

      {/* 7. PREGUNTAS FRECUENTES */}
      <FAQ />

      {/* 8. AGENDA TU HORA (WIZARD DE RESERVA) */}
      <section id="agendar" className="py-16 px-4 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Reserva 100% Online
            </span>
            <h3 className="text-3xl font-black text-white mt-1">Agenda tu hora</h3>
            <p className="text-slate-400 text-sm mt-1">
              Confirma tu cita en simples pasos y nosotros llevamos el taller a tu casa.
            </p>
          </div>
          <BookingWizard preselectedService={preselectedService} preselectedComuna={preselectedComuna} />
        </div>
      </section>

      {/* 9. FOOTER PROFESIONAL */}
      <footer className="bg-black text-slate-400 border-t border-slate-900 mt-8">
        {/* Franja de Redes Sociales */}
        <div className="border-b border-slate-800/80 bg-slate-950/80 py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-white text-base sm:text-lg font-bold tracking-tight">
              Síguenos en Redes sociales
            </span>
            <div className="flex items-center gap-3">
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
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Servicios & Secciones</h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/baterias" className="hover:text-amber-400 transition-colors">Baterías Más Frecuentes</Link></li>
                <li><Link href="/tienda" className="hover:text-cyan-400 transition-colors">Tienda de Repuestos & Upgrades</Link></li>
                <li><Link href="/diagnostico" className="hover:text-cyan-400 transition-colors">Diagnóstico por Síntomas OBD2</Link></li>
                <li><Link href="/telemetria" className="hover:text-cyan-400 transition-colors">Telemetría & Odómetro GPS</Link></li>
                <li><a href="#servicios" className="hover:text-cyan-400 transition-colors">Servicios Mecánicos Generales</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Plataforma & SaaS</h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/taller" className="hover:text-cyan-400 transition-colors">Panel de Gestión para Talleres</Link></li>
                <li><Link href="/planes" className="hover:text-amber-400 transition-colors">Planes & Suscripciones SaaS</Link></li>
                <li><a href="#cobertura" className="hover:text-cyan-400 transition-colors">Cobertura en Santiago</a></li>
                <li><a href="#faq" className="hover:text-cyan-400 transition-colors">Preguntas Frecuentes</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Atención Directa</h4>
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
    </div>
  );
}