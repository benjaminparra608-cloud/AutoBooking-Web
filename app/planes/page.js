'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { whatsappUrl, WEB3FORMS_ACCESS_KEY } from '../lib/config';

const PLANES = [
  {
    id: 'movil',
    nombre: 'Taller Móvil',
    badge: 'Para mecánicos independientes',
    precioMensual: 29900,
    precioAnual: 299000,
    descripcion: 'Ideal para mecánicos que atienden a domicilio o parten su propio negocio independiente.',
    caracteristicas: [
      '1 usuario / mecánico activo',
      'Agenda online 24/7 para tus clientes',
      'Hasta 60 Órdenes de Trabajo (OT) mensuales',
      'Historial de reparaciones por patente chilena',
      'Cotizador interactivo para tus clientes',
      'Exportación e impresión de hoja de trabajo',
      'Soporte técnico por WhatsApp'
    ],
    destacado: false,
    color: 'border-slate-800'
  },
  {
    id: 'pro',
    nombre: 'Taller Pro',
    badge: '⭐ Más Popular',
    precioMensual: 59900,
    precioAnual: 599000,
    descripcion: 'La solución completa para talleres físicos y flotas móviles en crecimiento.',
    caracteristicas: [
      'Hasta 5 usuarios / mecánicos',
      'Órdenes de Trabajo (OT) ilimitadas',
      'Agendamientos online ilimitados 24/7',
      'Módulo de Fidelización: Recordatorios de mantención por WhatsApp',
      'Checklist fotográfico y recepción de daños',
      'Cálculo de repuestos, mano de obra y desglose de IVA',
      'Hoja de entrega digital y física con tu logo',
      'Métricas de ventas y servicios más rentables',
      'Soporte prioritario 7 días a la semana'
    ],
    destacado: true,
    color: 'border-cyan-500 shadow-cyan-500/20'
  },
  {
    id: 'red',
    nombre: 'Taller Red / Flotas',
    badge: 'Empresas y Franquicias',
    precioMensual: 99900,
    precioAnual: 999000,
    descripcion: 'Para cadenas multimarca, múltiples sucursales o flotas corporativas.',
    caracteristicas: [
      'Usuarios y mecánicos ilimitados',
      'Gestión multi-sucursal centralizada',
      'Módulo avanzado de fidelización y campañas WhatsApp',
      'Integración con sistemas contables / ERP vía API',
      'Marca blanca: tu logo, colores y subdominio propio',
      'Onboarding personalizado y capacitación de equipo',
      'Gerente de cuenta dedicado'
    ],
    destacado: false,
    color: 'border-slate-800'
  }
];

const PREGUNTAS_TALLER = [
  {
    q: '¿Cómo funciona la prueba gratuita de 14 días?',
    a: 'Puedes solicitar tu acceso sin ingresar tarjeta de crédito. Te configuramos una cuenta con tus datos y logo para que pruebes el sistema con tus clientes reales durante dos semanas.'
  },
  {
    q: '¿Necesito instalar algún programa en mi computador?',
    a: 'No. AutoBooking funciona 100% en la nube desde cualquier navegador web (computador, tablet o teléfono móvil Android / iPhone). Tus mecánicos pueden usarlo directamente desde su celular en el taller o en terreno.'
  },
  {
    q: '¿Cómo reciben mis clientes los recordatorios de mantención?',
    a: 'El sistema detecta automáticamente cuándo un vehículo atendido hace 3 o 6 meses requiere revisión de kilometraje, cambio de aceite o pastillas, y te permite enviarle un WhatsApp personalizado con 1 solo clic.'
  },
  {
    q: '¿Tienen contratos de permanencia mínima?',
    a: 'Ninguno. Puedes pagar mes a mes y cancelar cuando desees. También ofrecemos planes anuales con un 17% de descuento (2 meses gratis).'
  },
  {
    q: '¿Emiten factura electrónica chilena?',
    a: 'Sí, emitimos Factura Electrónica (afecta a IVA o exenta según corresponda) a nombre de tu empresa o RUT comercial en Chile.'
  }
];

export default function PlanesPage() {
  const [cicloFacturacion, setCicloFacturacion] = useState('mensual'); // 'mensual' | 'anual'
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [autosAlMes, setAutosAlMes] = useState(35);
  const [faqAbierta, setFaqAbierta] = useState(null);

  // Formulario Demo
  const [demoForm, setDemoForm] = useState({
    nombreTaller: '',
    contacto: '',
    telefono: '',
    email: '',
    comuna: '',
    plan: 'Taller Pro',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [demoEnviada, setDemoEnviada] = useState(false);

  // Calculadora ROI
  const ticketPromedio = 65000; // CLP por mantención
  const clientesRecuperados = Math.round(autosAlMes * 0.22); // 22% retención
  const ingresoExtra = clientesRecuperados * ticketPromedio;

  function handleDemoSubmit(e) {
    e.preventDefault();
    setEnviando(true);

    const waMsg = encodeURIComponent(
      `¡Hola AutoBooking! Me interesa solicitar una DEMO para mi taller.\n\n` +
      `🏢 Taller: ${demoForm.nombreTaller}\n` +
      `👤 Contacto: ${demoForm.contacto}\n` +
      `📞 Teléfono: ${demoForm.telefono}\n` +
      `📍 Ciudad/Comuna: ${demoForm.comuna}\n` +
      `🏷️ Plan de interés: ${demoForm.plan}\n` +
      (demoForm.mensaje ? `💬 Mensaje: ${demoForm.mensaje}` : '')
    );

    // Si tiene Web3Forms configurado intentamos enviar en segundo plano
    if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'TU_ACCESS_KEY_AQUI') {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nueva Solicitud Demo Taller: ${demoForm.nombreTaller}`,
          ...demoForm
        })
      }).catch(() => {});
    }

    setTimeout(() => {
      setEnviando(false);
      setDemoEnviada(true);
      window.open(`https://wa.me/56912345678?text=${waMsg}`, '_blank');
    }, 600);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative">
      <Navbar />

      {/* 1. HERO B2B SAAS */}
      <header className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 border-b border-slate-800 py-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span>💼</span> AutoBooking para Talleres & Servicios Automotrices
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            Digitaliza tu taller y{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              multiplica la fidelidad
            </span>{' '}
            de tus clientes
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            El software en la nube diseñado para talleres mecánicos, mecánicos a domicilio y servicios de car audio en Chile. Agendamiento online 24/7, Órdenes de Trabajo digitales y recordatorios automáticos por WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#demo"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base py-3.5 px-8 rounded-full shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
            >
              🚀 Solicitar Demo Gratuita (14 días)
            </a>
            <Link
              href="/taller"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <span>👀</span> Ver Demo del Panel Taller
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">✅ Sin instalación requerida</span>
            <span className="flex items-center gap-1.5">✅ Factura electrónica chilena</span>
            <span className="flex items-center gap-1.5">✅ Cancela cuando quieras</span>
            <span className="flex items-center gap-1.5">✅ Soporte local en Chile</span>
          </div>
        </div>
      </header>

      {/* 2. VENTAJAS PRINCIPALES */}
      <section id="caracteristicas" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Potencia Operativa</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Todo lo que tu taller necesita en una sola plataforma
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Deja atrás los cuadernos de papel, las pizarras y los mensajes desordenados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-2xl flex items-center justify-center mb-6">
              📅
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Agenda Online 24/7</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tus clientes agendan desde su teléfono a cualquier hora, incluso de noche o feriados. Reduce llamadas y no pierdas ningún cliente por estar con las manos ocupadas en el taller.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-2xl flex items-center justify-center mb-6">
              📋
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Órdenes de Trabajo (OT)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Crea OTs profesionales numeradas, con checklist de recepción (combustible, kilometraje, rayaduras), cálculo automático de repuestos, mano de obra e IVA, listas para imprimir o enviar.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl flex items-center justify-center mb-6">
              💬
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fidelización por WhatsApp</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              El sistema te avisa cuando un cliente atendido necesita su mantención de los 10.000 km o revisión de frenos. Envíale un mensaje personalizado con 1 clic y asegura su regreso.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CALCULADORA INTERACTIVA DE RETORNO (ROI) */}
      <section id="calculadora" className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-800/40 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
                💰 Calculadora de Ganancia Adicional
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                ¿Cuánto dinero extra puede generar AutoBooking para tu taller?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Simula el impacto de recuperar a tus clientes pasados con recordatorios automáticos de mantenimiento.
              </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <div className="flex justify-between items-center text-sm font-semibold text-slate-200 mb-2">
                  <span>Vehículos atendidos al mes:</span>
                  <span className="text-cyan-400 text-lg font-bold">{autosAlMes} autos</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={autosAlMes}
                  onChange={(e) => setAutosAlMes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>10 autos (taller chico)</span>
                  <span>75 autos (mediano)</span>
                  <span>150+ autos (grande)</span>
                </div>
              </div>

              {/* Resultado del cálculo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Clientes fidelizados adicionales:</span>
                  <span className="text-3xl font-black text-white">+{clientesRecuperados}</span>
                  <span className="text-[11px] text-emerald-400 block mt-1">reagendamientos / mes</span>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 text-center">
                  <span className="text-xs text-emerald-300 block mb-1">Facturación extra estimada:</span>
                  <span className="text-3xl font-black text-emerald-400">
                    +${ingresoExtra.toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">CLP mensuales adicionales</span>
                </div>
              </div>

              <p className="text-center text-[11px] text-slate-400 italic">
                * Estimación conservadora basada en un 22% de tasa de reactivación y un ticket promedio de $65.000 CLP. ¡El plan Taller Pro se paga solo con el primer cliente recuperado!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLANES Y PRECIOS */}
      <section id="planes" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Suscripciones Flexibles</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Elige el plan ideal para tu negocio automotriz
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Todos los planes incluyen 14 días de prueba gratuita. Sin contratos forzosos.
          </p>

          {/* Selector Mensual / Anual */}
          <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-full p-1.5 mt-6">
            <button
              onClick={() => setCicloFacturacion('mensual')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                cicloFacturacion === 'mensual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pago Mensual
            </button>
            <button
              onClick={() => setCicloFacturacion('anual')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                cicloFacturacion === 'anual'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pago Anual</span>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700/60 font-black">
                2 Meses Gratis
              </span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Planes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANES.map((plan) => {
            const precio = cicloFacturacion === 'mensual' ? plan.precioMensual : Math.round(plan.precioAnual / 12);
            return (
              <div
                key={plan.id}
                className={`relative bg-slate-900 rounded-3xl p-8 flex flex-col justify-between border-2 transition-all ${plan.color} ${
                  plan.destacado ? 'scale-105 z-10 bg-slate-900/95 ring-2 ring-cyan-500/30' : 'hover:border-slate-700'
                }`}
              >
                {plan.destacado && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-lg">
                    Recomendado para Talleres
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white">{plan.nombre}</h3>
                      <span className="text-xs text-slate-400 font-medium">{plan.badge}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {plan.descripcion}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">
                        ${precio.toLocaleString('es-CL')}
                      </span>
                      <span className="text-xs text-slate-400">CLP / mes</span>
                    </div>
                    {cicloFacturacion === 'anual' && (
                      <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                        Facturado anualmente (${plan.precioAnual.toLocaleString('es-CL')} CLP/año + IVA)
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Incluye:</span>
                    {plan.caracteristicas.map((c, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold shrink-0">✓</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#demo"
                  onClick={() => {
                    setDemoForm((f) => ({ ...f, plan: plan.nombre }));
                  }}
                  className={`w-full py-3 px-6 rounded-2xl font-bold text-sm text-center transition-all ${
                    plan.destacado
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Comenzar Prueba Gratis
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FORMULARIO SOLICITUD DE DEMO */}
      <section id="demo" className="py-20 px-4 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
              🚀 Comienza hoy mismo
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              Solicita tu Demo Personalizada de AutoBooking
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Ingresa los datos de tu taller. Te activaremos el acceso inmediato y te ayudaremos a configurar tus servicios y precios.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {demoEnviada ? (
              <div className="text-center py-10 space-y-4">
                <span className="text-6xl">🎉</span>
                <h3 className="text-2xl font-bold text-white">¡Solicitud recibida con éxito!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Hemos abierto WhatsApp para coordinar tu prueba gratuita de 14 días. También puedes explorar el panel de administración ahora mismo:
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/taller"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full text-sm transition-all"
                  >
                    Ingresar al Panel de Taller
                  </Link>
                  <button
                    onClick={() => setDemoEnviada(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-full text-sm transition-all"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de tu Taller / Negocio *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Taller Mecánico San Cristóbal"
                      value={demoForm.nombreTaller}
                      onChange={(e) => setDemoForm({ ...demoForm, nombreTaller: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre y Apellido *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Carlos Muñoz"
                      value={demoForm.contacto}
                      onChange={(e) => setDemoForm({ ...demoForm, contacto: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={demoForm.telefono}
                      onChange={(e) => setDemoForm({ ...demoForm, telefono: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email de Contacto</label>
                    <input
                      type="email"
                      placeholder="contacto@mitaller.cl"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Comuna / Ciudad *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Santiago, Concepción, Viña..."
                      value={demoForm.comuna}
                      onChange={(e) => setDemoForm({ ...demoForm, comuna: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Plan de Interés</label>
                    <select
                      value={demoForm.plan}
                      onChange={(e) => setDemoForm({ ...demoForm, plan: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Taller Móvil">Taller Móvil ($29.900 CLP/mes)</option>
                      <option value="Taller Pro">Taller Pro ($59.900 CLP/mes - Recomendado)</option>
                      <option value="Taller Red / Flotas">Taller Red / Flotas ($99.900 CLP/mes)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">¿Algún requerimiento especial? (Opcional)</label>
                  <textarea
                    rows="3"
                    placeholder="Cuéntanos cuántos mecánicos tienes o qué servicios ofreces..."
                    value={demoForm.mensaje}
                    onChange={(e) => setDemoForm({ ...demoForm, mensaje: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl text-base shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {enviando ? 'Enviando solicitud...' : 'Solicitar Prueba Gratuita de 14 Días'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ SAAS TALLERES */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Resolvemos tus dudas</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Preguntas frecuentes de dueños de taller</h2>
        </div>

        <div className="space-y-4">
          {PREGUNTAS_TALLER.map((faq, index) => {
            const isOpen = faqAbierta === index;
            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setFaqAbierta(isOpen ? null : index)}
                  className="w-full p-5 text-left font-bold text-white flex justify-between items-center hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-500 text-lg ml-4">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">© 2026 AutoBooking SaaS para Talleres. Todos los derechos reservados.</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
