import React from 'react';
import { REVIEWS } from '../lib/config';

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'text-blue-400' : 'text-white/10'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            Testimonios
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-sm text-white/35 mt-3 max-w-md mx-auto font-light">
            Reseñas reales solicitadas tras cada servicio realizado.
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <div
              key={review.nombre + review.servicio}
              className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 flex flex-col hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group"
            >
              {/* Comilla decorativa */}
              <div className="absolute top-6 right-6 text-white/[0.04] text-7xl font-serif leading-none select-none pointer-events-none">
                "
              </div>

              <Stars count={review.estrellas} />

              <p className="text-white/60 text-sm leading-relaxed mt-5 mb-7 flex-1 relative z-10 font-light">
                "{review.texto}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-700/40 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">
                  {review.nombre.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 font-semibold text-sm truncate">{review.nombre}</p>
                  <p className="text-white/30 text-[11px] truncate">{review.servicio} · {review.comuna}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA secundario */}
        <p className="text-center text-white/30 text-xs mt-10">
          Calificación promedio{' '}
          <span className="text-white/60 font-semibold">4.9 / 5</span>
          {' '}basada en +350 reseñas verificadas de clientes en Santiago.
        </p>
      </div>
    </section>
  );
}
