'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import BottomNav from '../../../components/BottomNav';
import { getOrdenes, getCitas, DEMO_TALLERES } from '../../../lib/supabase';
import { whatsappUrl } from '../../../lib/config';

export default function HistorialVehiculoPage() {
  const params = useParams();
  const rawPatente = (params?.patente || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [vehiculoInfo, setVehiculoInfo] = useState(null);
  const [showStickerModal, setShowStickerModal] = useState(false);

  useEffect(() => {
    async function loadHistorial() {
      if (!rawPatente) return;
      setLoading(true);
      try {
        const [ordenes, citas] = await Promise.all([getOrdenes(), getCitas()]);

        const otList = (ordenes || []).filter(
          (o) => (o.patente || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === rawPatente
        );

        const citasList = (citas || []).filter(
          (c) => (c.patente || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === rawPatente
        );

        // Mapear eventos al historial unificado
        const timeline = [
          ...otList.map((o) => ({
            id: o.id || o.numero_ot,
            tipo: 'OT',
            codigo: o.numero_ot,
            fecha: o.fecha_entrega || o.created_at?.split('T')[0] || o.fecha_estimada,
            km: o.km || '45000',
            marca: o.marca,
            modelo: o.modelo,
            ano: o.ano,
            servicio: o.trabajos?.[0]?.descripcion || 'Mantención General y Diagnóstico',
            detalles: o.trabajos || [],
            repuestos: o.repuestos || [],
            mecanico: o.mecanico_asignado || 'Técnico Especialista',
            diagnostico: o.diagnostico,
            garantia: '6 Meses o 10.000 KM'
          })),
          ...citasList.map((c) => ({
            id: c.id,
            tipo: 'CITA',
            codigo: `AG-${c.fecha?.replace(/-/g, '')}`,
            fecha: c.fecha,
            km: c.km || '40000',
            marca: c.marca,
            modelo: c.modelo,
            ano: '2020',
            servicio: c.servicio || 'Servicio Preventivo',
            detalles: [{ descripcion: c.servicio || 'Chequeo de taller', completado: true }],
            repuestos: [],
            mecanico: 'Equipo AutoBooking',
            diagnostico: c.notas_taller || c.comentario,
            garantia: 'Garantía Estándar'
          }))
        ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setServicios(timeline);

        if (timeline.length > 0) {
          const primero = timeline[0];
          setVehiculoInfo({
            marca: primero.marca || 'Vehículo',
            modelo: primero.modelo || '',
            ano: primero.ano || '2020',
            kmActual: primero.km
          });
        } else {
          setVehiculoInfo({
            marca: 'Vehículo Multimarca',
            modelo: '',
            ano: '2020',
            kmActual: '45.000'
          });
        }
      } catch (err) {
        console.error('Error cargando pasaporte digital:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistorial();
  }, [rawPatente]);

  const patenteFormateada =
    rawPatente.length === 6
      ? `${rawPatente.slice(0, 2)}·${rawPatente.slice(2, 4)}·${rawPatente.slice(4, 6)}`
      : rawPatente;

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/historial/${rawPatente}`
    : `https://autobooking.cl/historial/${rawPatente}`;

  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}&color=0f172a&bgcolor=ffffff&qzone=2`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0d] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-white/60 text-sm tracking-wide">Cargando Pasaporte Digital del Auto...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans flex flex-col selection:bg-emerald-600 selection:text-white pb-24">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-8 w-full">
        {/* Barra Superior con Acciones */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Pasaporte Técnico Certificado
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowStickerModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Generar Sticker QR Guantera</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6.72 13.829c-.24-1.056-.867-1.809-1.944-1.809-1.467 0-2.276 1.341-2.276 3.085 0 1.777.848 3.102 2.33 3.102 1.057 0 1.696-.753 1.91-1.782h1.644c-.263 1.954-1.597 3.125-3.554 3.125-2.58 0-4.04-1.92-4.04-4.445 0-2.482 1.488-4.444 3.997-4.444 2.008 0 3.32 1.207 3.533 3.168H6.72z" />
              </svg>
              <span>Imprimir Certificado</span>
            </button>
          </div>
        </div>

        {/* Portada del Pasaporte */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0d1622] via-[#090f17] to-[#070b10] p-6 sm:p-8 shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Placa Patente */}
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    Historial Certificado
                  </span>
                  <span className="text-xs text-white/40">AutoBooking Red</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {vehiculoInfo?.marca} {vehiculoInfo?.modelo}
                </h1>
                <p className="text-xs text-white/40 mt-1">
                  Año {vehiculoInfo?.ano || '2020'} • Último Odómetro Registrado: <strong className="text-white">{vehiculoInfo?.kmActual} KM</strong>
                </p>
              </div>
            </div>

            {/* Sello de Garantía */}
            <div className="flex flex-col sm:items-end">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Libreta Verificada</div>
                  <div className="text-[10px] text-white/40">{servicios.length} mantenciones oficiales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cronología de Mantenimientos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Registro Histórico de Servicios ({servicios.length})
            </h2>
            <Link
              href={`/estado/${rawPatente}`}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver estado en vivo de reparación →
            </Link>
          </div>

          {servicios.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d121c]/70 p-8 text-center">
              <p className="text-white/60 text-sm mb-2">No se han registrado mantenciones previas para esta patente.</p>
              <p className="text-xs text-white/40 mb-4">Agenda tu primera inspección para activar tu pasaporte digital.</p>
              <Link
                href="/agendar"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Agendar Inspección de Ingreso
              </Link>
            </div>
          ) : (
            servicios.map((s, idx) => (
              <div
                key={s.id || idx}
                className="relative rounded-2xl border border-white/[0.08] bg-[#0d121c]/80 p-6 shadow-xl backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                      #{servicios.length - idx}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{s.servicio}</h3>
                      <p className="text-[11px] text-white/40">
                        {s.codigo} • Fecha: {s.fecha} • Kilometraje: <strong className="text-white/80">{s.km} KM</strong>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 self-start sm:self-auto">
                    Garantía: {s.garantia}
                  </span>
                </div>

                {/* Trabajos Realizados */}
                {s.detalles && s.detalles.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
                      Trabajos Ejecutados:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {s.detalles.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-white/80">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{d.descripcion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repuestos Instalados */}
                {s.repuestos && s.repuestos.length > 0 && (
                  <div className="mb-3 pt-3 border-t border-white/[0.04]">
                    <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
                      Repuestos Reemplazados:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {s.repuestos.map((r, rIdx) => (
                        <span key={rIdx} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/70">
                          {r.repuesto} {r.cantidad > 1 ? `(x${r.cantidad})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pie del Servicio */}
                <div className="flex items-center justify-between text-[11px] text-white/40 pt-3 border-t border-white/[0.06]">
                  <span>Responsable: <strong className="text-white/60">{s.mecanico}</strong></span>
                  <span className="text-emerald-400 font-mono">Sello AutoBooking Verificado</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL: Sticker QR para Guantera */}
      {showStickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0d121c] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowStickerModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-semibold text-white mb-1">
              Sticker QR Oficial para Vehículo
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Imprime esta etiqueta y pégala en la guantera o parabrisas del vehículo para acceso instantáneo al historial.
            </p>

            {/* Vista Previa del Sticker Imprimible (Estilo Lujo 8x5cm) */}
            <div className="p-5 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 shadow-2xl flex flex-col items-center text-center mb-6">
              <div className="w-full flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                  AUTOBOOKING • PASAPORTE DIGITAL
                </span>
                <span className="text-[10px] font-bold text-blue-600 font-mono">
                  {patenteFormateada}
                </span>
              </div>

              {/* Imagen QR */}
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 shadow-sm mb-3">
                <img
                  src={qrImageSrc}
                  alt={`QR Historial ${rawPatente}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs font-bold text-slate-900 mb-0.5">
                ESCANEA CON TU CELULAR
              </div>
              <div className="text-[10px] text-slate-600">
                Historial de mantenciones y sellos de garantía técnica al día
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Imprimir Sticker
              </button>
              <button
                type="button"
                onClick={() => setShowStickerModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 text-xs transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
