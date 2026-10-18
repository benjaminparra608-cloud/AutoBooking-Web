'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ZONES } from '../lib/config';
import { createStoreOrder } from '../lib/supabase';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    toggleItemInstallation,
    clearCart,
    totalItems,
    subtotalProductos,
    totalInstalacion,
    costoDespacho,
    totalGeneral
  } = useCart();

  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    telefono: '',
    comuna: 'Providencia',
    patente: '',
    notas: ''
  });

  // Aplanar comunas para el selector
  const todasLasComunas = ZONES.flatMap((z) => z.comunas);

  // Cerrar con tecla Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Barra de progreso hacia Despacho Gratis (Umbral $50.000 CLP)
  const umbralGratis = 50000;
  const progresoEnvioGratis = Math.min(100, Math.round((subtotalProductos / umbralGratis) * 100));
  const faltaParaGratis = Math.max(0, umbralGratis - subtotalProductos);

  function handleCheckoutWhatsApp() {
    if (items.length === 0) return;

    let resumenItems = items
      .map((item, idx) => {
        const insTexto = item.conInstalacion
          ? ` (Con Instalación a Domicilio: +$${(item.precioInstalacion || 0).toLocaleString('es-CL')} CLP)`
          : ' (Solo Despacho)';
        return `${idx + 1}. *${item.nombre}* x${item.cantidad} — $${(item.precio * item.cantidad).toLocaleString('es-CL')} CLP${insTexto}`;
      })
      .join('\n');

    const msg =
      `¡Hola AutoBooking! 🚗 Quisiera confirmar mi compra desde la tienda online:\n\n` +
      `📦 *PRODUCTOS SOLICITADOS:*\n` +
      `${resumenItems}\n\n` +
      `📍 *DATOS DE DESPACHO & CONTACTO:*\n` +
      `• Nombre: ${clienteForm.nombre || 'Por confirmar'}\n` +
      `• Teléfono: ${clienteForm.telefono || 'Por confirmar'}\n` +
      `• Comuna: ${clienteForm.comuna}\n` +
      (clienteForm.patente ? `• Patente auto: *${clienteForm.patente.toUpperCase()}* (Para validar compatibilidad)\n` : '') +
      (clienteForm.notas ? `• Observaciones: ${clienteForm.notas}\n` : '') +
      `\n💰 *DESGLOSE TOTAL:*\n` +
      `• Subtotal Productos: $${subtotalProductos.toLocaleString('es-CL')} CLP\n` +
      (totalInstalacion > 0 ? `• Mano de Obra Instalación: $${totalInstalacion.toLocaleString('es-CL')} CLP\n` : '') +
      `• Despacho: ${costoDespacho === 0 ? '¡GRATIS!' : `$${costoDespacho.toLocaleString('es-CL')} CLP`}\n` +
      `• *TOTAL A PAGAR: $${totalGeneral.toLocaleString('es-CL')} CLP*\n\n` +
      `¿Tienen disponibilidad para coordinar la entrega o instalación en mi domicilio?`;

    try {
      createStoreOrder({
        cliente_nombre: clienteForm.nombre || 'Cliente Web',
        cliente_telefono: clienteForm.telefono || '',
        comuna: clienteForm.comuna,
        patente: clienteForm.patente || '',
        vehiculo: clienteForm.patente ? `Auto patente ${clienteForm.patente.toUpperCase()}` : 'Vehículo cliente',
        items: items,
        subtotal: subtotalProductos,
        total_instalacion: totalInstalacion,
        costo_despacho: costoDespacho,
        total_general: totalGeneral,
        requiere_instalacion: totalInstalacion > 0,
        notas: clienteForm.notas || ''
      });
    } catch (err) {
      console.warn("Error registrando pedido para /taller:", err);
    }

    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <>
      {/* BOTÓN FLOTANTE DEL CARRITO (Aparece cuando hay productos y el drawer está cerrado) */}
      {totalItems > 0 && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 px-4 sm:px-5 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.4)] flex items-center gap-2.5 sm:gap-3 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/40"
          title="Ver Carrito de Compras"
        >
          <div className="relative">
            <span className="text-xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-slate-950 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-400">
              {totalItems}
            </span>
          </div>
          <div className="text-left text-xs leading-tight">
            <span className="block font-bold">Ver Carrito</span>
            <span className="font-mono font-black text-sm text-slate-950">
              ${totalGeneral.toLocaleString('es-CL')} CLP
            </span>
          </div>
        </button>
      )}

      {/* BACKDROP Y CONTENEDOR DEL DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Fondo oscuro con desenfoque */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Panel Lateral Deslizable (Slide-Over Drawer) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-slate-950 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl relative">

              {/* 1. CABECERA DEL DRAWER */}
              <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl">
                    🛒
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Carrito de Repuestos</h3>
                    <span className="text-xs text-slate-400">
                      {totalItems} {totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar carrito"
                >
                  ✕
                </button>
              </div>

              {/* 2. BARRA DE BENEFICIO: DESPACHO GRATIS */}
              {subtotalProductos > 0 && (
                <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/60">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                    <span className="text-slate-300">
                      {faltaParaGratis === 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span>🎉</span> ¡Calificas para Despacho GRATIS en Santiago!
                        </span>
                      ) : (
                        <span>
                          Faltan <strong>${faltaParaGratis.toLocaleString('es-CL')} CLP</strong> para Despacho Gratis
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{progresoEnvioGratis}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        faltaParaGratis === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${progresoEnvioGratis}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 3. LISTADO DE PRODUCTOS EN EL CARRITO */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-4xl text-slate-500">
                      🛒
                    </div>
                    <h4 className="text-lg font-bold text-white">Tu carrito está vacío</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Explora nuestra tienda de repuestos y upgrades de alto rendimiento con opción de instalación a domicilio.
                    </p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        const el = document.getElementById('tienda');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 px-6 rounded-full transition-all shadow-lg shadow-cyan-600/20"
                    >
                      Explorar Tienda Online →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 transition-all"
                        >
                          {/* Fila principal del producto */}
                          <div className="flex gap-3 items-start justify-between">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                                {item.icono || '📦'}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white leading-tight line-clamp-1">
                                  {item.nombre}
                                </h5>
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  ${item.precio.toLocaleString('es-CL')} CLP c/u
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-500 hover:text-rose-400 text-sm p-1 transition-colors cursor-pointer"
                              title="Eliminar del carrito"
                            >
                              🗑️
                            </button>
                          </div>

                          {/* Selector de cantidad y subtotal */}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 text-xs">
                            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, (item.cantidad || 1) - 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white font-bold cursor-pointer"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold text-white">
                                {item.cantidad || 1}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, (item.cantidad || 1) + 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black text-white font-mono">
                                ${(item.precio * (item.cantidad || 1)).toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                          </div>

                          {/* Toggle de Instalación a Domicilio para este producto */}
                          {item.precioInstalacion > 0 && (
                            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={!!item.conInstalacion}
                                  onChange={() => toggleItemInstallation(item.id)}
                                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                                />
                                <span className="text-[11px] text-slate-300">
                                  Instalación técnica a domicilio
                                </span>
                              </label>
                              <span className="text-[11px] font-bold text-cyan-400 font-mono">
                                +${((item.precioInstalacion || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Botón para vaciar carrito */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={clearCart}
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors underline cursor-pointer"
                      >
                        Vaciar carrito
                      </button>
                    </div>

                    {/* 4. FORMULARIO DE COORDINACIÓN DE DESPACHO */}
                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <span>📍</span> Datos para Coordinar Entrega
                      </h4>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Comuna de entrega (Santiago):
                        </label>
                        <select
                          value={clienteForm.comuna}
                          onChange={(e) => setClienteForm({ ...clienteForm, comuna: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                        >
                          {todasLasComunas.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Tu Nombre:
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Matías"
                            value={clienteForm.nombre}
                            onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Teléfono / WhatsApp:
                          </label>
                          <input
                            type="tel"
                            placeholder="+56 9 ..."
                            value={clienteForm.telefono}
                            onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                          <span>Patente de tu Vehículo (Opcional):</span>
                          <span className="text-[10px] text-cyan-400">Verificamos compatibilidad gratis</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: ABCD-12 o Modelo del auto"
                          value={clienteForm.patente}
                          onChange={(e) => setClienteForm({ ...clienteForm, patente: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 uppercase"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 5. PIE DEL DRAWER: RESUMEN Y CHECKOUT */}
              {items.length > 0 && (
                <div className="p-6 bg-slate-900/90 border-t border-slate-800 space-y-4">
                  {/* Desglose de Precios */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Repuestos:</span>
                      <span className="font-mono text-slate-200 font-semibold">
                        ${subtotalProductos.toLocaleString('es-CL')} CLP
                      </span>
                    </div>

                    {totalInstalacion > 0 && (
                      <div className="flex justify-between text-cyan-400">
                        <span>Instalación técnica a domicilio:</span>
                        <span className="font-mono font-semibold">
                          +${totalInstalacion.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400">
                      <span>Despacho en Santiago:</span>
                      <span className="font-mono">
                        {costoDespacho === 0 ? (
                          <span className="text-emerald-400 font-bold">¡GRATIS!</span>
                        ) : (
                          `$${costoDespacho.toLocaleString('es-CL')} CLP`
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-white">Total a Pagar:</span>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        ${totalGeneral.toLocaleString('es-CL')} CLP
                      </span>
                    </div>
                  </div>

                  {/* Botón de Checkout por WhatsApp */}
                  <button
                    onClick={handleCheckoutWhatsApp}
                    className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black py-3.5 px-6 rounded-2xl text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                  >
                    <span>Coordinar Pedido por WhatsApp</span>
                    <span>💬</span>
                  </button>

                  {/* Sellos de Seguridad */}
                  <div className="flex justify-center gap-4 text-[10px] text-slate-400 text-center font-medium pt-1">
                    <span>🛡️ Repuestos 100% Genuinos</span>
                    <span>•</span>
                    <span>🧾 Boleta o Factura</span>
                    <span>•</span>
                    <span>💳 Pago contra entrega</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
