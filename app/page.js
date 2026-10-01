import React from "react";
import BookingWizard from "./components/BookingWizard";
import WhatsAppBar from "./components/WhatsAppBar";
import { SERVICES, ZONES, whatsappUrl } from "./lib/config";

export default function LandingPage() {
  const heroWa = whatsappUrl("Hola, quiero cotizar un servicio para mi auto");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">
      {/* 1. HERO SECTION (Inicio) */}
      <header className="bg-red-600 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">AutoBooking</h1>
          <h2 className="text-2xl font-medium mb-6">Agenda con facilidad, sin moverte de casa.</h2>
          <p className="text-lg mb-8 opacity-90">
            Mecánica automotriz a domicilio. Cuide su inversión ahorrando tiempo y dinero.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#agendar"
              className="bg-white text-red-600 font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Agendar mi visita
            </a>
            <a
              href={heroWa}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition duration-300 inline-flex items-center justify-center gap-2"
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
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-10 text-gray-900">¿Cómo funciona?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-red-600 text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold mb-2">1. Cotiza y Agenda</h4>
            <p className="text-gray-600">Elige tu servicio y el horario que más te acomode.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-red-600 text-4xl mb-4">🔧</div>
            <h4 className="text-xl font-bold mb-2">2. Confirmación</h4>
            <p className="text-gray-600">Asignamos un mecánico experto para tu vehículo.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-red-600 text-4xl mb-4">🚗</div>
            <h4 className="text-xl font-bold mb-2">3. Reparación</h4>
            <p className="text-gray-600">Vamos a tu casa u oficina para realizar el trabajo.</p>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS SERVICIOS */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-10 text-center text-gray-900">Nuestros Servicios</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((servicio, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-600 flex items-center"
              >
                <span className="font-semibold text-gray-700">{servicio}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COBERTURA */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-3 text-center text-gray-900">¿Dónde operamos?</h3>
        <p className="text-center text-gray-500 mb-10">
          Atendemos estas comunas de Santiago, agrupadas por zona:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ZONES.map((zone) => (
            <div key={zone.name}>
              <h4 className="text-red-600 font-bold text-lg mb-3">Zona {zone.name}</h4>
              <div className="flex flex-wrap gap-2">
                {zone.comunas.map((comuna) => (
                  <span
                    key={comuna}
                    className="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-600 shadow-sm"
                  >
                    {comuna}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">
          ¿No ves tu comuna en la lista? Escríbenos por WhatsApp igual y te confirmamos.
        </p>
      </section>

      {/* 5. AGENDA TU HORA */}
      <section id="agendar" className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-center text-gray-900">Agenda tu hora</h3>
          <p className="text-center text-gray-500 mb-10">
            ¿Nos escribes fuera de horario? Deja tus datos y te confirmamos apenas abramos.
          </p>
          <BookingWizard />
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="border-t border-gray-800 pt-8 mt-8">
            <p className="text-gray-500">© 2026 AutoBooking. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <WhatsAppBar />
    </div>
  );
}
