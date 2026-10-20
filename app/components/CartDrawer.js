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
      `Hola AutoBooking. Deseo coordinar el despacho e instalación de mi compra:\n\n` +
      `*DETALLE DE PRODUCTOS:*\n` +
      `${resumenItems}\n\n` +
      `*DATOS DE ENTREGA & CONTACTO:*\n` +
      `• Nombre: ${clienteForm.nombre || 'Por confirmar'}\n` +
      `• Teléfono: ${clienteForm.telefono || 'Por confirmar'}\n` +
      `• Comuna: ${clienteForm.comuna}\n` +
      (clienteForm.patente ? `• Patente vehículo: *${clienteForm.patente.toUpperCase()}*\n` : '') +
      (clienteForm.notas ? `• Observaciones: ${clienteForm.notas}\n` : '') +
      `\n*RESUMEN COMERCIAL:*\n` +
      `• Subtotal Repuestos: $${subtotalProductos.toLocaleString('es-CL')} CLP\n` +
      (totalInstalacion > 0 ? `• Mano de Obra Instalación: $${totalInstalacion.toLocaleString('es-CL')} CLP\n` : '') +
      `• Despacho: ${costoDespacho === 0 ? 'Bonificado (GRATIS)' : `$${costoDespacho.toLocaleString('es-CL')} CLP`}\n` +
      `• *TOTAL A PAGAR: $${totalGeneral.toLocaleString('es-CL')} CLP*\n\n` +
      `¿Tienen factibilidad técnica para coordinar en mi domicilio?`;

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
      {/* BOTÓN FLOTANTE DEL CARRITO */}
      {totalItems > 0 && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-5 rounded-full shadow-2xl shadow-blue-600/40 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
          title="Ver Carrito de Compras"
        >
          <div className="relative">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-white text-[#080a0d] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div className="text-left text-xs leading-tight">
            <span className="block text-white/70 text-[10px] uppercase tracking-wider font-semibold">Carrito</span>
            <span className="font-mono font-bold text-sm text-white">
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

          {/* Panel Lateral Deslizable */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-[#0d1117] border-l border-white/[0.08] text-white flex flex-col h-full shadow-2xl relative">

              {/* 1. CABECERA DEL DRAWER */}
              <div className="p-6 border-b border-white/[0.06] bg-[#080a0d]/70 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">Tu Carrito de Repuestos</h3>
                    <span className="text-xs text-white/45 font-light">
                      {totalItems} {totalItems === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar carrito"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 2. BARRA DE BENEFICIO: DESPACHO GRATIS */}
              {subtotalProductos > 0 && (
                <div className="px-6 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-white/70">
                      {faltaParaGratis === 0 ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Despacho gratuito bonificado en Santiago
                        </span>
                      ) : (
                        <span>
                          Faltan <strong className="text-white font-mono">${faltaParaGratis.toLocaleString('es-CL')} CLP</strong> para despacho gratis
                        </span>
                      )}
                    </span>
                    <span className="text-white/40 font-mono text-[11px]">{progresoEnvioGratis}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        faltaParaGratis === 0 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progresoEnvioGratis}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 3. LISTADO DE PRODUCTOS */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/[0.06] mx-auto flex items-center justify-center text-white/30">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Tu carrito está vacío</h4>
                      <p className="text-xs text-white/40 max-w-xs mx-auto mt-1 font-light leading-relaxed">
                        Explora nuestro catálogo de repuestos certificados con opción de despacho y montaje a domicilio.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        const el = document.getElementById('tienda');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 px-6 rounded-full transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                      Explorar repuestos
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-white/[0.12]"
                        >
                          {/* Fila principal */}
                          <div className="flex gap-3 items-start justify-between">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-blue-400 shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white leading-tight line-clamp-1">
                                  {item.nombre}
                                </h5>
                                <span className="text-[11px] text-white/40 block mt-0.5 font-mono">
                                  ${item.precio.toLocaleString('es-CL')} CLP c/u
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/30 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                              title="Eliminar producto"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>

                          {/* Cantidad y subtotal */}
                          <div className="flex justify-between items-center pt-2 border-t border-white/[0.04] text-xs">
                            <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-lg p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, (item.cantidad || 1) - 1)}
                                className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white font-semibold cursor-pointer"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold text-white text-xs font-mono">
                                {item.cantidad || 1}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, (item.cantidad || 1) + 1)}
                                className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white font-semibold cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-bold text-white font-mono">
                                ${(item.precio * (item.cantidad || 1)).toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                          </div>

                          {/* Toggle Instalación a Domicilio */}
                          {item.precioInstalacion > 0 && (
                            <div className="bg-[#080a0d] border border-white/[0.06] rounded-xl p-2.5 flex items-center justify-between text-xs">
                              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={!!item.conInstalacion}
                                  onChange={() => toggleItemInstallation(item.id)}
                                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-white/[0.05] border-white/20 cursor-pointer"
                                />
                                <span className="text-[11px] text-white/70">
                                  Instalación a domicilio
                                </span>
                              </label>
                              <span className="text-[11px] font-semibold text-blue-400 font-mono">
                                +${((item.precioInstalacion || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Botón vaciar */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={clearCart}
                        className="text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                      >
                        Vaciar todo
                      </button>
                    </div>

                    {/* Formulario de despacho */}
                    <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400/80 block">
                        Datos de Despacho & Instalación
                      </span>

                      <div>
                        <label className="block text-[11px] font-medium text-white/50 mb-1">
                          Comuna de destino (Santiago)
                        </label>
                        <select
                          value={clienteForm.comuna}
                          onChange={(e) => setClienteForm({ ...clienteForm, comuna: e.target.value })}
                          className="w-full bg-[#080a0d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/80"
                        >
                          {todasLasComunas.map((c) => (
                            <option key={c} value={c} className="bg-[#080a0d] text-white">{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-white/50 mb-1">
                            Tu Nombre
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Matías"
                            value={clienteForm.nombre}
                            onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-white/50 mb-1">
                            Teléfono / WhatsApp
                          </label>
                          <input
                            type="tel"
                            placeholder="+56 9 ..."
                            value={clienteForm.telefono}
                            onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-white/50 mb-1 flex items-center justify-between">
                          <span>Patente (Opcional)</span>
                          <span className="text-[10px] text-blue-400">Verificamos compatibilidad técnica</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: ABCD-12 o Modelo"
                          value={clienteForm.patente}
                          onChange={(e) => setClienteForm({ ...clienteForm, patente: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/80 uppercase font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 4. PIE DEL DRAWER: CHECKOUT */}
              {items.length > 0 && (
                <div className="p-6 bg-[#080a0d]/95 border-t border-white/[0.08] space-y-4">
                  {/* Desglose */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/50">
                      <span>Subtotal repuestos:</span>
                      <span className="font-mono text-white/80">
                        ${subtotalProductos.toLocaleString('es-CL')} CLP
                      </span>
                    </div>

                    {totalInstalacion > 0 && (
                      <div className="flex justify-between text-blue-400">
                        <span>Mano de obra instalación:</span>
                        <span className="font-mono font-medium">
                          +${totalInstalacion.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-white/50">
                      <span>Despacho en Santiago:</span>
                      <span className="font-mono">
                        {costoDespacho === 0 ? (
                          <span className="text-emerald-400 font-medium">GRATIS</span>
                        ) : (
                          `$${costoDespacho.toLocaleString('es-CL')} CLP`
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-white">Total Final:</span>
                      <span className="text-2xl font-black text-white font-mono tracking-tight">
                        ${totalGeneral.toLocaleString('es-CL')} CLP
                      </span>
                    </div>
                  </div>

                  {/* Botón Checkout WhatsApp */}
                  <button
                    onClick={handleCheckoutWhatsApp}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-full text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Coordinar pedido vía WhatsApp</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.178.181-.077.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                    </svg>
                  </button>

                  {/* Sellos de Confianza */}
                  <div className="flex justify-center items-center gap-3 text-[11px] text-white/40 text-center font-light pt-1">
                    <span>Repuestos Genuinos</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>Boleta o Factura</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>Pago Seguro</span>
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
