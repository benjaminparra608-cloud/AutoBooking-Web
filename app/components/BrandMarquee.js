'use client';

import React from 'react';

const BRANDS = [
  { name: 'BOSCH', country: 'Alemania', category: 'Sistemas Eléctricos & Baterías', icon: '⚡' },
  { name: 'BREMBO', country: 'Italia', category: 'Frenado Cerámico & Discos', icon: '🛑' },
  { name: 'MOTUL', country: 'Francia', category: 'Lubricantes 100% Sintéticos', icon: '🛢️' },
  { name: 'MANN-FILTER', country: 'Alemania', category: 'Filtración OEM Premium', icon: '🌀' },
  { name: 'HANKOOK', country: 'Corea', category: 'Baterías MF & Rendimiento', icon: '🔋' },
  { name: 'VARTA', country: 'Alemania', category: 'Baterías AGM & Start-Stop', icon: '⚡' },
  { name: 'DENSO', country: 'Japón', category: 'Sensores OEM & Alternadores', icon: '🇯🇵' },
  { name: 'LIQUI MOLY', country: 'Alemania', category: 'Aditivos & Cera Tec', icon: '🧪' },
  { name: 'NGK SPARK PLUGS', country: 'Japón', category: 'Bujías Láser Iridium', icon: '🔥' },
  { name: 'MOBIL 1', country: 'USA', category: 'Protección Motor Sintética', icon: '🏎️' },
];

export default function BrandMarquee() {
  // Duplicamos el arreglo para lograr el efecto infinito
  const marqueeItems = [...BRANDS, ...BRANDS];

  return (
    <section className="py-12 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
      {/* Luces sutiles */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 mb-8 text-center relative z-10">
        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full inline-block mb-2">
          Estándar de Calidad Certificado
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Marcas Oficiales & Repuestos Homologados
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          En AutoBooking no usamos copias genéricas. Instalamos repuestos nuevos sellados con certificación de fabricante para proteger tu inversión.
        </p>
      </div>

      {/* Tira animada de marcas */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="flex w-max gap-4 py-2 animate-marquee hover:[animation-play-state:paused]">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="group shrink-0 flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl px-5 py-3.5 transition-all shadow-md duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shadow-inner group-hover:scale-105 transition-transform">
                {brand.icon}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white font-mono group-hover:text-cyan-300 transition-colors">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    ({brand.country})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block font-light">
                  {brand.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pill de Compromiso de Confianza */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
            <span className="text-amber-400 text-base block mb-0.5">📦</span>
            <strong className="text-white text-xs block font-bold">100% Nuevos</strong>
            <span className="text-[10px] text-slate-400">Sellados en caja original</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
            <span className="text-emerald-400 text-base block mb-0.5">🛡️</span>
            <strong className="text-white text-xs block font-bold">Hasta 18 Meses</strong>
            <span className="text-[10px] text-slate-400">Garantía por escrito</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
            <span className="text-cyan-400 text-base block mb-0.5">💻</span>
            <strong className="text-white text-xs block font-bold">Diagnóstico Digital</strong>
            <span className="text-[10px] text-slate-400">Escáner OBD2 incluido</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
            <span className="text-blue-400 text-base block mb-0.5">🧾</span>
            <strong className="text-white text-xs block font-bold">Boleta o Factura</strong>
            <span className="text-[10px] text-slate-400">Trazabilidad tributaria</span>
          </div>
        </div>
      </div>
    </section>
  );
}
