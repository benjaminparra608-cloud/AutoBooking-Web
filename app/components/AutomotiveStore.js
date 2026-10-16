'use client';

import React, { useState, useRef } from 'react';
import { whatsappUrl } from '../lib/config';

const PRODUCTOS_AUTOMOTRICES = [
  {
    id: 'bateria-agm-bosch',
    nombre: 'Batería Bosch S4 / Hankook AGM 65Ah High-Power',
    categoria: 'baterias',
    categoriaNombre: 'Baterías & Energía',
    marca: 'Bosch Automotive',
    precio: 79900,
    precioInstalacion: 15000,
    descripcionCorta: 'Potencia de arranque en frío superior (CCA 580A) con aleación de plata y libre de mantención.',
    compatibilidad: 'Universal para Sedanes, SUVs y Citycars (Toyota, Hyundai, Chevrolet, Nissan, Kia, Peugeot, etc.)',
    garantia: '18 meses de garantía directa',
    especificaciones: [
      'Capacidad: 65 Amperes/hora',
      'Arranque en frío (CCA): 580A a -18°C',
      'Tecnología: AGM / Calcio-Plata',
      'Bornes: Estándar cónicos (+ derecha o izquierda)',
      'Dimensiones: 232 x 173 x 225 mm'
    ],
    bgClass: 'from-amber-950/80 via-yellow-950/60 to-slate-900',
    borderClass: 'border-amber-600/40 hover:border-amber-400',
    accentTag: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    badge: '⚡ Top Ventas Invierno',
    icono: '🔋',
    packshot: '⚡ 65Ah AGM',
    colorHex: '#d97706'
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
    compatibilidad: 'Aprobaciones BMW LL-04, MB-Approval 229.51, VW 505 00 / 505 01, GM-OPEL dexos2',
    garantia: 'Producto sellado original con sello de origen francés',
    especificaciones: [
      'Viscosidad: SAE 5W-30',
      'Volumen: Bidón de 5 Litros',
      'Filtro: Incluye Filtro de Aceite Mann Filter certificado',
      'Base: 100% Sintética Mid SAPS',
      'Intervalo: Hasta 15.000 km o 12 meses'
    ],
    bgClass: 'from-emerald-950/80 via-teal-950/60 to-slate-900',
    borderClass: 'border-emerald-600/40 hover:border-emerald-400',
    accentTag: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    badge: '🛡️ Máxima Protección Motor',
    icono: '🛢️',
    packshot: '100% SINTÉTICO 5W30',
    colorHex: '#059669'
  },
  {
    id: 'frenos-brembo-ceramic',
    nombre: 'Kit Pastillas de Freno Cerámicas Brembo Premium',
    categoria: 'frenos',
    categoriaNombre: 'Sistema de Frenos',
    marca: 'Brembo Official',
    precio: 44900,
    precioInstalacion: 20000,
    descripcionCorta: 'Compuesto cerámico de alto coeficiente de fricción. Cero chillidos, menor desgaste de discos y llantas limpias.',
    compatibilidad: 'Disponible para eje delantero o trasero multimarca según modelo y año',
    garantia: '12 meses o 25.000 km',
    especificaciones: [
      'Compuesto: Cerámica de última generación (NAO)',
      'Lámina antirruido multicapa shim preinstalada',
      'Excelente respuesta térmica hasta 650°C',
      'Libre de polvo negro de asbesto',
      'Certificación europea ECE-R90'
    ],
    bgClass: 'from-blue-950/80 via-indigo-950/60 to-slate-900',
    borderClass: 'border-blue-600/40 hover:border-blue-400',
    accentTag: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    badge: '🛑 Frenado de Competición',
    icono: '🛑',
    packshot: 'BREMBO CERAMIC',
    colorHex: '#2563eb'
  },
  {
    id: 'carplay-android-9',
    nombre: 'Central Multimedia 9" IPS Apple CarPlay & Android Auto Inalámbrico',
    categoria: 'audio',
    categoriaNombre: 'Car Audio & Conectividad',
    marca: 'AutoBooking SoundTech',
    precio: 129900,
    precioInstalacion: 30000,
    descripcionCorta: 'Pantalla táctil HD 2.5D con CarPlay y Android Auto sin cables, Bluetooth 5.0, WiFi y cámara de retroceso con visión nocturna.',
    compatibilidad: 'Universal 2 DIN o con bisel específico para tu modelo de auto',
    garantia: '12 meses de garantía técnica',
    especificaciones: [
      'Pantalla: 9 pulgadas IPS Capacitiva 1024x600',
      'Conectividad: Apple CarPlay inalámbrico + Android Auto',
      'Cámara de retroceso: Gran angular 170° HD impermeable (IP68)',
      'Potencia de audio: 4 x 50W con ecualizador gráfico DSP',
      'Puertos: Doble entrada USB + salida para subwoofer'
    ],
    bgClass: 'from-purple-950/80 via-violet-950/60 to-slate-900',
    borderClass: 'border-purple-600/40 hover:border-purple-400',
    accentTag: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    badge: '📱 Inalámbrico + Cámara HD',
    icono: '🔊',
    packshot: 'CARPLAY 9" IPS',
    colorHex: '#9333ea'
  },
  {
    id: 'scanner-obd2-bluetooth',
    nombre: 'Scanner Automotriz OBD2 Bluetooth Pro v2.2 + App Pro',
    categoria: 'gadgets',
    categoriaNombre: 'Diagnóstico & Gadgets',
    marca: 'AutoScan Pro',
    precio: 28900,
    precioInstalacion: 0,
    descripcionCorta: 'Diagnóstico en tu celular. Lee y borra testigos Check Engine, monitorea sensores de motor, consumo y temperatura en tiempo real.',
    compatibilidad: 'Todos los vehículos desde el año 2000 en adelante (Protocolos OBD2 / EOBD / CAN-BUS)',
    garantia: '24 meses de garantía de reemplazo directo',
    especificaciones: [
      'Conexión: Bluetooth 5.0 ultra-rápido de baja latencia',
      'Compatibilidad OS: iOS (iPhone/iPad) y Android',
      'Lectura de códigos de falla: Genéricos y específicos de fabricante',
      'Datos en vivo: RPM, velocidad, temperatura refrigerante, MAF, O2',
      'Incluye licencia de app para celular en español'
    ],
    bgClass: 'from-cyan-950/80 via-sky-950/60 to-slate-900',
    borderClass: 'border-cyan-600/40 hover:border-cyan-400',
    accentTag: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    badge: '💻 Diagnóstico en Vivo',
    icono: '💻',
    packshot: 'OBD2 PRO CHIP v2.2',
    colorHex: '#06b6d4'
  },
  {
    id: 'luces-led-canbus',
    nombre: 'Kit Ampolletas LED Canbus 24.000LM (6000K Blanco Frío)',
    categoria: 'iluminacion',
    categoriaNombre: 'Iluminación & Visibilidad',
    marca: 'NightVision Pro',
    precio: 34900,
    precioInstalacion: 10000,
    descripcionCorta: '300% más iluminación que las ampolletas halógenas estándar. Disipador de turbina 12.000 RPM y chip Canbus sin error en tablero.',
    compatibilidad: 'Disponible en conectores H7, H4, H11, 9005 (HB3), 9006 (HB4)',
    garantia: '12 meses de garantía',
    especificaciones: [
      'Potencia lumínica: 24.000 Lúmenes por par',
      'Color: 6000K Blanco Diamante puro',
      'Chip: CSP Korea Automotive Grade de alto enfoque',
      'Cuerpo: Aluminio de aviación 6063 aeronáutico',
      'Vida útil: Más de 50.000 horas continuas'
    ],
    bgClass: 'from-rose-950/80 via-red-950/60 to-slate-900',
    borderClass: 'border-rose-600/40 hover:border-rose-400',
    accentTag: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    badge: '💡 300% Más Visibilidad',
    icono: '💡',
    packshot: 'LED CANBUS 24.000LM',
    colorHex: '#e11d48'
  },
  {
    id: 'compresor-digital-portatil',
    nombre: 'Compresor Inalámbrico 150 PSI con Pantalla Digital & Batería 6000mAh',
    categoria: 'gadgets',
    categoriaNombre: 'Accesorios & Emergencia',
    marca: 'AirTech Auto',
    precio: 39900,
    precioInstalacion: 0,
    descripcionCorta: 'Inflador inteligente portátil. Programa los PSI deseados y se detiene automáticamente al alcanzar la presión. Incluye linterna LED de emergencia.',
    compatibilidad: 'Neumáticos de auto, camionetas, motos, bicicletas y pelotas',
    garantia: '12 meses de garantía',
    especificaciones: [
      'Presión máxima: 150 PSI / 10.3 Bar',
      'Batería: Litio recargable de 6.000 mAh (USB-C)',
      'Función Powerbank: Puede cargar tu celular en emergencias',
      'Manómetro digital de alta precisión ±0.5 PSI',
      'Accesorios: 4 boquillas diferentes + manguera reforzada'
    ],
    bgClass: 'from-slate-900 via-gray-950 to-slate-950',
    borderClass: 'border-slate-700/80 hover:border-slate-500',
    accentTag: 'bg-slate-700/40 text-slate-200 border-slate-600',
    badge: '🛞 Imprescindible en tu Auto',
    icono: '🛞',
    packshot: 'COMPRESOR 150 PSI',
    colorHex: '#64748b'
  },
  {
    id: 'liqui-moly-ceratec',
    nombre: 'Pack Tratamiento Motor Liqui Moly Cera Tec (300ml) + Limpiador Inyectores',
    categoria: 'lubricantes',
    categoriaNombre: 'Aditivos de Alto Rendimiento',
    marca: 'Liqui Moly Germany',
    precio: 26900,
    precioInstalacion: 0,
    descripcionCorta: 'Tecnología alemana de suspensión microcerámica que sella microfisuras internas del motor, reduce fricción y ahorra combustible.',
    compatibilidad: 'Apto para todo tipo de aceites de motor en vehículos Gasolina y Diésel',
    garantia: '100% Made in Germany sellado de fábrica',
    especificaciones: [
      'Efecto duradero: Protección activa hasta por 50.000 km',
      'Reducción de consumo de combustible y emisiones CO2',
      'Menor rumorosidad y suavidad en ralentí',
      'No obstruye filtros de aceite ni catalizador',
      'Incluye Injection Reiniger para limpieza profunda de inyectores'
    ],
    bgClass: 'from-yellow-950/80 via-amber-950/60 to-slate-900',
    borderClass: 'border-yellow-600/40 hover:border-yellow-400',
    accentTag: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    badge: '🇩🇪 Ingeniería Alemana',
    icono: '🧪',
    packshot: 'LIQUI MOLY CERA TEC',
    colorHex: '#ca8a04'
  }
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos los Productos', icono: '✨' },
  { id: 'baterias', label: 'Baterías', icono: '🔋' },
  { id: 'lubricantes', label: 'Aceites & Filtros', icono: '🛢️' },
  { id: 'frenos', label: 'Frenos', icono: '🛑' },
  { id: 'audio', label: 'Car Audio & CarPlay', icono: '🔊' },
  { id: 'iluminacion', label: 'Luces LED', icono: '💡' },
  { id: 'gadgets', label: 'Diagnóstico & Herramientas', icono: '💻' }
];

export default function AutomotiveStore() {
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
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function comprarPorWhatsApp(producto, incluirInstalacion = false) {
    const incluyeIns = incluirInstalacion || !!conInstalacion[producto.id];
    const total = producto.precio + (incluyeIns ? producto.precioInstalacion : 0);
    const totalStr = total.toLocaleString('es-CL');

    const msg = `¡Hola AutoBooking! 🚗 Me interesa comprar el siguiente producto desde su tienda online:\n\n` +
      `📦 Producto: *${producto.nombre}*\n` +
      `🏷️ Marca: ${producto.marca}\n` +
      `💰 Precio Producto: $${producto.precio.toLocaleString('es-CL')} CLP\n` +
      (incluyeIns
        ? `🔧 Servicio de instalación a domicilio: Sí (+$${producto.precioInstalacion.toLocaleString('es-CL')} CLP)\n`
        : `🚚 Despacho: Solo envío / entrega\n`) +
      `💳 *Total a coordinar: $${totalStr} CLP*\n\n` +
      `¿Tienen stock disponible y qué días coordinan despacho o instalación en mi comuna?`;

    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <section id="tienda" className="py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Fondo estético automotriz con resplandores suaves */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full blur-[140px] bg-blue-600/10 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full blur-[140px] bg-cyan-500/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* ENCABEZADO DE LA TIENDA DE REPUESTOS Y PRODUCTOS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span>🛍️</span> Tienda Oficial AutoBooking & Repuestos
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Productos y Repuestos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 font-serif italic font-normal">
                Alto Rendimiento
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-light">
              Equipa tu vehículo con componentes genuinos certificados. Compra online con despacho rápido o solicita la instalación directa en tu domicilio por nuestros mecánicos.
            </p>
          </div>

          {/* Controles de Flechas para el Carrusel */}
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={() => handleScroll('left')}
              className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>
        </div>

        {/* FILTROS POR CATEGORÍA EN PASTILLAS */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                categoriaActiva === cat.id
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10 scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.icono}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* CARRUSEL DE TARJETAS DE PRODUCTOS AUTOMOTRICES (Estilo Delta Cafés en Image 2) */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {productosFiltrados.map((producto) => {
            const tieneInstalacion = producto.precioInstalacion > 0;
            const quiereInstalacion = !!conInstalacion[producto.id];
            const precioTotal = producto.precio + (quiereInstalacion ? producto.precioInstalacion : 0);

            return (
              <div
                key={producto.id}
                className={`snap-start shrink-0 w-[300px] sm:w-[340px] rounded-3xl p-6 flex flex-col justify-between border transition-all duration-300 bg-gradient-to-b ${producto.bgClass} ${producto.borderClass} shadow-2xl relative group hover:-translate-y-1`}
              >
                {/* Badge Superior */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${producto.accentTag}`}>
                    {producto.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{producto.marca}</span>
                </div>

                {/* PACKSHOT CENTRAL / VISUAL DEL PRODUCTO */}
                <div
                  onClick={() => setProductoSeleccionado(producto)}
                  className="w-full h-48 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col items-center justify-center p-4 my-2 cursor-pointer relative overflow-hidden group-hover:border-white/20 transition-all shadow-inner"
                >
                  <div className="text-6xl mb-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-300">
                    {producto.icono}
                  </div>
                  <span className="text-xs font-mono font-black tracking-widest text-slate-200 uppercase px-3 py-1 rounded-md bg-black/60 border border-white/10 shadow-sm">
                    {producto.packshot}
                  </span>
                  <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1 font-semibold">
                    Ver ficha 🔍
                  </span>
                </div>

                {/* DETALLES DEL PRODUCTO */}
                <div className="mt-3">
                  <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    {producto.categoriaNombre}
                  </span>
                  <h3
                    onClick={() => setProductoSeleccionado(producto)}
                    className="text-base font-bold text-white line-clamp-2 leading-snug hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {producto.descripcionCorta}
                  </p>
                </div>

                {/* OPCIÓN ADICIONAL DE INSTALACIÓN A DOMICILIO */}
                {tieneInstalacion && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={quiereInstalacion}
                        onChange={() => toggleInstalacion(producto.id)}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                      <span>
                        Sumar <strong>Instalación a Domicilio</strong> (+${producto.precioInstalacion.toLocaleString('es-CL')})
                      </span>
                    </label>
                  </div>
                )}

                {/* PRECIO Y ACCIÓN DE COMPRA */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Precio CLP:</span>
                    <span className="text-2xl font-black text-white font-mono leading-none">
                      ${precioTotal.toLocaleString('es-CL')}
                    </span>
                    {quiereInstalacion && (
                      <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                        Incluye instalación técnica
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => comprarPorWhatsApp(producto, quiereInstalacion)}
                    className="bg-white hover:bg-slate-200 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                  >
                    <span>Comprar</span>
                    <span className="text-emerald-700">💬</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* NOTA DE CONFIANZA INFERIOR */}
        <div className="mt-10 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <strong className="text-slate-200 block text-xs">Despacho en Santiago & Instalación Profesional</strong>
              <span>Recibe en tu casa en menos de 24 horas o coordina la visita de nuestro mecánico equipado.</span>
            </div>
          </div>
          <a
            href={whatsappUrl("Hola AutoBooking, tengo dudas sobre compatibilidad de un repuesto para mi vehículo")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline shrink-0"
          >
            ¿Dudas sobre la compatibilidad con tu auto? Consúltanos aquí →
          </a>
        </div>
      </div>

      {/* MODAL DETALLE DEL PRODUCTO (QUICK VIEW) */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${productoSeleccionado.accentTag}`}>
                {productoSeleccionado.badge}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{productoSeleccionado.marca}</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2 leading-tight">
              {productoSeleccionado.nombre}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {productoSeleccionado.descripcionCorta}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-6 space-y-3">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Compatibilidad Vehicular:</span>
                <span className="text-xs text-slate-200">{productoSeleccionado.compatibilidad}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Garantía:</span>
                <span className="text-xs text-emerald-400 font-semibold">{productoSeleccionado.garantia}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Especificaciones Técnicas:</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {productoSeleccionado.especificaciones.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Precio del producto:</span>
                <span className="text-3xl font-black text-white font-mono">
                  ${productoSeleccionado.precio.toLocaleString('es-CL')} CLP
                </span>
                {productoSeleccionado.precioInstalacion > 0 && (
                  <span className="text-xs text-cyan-400 block mt-0.5">
                    +${productoSeleccionado.precioInstalacion.toLocaleString('es-CL')} si deseas instalación técnica
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    comprarPorWhatsApp(productoSeleccionado, false);
                    setProductoSeleccionado(null);
                  }}
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Comprar con Despacho
                </button>
                {productoSeleccionado.precioInstalacion > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      comprarPorWhatsApp(productoSeleccionado, true);
                      setProductoSeleccionado(null);
                    }}
                    className="flex-1 sm:flex-none bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-600/25"
                  >
                    Comprar + Instalación
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
