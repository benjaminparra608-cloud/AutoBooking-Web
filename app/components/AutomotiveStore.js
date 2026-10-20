'use client';

import React, { useState, useRef } from 'react';
import { whatsappUrl } from '../lib/config';
import { useCart } from '../context/CartContext';

const PRODUCTOS_AUTOMOTRICES = [
  {
    id: 'bateria-agm-bosch',
    nombre: 'Batería Bosch S4 / Hankook AGM 65Ah High-Power',
    categoria: 'baterias',
    categoriaNombre: 'Baterías & Energía',
    marca: 'Bosch Automotive',
    precio: 79900,
    precioInstalacion: 15000,
    descripcionCorta: 'Potencia de arranque superior (CCA 580A) con tecnología de aleación plata, sellada y libre de mantención.',
    compatibilidad: 'Universal para Sedanes, SUVs y Citycars (Toyota, Hyundai, Chevrolet, Nissan, Kia, Peugeot, etc.)',
    garantia: '18 meses de garantía directa por escrito',
    especificaciones: [
      'Capacidad: 65 Amperes/hora',
      'Arranque en frío (CCA): 580A a -18°C',
      'Tecnología: AGM / Calcio-Plata sellada',
      'Bornes: Estándar cónicos (+ derecha / izquierda)',
      'Dimensiones: 232 x 173 x 225 mm'
    ],
    badge: 'Alta Demanda',
    packshot: '65Ah · AGM HIGH-POWER',
  },
  {
    id: 'aceite-motul-5w30',
    nombre: 'Kit Lubricación Motul 8100 X-Clean 5W30 (5L) + Filtro Mann',
    categoria: 'lubricantes',
    categoriaNombre: 'Lubricantes & Filtros',
    marca: 'Motul France',
    precio: 54900,
    precioInstalacion: 15000,
    descripcionCorta: 'Lubricante 100% sintético de alto rendimiento formulado para motores Gasolina y Diésel Euro 4, 5 y 6.',
    compatibilidad: 'Aprobaciones BMW LL-04, MB-Approval 229.51, VW 505 00 / 505 01, GM dexos2',
    garantia: 'Sellado de origen con trazabilidad certificada',
    especificaciones: [
      'Viscosidad: SAE 5W-30 100% Sintético',
      'Volumen: Bidón de 5 Litros sellado',
      'Filtro: Incluye Filtro Mann Filter certificado',
      'Base: 100% Sintética Mid SAPS',
      'Intervalo recomendado: Hasta 15.000 km'
    ],
    badge: '100% Sintético',
    packshot: 'MOTUL 8100 · 5W-30 (5L)',
  },
  {
    id: 'frenos-brembo-ceramic',
    nombre: 'Kit Pastillas de Freno Cerámicas Brembo Premium',
    categoria: 'frenos',
    categoriaNombre: 'Sistema de Frenos',
    marca: 'Brembo Official',
    precio: 44900,
    precioInstalacion: 20000,
    descripcionCorta: 'Compuesto cerámico NAO de alta fricción. Frenado silencioso, menor desgaste de discos y llantas limpias.',
    compatibilidad: 'Disponible para eje delantero o trasero según modelo y año',
    garantia: '12 meses o 25.000 km de garantía',
    especificaciones: [
      'Compuesto: Cerámica de última generación (NAO)',
      'Lámina antirruido multicapa shim preinstalada',
      'Respuesta térmica estable hasta 650°C',
      'Libre de asbesto y bajo polvo',
      'Certificación europea ECE-R90'
    ],
    badge: 'Cerámica NAO',
    packshot: 'BREMBO · CERAMIC BRAKES',
  },
  {
    id: 'carplay-android-9',
    nombre: 'Central Multimedia 9" IPS Apple CarPlay & Android Auto Inalámbrico',
    categoria: 'audio',
    categoriaNombre: 'Car Audio & Conectividad',
    marca: 'AutoBooking SoundTech',
    precio: 129900,
    precioInstalacion: 30000,
    descripcionCorta: 'Pantalla táctil HD 2.5D con CarPlay y Android Auto sin cables, Bluetooth 5.0 y cámara de retroceso impermeable.',
    compatibilidad: 'Universal 2 DIN o con bisel específico para tu modelo de auto',
    garantia: '12 meses de garantía técnica',
    especificaciones: [
      'Pantalla: 9 pulgadas IPS Capacitiva 1024x600',
      'Conectividad: Apple CarPlay + Android Auto inalámbrico',
      'Cámara de retroceso: Gran angular 170° HD impermeable',
      'Procesador: Quad-Core con DSP de audio 16 bandas',
      'Entradas: USB dual, Bluetooth 5.0 y entrada auxiliar'
    ],
    badge: 'Wireless CarPlay',
    packshot: 'IPS 9" · CARPLAY WIRELESS',
  },
  {
    id: 'bujias-iridium-ngk',
    nombre: 'Set 4 Bujías NGK Laser Iridium Long-Life (Japón)',
    categoria: 'gadgets',
    categoriaNombre: 'Encendido & Motor',
    marca: 'NGK Spark Plugs Japan',
    precio: 36900,
    precioInstalacion: 15000,
    descripcionCorta: 'Electrodo central de iridio ultrafino de 0.6mm con pastilla de platino en electrodo de masa. Mayor chispa.',
    compatibilidad: 'Rosca 14mm / 16mm estándar para motores japoneses, coreanos y europeos',
    garantia: '100% Original Made in Japan',
    especificaciones: [
      'Electrodo: Punta de Iridio soldado por láser',
      'Vida útil: Hasta 100.000 km de operación',
      'Arranque: Reducción de voltaje requerido en frío',
      'Rendimiento: Combustión más completa y menor consumo'
    ],
    badge: 'Long Life',
    packshot: 'NGK · LASER IRIDIUM',
  },
  {
    id: 'ampolletas-led-philips',
    nombre: 'Kit Ampolletas LED H4 / H7 Canbus 16.000LM 6000K Blanco Frío',
    categoria: 'iluminacion',
    categoriaNombre: 'Iluminación & Visibilidad',
    marca: 'AutoBooking ProLED',
    precio: 32900,
    precioInstalacion: 10000,
    descripcionCorta: 'Luz blanca pura de 6000K con patrón de corte de luz preciso que no encandila. Disipación por cobre activo.',
    compatibilidad: 'Formatos H4 (alta/baja), H7, H11 o H1 según especificación del foco',
    garantia: '12 meses de cambio directo',
    especificaciones: [
      'Luminosidad: 16.000 Lúmenes por par',
      'Temperatura: 6000K Blanco Diamante',
      'Sistema Canbus: Sin error en panel en 98% de autos',
      'Vida útil: Más de 30.000 horas continuas'
    ],
    badge: 'Canbus Ready',
    packshot: '16.000LM · 6000K WHITE',
  },
  {
    id: 'liqui-moly-cera-tec',
    nombre: 'Aditivo Cerámico Antidesgaste Liqui Moly Cera Tec (300ml)',
    categoria: 'lubricantes',
    categoriaNombre: 'Lubricantes & Aditivos',
    marca: 'Liqui Moly Germany',
    precio: 24900,
    precioInstalacion: 0,
    descripcionCorta: 'Protección cerámica de microestructura para el motor. Reduce la fricción, el consumo de combustible y el desgaste.',
    compatibilidad: 'Apto para todo tipo de aceites de motor en vehículos a gasolina y diésel',
    garantia: '100% Made in Germany sellado de fábrica',
    especificaciones: [
      'Efecto duradero: Protección activa hasta por 50.000 km',
      'Reducción de consumo de combustible y rumorosidad',
      'Suavidad notable en ralentí',
      'No obstruye filtros de aceite ni catalizador'
    ],
    badge: 'Made in Germany',
    packshot: 'LIQUI MOLY · CERA TEC',
  }
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'baterias', label: 'Baterías' },
  { id: 'lubricantes', label: 'Aceites & Filtros' },
  { id: 'frenos', label: 'Frenos' },
  { id: 'audio', label: 'Car Audio & CarPlay' },
  { id: 'iluminacion', label: 'Luces LED' },
  { id: 'gadgets', label: 'Encendido & Motor' }
];

export default function AutomotiveStore() {
  const { addToCart, setIsOpen, totalItems } = useCart();
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [conInstalacion, setConInstalacion] = useState({});
  const carouselRef = useRef(null);

  const productosFiltrados = PRODUCTOS_AUTOMOTRICES.filter(p =>
    categoriaActiva === 'todos' ? true : p.categoria === categoriaActiva
  );

  function toggleInstalacion(id) {
    setConInstalacion(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function handleScroll(direction) {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function comprarPorWhatsApp(producto, incluirInstalacion = false) {
    const incluyeIns = incluirInstalacion || !!conInstalacion[producto.id];
    const total = producto.precio + (incluyeIns ? producto.precioInstalacion : 0);
    const totalStr = total.toLocaleString('es-CL');

    const msg = `¡Hola AutoBooking! Me interesa el siguiente producto:\n\n` +
      `• Producto: *${producto.nombre}*\n` +
      `• Marca: ${producto.marca}\n` +
      `• Precio: $${producto.precio.toLocaleString('es-CL')} CLP\n` +
      (incluyeIns
        ? `• Servicio: Con instalación a domicilio (+$${producto.precioInstalacion.toLocaleString('es-CL')} CLP)\n`
        : `• Servicio: Solo despacho / entrega\n`) +
      `• Total: *$${totalStr} CLP*\n\n` +
      `¿Tienen disponibilidad para coordinar en mi comuna?`;

    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <section id="tienda" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* HEADER DE LA SECCIÓN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-2">
              Tienda Oficial & Repuestos
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Componentes & Repuestos Certificados
            </h2>
            <p className="text-sm text-white/35 mt-2 max-w-xl font-light">
              Marcas originales selladas con opción de entrega rápida o instalación directa en tu casa por técnicos calificados.
            </p>
          </div>

          {/* Controles de Carrito y Flechas */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.08] hover:border-blue-500/40 font-medium text-xs py-2 px-3.5 rounded-full flex items-center gap-2 transition-all cursor-pointer"
              title="Abrir Carrito"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="bg-blue-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Anterior"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Siguiente"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* FILTROS POR CATEGORÍA EN PASTILLAS MINIMALISTAS */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                categoriaActiva === cat.id
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-white/50 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CARRUSEL DE TARJETAS DE PRODUCTOS */}
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {productosFiltrados.map((producto) => {
            const tieneInstalacion = producto.precioInstalacion > 0;
            const quiereInstalacion = !!conInstalacion[producto.id];
            const precioTotal = producto.precio + (quiereInstalacion ? producto.precioInstalacion : 0);

            return (
              <div
                key={producto.id}
                className="snap-start shrink-0 w-[290px] sm:w-[320px] rounded-2xl p-6 flex flex-col justify-between border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04] group"
              >
                {/* Header de la tarjeta */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-blue-400 bg-blue-950/40 border border-blue-800/40">
                    {producto.badge}
                  </span>
                  <span className="text-[11px] font-mono text-white/30 tracking-wider">{producto.marca}</span>
                </div>

                {/* PACKSHOT CENTRAL */}
                <div
                  onClick={() => setProductoSeleccionado(producto)}
                  className="w-full h-40 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center p-4 my-2 cursor-pointer relative overflow-hidden group-hover:border-white/[0.15] transition-all"
                >
                  <span className="text-xs font-mono font-bold tracking-widest text-white/70 uppercase px-3 py-1.5 rounded-md bg-black/60 border border-white/10 shadow-sm text-center">
                    {producto.packshot}
                  </span>
                  <span className="absolute bottom-2 right-3 text-[10px] text-white/30 group-hover:text-blue-400 transition-colors font-medium">
                    Ver ficha →
                  </span>
                </div>

                {/* DETALLES */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-1">
                    {producto.categoriaNombre}
                  </span>
                  <h3
                    onClick={() => setProductoSeleccionado(producto)}
                    className="text-sm font-semibold text-white/90 line-clamp-2 leading-snug hover:text-blue-300 cursor-pointer transition-colors"
                  >
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-white/35 mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {producto.descripcionCorta}
                  </p>
                </div>

                {/* OPCIÓN ADICIONAL DE INSTALACIÓN */}
                {tieneInstalacion && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06]">
                    <label className="flex items-center gap-2.5 text-xs text-white/50 hover:text-white/80 cursor-pointer select-none transition-colors">
                      <input
                        type="checkbox"
                        checked={quiereInstalacion}
                        onChange={() => toggleInstalacion(producto.id)}
                        className="w-3.5 h-3.5 rounded text-blue-600 bg-white/[0.04] border-white/20 cursor-pointer"
                      />
                      <span className="text-[11px] font-light">
                        Sumar instalación in situ (+${producto.precioInstalacion.toLocaleString('es-CL')})
                      </span>
                    </label>
                  </div>
                )}

                {/* PRECIO Y ACCIÓN */}
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-white/30 block uppercase font-mono tracking-wider">Precio</span>
                    <span className="text-xl font-bold text-white font-mono leading-none">
                      ${precioTotal.toLocaleString('es-CL')}
                    </span>
                    {quiereInstalacion && (
                      <span className="text-[10px] text-blue-400 font-medium block mt-1">
                        Instalación incluida
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => addToCart(producto, quiereInstalacion)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Añadir a mi carrito"
                    >
                      <span>+ Carrito</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => comprarPorWhatsApp(producto, quiereInstalacion)}
                      className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-emerald-400 p-2 rounded-full transition-all cursor-pointer"
                      title="Comprar directo por WhatsApp"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DETALLE DEL PRODUCTO (QUICK VIEW) */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1117] border border-white/[0.10] rounded-2xl p-7 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-blue-400 bg-blue-950/40 border border-blue-800/40 uppercase tracking-wider">
                {productoSeleccionado.badge}
              </span>
              <span className="text-xs text-white/40 font-mono">{productoSeleccionado.marca}</span>
            </div>

            <h3 className="text-xl font-black text-white mb-2 leading-tight">
              {productoSeleccionado.nombre}
            </h3>

            <p className="text-sm text-white/45 leading-relaxed mb-5 font-light">
              {productoSeleccionado.descripcionCorta}
            </p>

            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] mb-5 space-y-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Compatibilidad:</span>
                <span className="text-xs text-white/70 font-light">{productoSeleccionado.compatibilidad}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Garantía:</span>
                <span className="text-xs text-emerald-400 font-medium">{productoSeleccionado.garantia}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Especificaciones Técnicas:</h4>
              <ul className="space-y-1.5 text-xs text-white/45 font-light">
                {productoSeleccionado.especificaciones.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-white/30 block">Precio Total</span>
                <span className="text-2xl font-bold text-white font-mono">
                  ${productoSeleccionado.precio.toLocaleString('es-CL')} CLP
                </span>
                {productoSeleccionado.precioInstalacion > 0 && (
                  <span className="text-xs text-blue-400 block mt-0.5 font-light">
                    +${productoSeleccionado.precioInstalacion.toLocaleString('es-CL')} instalación in situ
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(productoSeleccionado, false);
                    setProductoSeleccionado(null);
                  }}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-5 rounded-full transition-all cursor-pointer"
                >
                  Añadir al Carrito
                </button>
                {productoSeleccionado.precioInstalacion > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(productoSeleccionado, true);
                      setProductoSeleccionado(null);
                    }}
                    className="flex-1 sm:flex-none bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white font-semibold text-xs py-2.5 px-4 rounded-full transition-all cursor-pointer"
                  >
                    + Instalación
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
