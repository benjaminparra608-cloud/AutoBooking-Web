import React from "react";
import { GALLERY } from "../lib/config";

// Si "src" es una ruta (string), muestra la foto real.
// Si es null (placeholder), muestra un bloque de color con una etiqueta,
// para que sepas exactamente dónde va cada foto cuando las tengas.
function Frame({ src, label }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={label} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-800/80 text-slate-500 text-xs font-semibold uppercase tracking-wide">
      {label}
    </div>
  );
}

export default function Gallery() {
  return (
    <section id="galeria" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-3">Antes y después</h3>
        <p className="text-slate-400">
          Así dejamos los trabajos. (Fotos de ejemplo — reemplázalas por las tuyas en{" "}
          <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">app/lib/config.js</code>)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GALLERY.map((item) => (
          <div
            key={item.titulo}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 h-40">
              <Frame src={item.before} label="Antes" />
              <Frame src={item.after} label="Después" />
            </div>
            <div className="p-5">
              <h4 className="text-white font-bold mb-1">{item.titulo}</h4>
              <p className="text-slate-400 text-sm">{item.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
