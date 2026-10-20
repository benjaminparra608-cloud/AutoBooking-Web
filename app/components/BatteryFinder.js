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
      `🔋 *Batería solicitada:* ${bateria.nombre}\n` +
      `🏷️ *Código comercial:* ${bateria.codigo}\n` +
      `⚡ *Capacidad:* ${bateria.capacidadAh}Ah | Arranque CCA: ${bateria.cca}A\n` +
      `📍 *Polaridad:* ${bateria.polaridad} (${bateria.tipoBorne})\n` +
      `💰 *Precio:* $${bateria.precio.toLocaleString('es-CL')} CLP\n` +
      (conInstalacion
        ? `🔧 *Servicio:* Con Instalación a Domicilio y Test de Alternador (+ $${bateria.precioInstalacion.toLocaleString('es-CL')} CLP)\n`
        : `🚚 *Servicio:* Solo despacho / entrega\n`) +
      `💳 *Total:* $${total.toLocaleString('es-CL')} CLP\n\n` +
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
    <section id="catalogo-baterias" className="py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Luces y texturas de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-80 h-80 rounded-full blur-[140px] bg-amber-500/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>🔋</span> Catálogo de Baterías de Mayor Rotación Automotriz
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Encuentra la Batería Exacta para tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 font-serif italic font-normal">
              Marca y Modelo
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 font-light">
            Especialistas en las <strong>Baterías más frecuentes y de alta rotación en Chile</strong> (DIN, JIS y AGM Start-Stop). Instalación a domicilio, diagnóstico de alternador computarizado y garantía formal por escrito.
          </p>
        </div>

        {/* BUSCADOR INTELIGENTE EN TIEMPO REAL */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              placeholder="Escribe tu auto (ej: Sail, Swift, Hilux, Morning, RAV4) o código (ej: DIN 55, 55D23L, NS60)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/90 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-xl"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* CHIPS DE AUTOS FRECUENTES */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-[11px] text-slate-500 mr-1 font-medium">Búsquedas rápidas:</span>
            {chipsPopulares.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setBusqueda(chip.q)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  busqueda.toLowerCase() === chip.q.toLowerCase()
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* FILTROS POR TIPO DE NORMA */}
        <div className="flex justify-start sm:justify-center gap-2 mb-8 overflow-x-auto pb-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setFiltroNorma('todas')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroNorma === 'todas'
                ? 'bg-white text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({TOP_8_BATERIAS.length})
          </button>
          <button
            onClick={() => setFiltroNorma('din')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroNorma === 'din'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Norma DIN (Europeas / Mercosur)
          </button>
          <button
            onClick={() => setFiltroNorma('jis')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroNorma === 'jis'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Norma JIS (Asiáticas / Japonesas)
          </button>
          <button
            onClick={() => setFiltroNorma('startstop')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroNorma === 'startstop'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Start-Stop (EFB / AGM)
          </button>
        </div>

        {/* GRILLA DE TARJETAS DE BATERÍAS */}
        {resultados.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 max-w-xl mx-auto">
            <span className="text-4xl block mb-2">🔍</span>
            <h4 className="text-lg font-bold text-white mb-1">No encontramos una batería con ese término</h4>
            <p className="text-xs text-slate-400 mb-4">
              Consúltanos directamente por WhatsApp con tu patente o modelo y te confirmaremos el código exacto en menos de 5 minutos.
            </p>
            <a
              href={whatsappUrl(`Hola AutoBooking, qué batería le sirve a mi auto (${busqueda})?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-5 rounded-full transition-all"
            >
              Consultar Compatibilidad por WhatsApp →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((bat) => (
              <div
                key={bat.id}
                className={`bg-gradient-to-b ${bat.colorCard} border ${bat.borderCard} rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-xl relative transition-all duration-300 hover:-translate-y-1`}
              >
                <div>
                  {/* FOTOGRAFÍA PROFESIONAL DEL PRODUCTO & CÓDIGO */}
                  <div
                    onClick={() => setBateriaModal(bat)}
                    className="w-full h-44 rounded-2xl bg-slate-950/80 border border-white/10 relative overflow-hidden cursor-pointer group-hover:border-amber-400/50 transition-all duration-300 mb-3 shadow-inner group/img"
                  >
                    <img
                      src={bat.imagen}
                      alt={bat.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover/img:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40 pointer-events-none" />

                    {/* Badge superior sobre la foto */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md border ${bat.tagColor}`}>
                        {bat.rankingLabel}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-white bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 shrink-0">
                        {bat.norma}
                      </span>
                    </div>

                    {/* Código sobre la imagen en la parte inferior */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between pointer-events-none">
                      <div className="bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                        <span className="text-[8px] text-slate-400 font-mono block uppercase">Código:</span>
                        <div className="text-xs sm:text-sm font-mono font-black text-amber-300 tracking-wider">
                          {bat.codigo}
                        </div>
                      </div>
                      <span className="text-[10px] text-cyan-300 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-md border border-cyan-500/30 font-semibold flex items-center gap-1 shadow-sm">
                        Ficha 🔍
                      </span>
                    </div>
                  </div>

                  {/* Formato de caja estandarizado */}
                  <div className="bg-slate-950/70 border border-white/5 rounded-xl px-3 py-1.5 mb-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="truncate pr-2">{bat.formatoCaja}</span>
                    <span className="text-amber-400 font-bold shrink-0">{bat.anclaje}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3 leading-snug">
                    {bat.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {bat.descripcion}
                  </p>

                  {/* ESPECIFICACIONES TÉCNICAS CLAVE */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 border border-white/5 rounded-xl p-2.5 my-3.5 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Capacidad:</span>
                      <strong className="text-white font-mono text-xs">{bat.capacidadAh} Ah</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Arranque:</span>
                      <strong className="text-cyan-400 font-mono text-xs">{bat.cca} CCA</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Polaridad:</span>
                      <strong className="text-amber-300 font-mono text-[11px] truncate block" title={bat.polaridad}>
                        {bat.polaridad.includes('(PD') || bat.polaridad.includes('Derecho') ? 'PD (+ Der)' : 'PI (+ Izq)'}
                      </strong>
                    </div>
                  </div>

                  {/* EJEMPLOS DE AUTOS COMPATIBLES */}
                  <div className="text-xs mb-4">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                      🚗 Algunos autos compatibles:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {bat.modelosCompatibles.slice(0, 4).map((mod, i) => (
                        <span
                          key={i}
                          className="bg-slate-950/90 border border-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          {mod}
                        </span>
                      ))}
                      {bat.modelosCompatibles.length > 4 && (
                        <button
                          onClick={() => setBateriaModal(bat)}
                          className="text-[10px] text-cyan-400 font-bold px-1 hover:underline cursor-pointer"
                        >
                          +{bat.modelosCompatibles.length - 4} más...
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRECIO Y ACCIONES */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Precio Batería CLP:</span>
                      <span className="text-2xl font-black text-white font-mono">
                        ${bat.precio.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      +{bat.garantia.split(' ')[0]} meses garantía
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
                            icono: bat.icono
                          },
                          true
                        )
                      }
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-95"
                    >
                      <span>+ Carrito</span>
                      <span>🛒</span>
                    </button>

                    <button
                      onClick={() => handlePedirBateriaWhatsApp(bat, true)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Pedir a domicilio por WhatsApp"
                    >
                      <span>Instalar</span>
                      <span>💬</span>
                    </button>

                    <button
                      onClick={() => setBateriaModal(bat)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 px-2.5 rounded-xl transition-colors cursor-pointer"
                      title="Ver ficha técnica completa"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTA DE SERVICIO TÉCNICO INCLUIDO */}
        <div className="mt-10 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-2xl flex items-center justify-center shrink-0">
              ⚡
            </div>
            <div>
              <strong className="text-white text-sm block font-bold mb-0.5">
                ¿Te quedaste en panne de batería en tu casa o trabajo?
              </strong>
              <span>
                Llevamos la batería exacta a tu domicilio en Santiago, realizamos el reemplazo técnico, limpiamos bornes y testeamos el alternador con equipo digital sin costo adicional.
              </span>
            </div>
          </div>

          <a
            href={whatsappUrl("Hola AutoBooking, me quedé en panne de batería y necesito auxilio a domicilio urgente")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs py-3 px-6 rounded-full transition-all shrink-0 text-center shadow-lg shadow-amber-500/20"
          >
            🚨 Auxilio Rápido de Batería por WhatsApp →
          </a>
        </div>

      </div>

      {/* MODAL FICHA TÉCNICA EXTENDIDA */}
      {bateriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBateriaModal(null)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${bateriaModal.tagColor} inline-block mb-3`}>
              {bateriaModal.rankingLabel}
            </span>

            {/* Fotografía de batería */}
            {bateriaModal.imagen && (
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-xl group">
                <img
                  src={bateriaModal.imagen}
                  alt={bateriaModal.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30 pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-xs font-mono font-black text-amber-300 bg-black/85 backdrop-blur-md px-3 py-1 rounded-lg border border-amber-500/30">
                    Código {bateriaModal.codigo}
                  </span>
                  <span className="text-xs text-slate-200 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                    {bateriaModal.norma}
                  </span>
                </div>
              </div>
            )}

            <h3 className="text-2xl font-black text-white mb-1">
              {bateriaModal.nombre}
            </h3>
            <p className="text-xs text-amber-300 font-mono font-bold mb-4">
              Código: {bateriaModal.codigo} · {bateriaModal.norma}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs mb-6">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
                <div>
                  <span className="text-slate-500 block">Capacidad:</span>
                  <span className="font-bold text-white font-mono">{bateriaModal.capacidadAh} Ah</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Arranque en Frío:</span>
                  <span className="font-bold text-cyan-400 font-mono">{bateriaModal.cca} CCA (-18°C)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
                <div>
                  <span className="text-slate-500 block">Polaridad:</span>
                  <span className="font-semibold text-slate-200">{bateriaModal.polaridad}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tipo de Borne:</span>
                  <span className="font-semibold text-slate-200">{bateriaModal.tipoBorne}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Dimensiones:</span>
                  <span className="font-semibold text-slate-300 font-mono">{bateriaModal.dimensiones}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Anclaje Inferior:</span>
                  <span className="font-semibold text-slate-300">{bateriaModal.anclaje}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Todos los Modelos Compatibles en Chile:
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                {bateriaModal.modelosCompatibles.map((mod, i) => (
                  <span
                    key={i}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-1 rounded-lg"
                  >
                    ✓ {mod}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Precio con despacho:</span>
                <span className="text-3xl font-black text-white font-mono">
                  ${bateriaModal.precio.toLocaleString('es-CL')} CLP
                </span>
                <span className="text-xs text-cyan-400 block mt-0.5">
                  +$15.000 con instalación a domicilio y chequeo de alternador
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart(
                      {
                        id: bateriaModal.id,
                        nombre: `${bateriaModal.nombre} (${bateriaModal.codigo})`,
                        precio: bateriaModal.precio,
                        precioInstalacion: bateriaModal.precioInstalacion,
                        marca: 'Batería Homologada',
                        icono: bateriaModal.icono
                      },
                      true
                    );
                    setBateriaModal(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Añadir al Carrito 🛒
                </button>
                <button
                  onClick={() => {
                    handlePedirBateriaWhatsApp(bateriaModal, true);
                    setBateriaModal(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Pedir por WhatsApp 💬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
