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
  telefono: "",
  comuna: "",
  direccion: "",
  comentario: "",
  botcheck: false,
};

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ open: false, text: "Revisando horario..." });
  const [sent, setSent] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [sending, setSending] = useState(false);

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
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Nuevo agendamiento — AutoBooking",
          from_name: "AutoBooking — Agendamiento web",
          Nombre: form.nombre,
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
      console.error("No se pudo enviar el correo del agendamiento:", err);
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

  if (sent) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">¡Casi listo!</h3>
        <p className="text-gray-600 mb-1">
          {status.open
            ? "Estamos atendiendo: te respondemos en minutos para confirmar la hora."
            : status.text}
        </p>
        <p className="text-gray-600 mb-6">
          Envía el mensaje que se abrió en WhatsApp para que lo veamos de inmediato. Si no se
          abrió, toca el botón de abajo.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow hover:bg-green-600 transition mb-3"
        >
          Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={startOver}
          className="block mx-auto text-red-600 font-semibold hover:underline"
        >
          Agendar otra hora
        </button>
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
