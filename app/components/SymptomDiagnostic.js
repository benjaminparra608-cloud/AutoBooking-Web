'use client';

import React, { useState } from 'react';
import { SERVICES } from '../lib/config';

const SINTOMAS = [
  {
    id: 'frenos-chillido',
    icono: '🛑',
    titulo: 'Chillido agudo o vibración al frenar',
    descripcion: 'Al pisar el pedal de freno escuchas un silbido metálico o sientes vibración en el volante.',
    causaProbable: 'Pastillas de freno desgastadas al límite o discos cristalizados/alabeados.',
    servicioRecomendado: 'Servicio de frenos',
    precioDesde: 45000,
    riesgo: 'Alto: El desgaste excesivo puede rayar los discos de freno y duplicar la distancia de frenado.',
    categoria: 'Seguridad'
  },
  {
    id: 'bateria-no-arranca',
    icono: '⚡',
    titulo: 'No parte en frío o hace un "clic" seco',
    descripcion: 'Al girar la llave o presionar el botón de encendido las luces se atenúan y el motor no gira.',
    causaProbable: 'Batería agotada por fin de vida útil (más de 2–3 años) o falla en el alternador.',
    servicioRecomendado: 'Instalación y Venta de Baterías',
    precioDesde: 69000,
    riesgo: 'Medio: Riesgo inminente de quedar en panne sin poder mover el vehículo.',
    categoria: 'Eléctrico'
  },
  {
    id: 'check-engine',
    icono: '💻',
    titulo: 'Luz Check Engine encendida en el tablero',
    descripcion: 'Se encendió el testigo amarillo del motor de forma fija o parpadeante.',
    causaProbable: 'Falla detectada por la computadora en sensores (oxígeno, MAF), bujías, bobinas o inyección.',
    servicioRecomendado: 'Escaner Automotriz',
    precioDesde: 25000,
    riesgo: 'Moderado: Mayor consumo de combustible y potencial daño catalítico a mediano plazo.',
    categoria: 'Motor'
  },
  {
    id: 'mantencion-km',
    icono: '🛠️',
    titulo: 'Cumplí kilometraje y toca mantención',
    descripcion: 'Pasaron más de 10.000 km o 12 meses desde el último cambio de aceite y filtros.',
    causaProbable: 'Degradación natural de los lubricantes y saturación de filtros de aire y aceite.',
    servicioRecomendado: 'Mantenciones por KM',
    precioDesde: 65000,
    riesgo: 'Crítico: El aceite vencido genera lodos internos y acelera el desgaste interno del motor.',
    categoria: 'Mantenimiento'
  },
  {
    id: 'tirones-electrico',
    icono: '⚡',
    titulo: 'Auto da tirones o pierde fuerza al acelerar',
    descripcion: 'Sientes pérdida de potencia al adelantar o el motor tironea en bajas revoluciones.',
    causaProbable: 'Falla en bobinas de encendido, bujías desgastadas o inyectores sucios.',
    servicioRecomendado: 'Diagnósticos Eléctricos',
    precioDesde: 35000,
    riesgo: 'Medio: Afecta la respuesta del auto en situaciones de tráfico y sobrecalienta el catalizador.',
    categoria: 'Eléctrico'
  },
  {
    id: 'auto-usado',
    icono: '🔍',
    titulo: 'Voy a comprar un auto usado y quiero revisarlo',
    descripcion: 'Necesito que un mecánico profesional evalúe el auto antes de transferir el dinero.',
    causaProbable: 'Verificación de choque estructural, kilometraje adulterado y fugas ocultas.',
    servicioRecomendado: 'Inspección Técnica Pre-Compra',
    precioDesde: 49000,
    riesgo: 'Económico: Evita comprar un auto con vicios ocultos que requiera millones en reparaciones.',
    categoria: 'Inspección'
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
    <section id="diagnostico-sintomas" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3 inline-block">
          🩺 Asistente Inteligente
        </span>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">
          ¿Qué le pasa a tu auto? Diagnóstico por Síntomas
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          Si no sabes qué servicio necesitas, selecciona el síntoma que notas en tu auto y te diremos la causa probable y la solución técnica adecuada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista interactiva de síntomas */}
        <div className="lg:col-span-6 space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Selecciona el síntoma más parecido:
          </label>
          {SINTOMAS.map(s => {
            const isSelected = selectedSintoma.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSintoma(s)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl mt-0.5">{s.icono}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{s.titulo}</h4>
                    <span className="text-[10px] text-cyan-400 font-semibold uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {s.categoria}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.descripcion}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Ficha de diagnóstico y recomendación */}
        <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-800/50 rounded-3xl p-6 sm:p-7 shadow-xl sticky top-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedSintoma.icono}</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Diagnóstico Preliminar
              </span>
              <h4 className="text-lg font-bold text-white">{selectedSintoma.titulo}</h4>
            </div>
          </div>

          {/* Causa probable */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 text-xs space-y-2">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px] mb-0.5">Causa Probable:</span>
              <p className="text-slate-200 leading-relaxed">{selectedSintoma.causaProbable}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-amber-400 block uppercase font-bold text-[10px] mb-0.5">Riesgo si no se atiende:</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">{selectedSintoma.riesgo}</p>
            </div>
          </div>

          {/* Servicio recomendado */}
          <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-2xl p-4 mb-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">Servicio Recomendado:</span>
              <span className="text-base font-extrabold text-white">{selectedSintoma.servicioRecomendado}</span>
              <span className="text-xs text-slate-400 block mt-0.5">Diagnóstico y mano de obra profesional</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Desde</span>
              <span className="text-xl font-extrabold text-cyan-300">
                ${selectedSintoma.precioDesde.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAgendar(selectedSintoma.servicioRecomendado)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Agendar {selectedSintoma.servicioRecomendado}</span>
            <span>➔</span>
          </button>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            El servicio se auto-seleccionará en el formulario para tu comodidad.
          </p>
        </div>
      </div>
    </section>
  );
}
