'use client';

import React, { useState } from 'react';
import { ZONES, whatsappUrl } from '../lib/config';

export default function CoverageChecker({ onSelectComuna }) {
  const [comunaInput, setComunaInput] = useState('');
  const [resultado, setResultado] = useState(null);

  const todasLasComunas = ZONES.flatMap(z =>
    z.comunas.map(c => ({ comuna: c, zona: z.name }))
  );

  function verificarComuna(texto) {
    const q = texto.trim().toLowerCase();
    setComunaInput(texto);
    if (!q) { setResultado(null); return; }
    const match = todasLasComunas.find(
      c => c.comuna.toLowerCase() === q || c.comuna.toLowerCase().includes(q)
    );
    if (match) {
      setResultado({
        encontrado: true,
        comuna: match.comuna,
        zona: match.zona,
        tiempo: match.zona === 'Oriente' ? '30–45 min' : '45–60 min',
      });
    } else {
      setResultado({ encontrado: false, comuna: texto.trim() });
    }
  }

  function handleAgendarEnComuna(comunaNombre) {
    if (onSelectComuna) onSelectComuna(comunaNombre);
    const elem = document.getElementById('agendar');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }

  const comunasPopulares = ['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago Centro', 'La Florida', 'Puente Alto', 'Maipú'];

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 md:p-9 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-7">
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-blue-400/80 mb-2">
          Verificador en tiempo real
        </p>
        <h4 className="text-xl font-bold text-white">¿Llegamos a tu domicilio?</h4>
        <p className="text-xs text-white/35 mt-1.5 font-light">
          Escribe tu comuna o selecciona una para verificar disponibilidad y tiempos estimados.
        </p>
      </div>

      {/* Input */}
      <div className="relative max-w-md mx-auto mb-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Ej: Providencia, Las Condes, Ñuñoa..."
          value={comunaInput}
          onChange={e => verificarComuna(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl pl-10 pr-10 py-3 text-sm text-white/80 placeholder-white/20 transition-all"
        />
        {comunaInput && (
          <button
            onClick={() => { setComunaInput(''); setResultado(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Chips de comunas rápidas */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="text-[10px] text-white/25 py-1.5 self-center uppercase tracking-wider">Sugeridas:</span>
        {comunasPopulares.map(cp => (
          <button
            key={cp}
            type="button"
            onClick={() => verificarComuna(cp)}
            className="text-[11px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-blue-500/30 text-white/50 hover:text-white/80 px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            {cp}
          </button>
        ))}
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="mt-2">
          {resultado.encontrado ? (
            <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">¡Atendemos en {resultado.comuna}!</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Zona {resultado.zona} · Tiempo estimado: {resultado.tiempo} · Sin costo de traslado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAgendarEnComuna(resultado.comuna)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                Agendar aquí →
              </button>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.10] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/70">"{resultado.comuna}" fuera de zona habitual</p>
                  <p className="text-xs text-white/35 mt-0.5">Podemos coordinar visitas especiales. Consúltanos.</p>
                </div>
              </div>
              <a
                href={whatsappUrl(`Hola, estoy en ${resultado.comuna} y quiero consultar cobertura.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white/70 text-xs font-semibold px-5 py-2.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0"
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
