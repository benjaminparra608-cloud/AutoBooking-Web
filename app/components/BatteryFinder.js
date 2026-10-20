'use client';

import React, { useState } from 'react';
import { TOP_8_BATERIAS, buscarBateriasPorAutoOCodigo } from '../lib/batteryCatalog';
import { useCart } from '../context/CartContext';
import { whatsappUrl } from '../lib/config';
import { createStoreOrder } from '../lib/supabase';

export default function BatteryFinder() {
  const [busqueda, setBusqueda] = useState('');
  const [bateriaModal, setBateriaModal] = useState(null);
  const [filtroNorma, setFiltroNorma] = useState('todas'); // 'todas' | 'din' | 'jis' | 'startstop'
  const { addToCart } = useCart();

  const resultados = buscarBateriasPorAutoOCodigo(busqueda).filter((bat) => {
    if (filtroNorma === 'din') return bat.norma.includes('DIN') && !bat.norma.includes('AGM');
    if (filtroNorma === 'jis') return bat.norma.includes('JIS') && !bat.norma.includes('Start-Stop');
    if (filtroNorma === 'startstop') return bat.tecnologia.includes('EFB') || bat.tecnologia.includes('AGM');
    return true;
  });

  function handlePedirBateriaWhatsApp(bateria, conInstalacion = true) {
    const total = bateria.precio + (conInstalacion ? bateria.precioInstalacion : 0);
    const msg =
      `¡Hola AutoBooking! 🚗 Necesito una batería para mi auto:\n\n` +
      `• Batería: *${bateria.nombre}*\n` +
      `• Código: ${bateria.codigo}\n` +
      `• Capacidad: ${bateria.capacidadAh}Ah | Arranque CCA: ${bateria.cca}A\n` +
      `• Polaridad: ${bateria.polaridad} (${bateria.tipoBorne})\n` +
      `• Precio: $${bateria.precio.toLocaleString('es-CL')} CLP\n` +
      (conInstalacion
        ? `• Servicio: Con Instalación a Domicilio y Test de Alternador (+ $${bateria.precioInstalacion.toLocaleString('es-CL')} CLP)\n`
        : `• Servicio: Solo despacho / entrega\n`) +
      `• Total: *$${total.toLocaleString('es-CL')} CLP*\n\n` +
      `¿Tienen disponibilidad para traerla e instalarla hoy en mi comuna?`;

    try {
      createStoreOrder({
        cliente_nombre: 'Cliente Web (Baterías)',
        cliente_telefono: '',
        comuna: 'Santiago (Por coordinar)',
        patente: '',
        vehiculo: busqueda ? `Consulta por: ${busqueda}` : 'Batería a domicilio',
        items: [
          {
            id: bateria.id,
            nombre: `${bateria.nombre} (${bateria.codigo})`,
            codigo: bateria.codigo,
            cantidad: 1,
            precio: bateria.precio,
            conInstalacion: conInstalacion,
            precioInstalacion: conInstalacion ? bateria.precioInstalacion : 0
          }
        ],
        subtotal: bateria.precio,
        total_instalacion: conInstalacion ? bateria.precioInstalacion : 0,
        costo_despacho: 0,
        total_general: total,
        requiere_instalacion: conInstalacion,
        notas: `Solicitud de batería ${bateria.codigo} vía WhatsApp.`
      });
    } catch (e) {
      console.warn("Error guardando orden de batería:", e);
    }

    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const chipsPopulares = [
    { label: 'Chevrolet Sail (DIN 55)', q: 'Sail' },
    { label: 'Hyundai Accent / Tucson (55D23L)', q: 'Accent' },
    { label: 'Toyota Yaris / Swift (NS60L)', q: 'Yaris' },
    { label: 'Kia Morning / Spark (NS40ZL)', q: 'Morning' },
    { label: 'Toyota Hilux / L200 (105D31L)', q: 'Hilux' },
    { label: 'Nissan Qashqai / MG (80D26L)', q: 'Qashqai' },
    { label: 'Partner / Berlingo (DIN 72)', q: 'Partner' },
    { label: 'Mazda i-Stop (Q85 EFB)', q: 'i-Stop' }
  ];

  return (
    <section id="catalogo-baterias" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-2">
            Catálogo Maestro · Parque Automotriz Chileno
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Encuentra la Batería Exacta
          </h2>
          <p className="text-sm text-white/35 mt-2 font-light">
            Modelos de alta rotación en Chile (DIN, JIS y AGM Start-Stop) con instalación a domicilio, diagnóstico computarizado de alternador y garantía por escrito.
          </p>
        </div>

        {/* BUSCADOR INTELIGENTE EN TIEMPO REAL */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Escribe tu auto (ej: Sail, Swift, Hilux, Morning) o código (DIN 55, 55D23L)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs p-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* CHIPS DE AUTOS FRECUENTES */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-[10px] text-white/25 mr-1 font-mono uppercase tracking-wider">Populares:</span>
            {chipsPopulares.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setBusqueda(chip.q)}
                className={`text-[11px] px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  busqueda.toLowerCase() === chip.q.toLowerCase()
                    ? 'bg-white text-black font-semibold border-white'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* FILTROS POR TIPO DE NORMA */}
        <div className="flex justify-start sm:justify-center gap-2 mb-10 overflow-x-auto pb-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setFiltroNorma('todas')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs transition-all cursor-pointer ${
              filtroNorma === 'todas'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06]'
            }`}
          >
            Todas ({TOP_8_BATERIAS.length})
          </button>
          <button
            onClick={() => setFiltroNorma('din')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs transition-all cursor-pointer ${
              filtroNorma === 'din'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06]'
            }`}
          >
            Norma DIN (Europeas / Mercosur)
          </button>
          <button
            onClick={() => setFiltroNorma('jis')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs transition-all cursor-pointer ${
              filtroNorma === 'jis'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06]'
            }`}
          >
            Norma JIS (Asiáticas / Japonesas)
          </button>
          <button
            onClick={() => setFiltroNorma('startstop')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs transition-all cursor-pointer ${
              filtroNorma === 'startstop'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06]'
            }`}
          >
            Start-Stop (EFB / AGM)
          </button>
        </div>

        {/* GRILLA DE TARJETAS DE BATERÍAS */}
        {resultados.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-12 text-center text-white/40 max-w-xl mx-auto">
            <h4 className="text-base font-semibold text-white mb-1">No encontramos una batería con ese término</h4>
            <p className="text-xs text-white/35 mb-5 font-light">
              Consúltanos por WhatsApp con tu patente o modelo y te confirmamos el código exacto en minutos.
            </p>
            <a
              href={whatsappUrl(`Hola AutoBooking, qué batería le sirve a mi auto (${busqueda})?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-5 rounded-full transition-all"
            >
              Consultar por WhatsApp →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((bat) => (
              <div
                key={bat.id}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  {/* Etiqueta de Segmento */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-blue-400 bg-blue-950/40 border border-blue-800/40">
                      {bat.rankingLabel}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono tracking-wider">
                      {bat.norma}
                    </span>
                  </div>

                  {/* CÓDIGO COMERCIAL DESTACADO */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 my-2 text-center">
                    <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block">
                      Código Estandarizado
                    </span>
                    <div className="text-lg font-mono font-bold text-white tracking-wider">
                      {bat.codigo}
                    </div>
                    <span className="text-[10px] text-white/30 font-mono block mt-0.5">
                      {bat.formatoCaja}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white/90 mt-3 leading-snug">
                    {bat.nombre}
                  </h3>
                  <p className="text-xs text-white/35 mt-1 line-clamp-2 font-light">
                    {bat.descripcion}
                  </p>

                  {/* ESPECIFICACIONES TÉCNICAS */}
                  <div className="grid grid-cols-3 gap-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-2.5 my-3.5 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-white/30 block font-mono uppercase">Capacidad:</span>
                      <strong className="text-white/80 font-mono text-xs font-semibold">{bat.capacidadAh} Ah</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 block font-mono uppercase">Arranque:</span>
                      <strong className="text-blue-400 font-mono text-xs font-semibold">{bat.cca} CCA</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 block font-mono uppercase">Polaridad:</span>
                      <strong className="text-white/80 font-mono text-[11px] truncate block" title={bat.polaridad}>
                        {bat.polaridad.includes('(PD') || bat.polaridad.includes('Derecho') ? 'PD (+ Der)' : 'PI (+ Izq)'}
                      </strong>
                    </div>
                  </div>

                  {/* COMPATIBLES */}
                  <div className="text-xs mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30 block mb-1">
                      Modelos de referencia:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {bat.modelosCompatibles.slice(0, 4).map((mod, i) => (
                        <span
                          key={i}
                          className="bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/50 px-2 py-0.5 rounded-md font-light"
                        >
                          {mod}
                        </span>
                      ))}
                      {bat.modelosCompatibles.length > 4 && (
                        <button
                          onClick={() => setBateriaModal(bat)}
                          className="text-[10px] text-blue-400 font-medium px-1 hover:underline cursor-pointer"
                        >
                          +{bat.modelosCompatibles.length - 4} más...
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRECIO Y ACCIONES */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-white/30 block">Precio CLP</span>
                      <span className="text-2xl font-bold text-white font-mono">
                        ${bat.precio.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400/80 font-light">
                      {bat.garantia.split(' ')[0]} meses garantía
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        addToCart(
                          {
                            id: bat.id,
                            nombre: `${bat.nombre} (${bat.codigo})`,
                            precio: bat.precio,
                            precioInstalacion: bat.precioInstalacion,
                            marca: 'Batería Homologada',
                            icono: '⚡'
                          },
                          true
                        )
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>+ Carrito</span>
                    </button>

                    <button
                      onClick={() => handlePedirBateriaWhatsApp(bat, true)}
                      className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-emerald-400 p-2 rounded-full transition-all cursor-pointer flex items-center justify-center"
                      title="Pedir a domicilio por WhatsApp"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setBateriaModal(bat)}
                      className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/50 hover:text-white p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                      title="Ficha técnica completa"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTA DE SERVICIO TÉCNICO INCLUIDO */}
        <div className="mt-12 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-xs text-white/50 font-light">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <strong className="text-white text-sm block font-semibold mb-0.5">
                ¿Te quedaste en panne de batería en tu domicilio o trabajo?
              </strong>
              <span>
                Llevamos la batería exacta a tu ubicación en Santiago, realizamos el reemplazo técnico, limpiamos bornes y testeamos el alternador digitalmente sin costo adicional.
              </span>
            </div>
          </div>

          <a
            href={whatsappUrl("Hola AutoBooking, me quedé en panne de batería y necesito auxilio a domicilio urgente")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 px-6 rounded-full transition-all shrink-0 text-center shadow-md shadow-blue-600/20"
          >
            Auxilio Inmediato por WhatsApp →
          </a>
        </div>

      </div>

      {/* MODAL FICHA TÉCNICA */}
      {bateriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1117] border border-white/[0.10] rounded-2xl p-7 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBateriaModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-blue-400 bg-blue-950/40 border border-blue-800/40 uppercase tracking-wider inline-block mb-2">
              {bateriaModal.rankingLabel}
            </span>

            <h3 className="text-xl font-black text-white mb-1">
              {bateriaModal.nombre}
            </h3>
            <p className="text-xs text-white/40 font-mono mb-4">
              Código: {bateriaModal.codigo} · {bateriaModal.norma}
            </p>

            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] space-y-2 text-xs mb-5 font-light">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/[0.04]">
                <div>
                  <span className="text-white/30 block font-mono text-[10px] uppercase">Capacidad:</span>
                  <span className="font-semibold text-white font-mono">{bateriaModal.capacidadAh} Ah</span>
                </div>
                <div>
                  <span className="text-white/30 block font-mono text-[10px] uppercase">Arranque en Frío:</span>
                  <span className="font-semibold text-blue-400 font-mono">{bateriaModal.cca} CCA (-18°C)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/[0.04]">
                <div>
                  <span className="text-white/30 block font-mono text-[10px] uppercase">Polaridad:</span>
                  <span className="text-white/70">{bateriaModal.polaridad}</span>
                </div>
                <div>
                  <span className="text-white/30 block font-mono text-[10px] uppercase">Tipo de Borne:</span>
                  <span className="text-white/70">{bateriaModal.tipoBorne}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-white/30 block font-mono text-[10px] uppercase">Dimensiones:</span>
                  <span className="text-white/70 font-mono">{bateriaModal.dimensiones}</span>
                </div>
                <div>
                  <span className="text-white/30 block font-mono text-[10px] uppercase">Anclaje Inferior:</span>
                  <span className="text-white/70">{bateriaModal.anclaje}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">
                Modelos Compatibles en Chile:
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                {bateriaModal.modelosCompatibles.map((mod, i) => (
                  <span
                    key={i}
                    className="bg-white/[0.03] border border-white/[0.06] text-xs text-white/60 px-3 py-1 rounded-lg font-light"
                  >
                    ✓ {mod}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-white/30 block">Precio Total</span>
                <span className="text-2xl font-bold text-white font-mono">
                  ${bateriaModal.precio.toLocaleString('es-CL')} CLP
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(
                      {
                        id: bateriaModal.id,
                        nombre: `${bateriaModal.nombre} (${bateriaModal.codigo})`,
                        precio: bateriaModal.precio,
                        precioInstalacion: bateriaModal.precioInstalacion,
                        marca: 'Batería Homologada',
                        icono: '⚡'
                      },
                      true
                    );
                    setBateriaModal(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-5 rounded-full transition-all cursor-pointer"
                >
                  Añadir al Carrito
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePedirBateriaWhatsApp(bateriaModal, true);
                    setBateriaModal(null);
                  }}
                  className="bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-emerald-400 font-semibold text-xs py-2.5 px-4 rounded-full transition-all cursor-pointer"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
