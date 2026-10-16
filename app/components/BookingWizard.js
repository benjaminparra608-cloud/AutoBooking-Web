"use client";

import { useEffect, useState } from "react";
import {
  WEB3FORMS_ACCESS_KEY,
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
  { id: 3, label: "Agendar" },
  { id: 4, label: "Detalle" },
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
  const [status, setStatus] = useState({ open: false, text: "Revisando horario..." });
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
    // Necesita la hora real del navegador en el momento en que se abre la página
    // (no la hora del servidor al momento del build/SSR), así que no se puede
    // calcular de forma segura durante el render. Por eso se hace acá, una sola vez.
    const now = new Date();
    const today = toDateInputValue(now);
    if (isOpenNow(now)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus({ open: true, text: "Estamos atendiendo ahora — respuesta en minutos." });
      setForm((f) => ({ ...f, fecha: f.fecha || today }));
    } else {
      const next = nextOpenDate(now);
      setStatus({
        open: false,
        text: `Fuera de horario. Próximo horario disponible: ${formatDateEs(next)}.`,
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
    if (form.botcheck) return; // campo trampa anti-spam

    const lines = [
      "Hola! Quiero agendar una hora en AutoBooking.",
      `Vehículo: ${form.marca} ${form.modelo} — Patente: ${form.patente}`,
    ];
    if (form.km) lines.push(`Kilometraje: ${form.km}`);
    lines.push(`Servicio: ${form.servicio}`);
    lines.push(`Fecha preferida: ${form.fecha} — ${form.horario}`);
    lines.push(`Nombre: ${form.nombre}`);
    lines.push(`Teléfono: ${form.telefono}`);
    lines.push(`Comuna: ${form.comuna}`);
    if (form.direccion) lines.push(`Dirección: ${form.direccion}`);
    if (form.comentario) lines.push(`Detalle: ${form.comentario}`);

    const url = whatsappUrl(lines.join("\n"));
    setWaUrl(url);

    setSending(true);
    try {
      // Guardar agendamiento en la base de datos (Supabase / local)
      await createCita(form);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "c6b804a3-8309-4850-87b4-fedd3c534e77",
          subject: "Nuevo agendamiento — AutoBooking",
          from_name: "AutoBooking — Agendamiento web",
          Nombre: form.nombre,
          email: form.email,
          Teléfono: form.telefono,
          Comuna: form.comuna,
          Dirección: form.direccion || "(no indicada)",
          Vehículo: `${form.marca} ${form.modelo}`,
          Patente: form.patente,
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
    `w-full rounded-lg border px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

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
    const codigoReserva = `AB-${(form.patente || 'CL').replace(/\W/g, '')}-${(form.fecha || '').slice(-4) || '2026'}`;

    return (
      <div className="max-w-xl mx-auto bg-slate-900 border border-cyan-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow ambiental */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-600/50 text-emerald-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/50">
            ✓
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
            ¡Agendamiento Registrado!
          </span>
          <h3 className="text-2xl font-black text-white mt-2">
            Pase Digital de Agendamiento
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {status.open
              ? "Estamos atendiendo en línea: te confirmaremos en pocos minutos."
              : status.text}
          </p>
        </div>

        {/* Tarjeta tipo Ticket / Comprobante */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 relative">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 mb-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Código de Cita</span>
              <span className="font-mono font-bold text-sm text-cyan-400">{codigoReserva}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Placa Patente</span>
              <span className="font-mono font-bold text-sm text-slate-200">{form.patente || 'S/PATENTE'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <span className="text-slate-500 block">Vehículo:</span>
              <span className="font-semibold text-slate-200">{form.marca} {form.modelo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Servicio:</span>
              <span className="font-semibold text-cyan-300">{form.servicio}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Fecha agendada:</span>
              <span className="font-semibold text-slate-200">{form.fecha}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Horario preferido:</span>
              <span className="font-semibold text-slate-200">{form.horario}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Titular:</span>
              <span className="font-semibold text-slate-200">{form.nombre}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Comuna:</span>
              <span className="font-semibold text-slate-200">{form.comuna}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 mt-2">
            💡 <strong>Próximo paso:</strong> Envía el mensaje generado en WhatsApp para confirmar la llegada del mecánico o el ingreso al taller.
          </div>
        </div>

        {/* Botones de acción del Pase */}
        <div className="space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>💬</span>
            <span>Confirmar por WhatsApp</span>
          </a>

          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <span>📅</span>
            <span>Agregar a Google Calendar</span>
          </a>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <span>🖨️</span> Guardar comprobante
            </button>

            <button
              type="button"
              onClick={startOver}
              className="text-xs text-cyan-400 hover:underline font-semibold cursor-pointer"
            >
              Agendar otra hora
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
        className={`flex items-center gap-2 rounded-lg border px-4 py-3 mb-6 text-sm ${
          status.open
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            status.open ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {status.text}
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between mb-8">
        <div className="absolute top-4 left-4 right-4 h-px bg-gray-200 z-0" />
        {STEPS.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                s.id === step
                  ? "bg-red-600 border-red-600 text-white"
                  : s.id < step
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {s.id}
            </div>
            <span
              className={`text-xs text-center ${
                s.id === step ? "text-gray-900 font-semibold" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        {step === 1 && (
          <div className="space-y-4">
            {form.servicio && (
              <div className="bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between">
                <span>🔧 Servicio seleccionado: <strong>{form.servicio}</strong></span>
                <span className="text-[10px] bg-cyan-200/60 text-cyan-800 px-2 py-0.5 rounded font-bold">Listo para agendar</span>
              </div>
            )}
            <h4 className="text-lg font-bold text-gray-900 mb-2">Ingresa datos de tu vehículo</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Patente</label>
              <input
                className={inputClass("patente")}
                value={form.patente}
                onChange={(e) => update("patente", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Marca</label>
                <input
                  className={inputClass("marca")}
                  placeholder="Ej: Chevrolet"
                  value={form.marca}
                  onChange={(e) => update("marca", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Modelo</label>
                <input
                  className={inputClass("modelo")}
                  placeholder="Ej: Sail"
                  value={form.modelo}
                  onChange={(e) => update("modelo", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Kilometraje actual
              </label>
              <input
                type="number"
                className={inputClass("km")}
                placeholder="Ej: 45000"
                value={form.km}
                onChange={(e) => update("km", e.target.value)}
              />
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={goNext}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Selecciona el servicio</h4>
            <div className="space-y-2">
              {SERVICES.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer font-medium ${
                    form.servicio === s
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="servicio"
                    className="w-4 h-4 accent-red-600"
                    checked={form.servicio === s}
                    onChange={() => update("servicio", s)}
                  />
                  {s}
                </label>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Elige fecha y horario</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha</label>
                <input
                  type="date"
                  className={inputClass("fecha")}
                  value={form.fecha}
                  onChange={(e) => update("fecha", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Horario</label>
                <select
                  className={inputClass("horario")}
                  value={form.horario}
                  onChange={(e) => update("horario", e.target.value)}
                >
                  <option value="" disabled>
                    Elige
                  </option>
                  <option>Mañana (9:00–13:00)</option>
                  <option>Tarde (14:00–19:00)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Tus datos de contacto</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre</label>
              <input
                className={inputClass("nombre")}
                value={form.nombre}
                onChange={(e) => update("nombre", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass("email")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Teléfono</label>
              <input
                type="tel"
                placeholder="+56 9 ..."
                className={inputClass("telefono")}
                value={form.telefono}
                onChange={(e) => update("telefono", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Comuna</label>
              <input
                placeholder="Ej: La Florida, Providencia..."
                className={inputClass("comuna")}
                value={form.comuna}
                onChange={(e) => update("comuna", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Dirección (opcional)
              </label>
              <input
                placeholder="Calle, número, referencia"
                className={inputClass("direccion")}
                value={form.direccion}
                onChange={(e) => update("direccion", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Cuéntanos qué le pasa a tu auto (opcional)
              </label>
              <textarea
                className={inputClass("comentario") + " min-h-[80px]"}
                value={form.comentario}
                onChange={(e) => update("comentario", e.target.value)}
              />
            </div>

            {/* Campo trampa anti-spam, invisible para personas */}
            <input
              type="checkbox"
              checked={form.botcheck}
              onChange={(e) => update("botcheck", e.target.checked)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar por WhatsApp"}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center pt-1">
              Se abre WhatsApp con tu solicitud ya redactada, lista para enviar.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
