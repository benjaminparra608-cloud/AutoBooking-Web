'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsOpen: setIsCartOpen } = useCart();
  const isTaller = pathname === '/taller';
  const isPlanes = pathname === '/planes';
  const isCliente = !isTaller && !isPlanes;

  // Estados para dropdowns de escritorio
  const [openDropdown, setOpenDropdown] = useState(null); // 'servicios' | 'tienda' | 'portal' | null
  const timeoutRef = useRef(null);
  const navRef = useRef(null);

  // Estado para menú móvil desplegable
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState('servicios');

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con tecla Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers para hover suave en desktop
  function handleMouseEnter(name) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  }

  function handleToggleDropdown(name) {
    setOpenDropdown(openDropdown === name ? null : name);
  }

  // Cerrar menús al hacer click en un enlace de navegación
  function handleNavLinkClick() {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. BARRA SUPERIOR MÓVIL COMPACTA                         */}
      {/* ========================================================= */}
      <nav className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 px-4 py-2.5 flex md:hidden items-center justify-between shadow-xl">
        <Link href="/" className="text-base font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/30 border border-cyan-300/40">
            AB
          </span>
          <span className="text-sm">
            Auto<span className="text-cyan-400 font-extrabold">Booking</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Botón Carrito en Móvil */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold p-2 rounded-full flex items-center justify-center transition-all cursor-pointer"
            aria-label="Abrir Carrito"
          >
            <span className="text-sm">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Menú Hamburguesa Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* Botón Agendar en Móvil */}
          {isCliente && (
            <a
              href="#agendar"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-md transition-all flex items-center gap-1"
            >
              <span>Agendar</span>
              <span>→</span>
            </a>
          )}
        </div>
      </nav>

      {/* MENÚ MÓVIL DESPLEGABLE (ACORDEÓN POR CATEGORÍAS) */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 p-4 md:hidden shadow-2xl max-h-[85vh] overflow-y-auto space-y-3">
          {/* Selector de modo Clientes / Taller / SaaS */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <Link
              href="/"
              onClick={handleNavLinkClick}
              className={`py-2 text-center text-xs font-bold rounded-xl transition-all ${
                isCliente ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              🚗 Clientes
            </Link>
            <Link
              href="/taller"
              onClick={handleNavLinkClick}
              className={`py-2 text-center text-xs font-bold rounded-xl transition-all ${
                isTaller ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              🔧 Taller
            </Link>
            <Link
              href="/planes"
              onClick={handleNavLinkClick}
              className={`py-2 text-center text-xs font-bold rounded-xl transition-all ${
                isPlanes ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400'
              }`}
            >
              💼 SaaS
            </Link>
          </div>

          {/* Categoría 1: Servicios & Mecánica */}
          <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/60">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'servicios' ? '' : 'servicios')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span>🛠️</span>
                <span>Servicios & Diagnóstico</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {mobileExpandedSection === 'servicios' ? '▲' : '▼'}
              </span>
            </button>
            {mobileExpandedSection === 'servicios' && (
              <div className="p-3 pt-0 space-y-2 border-t border-slate-800/50">
                <a
                  href="#servicios"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-cyan-400"
                >
                  🚗 Nuestros Servicios a Domicilio
                </a>
                <a
                  href="#diagnostico-sintomas"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-cyan-400"
                >
                  💻 Diagnóstico con Escáner OBD2
                </a>
                <a
                  href="#cotizador"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-cyan-400"
                >
                  ⚡ Cotizador Rápido de Mantenciones
                </a>
                <a
                  href="#cobertura"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-cyan-400"
                >
                  📍 Cobertura y Comunas en Santiago
                </a>
              </div>
            )}
          </div>

          {/* Categoría 2: Tienda & Telemetría */}
          <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/60">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'tienda' ? '' : 'tienda')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span>🛍️</span>
                <span>Tienda & Telemetría GPS</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {mobileExpandedSection === 'tienda' ? '▲' : '▼'}
              </span>
            </button>
            {mobileExpandedSection === 'tienda' && (
              <div className="p-3 pt-0 space-y-2 border-t border-slate-800/50">
                <a
                  href="#tienda"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-amber-400"
                >
                  🛍️ Tienda de Repuestos & Upgrades
                </a>
                <a
                  href="#catalogo-baterias"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-amber-400"
                >
                  🔋 Baterías Top 8 con Instalación
                </a>
                <a
                  href="#monitor-desgaste"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-xl bg-slate-950/60 text-xs font-medium text-slate-300 hover:text-cyan-400"
                >
                  📡 Monitor de Desgaste & Odómetro GPS
                </a>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href="#agendar"
              onClick={handleNavLinkClick}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <span>📅 Agendar Hora en Santiago</span>
              <span>→</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BARRA DE NAVEGACIÓN SUPERIOR DE ESCRITORIO (MODERNA)    */}
      {/* ========================================================= */}
      <nav ref={navRef} className="sticky top-3 z-50 w-full px-4 hidden md:block">
        <div className="max-w-6xl mx-auto bg-slate-950/90 backdrop-blur-2xl border border-slate-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.7)] rounded-full px-5 py-2.5 flex items-center justify-between transition-all relative">

          {/* LADO IZQUIERDO: LOGO DE MARCA */}
          <div className="flex items-center gap-7">
            <Link href="/" className="text-lg font-black tracking-tight text-white flex items-center gap-2.5 group shrink-0">
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/30 border border-cyan-300/40 group-hover:scale-105 transition-transform">
                AB
              </span>
              <span>
                Auto<span className="text-cyan-400 font-extrabold">Booking</span>
              </span>
            </Link>

            {/* MENÚS DESPLEGABLES PRINCIPALES (ORGANIZADOS POR CATEGORÍAS) */}
            {isCliente && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">

                {/* DROPDOWN 1: SERVICIOS & MECÁNICA */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('servicios')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleDropdown('servicios')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer select-none ${
                      openDropdown === 'servicios'
                        ? 'bg-slate-900 text-cyan-400 border border-slate-700 shadow-sm'
                        : 'hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <span>🛠️</span>
                    <span>Servicios</span>
                    <span className={`text-[9px] transition-transform duration-200 ${openDropdown === 'servicios' ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`}>
                      ▼
                    </span>
                  </button>

                  {/* Panel Desplegable Servicios */}
                  {openDropdown === 'servicios' && (
                    <div className="absolute top-full left-0 mt-3 w-80 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 mb-1">
                        Atención Técnica a Domicilio
                      </div>

                      <a
                        href="#servicios"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-cyan-500/40">
                          🚗
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block transition-colors leading-tight">
                            Nuestros Servicios
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Mantenciones por KM, frenos, car audio y baterías.
                          </span>
                        </div>
                      </a>

                      <a
                        href="#diagnostico-sintomas"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-cyan-500/40">
                          💻
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block transition-colors leading-tight">
                            Diagnóstico con Escáner OBD2
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Detección computarizada de fallas y códigos de motor.
                          </span>
                        </div>
                      </a>

                      <a
                        href="#cotizador"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-cyan-500/40">
                          ⚡
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block transition-colors leading-tight">
                            Cotizador de Mantenciones
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Calcula el valor de tu servicio en segundos.
                          </span>
                        </div>
                      </a>

                      <a
                        href="#cobertura"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-cyan-500/40">
                          📍
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block transition-colors leading-tight">
                            Cobertura Comunal
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Revisa disponibilidad en tu comuna de Santiago.
                          </span>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* DROPDOWN 2: TIENDA & TELEMETRÍA */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('tienda')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleDropdown('tienda')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer select-none ${
                      openDropdown === 'tienda'
                        ? 'bg-slate-900 text-amber-300 border border-slate-700 shadow-sm'
                        : 'hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <span>🛍️</span>
                    <span>Tienda & Telemetría</span>
                    <span className={`text-[9px] transition-transform duration-200 ${openDropdown === 'tienda' ? 'rotate-180 text-amber-400' : 'text-slate-500'}`}>
                      ▼
                    </span>
                  </button>

                  {/* Panel Desplegable Tienda */}
                  {openDropdown === 'tienda' && (
                    <div className="absolute top-full left-0 mt-3 w-80 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 mb-1">
                        Repuestos & Monitoreo Inteligente
                      </div>

                      <a
                        href="#tienda"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-amber-400/40">
                          🛍️
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white group-hover:text-amber-400 block transition-colors leading-tight">
                            Tienda de Repuestos
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Aceite Motul 5W30, frenos Brembo, CarPlay y bujías.
                          </span>
                        </div>
                      </a>

                      <a
                        href="#catalogo-baterias"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-amber-400/40">
                          🔋
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white group-hover:text-amber-400 block transition-colors leading-tight">
                            Baterías Top 8 Chile
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Modelos DIN, JIS y AGM con instalación a domicilio.
                          </span>
                        </div>
                      </a>

                      <a
                        href="#monitor-desgaste"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-900/90 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:border-cyan-400/40">
                          📡
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-cyan-300 group-hover:text-cyan-400 block transition-colors leading-tight">
                            Monitor de Desgaste & GPS
                          </strong>
                          <span className="text-[11px] text-slate-400 font-light leading-snug">
                            Historial clínico, consumo de combustible y odómetro.
                          </span>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* LADO DERECHO: SELECTOR DE PORTAL + CARRITO + BOTÓN AGENDAR */}
          <div className="flex items-center gap-3">

            {/* DROPDOWN 3: SELECTOR DE PORTAL / ÁREA (MÁS LIMPIO Y COMPACTO QUE 3 BOTONES SEPARADOS) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('portal')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleToggleDropdown('portal')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  openDropdown === 'portal'
                    ? 'bg-slate-900 border-slate-700 text-white shadow-sm'
                    : isTaller
                    ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
                    : isPlanes
                    ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{isTaller ? '🔧 Panel Taller' : isPlanes ? '💼 Planes SaaS' : '🚗 Clientes'}</span>
                <span className={`text-[9px] transition-transform duration-200 ${openDropdown === 'portal' ? 'rotate-180' : 'text-slate-500'}`}>
                  ▼
                </span>
              </button>

              {/* Panel Desplegable Portal */}
              {openDropdown === 'portal' && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 mb-1">
                    Cambiar de Plataforma
                  </div>

                  <Link
                    href="/"
                    onClick={handleNavLinkClick}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all ${
                      isCliente ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="text-base">🚗</span>
                    <div>
                      <strong className="text-xs font-bold block leading-tight">Portal Clientes</strong>
                      <span className="text-[10px] text-slate-400">Atención técnica a domicilio</span>
                    </div>
                  </Link>

                  <Link
                    href="/taller"
                    onClick={handleNavLinkClick}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all ${
                      isTaller ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="text-base">🔧</span>
                    <div>
                      <strong className="text-xs font-bold block leading-tight">Panel Taller Mecánico</strong>
                      <span className="text-[10px] text-slate-400">Citas, OTs, Detailing y Stock</span>
                    </div>
                  </Link>

                  <Link
                    href="/planes"
                    onClick={handleNavLinkClick}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all ${
                      isPlanes ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="text-base">💼</span>
                    <div>
                      <strong className="text-xs font-bold block leading-tight">Planes SaaS Automotriz</strong>
                      <span className="text-[10px] text-slate-400">Software para talleres y flotas</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Botón Carrito de Compras */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Abrir Carrito de Repuestos"
            >
              <span>🛒</span>
              <span className="hidden lg:inline">Carrito</span>
              {totalItems > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botón CTA Principal */}
            {isCliente ? (
              <a
                href="#agendar"
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs py-2 px-5 rounded-full shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span>Agendar Visita</span>
                <span className="font-black">→</span>
              </a>
            ) : isPlanes ? (
              <a
                href="#demo"
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs py-2 px-5 rounded-full shadow-lg transition-all"
              >
                Pedir Demo Gratis
              </a>
            ) : (
              <a
                href="/"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs py-2 px-4 rounded-full transition-all"
              >
                Volver a la Web
              </a>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}