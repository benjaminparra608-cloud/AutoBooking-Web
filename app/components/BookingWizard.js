"use client";

import { useEffect, useState } from "react";
import {
  SERVICES,
  isOpenNow,
  nextOpenDate,
  toDateInputValue,
  formatDateEs,
  whatsappUrl,
} from "../lib/config";
import { createCita } from "../lib/supabase";

const STEPS = [
  { id: 1, label: "Vehículo" },
  { id: 2, label: "Servicio" },
  { id: 3, label: "Fecha y Hora" },
  { id: 4, label: "Contacto" },
];

const initialForm = {
  patente: "",
  marca: "",
  modelo: "",
  km: "",
  servicio: "",
  fecha: "",
  horario: "",
  nombre: "",
  email: "",
  telefono: "",
  comuna: "",
  direccion: "",
  comentario: "",
  botcheck: false,
};

export default function BookingWizard({ preselectedService, preselectedComuna }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ open: false, text: "Consultando disponibilidad..." });
  const [sent, setSent] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setForm((f) => ({ ...f, servicio: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedComuna) {
      setForm((f) => ({ ...f, comuna: preselectedComuna }));
    }
  }, [preselectedComuna]);

  useEffect(() => {
    const now = new Date();
    const today = toDateInputValue(now);
    if (isOpenNow(now)) {
      setStatus({ open: true, text: "Atención en tiempo real — Respuesta inmediata vía WhatsApp" });
      setForm((f) => ({ ...f, fecha: f.fecha || today }));
    } else {
      const next = nextOpenDate(now);
      setStatus({
        open: false,
        text: `Fuera de horario de taller. Primer cupo disponible: ${formatDateEs(next)}.`,
      });
      setForm((f) => ({ ...f, fecha: f.fecha || toDateInputValue(next) }));
    }
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: false }));
  }

  function validateStep(n) {
    const required = {
      1: ["patente", "marca", "modelo"],
      2: ["servicio"],
      3: ["fecha", "horario"],
      4: ["nombre", "telefono", "comuna"],
    }[n];
    const next = {};
    required.forEach((field) => {
      if (!String(form[field]).trim()) next[field] = true;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(4)) return;
    if (form.botcheck) return;

    const lines = [
      "Hola AutoBooking. Deseo confirmar mi solicitud de agendamiento:",
      `• Vehículo: ${form.marca} ${form.modelo} (${form.patente.toUpperCase()})`,
    ];
    if (form.km) lines.push(`• Kilometraje: ${form.km} km`);
    lines.push(`• Servicio solicitado: ${form.servicio}`);
    lines.push(`• Fecha y franja: ${form.fecha} (${form.horario})`);
    lines.push(`• Cliente: ${form.nombre}`);
    lines.push(`• Teléfono: ${form.telefono}`);
    lines.push(`• Comuna: ${form.comuna}`);
    if (form.direccion) lines.push(`• Dirección: ${form.direccion}`);
    if (form.comentario) lines.push(`• Observaciones: ${form.comentario}`);

    const url = whatsappUrl(lines.join("\n"));
    setWaUrl(url);

    setSending(true);
    try {
      await createCita(form);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "c6b804a3-8309-4850-87b4-fedd3c534e77",
          subject: "Nuevo agendamiento web — AutoBooking",
          from_name: "AutoBooking Portal",
          Nombre: form.nombre,
          email: form.email,
          Teléfono: form.telefono,
          Comuna: form.comuna,
          Dirección: form.direccion || "(no indicada)",
          Vehículo: `${form.marca} ${form.modelo}`,
          Patente: form.patente.toUpperCase(),
          Kilometraje: form.km || "(no indicado)",
          Servicio: form.servicio,
          "Fecha preferida": `${form.fecha} — ${form.horario}`,
          Detalle: form.comentario || "(sin comentario)",
        }),
      });
    } catch (err) {
      console.error("No se pudo procesar el agendamiento:", err);
    } finally {
      setSending(false);
    }

    window.open(url, "_blank");
    setSent(true);
  }

  function startOver() {
    setForm(initialForm);
    setErrors({});
    setSent(false);
    setStep(1);
  }

  const inputClass = (field) =>
    `w-full bg-white/[0.03] border ${
      errors[field] ? "border-rose-500/80 focus:border-rose-400" : "border-white/[0.08] focus:border-blue-500/80"
    } focus:bg-white/[0.05] rounded-xl text-white placeholder-white/25 text-sm py-3 px-4 outline-none transition-all`;

  function generateGoogleCalendarUrl() {
    const title = encodeURIComponent(`AutoBooking: ${form.servicio} (${form.patente || 'Vehículo'})`);
    const details = encodeURIComponent(
      `Cita confirmada en AutoBooking.\nServicio: ${form.servicio}\nVehículo: ${form.marca} ${form.modelo} (${form.patente})\nCliente: ${form.nombre}\nTeléfono: ${form.telefono}\nComuna: ${form.comuna}`
    );
    const location = encodeURIComponent(form.direccion ? `${form.direccion}, ${form.comuna}` : form.comuna || 'Santiago');

    const isTarde = form.horario && form.horario.includes('Tarde');
    const startHour = isTarde ? '140000' : '090000';
    const endHour = isTarde ? '170000' : '120000';
    const cleanDate = (form.fecha || '').replace(/-/g, '');
    const dates = `${cleanDate}T${startHour}/${cleanDate}T${endHour}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  }

  if (sent) {
    const calendarUrl = generateGoogleCalendarUrl();
    const codigoReserva = `AB-${(form.patente || 'CL').replace(/\W/g, '').toUpperCase()}-${(form.fecha || '').slice(-4) || '2026'}`;

    return (
      <div className="max-w-xl mx-auto bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow ambiental */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            Agendamiento Confirmado
          </span>
          <h3 className="text-2xl font-black text-white mt-3 tracking-tight">
            Pase Digital de Servicio
          </h3>
          <p className="text-white/45 text-xs mt-1.5 font-light">
            {status.open
              ? "Recepción en línea activa. Un especialista técnico revisará tu requerimiento en minutos."
              : status.text}
          </p>
        </div>

        {/* Tarjeta tipo Boarding Pass */}
        <div className="bg-[#080a0d] border border-white/[0.06] rounded-2xl p-5 mb-6 relative">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3 mb-4">
            <div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest block font-semibold">Código de Cita</span>
              <span className="font-mono font-bold text-sm text-blue-400">{codigoReserva}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/40 uppercase tracking-widest block font-semibold">Placa Patente</span>
              <span className="font-mono font-bold text-sm text-white tracking-widest">{form.patente.toUpperCase() || 'S/PATENTE'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <span className="text-white/40 block text-[11px]">Vehículo</span>
              <span className="font-medium text-white/90">{form.marca} {form.modelo}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[11px]">Servicio</span>
              <span className="font-medium text-blue-400">{form.servicio}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[11px]">Fecha agendada</span>
              <span className="font-medium text-white/90">{form.fecha}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[11px]">Franja horaria</span>
              <span className="font-medium text-white/90">{form.horario}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[11px]">Titular</span>
              <span className="font-medium text-white/90">{form.nombre}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[11px]">Comuna</span>
              <span className="font-medium text-white/90">{form.comuna}</span>
            </div>
          </div>

          <div className="text-[11px] text-white/50 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] leading-relaxed">
            <strong className="text-white/80">Siguiente paso:</strong> Envía el mensaje preconfigurado en WhatsApp para coordinar el arribo de la unidad móvil o la recepción en taller.
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-full shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.178.181-.077.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
            </svg>
            <span>Confirmar cita por WhatsApp</span>
          </a>

          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white/80 font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            <span>Añadir a Google Calendar</span>
          </a>

          <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.056-.867-1.92-1.72-2.329m14 0c-.853.409-1.48 1.273-1.72 2.329m-10.56 0A8.966 8.966 0 0112 12c1.933 0 3.7.614 5.14 1.658M6.72 13.829C6.275 14.774 6 15.85 6 17v2.25h12V17c0-1.15-.275-2.226-.72-3.171" />
              </svg>
              <span>Imprimir comprobante</span>
            </button>

            <button
              type="button"
              onClick={startOver}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
            >
              Agendar otro vehículo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Indicador de horario */}
      <div
        className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 mb-6 text-xs transition-colors ${
          status.open
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-white/[0.02] border-white/[0.08] text-white/60"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            status.open ? "bg-emerald-400 animate-pulse" : "bg-white/40"
          }`}
        />
        <span>{status.text}</span>
      </div>

      {/* Stepper minimalista */}
      <div className="relative flex justify-between mb-8">
        <div className="absolute top-4 left-6 right-6 h-px bg-white/[0.08] z-0" />
        {STEPS.map((s) => {
          const isCurrent = s.id === step;
          const isPast = s.id < step;
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                  isCurrent
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-500/20"
                    : isPast
                    ? "bg-white/[0.08] border-white/[0.15] text-white/80"
                    : "bg-[#0d1117] border-white/[0.08] text-white/30"
                }`}
              >
                {isPast ? (
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span
                className={`text-[11px] text-center tracking-tight transition-colors ${
                  isCurrent ? "text-white font-semibold" : isPast ? "text-white/60 font-medium" : "text-white/30"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0d1117] rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl relative"
      >
        {step === 1 && (
          <div className="space-y-4">
            {form.servicio && (
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
                <span>Servicio seleccionado: <strong className="text-white">{form.servicio}</strong></span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">Listo</span>
              </div>
            )}
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-1">
                Paso 1 de 4
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight">Identificación de tu Vehículo</h4>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                Placa Patente *
              </label>
              <input
                className={inputClass("patente") + " uppercase font-mono tracking-wider"}
                placeholder="Ej: AB-CD-12"
                value={form.patente}
                onChange={(e) => update("patente", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Marca *
                </label>
                <input
                  className={inputClass("marca")}
                  placeholder="Ej: Chevrolet, Toyota..."
                  value={form.marca}
                  onChange={(e) => update("marca", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Modelo *
                </label>
                <input
                  className={inputClass("modelo")}
                  placeholder="Ej: Sail, RAV4, D-Max..."
                  value={form.modelo}
                  onChange={(e) => update("modelo", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                Kilometraje actual (Opcional)
              </label>
              <input
                type="number"
                className={inputClass("km")}
                placeholder="Ej: 45000"
                value={form.km}
                onChange={(e) => update("km", e.target.value)}
              />
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={goNext}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-full transition-all text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuar a Servicios</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-1">
                Paso 2 de 4
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight">Selecciona el Servicio Requerido</h4>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {SERVICES.map((s) => {
                const isSelected = form.servicio === s;
                return (
                  <label
                    key={s}
                    className={`flex items-center justify-between border rounded-2xl px-4 py-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500/80 bg-blue-600/10 text-white ring-1 ring-blue-500/40"
                        : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "border-blue-500 bg-blue-600" : "border-white/30 bg-transparent"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium">{s}</span>
                    </div>
                    <input
                      type="radio"
                      name="servicio"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => update("servicio", s)}
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium py-3 rounded-full transition-all text-sm cursor-pointer"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-full transition-all text-sm shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-1">
                Paso 3 de 4
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight">Elige Fecha y Horario</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Fecha Preferida *
                </label>
                <input
                  type="date"
                  className={inputClass("fecha") + " [color-scheme:dark]"}
                  value={form.fecha}
                  onChange={(e) => update("fecha", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Franja Horaria *
                </label>
                <select
                  className={inputClass("horario") + " bg-[#080a0d]"}
                  value={form.horario}
                  onChange={(e) => update("horario", e.target.value)}
                >
                  <option value="" disabled className="bg-[#080a0d] text-white/40">
                    Selecciona horario
                  </option>
                  <option value="Mañana (9:00–13:00)" className="bg-[#080a0d] text-white">
                    Mañana (9:00 – 13:00)
                  </option>
                  <option value="Tarde (14:00–19:00)" className="bg-[#080a0d] text-white">
                    Tarde (14:00 – 19:00)
                  </option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/50 leading-relaxed">
              La hora exacta se coordina directamente por WhatsApp de acuerdo a tu comuna y ruta técnica del día.
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium py-3 rounded-full transition-all text-sm cursor-pointer"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-full transition-all text-sm shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 block mb-1">
                Paso 4 de 4
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight">Datos de Contacto y Ubicación</h4>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                Nombre y Apellido *
              </label>
              <input
                className={inputClass("nombre")}
                placeholder="Ej: Carlos Silva"
                value={form.nombre}
                onChange={(e) => update("nombre", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  className={inputClass("telefono")}
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="contacto@ejemplo.cl"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass("email")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Comuna (Santiago) *
                </label>
                <input
                  placeholder="Ej: Las Condes, Providencia..."
                  className={inputClass("comuna")}
                  value={form.comuna}
                  onChange={(e) => update("comuna", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                  Dirección o Referencia
                </label>
                <input
                  placeholder="Calle, número, depto."
                  className={inputClass("direccion")}
                  value={form.direccion}
                  onChange={(e) => update("direccion", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-1.5">
                Observaciones del Vehículo (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ruidos anormales, testigo encendido o especificaciones del auto..."
                className={inputClass("comentario")}
                value={form.comentario}
                onChange={(e) => update("comentario", e.target.value)}
              />
            </div>

            {/* Campo trampa anti-spam */}
            <input
              type="checkbox"
              checked={form.botcheck}
              onChange={(e) => update("botcheck", e.target.checked)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium py-3 rounded-full transition-all text-sm cursor-pointer"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-full transition-all text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{sending ? "Confirmando..." : "Confirmar vía WhatsApp"}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-white/40 text-center pt-1 font-light">
              Se iniciará una conversación segura con un asesor técnico para validar stock y disponibilidad.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
