import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* 1. HERO SECTION (Inicio) */}
      <header className="bg-red-600 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">AutoBooking</h1>
          <h2 className="text-2xl font-medium mb-6">Agenda con facilidad, sin moverte de casa.</h2>
          {/* Cuidar la inversión y servicio a domicilio */}
          <p className="text-lg mb-8 opacity-90">
            Mecánica automotriz a domicilio. Cuide su inversión ahorrando tiempo y dinero.
          </p>
          <a 
            href="#agendar" 
            className="bg-white text-red-600 font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Agendar mi visita
          </a>
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
          {/* Servicios detallados basados en la gráfica del taller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Instalación y Venta de Baterías",
              "Servicio de frenos",
              "Diagnósticos Eléctricos",
              "Car Audio",
              "Mantenciones por KM",
              "Escaner Automotriz",
              "Inspección Técnica Pre-Compra"
            ].map((servicio, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-600 flex items-center">
                <span className="font-semibold text-gray-700">{servicio}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COBERTURA Y FOOTER */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h4 className="text-2xl font-bold mb-4">¿Dónde operamos?</h4>
          {/* Zonas de cobertura específicas */}
          <p className="text-lg text-gray-400 mb-8">
            Cobertura: Zona Sur, centro y oriente de Santiago
          </p>
          <div className="border-t border-gray-800 pt-8 mt-8">
            <p className="text-gray-500">© 2026 AutoBooking. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}