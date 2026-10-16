'use client';

import React, { useState } from 'react';
import { SERVICES, VEHICLE_TYPES, SERVICE_QUOTES } from '../lib/config';

export default function QuickQuote({ onSelectService }) {
  const [selectedVehicleType, setSelectedVehicleType] = useState(VEHICLE_TYPES[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[4]); // 'Mantenciones por KM' por defecto

  const quoteInfo = SERVICE_QUOTES[selectedService] || {
    basePrice: 45000,
    time: '45–60 min',
    includes: ['Diagnóstico inicial computarizado', 'Garantía técnica de satisfacción']
  };

  const estimatedPrice = Math.round((quoteInfo.basePrice * selectedVehicleType.multiplier) / 1000) * 1000;

  function handleAgendar() {
    if (onSelectService) {
      onSelectService(selectedService);
    }
    const elem = document.getElementById('agendar');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section id="cotizador" className="py-16 px-4 bg-slate-900/60 border-y border-slate-800/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3 inline-block">
            ⚡ Transparencia total
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Cotizador Rápido de Servicios
          </h3>
          <p className="text-slate-400 text-sm mt-2">
            Elige el tipo de vehículo y el servicio que necesitas para obtener una estimación de precio y tiempo sin sorpresas.
          </p>
        </div>

        {/* 1. Selector de Tipo de Vehículo */}
        <div className="mb-8">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 text-center sm:text-left">
            Paso 1: Selecciona el formato de tu auto
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {VEHICLE_TYPES.map(vt => (
              <button
                key={vt.id}
                type="button"
                onClick={() => setSelectedVehicleType(vt)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedVehicleType.id === vt.id
                    ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{vt.icon}</span>
                  {selectedVehicleType.id === vt.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{vt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{vt.ejemplo}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Selector de Servicios y Tarjeta de Resultado */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Botones de Servicios */}
          <div className="lg:col-span-7 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Paso 2: Elige el servicio requerido
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICES.map(serv => {
                const isSelected = selectedService === serv;
                const quote = SERVICE_QUOTES[serv];
                const price = quote ? Math.round((quote.basePrice * selectedVehicleType.multiplier) / 1000) * 1000 : 0;

                return (
                  <button
                    key={serv}
                    type="button"
                    onClick={() => setSelectedService(serv)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold leading-snug">{serv}</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 whitespace-nowrap">
                      ${price.toLocaleString('es-CL')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Presupuesto Transparente */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-900/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Presupuesto Estimado
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                ⏱ {quoteInfo.time}
              </span>
            </div>

            <h4 className="text-xl font-bold text-white mb-1">
              {selectedService}
            </h4>
            <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
              <span>{selectedVehicleType.icon}</span>
              <span>Para {selectedVehicleType.label}</span>
            </div>

            {/* Precio */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-5 text-center">
              <span className="text-xs text-slate-500 block uppercase font-medium">Desde aproximadamente</span>
              <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                ${estimatedPrice.toLocaleString('es-CL')}{' '}
                <span className="text-xs font-normal text-slate-400">CLP</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-medium block mt-1">
                ✓ Mano de obra e insumos incluidos
              </span>
            </div>

            {/* Lista de lo que incluye */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                ¿Qué incluye este servicio?
              </span>
              {(quoteInfo.includes || []).map((inc, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{inc}</span>
                </div>
              ))}
            </div>

            {/* Botón de Agendar */}
            <button
              type="button"
              onClick={handleAgendar}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl text-center shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Agendar con este estimado</span>
              <span>➔</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              Te confirmamos la hora exacta por WhatsApp antes de acudir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
