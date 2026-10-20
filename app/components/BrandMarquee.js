'use client';

import React from 'react';

const BRANDS = [
  { name: 'BOSCH',        country: 'Alemania', category: 'Sistemas Eléctricos & Baterías' },
  { name: 'BREMBO',       country: 'Italia',   category: 'Frenado Cerámico & Discos'      },
  { name: 'MOTUL',        country: 'Francia',  category: 'Lubricantes 100% Sintéticos'    },
  { name: 'MANN-FILTER',  country: 'Alemania', category: 'Filtración OEM Premium'         },
  { name: 'HANKOOK',      country: 'Corea',    category: 'Baterías MF & Rendimiento'      },
  { name: 'VARTA',        country: 'Alemania', category: 'Baterías AGM & Start-Stop'      },
  { name: 'DENSO',        country: 'Japón',    category: 'Sensores OEM & Alternadores'    },
  { name: 'LIQUI MOLY',   country: 'Alemania', category: 'Aditivos & Cera Tec'            },
  { name: 'NGK',          country: 'Japón',    category: 'Bujías Láser Iridium'           },
  { name: 'MOBIL 1',      country: 'USA',      category: 'Protección Motor Sintética'     },
];

const TRUST_ITEMS = [
  {
    label: '100% Nuevos',
    sub: 'Sellados en caja original',
    icon: (
      <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: 'Hasta 18 meses',
    sub: 'Garantía por escrito',
    icon: (
      <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Escáner OBD2',
    sub: 'Diagnóstico digital incluido',
    icon: (
      <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    label: 'Boleta o Factura',
    sub: 'Trazabilidad tributaria',
    icon: (
      <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function BrandMarquee() {
  const marqueeItems = [...BRANDS, ...BRANDS];

  return (
    <section className="bg-[#080a0d] border-b border-white/[0.06] py-16 overflow-hidden relative">

      {/* Header de sección */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
          Estándar de Calidad Certificado
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Marcas Oficiales & Repuestos Homologados
        </h2>
        <p className="text-sm text-white/35 mt-2 max-w-xl mx-auto font-light">
          Solo repuestos nuevos sellados con certificación de fabricante. Sin copias ni piezas de dudosa procedencia.
        </p>
      </div>

      {/* Tira de marcas animada */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_96px,_black_calc(100%-96px),transparent_100%)]">
        <div className="flex w-max gap-3 py-1 animate-marquee hover:[animation-play-state:paused]">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="shrink-0 flex items-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-blue-500/30 rounded-xl px-5 py-3 transition-all duration-200 cursor-default"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-white/40 tracking-tight">
                  {brand.name.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <span className="font-bold text-xs tracking-wider text-white/80 block font-mono">
                  {brand.name}
                </span>
                <span className="text-[10px] text-white/30 block">
                  {brand.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de confianza */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col items-start gap-2 hover:bg-white/[0.04] transition-colors"
            >
              {item.icon}
              <div>
                <p className="text-xs font-semibold text-white/70">{item.label}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
