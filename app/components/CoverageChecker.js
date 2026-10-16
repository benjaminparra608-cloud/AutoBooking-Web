'use client';

import React, { useState } from 'react';
import { ZONES, whatsappUrl } from '../lib/config';

export default function CoverageChecker({ onSelectComuna }) {
  const [comunaInput, setComunaInput] = useState('');
  const [resultado, setResultado] = useState(null);

  // Aplanar comunas con su zona
  const todasLasComunas = ZONES.flatMap(z =>
    z.comunas.map(c => ({ comuna: c, zona: z.name }))
  );

  function verificarComuna(texto) {
    const q = texto.trim().toLowerCase();
    setComunaInput(texto);
    if (!q) {
      setResultado(null);
      return;
    }

    const match = todasLasComunas.find(c => c.comuna.toLowerCase() === q || c.comuna.toLowerCase().includes(q));

    if (match) {
      setResultado({
        encontrado: true,
        comuna: match.comuna,
        zona: match.zona,
        tiempo: match.zona === 'Oriente' ? '30–45 min' : '45–60 min'
      });
    } else {
      setResultado({
        encontrado: false,
        comuna: texto.trim()
      });
    }
  }

  function handleAgendarEnComuna(comunaNombre) {
    if (onSelectComuna) {
      onSelectComuna(comunaNombre);
    }
    const elem = document.getElementById('agendar');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }

  const comunasPopulares = ['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago Centro', 'La Florida', 'Puente Alto', 'Maipú'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
          📍 Verificador en tiempo real
        </span>
        <h4 className="text-2xl font-bold text-white mt-2">¿Llegamos a tu domicilio?</h4>
        <p className="text-xs text-slate-400 mt-1">
          Escribe tu comuna o selecciona una para verificar disponibilidad y tiempos estimados de llegada.
        </p>
      </div>

      {/* Input de búsqueda */}
      <div className="relative max-w-md mx-auto mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📍</span>
        <input
          type="text"
          placeholder="Escribe tu comuna (ej: Ñuñoa, Las Condes)..."
          value={comunaInput}
          onChange={e => verificarComuna(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
        />
        {comunaInput && (
          <button
            onClick={() => { setComunaInput(''); setResultado(null); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Chips de comunas rápidas */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        <span className="text-xs text-slate-500 py-1 mr-1">Comunas frecuentes:</span>
        {comunasPopulares.map(cp => (
          <button
            key={cp}
            type="button"
            onClick={() => verificarComuna(cp)}
            className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            {cp}
          </button>
        ))}
      </div>

      {/* Resultado de la verificación */}
      {resultado && (
        <div className="transition-all">
          {resultado.encontrado ? (
            <div className="bg-emerald-950/40 border border-emerald-600/50 rounded-2xl p-5 text-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-emerald-500/50 flex items-center justify-center text-xl shrink-0">
                  ✓
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">
                    ¡Excelente! Atendemos a domicilio en {resultado.comuna}
                  </h5>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Zona {resultado.zona} de Santiago • Tiempo estimado: {resultado.tiempo} • Traslado sin costo extra
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAgendarEnComuna(resultado.comuna)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950 whitespace-nowrap cursor-pointer"
              >
                Agendar en {resultado.comuna} ➔
              </button>
            </div>
          ) : (
            <div className="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-5 text-amber-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900 border border-amber-500/50 flex items-center justify-center text-xl shrink-0">
                  ℹ️
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">
                    &ldquo;{resultado.comuna}&rdquo; está fuera de la zona habitual
                  </h5>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    Podemos coordinar visitas especiales a comunas periféricas o recibir tu vehículo en taller.
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl(`Hola, estoy en la comuna de ${resultado.comuna} y me gustaría consultar si pueden atenderme a domicilio.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-950 whitespace-nowrap cursor-pointer"
              >
                Consultar por WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
