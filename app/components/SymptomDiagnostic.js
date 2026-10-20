'use client';

import React, { useState } from 'react';

const SINTOMAS = [
  {
    id: 'frenos-chillido',
    titulo: 'Chillido agudo o vibración al frenar',
    descripcion: 'Al pisar el pedal de freno escuchas un silbido metálico o notas vibración en el volante.',
    causaProbable: 'Pastillas de freno desgastadas al límite o discos cristalizados / alabeados.',
    servicioRecomendado: 'Servicio de frenos',
    precioDesde: 45000,
    riesgo: 'Alto: El desgaste excesivo puede rayar los discos y duplicar la distancia de frenado.',
    categoria: 'Frenos',
    icon: (
      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    )
  },
  {
    id: 'bateria-no-arranca',
    titulo: 'No parte en frío o hace un "clic" seco',
    descripcion: 'Al girar la llave o pulsar Start las luces se atenúan y el motor de arranque no gira.',
    causaProbable: 'Batería agotada por fin de vida útil (más de 2–3 años) o alternador defectuoso.',
    servicioRecomendado: 'Instalación y Venta de Baterías',
    precioDesde: 69000,
    riesgo: 'Medio: Riesgo inminente de quedar en panne sin poder encender el vehículo.',
    categoria: 'Eléctrico',
    icon: (
      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )
  },
  {
    id: 'check-engine',
    titulo: 'Luz Check Engine encendida en el panel',
    descripcion: 'Se encendió el testigo amarillo de motor de forma fija o parpadeante.',
    causaProbable: 'Código de falla registrado en la ECU (sensores de oxígeno, MAF, encendido o inyección).',
    servicioRecomendado: 'Escaner Automotriz',
    precioDesde: 25000,
    riesgo: 'Moderado: Mayor consumo de combustible y potencial daño catalítico con el tiempo.',
    categoria: 'Electrónica',
    icon: (
      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    )
  },
  {
    id: 'mantencion-km',
    titulo: 'Kilometraje cumplido para mantención',
    descripcion: 'Transcurrieron más de 10.000 km o 12 meses desde el último cambio de aceite y filtros.',
    causaProbable: 'Degradación térmica natural de lubricantes y saturación de filtros de aire y aceite.',
    servicioRecomendado: 'Mantenciones por KM',
    precioDesde: 65000,
    riesgo: 'Crítico: El aceite degradado genera lodos internos y acelera el desgaste del motor.',
    categoria: 'Mantención',
    icon: (
      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03" />
      </svg>
    )
  },
  {
    id: 'tirones-electrico',
    titulo: 'Tirones o pérdida de potencia al acelerar',
    descripcion: 'Sientes pérdida de respuesta al adelantar o el motor tironea a bajas revoluciones.',
    causaProbable: 'Falla en bobinas de encendido, bujías desgastadas o inyectores sucios.',
    servicioRecomendado: 'Diagnósticos Eléctricos',
    precioDesde: 35000,
    riesgo: 'Medio: Afecta la respuesta del auto en adelantamientos y satura el catalizador.',
    categoria: 'Encendido',
    icon: (
      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 'auto-usado',
    titulo: 'Inspección técnica pre-compra de auto usado',
    descripcion: 'Evaluación profesional de más de 100 puntos antes de transferir dinero por un auto.',
    causaProbable: 'Verificación de choque estructural, kilometraje adulterado y fugas ocultas.',
    servicioRecomendado: 'Inspección Técnica Pre-Compra',
    precioDesde: 49000,
    riesgo: 'Económico: Evita comprar un vehículo con fallas estructurales o mecánicas ocultas.',
    categoria: 'Inspección',
    icon: (
      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    )
  }
];

export default function SymptomDiagnostic({ onSelectService }) {
  const [selectedSintoma, setSelectedSintoma] = useState(SINTOMAS[0]);

  function handleAgendar(servicio) {
    if (onSelectService) {
      onSelectService(servicio);
    }
    const elem = document.getElementById('agendar');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="diagnostico-sintomas" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-2">
            Asistente Virtual
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ¿Qué síntoma notas en tu vehículo?
          </h2>
          <p className="text-sm text-white/35 mt-2 font-light">
            Selecciona el síntoma para conocer la causa probable y la solución técnica recomendada antes de agendar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lista interactiva de síntomas */}
          <div className="lg:col-span-6 space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-3">
              Selecciona un síntoma:
            </span>
            {SINTOMAS.map(s => {
              const isSelected = selectedSintoma.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSintoma(s)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-white/[0.05] border-blue-500/50 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/30'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-white/90 truncate">{s.titulo}</h4>
                      <span className="text-[10px] text-white/40 font-mono uppercase px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] shrink-0">
                        {s.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-white/35 line-clamp-2 leading-relaxed font-light">{s.descripcion}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ficha de diagnóstico y recomendación */}
          <div className="lg:col-span-6 bg-[#0d1117] border border-white/[0.08] rounded-2xl p-7 shadow-2xl sticky top-24">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400">
                {selectedSintoma.icon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400/80 block">
                  Diagnóstico Preliminar
                </span>
                <h3 className="text-base font-bold text-white leading-snug">{selectedSintoma.titulo}</h3>
              </div>
            </div>

            {/* Causa probable */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-4 text-xs space-y-3 font-light">
              <div>
                <span className="text-white/30 block uppercase font-mono text-[10px] mb-1">Causa Probable:</span>
                <p className="text-white/70 leading-relaxed">{selectedSintoma.causaProbable}</p>
              </div>
              <div className="pt-3 border-t border-white/[0.04]">
                <span className="text-amber-400/80 block uppercase font-mono text-[10px] mb-1">Riesgo si no se atiende:</span>
                <p className="text-white/45 leading-relaxed text-xs">{selectedSintoma.riesgo}</p>
              </div>
            </div>

            {/* Servicio recomendado */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-blue-400 uppercase font-mono tracking-wider block mb-0.5">
                  Servicio Recomendado
                </span>
                <span className="text-sm font-bold text-white block">{selectedSintoma.servicioRecomendado}</span>
                <span className="text-[11px] text-white/30 font-light">Mano de obra técnica e instrumental OBD2</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/30 uppercase font-mono block">Desde</span>
                <span className="text-lg font-bold text-white font-mono">
                  ${selectedSintoma.precioDesde.toLocaleString('es-CL')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAgendar(selectedSintoma.servicioRecomendado)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <span>Agendar {selectedSintoma.servicioRecomendado}</span>
              <span>→</span>
            </button>
            <p className="text-[11px] text-white/25 text-center mt-3 font-light">
              El servicio quedará preseleccionado en tu formulario de reserva.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
