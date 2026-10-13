import React from "react";
import { REVIEWS, GALLERY } from "../lib/config";

// Tarjeta base: caja de "mockup" arriba + título/descripción abajo,
// igual al patrón de las 6 tarjetas de referencia (toggles, chips, galería,
// chat, autocompletado, reseña).
function FeatureCard({ title, description, badge, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-blue-500/40 transition-colors">
      <div className="h-40 rounded-xl bg-slate-950 border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
        {children}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="text-white font-bold">{title}</h4>
          {badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div
      className={`w-9 h-5 rounded-full flex items-center px-0.5 shrink-0 ${
        on ? "bg-blue-600 justify-end" : "bg-slate-700 justify-start"
      }`}
    >
      <div className="w-4 h-4 rounded-full bg-white shadow" />
    </div>
  );
}

function ServicesMockup() {
  const rows = [
    { label: "Diagnóstico eléctrico", on: true },
    { label: "Cambio de batería", on: true },
    { label: "Car audio", on: false },
    { label: "Mantención por KM", on: true },
  ];
  return (
    <div className="w-full space-y-2.5">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-3 py-2"
        >
          <span className="text-xs text-slate-200 font-medium truncate pr-2">{r.label}</span>
          <Toggle on={r.on} />
        </div>
      ))}
    </div>
  );
}

function ConditionMockup() {
  const chips = [
    { icon: "🔊", label: "Ruido extraño", on: true },
    { icon: "⚠️", label: "Check engine", on: true },
    { icon: "🔋", label: "Batería baja", on: false },
    { icon: "🛑", label: "Frenos", on: false },
    { icon: "🌡️", label: "Sobrecalienta", on: true },
    { icon: "💧", label: "Fuga de aceite", on: false },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {chips.map((c) => (
        <div
          key={c.label}
          className={`flex flex-col items-center justify-center text-center gap-1 rounded-lg p-2 border ${
            c.on
              ? "bg-cyan-950/50 border-cyan-700/60"
              : "bg-slate-900 border-slate-800"
          }`}
        >
          <span className="text-lg leading-none">{c.icon}</span>
          <span className="text-[9px] text-slate-300 leading-tight">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function GalleryMockup() {
  const job = GALLERY[0];
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden flex">
      <div className="w-1/2 h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
        <span className="text-slate-400 text-2xl">🚗</span>
      </div>
      <div className="w-1/2 h-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
        <span className="text-white text-2xl drop-shadow">✨</span>
      </div>
      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wide bg-black/60 text-white px-2 py-0.5 rounded-full">
        Antes
      </span>
      <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide bg-black/60 text-white px-2 py-0.5 rounded-full">
        Después
      </span>
      {job && (
        <span className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white bg-black/50 rounded px-2 py-1 truncate">
          {job.titulo}
        </span>
      )}
    </div>
  );
}

function ReminderMockup() {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        <span className="text-xs font-semibold text-white">AutoBooking</span>
        <span className="text-[10px] text-slate-500 ml-auto">ahora</span>
      </div>
      <p className="text-xs text-slate-300 leading-snug">
        Hola Marcos, ya pasaron 6 meses desde tu última mantención. ¿Agendamos la próxima?
      </p>
      <span className="self-start text-[10px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
        Agendar de nuevo
      </span>
    </div>
  );
}

function AutocompleteMockup() {
  return (
    <div className="w-full">
      <div className="bg-slate-900 border border-cyan-600/60 rounded-lg px-3 py-2 text-xs text-slate-200 mb-2">
        Av. Apoquindo 12<span className="inline-block w-px h-3 bg-cyan-400 align-middle animate-pulse" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        {["Av. Apoquindo 1208, Las Condes", "Av. Apoquindo 1280, Las Condes"].map((addr) => (
          <div
            key={addr}
            className="flex items-center gap-2 px-3 py-2 text-[11px] text-slate-300 border-b border-slate-800/60 last:border-b-0"
          >
            <span className="text-cyan-400">📍</span>
            <span className="truncate">{addr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewMockup() {
  const review = REVIEWS[0];
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex gap-0.5 text-amber-400 text-sm">
        {Array.from({ length: review?.estrellas ?? 5 }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="text-xs text-slate-300 italic leading-snug line-clamp-2">
        “{review?.texto ?? "Llegaron puntuales y dejaron todo funcionando perfecto."}”
      </p>
      <div className="flex items-center gap-2 pt-1">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {review?.nombre?.charAt(0) ?? "M"}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-white font-semibold truncate">{review?.nombre ?? "Marcos Webb"}</p>
          <p className="text-[10px] text-slate-500 truncate">{review?.servicio ?? "Cambio de batería"}</p>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Servicios configurables",
    description: "No partas de cero. Activa solo los servicios que ofreces.",
    Mockup: ServicesMockup,
  },
  {
    title: "Estado del vehículo, por adelantado",
    description: "Tu cliente marca el problema antes de que llegues. Sin sorpresas en terreno.",
    Mockup: ConditionMockup,
  },
  {
    title: "Galería antes y después",
    description: "Muestra tu mejor trabajo en tu página. Deja que los resultados hablen.",
    Mockup: GalleryMockup,
  },
  {
    title: "Recordatorios de servicio",
    badge: "Próximamente",
    description: "Avisamos a tus clientes cuando se acerca su próxima mantención.",
    Mockup: ReminderMockup,
  },
  {
    title: "Autocompletado en todo",
    description: "Patente, marca, modelo y dirección se completan mientras tu cliente escribe.",
    Mockup: AutocompleteMockup,
  },
  {
    title: "Reseñas después de cada trabajo",
    description: "Cuando el trabajo queda listo, le pedimos una reseña a tu cliente.",
    Mockup: ReviewMockup,
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-3">
          Hecho solo para mecánica automotriz a domicilio
        </h3>
        <p className="text-slate-400">
          No hacemos citas de peluquería ni de dentista. Solo autos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ title, description, badge, Mockup }) => (
          <FeatureCard key={title} title={title} description={description} badge={badge}>
            <Mockup />
          </FeatureCard>
        ))}
      </div>
    </section>
  );
}
