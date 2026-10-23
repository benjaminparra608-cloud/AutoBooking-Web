'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import BottomNav from '../../../components/BottomNav';
import { getOrdenes, getCitas, DEMO_TALLERES } from '../../../lib/supabase';
import { whatsappUrl } from '../../../lib/config';

const ETAPAS_OT = [
  { id: 'ingresado', label: 'Recepción & Checklist', desc: 'Vehículo recibido e inspeccionado en taller', porcentaje: 20 },
  { id: 'diagnostico', label: 'Diagnóstico & Desarme', desc: 'Revisión computarizada y chequeo visual', porcentaje: 40 },
  { id: 'en_proceso', label: 'En Reparación', desc: 'Mecánico ejecutando los trabajos autorizados', porcentaje: 65 },
  { id: 'espera_repuestos', label: 'En Espera de Repuestos', desc: 'Repuestos originales en tránsito al taller', porcentaje: 50 },
  { id: 'listo_entrega', label: 'Listo para Entrega', desc: 'Control de calidad aprobado y lavado final', porcentaje: 95 },
  { id: 'entregado', label: 'Entregado al Cliente', desc: 'Servicio finalizado con garantía certificada', porcentaje: 100 },
];

export default function EstadoAutoPage() {
  const params = useParams();
  const rawPatente = (params?.patente || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  const [loading, setLoading] = useState(true);
  const [ordenActiva, setOrdenActiva] = useState(null);
  const [citaActiva, setCitaActiva] = useState(null);
  const [tallerAsignado, setTallerAsignado] = useState(DEMO_TALLERES[0]);

  useEffect(() => {
    async function loadEstado() {
      if (!rawPatente) return;
      setLoading(true);
      try {
        const [ordenes, citas] = await Promise.all([getOrdenes(), getCitas()]);

        // Buscar OT activa que coincida con la patente
        const ot = (ordenes || []).find(
          (o) => (o.patente || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === rawPatente
        );

        // Buscar Cita si no hay OT
        const cita = (citas || []).find(
          (c) => (c.patente || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === rawPatente
        );

        setOrdenActiva(ot || null);
        setCitaActiva(cita || null);
      } catch (err) {
        console.error('Error cargando estado:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEstado();
  }, [rawPatente]);

  // Formato chileno de patente: KL·MN·34 o AB·CD·12
  const patenteFormateada =
    rawPatente.length === 6
      ? `${rawPatente.slice(0, 2)}·${rawPatente.slice(2, 4)}·${rawPatente.slice(4, 6)}`
      : rawPatente;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0d] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white/60 text-sm tracking-wide">Consultando telemetría del taller...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Estado actual del Stepper
  const estadoActual = ordenActiva ? ordenActiva.estado : citaActiva ? 'ingresado' : 'sin_orden';
  const etapaObj = ETAPAS_OT.find((e) => e.id === estadoActual) || ETAPAS_OT[0];
  const porcentaje = ordenActiva ? etapaObj.porcentaje : citaActiva ? 20 : 0;

  const nombreVehiculo = ordenActiva
    ? `${ordenActiva.marca || ''} ${ordenActiva.modelo || ''}`.trim() || 'Vehículo en Taller'
    : citaActiva
    ? `${citaActiva.marca || ''} ${citaActiva.modelo || ''}`.trim() || 'Vehículo Registrado'
    : 'Vehículo';

  const mecanicoAsignado = ordenActiva?.mecanico_asignado || 'Equipo Técnico AutoBooking';
  const fechaEstimada = ordenActiva?.fecha_estimada || citaActiva?.fecha || 'Hoy';

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white pb-24">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-8 w-full">
        {/* Banner Superior con Pulsante En Vivo */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Telemetría en Vivo de Taller
            </span>
          </div>
          <Link
            href="/estado"
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            ← Consultar otra patente
          </Link>
        </div>

        {/* Tarjeta de Encabezado: Patente y Datos del Auto */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0d121c] via-[#090d14] to-[#07090e] p-6 sm:p-8 shadow-2xl mb-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Placa Patente Chilena Estilizada */}
              <div className="relative bg-white text-black px-4 py-2 rounded-lg border-2 border-slate-800 shadow-xl flex flex-col items-center justify-center min-w-[140px]">
                <div className="w-full flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-300 pb-0.5 mb-0.5">
                  <span>CHILE</span>
                  <span className="text-blue-600">★</span>
                </div>
                <span className="font-mono font-black text-xl sm:text-2xl tracking-widest">
                  {patenteFormateada}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {nombreVehiculo}
                </h1>
                <p className="text-xs sm:text-sm text-white/50 mt-1 flex items-center gap-2">
                  <span>{ordenActiva?.numero_ot || 'Cita Confirmada'}</span>
                  <span>•</span>
                  <span>Mecánico: <strong className="text-white/80">{mecanicoAsignado}</strong></span>
                </p>
              </div>
            </div>

            {/* Estado Badge */}
            <div className="flex flex-col sm:items-end">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border ${
                estadoActual === 'listo_entrega' || estadoActual === 'entregado'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {etapaObj.label}
              </span>
              <span className="text-[11px] text-white/40 mt-1.5 font-light">
                Fecha estimada de entrega: <strong className="text-white/70">{fechaEstimada}</strong>
              </span>
            </div>
          </div>

          {/* Barra de Progreso Global */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>Progreso de Reparación: <strong className="text-white">{etapaObj.desc}</strong></span>
              <span className="font-mono font-bold text-blue-400">{porcentaje}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700 shadow-lg shadow-blue-500/50"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stepper de Etapas en Vivo */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d121c]/70 p-6 sm:p-8 shadow-xl backdrop-blur-sm mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-6">
            Línea de Tiempo del Servicio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {[
              { id: 'ingresado', num: '1', titulo: 'Ingreso & Checklist', sub: 'Inspección 360°' },
              { id: 'diagnostico', num: '2', titulo: 'Diagnóstico', sub: 'Pauta Técnica' },
              { id: 'en_proceso', num: '3', titulo: 'En Reparación', sub: 'Elevador Activo' },
              { id: 'listo_entrega', num: '4', titulo: 'Control Calidad', sub: 'Listo Retiro' },
              { id: 'entregado', num: '5', titulo: 'Entregado', sub: 'Garantía Activa' }
            ].map((paso, idx) => {
              const pasado =
                (paso.id === 'ingresado') ||
                (paso.id === 'diagnostico' && ['diagnostico', 'en_proceso', 'espera_repuestos', 'listo_entrega', 'entregado'].includes(estadoActual)) ||
                (paso.id === 'en_proceso' && ['en_proceso', 'espera_repuestos', 'listo_entrega', 'entregado'].includes(estadoActual)) ||
                (paso.id === 'listo_entrega' && ['listo_entrega', 'entregado'].includes(estadoActual)) ||
                (paso.id === 'entregado' && estadoActual === 'entregado');

              const esActual =
                (paso.id === estadoActual) ||
                (paso.id === 'en_proceso' && estadoActual === 'espera_repuestos');

              return (
                <div key={paso.id} className="flex flex-col items-center sm:items-start text-center sm:text-left relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        pasado
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-white/[0.04] text-white/30 border border-white/[0.08]'
                      } ${esActual ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black' : ''}`}
                    >
                      {pasado ? '✓' : paso.num}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">{paso.titulo}</span>
                  </div>
                  <span className="text-[11px] text-white/40">{paso.sub}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trabajos en Ejecución y Diagnóstico */}
        {ordenActiva && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Trabajos Realizados */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d121c]/70 p-6 shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center justify-between">
                <span>Pauta de Trabajos Autorizados</span>
                <span className="text-[11px] text-blue-400 font-mono">
                  {(ordenActiva.trabajos || []).filter((t) => t.completado).length}/{(ordenActiva.trabajos || []).length} Listos
                </span>
              </h3>

              <div className="space-y-2.5">
                {(ordenActiva.trabajos || []).map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        t.completado ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.05] text-white/30'
                      }`}>
                        {t.completado ? '✓' : idx + 1}
                      </span>
                      <span className={`truncate ${t.completado ? 'text-white/90 line-through opacity-70' : 'text-white font-medium'}`}>
                        {t.descripcion}
                      </span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                      t.completado ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      {t.completado ? 'Listo' : 'En proceso'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnóstico y Resguardo de Ingreso */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d121c]/70 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                  Informe Técnico de Ingreso
                </h3>

                {ordenActiva.diagnostico ? (
                  <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-blue-200/90 leading-relaxed mb-4">
                    {ordenActiva.diagnostico}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 mb-4">Inspección de diagnóstico en desarrollo.</p>
                )}

                {/* Inventario de Cabina */}
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60 pt-2 border-t border-white/[0.06]">
                  <div>Combustible: <strong className="text-white">{ordenActiva.checklist?.combustible || '1/2'}</strong></div>
                  <div>Rueda Repuesto: <strong className="text-white">{ordenActiva.checklist?.ruedaRepuesto !== false ? 'Presente' : 'No'}</strong></div>
                  <div>Documentos: <strong className="text-white">{ordenActiva.checklist?.documentos !== false ? 'En cabina' : 'No'}</strong></div>
                  <div>Daños Carrocería: <strong className="text-white">{ordenActiva.checklist?.danos?.length || 0} registrados</strong></div>
                </div>
              </div>

              {/* Botón Pasaporte Digital */}
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link
                  href={`/historial/${rawPatente}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white transition-all"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Ver Hoja de Vida Completa del Auto</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Botón WhatsApp de Atención Directa */}
        <div className="text-center">
          <a
            href={whatsappUrl(`Hola, deseo consultar por el avance de mi vehículo patente ${rawPatente} (${ordenActiva?.numero_ot || 'Servicio'}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
            </svg>
            <span>Consultar al Taller por WhatsApp</span>
          </a>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
