import React from "react";
import { DIFFERENTIATORS } from "../lib/config";

export default function Differentiators() {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-3">¿Qué nos diferencia?</h3>
        <p className="text-slate-400">
          No somos un taller más. Hicimos AutoBooking pensando solo en mecánica a domicilio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DIFFERENTIATORS.map((item) => (
          <div
            key={item.title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
