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
    badge: 'Mecánicos independientes & a domicilio',
    precioMensual: 29900,
    precioAnual: 299000,
    descripcion: 'Diseñado para mecánicos que atienden a terreno o inician su operación independiente.',
    caracteristicas: [
      '1 usuario mecánico activo',
      'Agenda online 24/7 para tus clientes',
      'Hasta 60 Órdenes de Trabajo (OT) mensuales',
      'Historial de reparaciones por patente chilena',
      'Cotizador interactivo para tus clientes',
      'Exportación e impresión de hoja de trabajo',
      'Soporte técnico por WhatsApp'
    ],
    destacado: false,
  },
  {
    id: 'pro',
    nombre: 'Taller Pro',
    badge: 'La opción más elegida',
    precioMensual: 59900,
    precioAnual: 599000,
    descripcion: 'La solución integral para talleres mecánicos establecidos y servicios en expansión.',
    caracteristicas: [
      'Hasta 5 mecánicos / operarios concurrentes',
      'Órdenes de Trabajo (OT) ilimitadas',
      'Agendamiento online 24/7 sin restricciones',
      'Módulo de fidelización con recordatorios automáticos',
      'Checklist fotográfico y control de daños de ingreso',
      'Cálculo de insumos, repuestos, mano de obra e IVA',
      'Hoja de entrega digital personalizada con tu logotipo',
      'Métricas comerciales y servicios de mayor margen',
      'Soporte prioritario 7 días a la semana'
    ],
    destacado: true,
  },
  {
    id: 'red',
    nombre: 'Taller Red / Flotas',
    badge: 'Empresas, cadenas y franquicias',
    precioMensual: 99900,
    precioAnual: 999000,
    descripcion: 'Para talleres multimarca con múltiples sucursales o flotas corporativas.',
    caracteristicas: [
      'Usuarios y mecánicos ilimitados',
      'Gestión multi-sucursal centralizada',
      'Fidelización avanzada y campañas automáticas vía WhatsApp',
      'Integración con ERP y software contable vía API',
      'Personalización completa con tu marca e identidad',
      'Capacitación inicial y acompañamiento operativo',
      'Gerente de cuenta corporativo asignado'
    ],
    destacado: false,
  }
];

const PREGUNTAS_TALLER = [
  {
    q: '¿Cómo funciona el periodo de prueba de 14 días?',
    a: 'Puedes solicitar tu acceso sin necesidad de ingresar tarjeta de crédito. Configuramos tu cuenta con la información de tu taller para que operes con clientes reales durante dos semanas completas.'
  },
  {
    q: '¿Requiere instalación de software en computadores?',
    a: 'No. AutoBooking funciona 100% en la nube desde cualquier navegador web (computador de escritorio, tablet o smartphones Android / iOS). Tus mecánicos pueden utilizarlo directamente en el elevador o en terreno.'
  },
  {
    q: '¿Cómo funcionan los recordatorios de mantención a clientes?',
    a: 'El sistema calcula los intervalos de mantenimiento en base al kilometraje promedio o fecha de última atención (ej. 3 o 6 meses) y te permite contactar al cliente con un mensaje personalizado vía WhatsApp con un solo clic.'
  },
  {
    q: '¿Existen plazos forzosos o cláusulas de permanencia?',
    a: 'Ninguno. La suscripción opera mes a mes y puedes cancelar el servicio en cualquier momento. También ofrecemos facturación anual con un 17% de ahorro (2 meses bonificados).'
  },
  {
    q: '¿Emiten Factura Electrónica en Chile?',
    a: 'Sí, emitimos Factura Electrónica afecta a IVA a nombre del RUT o razón social de tu empresa en Chile.'
  }
];

export default function PlanesPage() {
  const [cicloFacturacion, setCicloFacturacion] = useState('mensual');
  const [autosAlMes, setAutosAlMes] = useState(35);
  const [faqAbierta, setFaqAbierta] = useState(null);

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

  // Estimador de Retorno de Inversión
  const ticketPromedio = 65000;
  const clientesRecuperados = Math.round(autosAlMes * 0.22);
  const ingresoExtra = clientesRecuperados * ticketPromedio;

  function handleDemoSubmit(e) {
    e.preventDefault();
    setEnviando(true);

    const waMsg = encodeURIComponent(
      `Hola AutoBooking. Solicito acceso a la DEMO para mi taller:\n\n` +
      `• Taller: ${demoForm.nombreTaller}\n` +
      `• Contacto: ${demoForm.contacto}\n` +
      `• Teléfono: ${demoForm.telefono}\n` +
      `• Comuna / Ciudad: ${demoForm.comuna}\n` +
      `• Plan de interés: ${demoForm.plan}\n` +
      (demoForm.mensaje ? `• Comentarios: ${demoForm.mensaje}` : '')
    );

    if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'TU_ACCESS_KEY_AQUI') {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Solicitud Demo Taller: ${demoForm.nombreTaller}`,
          ...demoForm
        })
      }).catch(() => {});
    }

    setTimeout(() => {
      setEnviando(false);
      setDemoEnviada(true);
      window.open(`https://wa.me/56912345678?text=${waMsg}`, '_blank');
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-24 selection:bg-blue-600/30">
      <Navbar />

      {/* 1. HERO B2B SAAS */}
      <header className="relative pt-24 pb-20 px-6 lg:px-8 border-b border-white/[0.06] overflow-hidden text-center">
        {/* Subtle radial aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-blue-400 text-[11px] font-semibold uppercase tracking-[0.18em] mb-6">
            AutoBooking para Talleres & Servicios Automotrices
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Estandariza tu taller y{' '}
            <span className="text-white/40 font-light italic">multiplica el retorno</span>{' '}
            de tus clientes
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Plataforma digital en la nube para talleres mecánicos, servicios a domicilio y centros de detailing en Chile. Agendamiento 24/7, Órdenes de Trabajo digitales y recordatorios automáticos por WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <a
              href="#demo"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3.5 px-8 rounded-full shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              Solicitar demo gratuita (14 días)
            </a>
            <Link
              href="/taller"
              className="w-full sm:w-auto bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] font-medium text-sm py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <span>Explorar demo del panel taller</span>
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-xs text-white/40 font-light">
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Sin instalación requerida
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Factura electrónica chilena
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Cancela cuando quieras
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Soporte técnico local
            </span>
          </div>
        </div>
      </header>

      {/* 2. VENTAJAS PRINCIPALES */}
      <section id="caracteristicas" className="py-24 px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-2">
            Arquitectura de Gestión
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Todo tu taller bajo una misma plataforma
          </h2>
          <p className="text-white/45 text-sm mt-3 font-light leading-relaxed">
            Elimina planillas dispersas, órdenes en papel y llamadas perdidas con un flujo operativo centralizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-white/[0.12] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-blue-400 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Agenda Online 24/7</h3>
            <p className="text-white/45 text-sm leading-relaxed font-light">
              Tus clientes agendan directamente desde su celular las 24 horas del día. Disminuye llamadas telefónicas mientras tus mecánicos trabajan en los vehículos.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-white/[0.12] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-blue-400 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Órdenes de Trabajo (OT)</h3>
            <p className="text-white/45 text-sm leading-relaxed font-light">
              Emite OTs correlativas con registro fotográfico de recepción, combustible, cálculo automático de repuestos, mano de obra e impuestos.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-white/[0.12] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-blue-400 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Fidelización por WhatsApp</h3>
            <p className="text-white/45 text-sm leading-relaxed font-light">
              Notifica a tus clientes cuando su vehículo cumpla el periodo para cambio de aceite, pastillas o revisión técnica, activando visitas recurrentes.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CALCULADORA ROI */}
      <section id="calculadora" className="py-20 px-6 lg:px-8 bg-white/[0.01] border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-2">
                Simulador de Retorno
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ¿Cuánto valor extra puede generar AutoBooking en tu taller?
              </h3>
              <p className="text-xs sm:text-sm text-white/45 mt-2 font-light">
                Calcula la facturación adicional generada al reactivar clientes pasados mediante avisos preventivos.
              </p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-white/80 mb-3">
                  <span>Vehículos atendidos al mes:</span>
                  <span className="text-blue-400 font-bold font-mono text-base">{autosAlMes} unidades</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={autosAlMes}
                  onChange={(e) => setAutosAlMes(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-white/35 mt-2 font-light">
                  <span>10 vehículos (independiente)</span>
                  <span>75 vehículos (mediano)</span>
                  <span>150+ vehículos (flota)</span>
                </div>
              </div>

              {/* Resultado del cálculo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center">
                  <span className="text-xs text-white/40 block mb-1 font-light">Clientes reactivados / mes:</span>
                  <span className="text-3xl font-black text-white tracking-tight">+{clientesRecuperados}</span>
                  <span className="text-[11px] text-blue-400 block mt-1 font-medium">visitas adicionales</span>
                </div>
                <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-2xl p-5 text-center">
                  <span className="text-xs text-blue-300/80 block mb-1 font-light">Facturación extra estimada:</span>
                  <span className="text-3xl font-black text-blue-400 font-mono tracking-tight">
                    +${ingresoExtra.toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] text-white/40 block mt-1 font-light">CLP mensuales aproximados</span>
                </div>
              </div>

              <p className="text-center text-[11px] text-white/35 font-light leading-relaxed">
                * Estimación conservadora basada en un 22% de tasa de reactivación periódica y un ticket medio de $65.000 CLP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLANES Y PRECIOS */}
      <section id="planes" className="py-24 px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-2">
            Planes de Suscripción
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Elige el formato adecuado a tu operación
          </h2>
          <p className="text-white/45 text-sm mt-2 font-light">
            Todos los planes incluyen 14 días de prueba con configuración asistida.
          </p>

          {/* Toggle Mensual / Anual */}
          <div className="inline-flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full p-1 mt-8">
            <button
              onClick={() => setCicloFacturacion('mensual')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                cicloFacturacion === 'mensual'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Pago Mensual
            </button>
            <button
              onClick={() => setCicloFacturacion('anual')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                cicloFacturacion === 'anual'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <span>Pago Anual</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                2 Meses Gratis
              </span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Planes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PLANES.map((plan) => {
            const precio = cicloFacturacion === 'mensual' ? plan.precioMensual : Math.round(plan.precioAnual / 12);
            return (
              <div
                key={plan.id}
                className={`relative bg-[#0d1117] rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  plan.destacado
                    ? 'border-2 border-blue-500/50 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/20'
                    : 'border border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                {plan.destacado && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-semibold uppercase tracking-[0.18em] py-1 px-3.5 rounded-full shadow-md">
                    Recomendado para Talleres
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.nombre}</h3>
                    <span className="text-xs text-white/40 font-light block mt-0.5">{plan.badge}</span>
                  </div>

                  <p className="text-xs text-white/50 mb-6 font-light leading-relaxed">
                    {plan.descripcion}
                  </p>

                  <div className="mb-6 pb-6 border-b border-white/[0.06]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white font-mono tracking-tight">
                        ${precio.toLocaleString('es-CL')}
                      </span>
                      <span className="text-xs text-white/40 font-light">CLP / mes</span>
                    </div>
                    {cicloFacturacion === 'anual' && (
                      <span className="text-[11px] text-blue-400 font-medium block mt-1.5">
                        Facturado anualmente (${plan.precioAnual.toLocaleString('es-CL')} CLP/año + IVA)
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.18em] block">
                      Capacidades:
                    </span>
                    {plan.caracteristicas.map((c, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-white/70 font-light">
                        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
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
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs text-center transition-all cursor-pointer ${
                    plan.destacado
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  Comenzar prueba gratis
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FORMULARIO SOLICITUD DE DEMO */}
      <section id="demo" className="py-24 px-6 lg:px-8 bg-white/[0.01] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-2">
              Acceso Inmediato
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Solicita tu Demo Personalizada de AutoBooking
            </h2>
            <p className="text-white/45 text-sm mt-2 font-light">
              Ingresa los datos de tu taller. Te activaremos el entorno de pruebas y te asistiremos en la carga de servicios.
            </p>
          </div>

          <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl">
            {demoEnviada ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Solicitud enviada correctamente</h3>
                <p className="text-sm text-white/50 max-w-md mx-auto font-light leading-relaxed">
                  Se ha generado la conversación en WhatsApp para entregarte tus credenciales de prueba. También puedes revisar el panel demostrativo en este enlace:
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/taller"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/25"
                  >
                    Ingresar al Panel de Taller
                  </Link>
                  <button
                    onClick={() => setDemoEnviada(false)}
                    className="bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] font-medium py-3 px-6 rounded-full text-xs transition-all cursor-pointer"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                      Nombre del Taller o Negocio *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Taller Mecánico San Cristóbal"
                      value={demoForm.nombreTaller}
                      onChange={(e) => setDemoForm({ ...demoForm, nombreTaller: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                      Tu Nombre y Apellido *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Carlos Muñoz"
                      value={demoForm.contacto}
                      onChange={(e) => setDemoForm({ ...demoForm, contacto: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={demoForm.telefono}
                      onChange={(e) => setDemoForm({ ...demoForm, telefono: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="contacto@mitaller.cl"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                      Comuna / Ciudad *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Providencia, Santiago..."
                      value={demoForm.comuna}
                      onChange={(e) => setDemoForm({ ...demoForm, comuna: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                      Plan de Interés
                    </label>
                    <select
                      value={demoForm.plan}
                      onChange={(e) => setDemoForm({ ...demoForm, plan: e.target.value })}
                      className="w-full bg-[#080a0d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/80 transition-all"
                    >
                      <option value="Taller Móvil" className="bg-[#080a0d] text-white">Taller Móvil ($29.900 CLP/mes)</option>
                      <option value="Taller Pro" className="bg-[#080a0d] text-white">Taller Pro ($59.900 CLP/mes)</option>
                      <option value="Taller Red / Flotas" className="bg-[#080a0d] text-white">Taller Red / Flotas ($99.900 CLP/mes)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                    Observaciones o requerimiento especial (Opcional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Cantidad de operarios o tipo de servicios que ofrecen..."
                    value={demoForm.mensaje}
                    onChange={(e) => setDemoForm({ ...demoForm, mensaje: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-full text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {enviando ? 'Enviando solicitud...' : 'Solicitar Prueba Gratuita de 14 Días'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ SAAS TALLERES */}
      <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-2">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Consultas comunes de administradores de taller
          </h2>
        </div>

        <div className="space-y-3">
          {PREGUNTAS_TALLER.map((faq, index) => {
            const isOpen = faqAbierta === index;
            return (
              <div
                key={index}
                className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-all ${
                  isOpen ? 'border-blue-500/50 bg-white/[0.04]' : 'border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <button
                  onClick={() => setFaqAbierta(isOpen ? null : index)}
                  className="w-full p-5 text-left font-medium text-white flex justify-between items-center transition-colors cursor-pointer text-sm"
                >
                  <span>{faq.q}</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 transition-transform ${isOpen ? 'rotate-45 text-blue-400' : 'text-white/40'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-3 font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 text-center text-xs text-white/40 font-light">
        <div className="max-w-4xl mx-auto px-6">
          <p>© 2026 AutoBooking SaaS para Talleres. Todos los derechos reservados.</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
