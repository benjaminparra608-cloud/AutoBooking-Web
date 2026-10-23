'use client';

import React, { useState } from 'react';

const TIPOS_DANO = [
  { id: 'rayon', label: 'Rayón / Arañazo', color: 'bg-amber-500 text-black border-amber-400', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'abolladura', label: 'Abolladura', color: 'bg-rose-500 text-white border-rose-400', badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'piquete', label: 'Piquete Vidrio', color: 'bg-cyan-500 text-black border-cyan-400', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'foco', label: 'Foco Roto', color: 'bg-purple-500 text-white border-purple-400', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'golpe', label: 'Golpe Estructural', color: 'bg-red-600 text-white border-red-500', badgeColor: 'text-red-400 bg-red-600/10 border-red-500/30' },
];

const NIVELES_COMBUSTIBLE = ['Reserva', '1/4', '1/2', '3/4', 'Lleno'];

export default function VehicleDamageInspector({
  checklistData = {},
  onChange,
  patente = '',
  clienteNombre = '',
  clienteTelefono = '',
  onClose
}) {
  const [vistaActual, setVistaActual] = useState('superior'); // 'superior' | 'lateral_izq' | 'lateral_der' | 'frente_trasera'
  const [tipoSeleccionado, setTipoSeleccionado] = useState(TIPOS_DANO[0].id);

  // Datos locales de daños y checklist
  const [danos, setDanos] = useState(checklistData.danos || []);
  const [combustible, setCombustible] = useState(checklistData.combustible || '1/2');
  const [kmIngreso, setKmIngreso] = useState(checklistData.kmIngreso || '');
  const [pertenencias, setPertenencias] = useState({
    ruedaRepuesto: checklistData.ruedaRepuesto !== false,
    gata: checklistData.gata !== false,
    llaveRuedas: checklistData.llaveRuedas !== false,
    documentos: checklistData.documentos !== false,
    antena: checklistData.antena !== false,
    objetosRetirados: checklistData.objetosRetirados || true,
    lucesOperativas: checklistData.lucesOperativas !== false,
  });
  const [observaciones, setObservaciones] = useState(checklistData.rayones || '');

  // Click en el auto para marcar daño
  function handleSvgClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const nuevoDano = {
      id: `dano-${Date.now()}`,
      numero: danos.length + 1,
      vista: vistaActual,
      tipo: tipoSeleccionado,
      x,
      y,
      detalle: TIPOS_DANO.find((t) => t.id === tipoSeleccionado)?.label || 'Daño'
    };

    const updated = [...danos, nuevoDano];
    setDanos(updated);
    notifyChanges(updated, combustible, pertenencias, observaciones, kmIngreso);
  }

  function handleEliminarDano(id) {
    const updated = danos.filter((d) => d.id !== id).map((d, idx) => ({ ...d, numero: idx + 1 }));
    setDanos(updated);
    notifyChanges(updated, combustible, pertenencias, observaciones, kmIngreso);
  }

  function notifyChanges(d, comb, pert, obs, km) {
    if (onChange) {
      onChange({
        ...checklistData,
        danos: d,
        combustible: comb,
        kmIngreso: km,
        ...pert,
        rayones: obs,
        totalDanos: d.length
      });
    }
  }

  function handlePertenenciaToggle(key) {
    const updated = { ...pertenencias, [key]: !pertenencias[key] };
    setPertenencias(updated);
    notifyChanges(danos, combustible, updated, observaciones, kmIngreso);
  }

  function handleCombustibleChange(val) {
    setCombustible(val);
    notifyChanges(danos, val, pertenencias, observaciones, kmIngreso);
  }

  function handleObservacionesChange(val) {
    setObservaciones(val);
    notifyChanges(danos, combustible, pertenencias, val, kmIngreso);
  }

  // Generar mensaje de WhatsApp con el Acta de Recepción
  function handleEnviarActaWhatsApp() {
    const tel = (clienteTelefono || '').replace(/\D/g, '');
    const lineasDanos = danos.length === 0
      ? '• Carrocería sin daños ni rayones visibles de ingreso.'
      : danos.map((d) => `• Punto ${d.numero}: ${d.detalle} (${d.vista.replace('_', ' ')})`).join('\n');

    const pertenenciasTexto = [
      `• Rueda de repuesto: ${pertenencias.ruedaRepuesto ? 'PRESENTE' : 'NO PRESENTA'}`,
      `• Gata y llave: ${pertenencias.gata ? 'PRESENTE' : 'NO PRESENTA'}`,
      `• Documentos en guantera: ${pertenencias.documentos ? 'REGISTRADOS' : 'NO REGISTRADOS'}`,
      `• Nivel de combustible: ${combustible}`,
      kmIngreso ? `• Odómetro: ${kmIngreso} km` : null
    ].filter(Boolean).join('\n');

    const msg =
      `*AUTOBOOKING — ACTA DE RECEPCIÓN & INSPECCIÓN 360°*\n\n` +
      `Estimado/a ${clienteNombre || 'Cliente'},\n` +
      `Confirmamos el ingreso de su vehículo *${(patente || '').toUpperCase()}* a nuestro taller técnico.\n\n` +
      `*INSPECCIÓN DE CARROCERÍA Y DAÑOS:* \n${lineasDanos}\n\n` +
      `*INVENTARIO DE CABINA Y COMBUSTIBLE:*\n${pertenenciasTexto}\n\n` +
      (observaciones ? `*OBSERVACIONES ADICIONALES:*\n${observaciones}\n\n` : '') +
      `Su vehículo queda bajo protocolo de resguardo y diagnóstico profesional. Le informaremos avances en tiempo real por este medio.`;

    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const danosEnVistaActual = danos.filter((d) => d.vista === vistaActual);

  return (
    <div className="bg-[#0b0e14] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl text-white">
      {/* Cabecera */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
            360°
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-white">
                Inspección Visual de Carrocería & Daños
              </h3>
              {patente && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/[0.06] border border-white/[0.1] text-blue-300">
                  {patente.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs text-white/40">
              Toca la silueta del vehículo para registrar rayones o abolladuras de ingreso.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEnviarActaWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all cursor-pointer"
            title="Enviar acta digital al cliente por WhatsApp"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
            </svg>
            <span>Acta WhatsApp</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL IZQUIERDO: Selector de Tipo y Controles de Vistas (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Selector de Ángulo / Vista */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
              Ángulo de Inspección
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <button
                type="button"
                onClick={() => setVistaActual('superior')}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                  vistaActual === 'superior' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Vista Superior
              </button>
              <button
                type="button"
                onClick={() => setVistaActual('lateral_izq')}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                  vistaActual === 'lateral_izq' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Lateral Izquierdo
              </button>
              <button
                type="button"
                onClick={() => setVistaActual('lateral_der')}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                  vistaActual === 'lateral_der' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Lateral Derecho
              </button>
              <button
                type="button"
                onClick={() => setVistaActual('frente_trasera')}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                  vistaActual === 'frente_trasera' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Frente & Posterior
              </button>
            </div>
          </div>

          {/* Tipo de Daño a marcar */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
              Herramienta de Marcaje
            </label>
            <div className="space-y-1.5">
              {TIPOS_DANO.map((tipo) => {
                const activo = tipoSeleccionado === tipo.id;
                return (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => setTipoSeleccionado(tipo.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      activo
                        ? 'bg-white/[0.08] border-white/25 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full border ${tipo.color}`} />
                      <span>{tipo.label}</span>
                    </div>
                    {activo && <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Activo</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nivel de Combustible */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
              Nivel de Combustible de Ingreso
            </label>
            <div className="grid grid-cols-5 gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center">
              {NIVELES_COMBUSTIBLE.map((nivel) => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => handleCombustibleChange(nivel)}
                  className={`py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                    combustible === nivel ? 'bg-blue-600 text-white shadow' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {nivel}
                </button>
              ))}
            </div>
          </div>

          {/* Kilometraje de Ingreso */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Odómetro al Recibir (KM)
            </label>
            <input
              type="text"
              value={kmIngreso}
              onChange={(e) => {
                setKmIngreso(e.target.value);
                notifyChanges(danos, combustible, pertenencias, observaciones, e.target.value);
              }}
              placeholder="ej. 85.420"
              className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 outline-none"
            />
          </div>
        </div>

        {/* PANEL CENTRAL: Silueta Interactiva (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="w-full bg-[#080a0d] border border-white/[0.06] rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[380px] select-none">
            <div className="absolute top-3 left-4 text-xs text-white/40 font-mono uppercase tracking-wider">
              {vistaActual === 'superior' && 'Vista Techo y Contorno'}
              {vistaActual === 'lateral_izq' && 'Costado Conductor (Izquierdo)'}
              {vistaActual === 'lateral_der' && 'Costado Acompañante (Derecho)'}
              {vistaActual === 'frente_trasera' && 'Frontal (Capó) & Trasera (Maletero)'}
            </div>

            <div className="absolute top-3 right-4 text-[11px] text-white/40">
              Total Daños: <span className="font-bold text-white">{danos.length}</span>
            </div>

            {/* Lienzo SVG Interactivo */}
            <div
              onClick={handleSvgClick}
              className="relative w-full max-w-[460px] h-[300px] flex items-center justify-center cursor-crosshair p-2"
            >
              {/* VISTA SUPERIOR */}
              {vistaActual === 'superior' && (
                <svg className="w-full h-full max-h-[280px]" viewBox="0 0 240 400" fill="none">
                  {/* Carrocería Superior */}
                  <rect x="50" y="30" width="140" height="340" rx="45" fill="#111622" stroke="#334155" strokeWidth="2" />
                  {/* Parabrisas delantero */}
                  <path d="M 65 110 Q 120 95 175 110 L 165 155 Q 120 150 75 155 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  {/* Luneta trasera */}
                  <path d="M 72 280 Q 120 288 168 280 L 164 320 Q 120 325 76 320 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  {/* Techo */}
                  <rect x="75" y="165" width="90" height="105" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />
                  {/* Espejos laterales */}
                  <rect x="36" y="125" width="14" height="24" rx="5" fill="#334155" />
                  <rect x="190" y="125" width="14" height="24" rx="5" fill="#334155" />
                  {/* Capó líneas */}
                  <path d="M 85 45 L 85 95 M 155 45 L 155 95" stroke="#334155" strokeWidth="1.5" />
                  {/* Ruedas */}
                  <rect x="34" y="65" width="16" height="42" rx="4" fill="#0f172a" stroke="#475569" />
                  <rect x="190" y="65" width="16" height="42" rx="4" fill="#0f172a" stroke="#475569" />
                  <rect x="34" y="290" width="16" height="42" rx="4" fill="#0f172a" stroke="#475569" />
                  <rect x="190" y="290" width="16" height="42" rx="4" fill="#0f172a" stroke="#475569" />
                  <text x="120" y="70" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">FRENTE</text>
                  <text x="120" y="355" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">TRASERA</text>
                </svg>
              )}

              {/* VISTA LATERAL IZQUIERDA */}
              {vistaActual === 'lateral_izq' && (
                <svg className="w-full h-full max-h-[220px]" viewBox="0 0 460 200" fill="none">
                  {/* Silueta Lateral */}
                  <path
                    d="M 30 140 L 430 140 Q 435 130 425 110 L 380 95 L 310 50 Q 230 48 160 52 L 100 95 L 45 105 Q 25 120 30 140 Z"
                    fill="#111622"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  {/* Ventanas */}
                  <path d="M 165 62 L 230 60 L 230 95 L 120 95 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 238 60 L 305 60 L 345 95 L 238 95 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  {/* Ruedas y Guardabarros */}
                  <circle cx="100" cy="140" r="32" fill="#0b0e14" stroke="#475569" strokeWidth="3" />
                  <circle cx="100" cy="140" r="16" fill="#1e293b" stroke="#64748b" />
                  <circle cx="360" cy="140" r="32" fill="#0b0e14" stroke="#475569" strokeWidth="3" />
                  <circle cx="360" cy="140" r="16" fill="#1e293b" stroke="#64748b" />
                  {/* Puertas */}
                  <line x1="234" y1="60" x2="234" y2="135" stroke="#334155" strokeWidth="1.5" />
                  {/* Manillas */}
                  <rect x="200" y="102" width="14" height="4" rx="2" fill="#94a3b8" />
                  <rect x="270" y="102" width="14" height="4" rx="2" fill="#94a3b8" />
                  <text x="55" y="125" fill="#475569" fontSize="10" fontWeight="bold">FRENTE</text>
                  <text x="400" y="125" fill="#475569" fontSize="10" fontWeight="bold">ATRÁS</text>
                </svg>
              )}

              {/* VISTA LATERAL DERECHA */}
              {vistaActual === 'lateral_der' && (
                <svg className="w-full h-full max-h-[220px]" viewBox="0 0 460 200" fill="none">
                  {/* Invertido horizontalmente */}
                  <g transform="translate(460, 0) scale(-1, 1)">
                    <path
                      d="M 30 140 L 430 140 Q 435 130 425 110 L 380 95 L 310 50 Q 230 48 160 52 L 100 95 L 45 105 Q 25 120 30 140 Z"
                      fill="#111622"
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    <path d="M 165 62 L 230 60 L 230 95 L 120 95 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <path d="M 238 60 L 305 60 L 345 95 L 238 95 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="100" cy="140" r="32" fill="#0b0e14" stroke="#475569" strokeWidth="3" />
                    <circle cx="100" cy="140" r="16" fill="#1e293b" stroke="#64748b" />
                    <circle cx="360" cy="140" r="32" fill="#0b0e14" stroke="#475569" strokeWidth="3" />
                    <circle cx="360" cy="140" r="16" fill="#1e293b" stroke="#64748b" />
                    <line x1="234" y1="60" x2="234" y2="135" stroke="#334155" strokeWidth="1.5" />
                    <rect x="200" y="102" width="14" height="4" rx="2" fill="#94a3b8" />
                    <rect x="270" y="102" width="14" height="4" rx="2" fill="#94a3b8" />
                  </g>
                  <text x="400" y="125" fill="#475569" fontSize="10" fontWeight="bold">FRENTE</text>
                  <text x="55" y="125" fill="#475569" fontSize="10" fontWeight="bold">ATRÁS</text>
                </svg>
              )}

              {/* VISTA FRENTE Y TRASERA */}
              {vistaActual === 'frente_trasera' && (
                <div className="w-full flex items-center justify-around gap-4">
                  {/* Frente */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-white/50 mb-2 font-bold uppercase">Frontal</span>
                    <svg className="w-[180px] h-[180px]" viewBox="0 0 200 200" fill="none">
                      <rect x="20" y="70" width="160" height="90" rx="20" fill="#111622" stroke="#334155" strokeWidth="2" />
                      <path d="M 35 70 Q 100 45 165 70 Z" fill="#1e293b" stroke="#475569" />
                      {/* Focos */}
                      <polygon points="30,85 65,85 60,105 30,100" fill="#f8fafc" opacity="0.8" />
                      <polygon points="170,85 135,85 140,105 170,100" fill="#f8fafc" opacity="0.8" />
                      {/* Parrilla */}
                      <rect x="70" y="90" width="60" height="35" rx="5" fill="#0f172a" stroke="#334155" />
                      {/* Patente */}
                      <rect x="78" y="135" width="44" height="15" rx="2" fill="#ffffff" />
                      <text x="100" y="146" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">{patente ? patente.toUpperCase() : 'PATENTE'}</text>
                      {/* Ruedas */}
                      <rect x="15" y="120" width="12" height="45" rx="3" fill="#020617" />
                      <rect x="173" y="120" width="12" height="45" rx="3" fill="#020617" />
                    </svg>
                  </div>

                  {/* Trasera */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-white/50 mb-2 font-bold uppercase">Trasera</span>
                    <svg className="w-[180px] h-[180px]" viewBox="0 0 200 200" fill="none">
                      <rect x="20" y="70" width="160" height="90" rx="20" fill="#111622" stroke="#334155" strokeWidth="2" />
                      <path d="M 35 70 Q 100 50 165 70 Z" fill="#1e293b" stroke="#475569" />
                      {/* Luces traseras rojas */}
                      <polygon points="30,85 65,85 60,105 30,100" fill="#ef4444" />
                      <polygon points="170,85 135,85 140,105 170,100" fill="#ef4444" />
                      {/* Maletero manilla */}
                      <line x1="75" y1="105" x2="125" y2="105" stroke="#475569" strokeWidth="2" />
                      {/* Patente */}
                      <rect x="78" y="120" width="44" height="15" rx="2" fill="#ffffff" />
                      <text x="100" y="131" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">{patente ? patente.toUpperCase() : 'PATENTE'}</text>
                      {/* Ruedas */}
                      <rect x="15" y="120" width="12" height="45" rx="3" fill="#020617" />
                      <rect x="173" y="120" width="12" height="45" rx="3" fill="#020617" />
                    </svg>
                  </div>
                </div>
              )}

              {/* PINS DE DAÑOS EN LA VISTA ACTUAL */}
              {danosEnVistaActual.map((dano) => {
                const tipoObj = TIPOS_DANO.find((t) => t.id === dano.tipo) || TIPOS_DANO[0];
                return (
                  <div
                    key={dano.id}
                    style={{ left: `${dano.x}%`, top: `${dano.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarDano(dano.id);
                    }}
                    title={`${dano.detalle} - Clic para eliminar`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-2 ring-black ${tipoObj.color}`}>
                      {dano.numero}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none whitespace-nowrap transition-all">
                      Punto {dano.numero}: {dano.detalle} (Eliminar)
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-white/30 mt-2 text-center">
              Haz clic en cualquier punto del auto para añadir un pin. Para borrar un pin, haz clic sobre él.
            </p>
          </div>

          {/* Lista de Daños Registrados */}
          {danos.length > 0 && (
            <div className="w-full mt-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2 flex items-center justify-between">
                <span>Daños Registrados ({danos.length})</span>
                <span className="text-[10px] text-white/30">Clic en X para remover</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {danos.map((d) => {
                  const tipoObj = TIPOS_DANO.find((t) => t.id === d.tipo) || TIPOS_DANO[0];
                  return (
                    <div
                      key={d.id}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${tipoObj.color}`}>
                          {d.numero}
                        </span>
                        <span className="text-white/80 truncate font-medium">{d.detalle}</span>
                        <span className="text-[10px] text-white/40 font-mono">({d.vista.replace('_', ' ')})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminarDano(d.id)}
                        className="text-white/30 hover:text-rose-400 p-1"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checklist de Pertenencias y Observaciones */}
      <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-white/[0.01]">
        <div className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3">
          Checklist de Pertenencias y Elementos de Seguridad
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
          {[
            { key: 'ruedaRepuesto', label: 'Rueda Repuesto' },
            { key: 'gata', label: 'Gata Hidráulica' },
            { key: 'llaveRuedas', label: 'Llave de Ruedas' },
            { key: 'documentos', label: 'Documentos Auto' },
            { key: 'antena', label: 'Antena / Radio' },
            { key: 'objetosRetirados', label: 'Valores Retirados' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handlePertenenciaToggle(item.key)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                pertenencias[item.key]
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-white/40'
              }`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                pertenencias[item.key] ? 'bg-blue-600 text-white' : 'border border-white/20'
              }`}>
                {pertenencias[item.key] ? '✓' : ''}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
            Observaciones Especiales del Cliente al Ingresar
          </label>
          <textarea
            rows={2}
            value={observaciones}
            onChange={(e) => handleObservacionesChange(e.target.value)}
            placeholder="ej. Ruido metálico al girar volante a la izquierda. Cliente autoriza diagnóstico preliminar."
            className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
