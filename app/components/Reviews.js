import React from "react";
import { REVIEWS } from "../lib/config";

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "" : "text-slate-700"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-white mb-3">Lo que dicen nuestros clientes</h3>
          <p className="text-slate-400">
            Pedimos una reseña después de cada trabajo. Esto es parte de lo que nos cuentan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.nombre + review.servicio}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
            >
              <Stars count={review.estrellas} />
              <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-6 flex-1">
                “{review.texto}”
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {review.nombre.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{review.nombre}</p>
                  <p className="text-slate-500 text-xs truncate">
                    {review.servicio} · {review.comuna}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
