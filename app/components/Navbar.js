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

  function handleNavLinkClick() {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. BARRA SUPERIOR MÓVIL COMPACTA (MINIMALISTA)             */}
      {/* ========================================================= */}
      <nav className="sticky top-0 z-50 w-full bg-[#080a0d]/90 backdrop-blur-2xl border-b border-white/[0.06] px-4 py-3 flex md:hidden items-center justify-between">
        <Link href="/" className="text-base font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-blue-600/30">
            AB
          </span>
          <span className="text-sm font-black tracking-tight">
            Auto<span className="text-blue-400 font-extrabold">Booking</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Botón SOS rápido en móvil */}
          {isCliente && (
            <Link
              href="/emergencia"
              className="bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-[11px] py-1.5 px-2.5 rounded-full flex items-center gap-1 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>SOS</span>
            </Link>
          )}

          {/* Botón Buscar en Móvil */}
          <Link
            href="/buscar"
            className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/75 p-2 rounded-full flex items-center justify-center transition-all"
            aria-label="Buscar servicios"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>

          {/* Botón Carrito en Móvil */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 p-2 rounded-full flex items-center justify-center transition-all cursor-pointer"
            aria-label="Abrir Carrito"
          >
            <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Menú Hamburguesa Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 bg-[#0d1117]/98 backdrop-blur-2xl border-b border-white/[0.08] p-5 md:hidden shadow-2xl max-h-[85vh] overflow-y-auto space-y-3.5">
          {/* Selector de modo Clientes / Taller / SaaS */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <Link
              href="/"
              onClick={handleNavLinkClick}
              className={`py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                isCliente ? 'bg-blue-600 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Clientes
            </Link>
            <Link
              href="/taller"
              onClick={handleNavLinkClick}
              className={`py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                isTaller ? 'bg-blue-600 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Taller
            </Link>
            <Link
              href="/planes"
              onClick={handleNavLinkClick}
              className={`py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                isPlanes ? 'bg-blue-600 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
              }`}
            >
              SaaS
            </Link>
          </div>

          {/* Botón Destacado Emergencia SOS 24/7 */}
          <Link
            href="/emergencia"
            onClick={handleNavLinkClick}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-rose-600/25 to-red-600/20 border border-rose-500/40 flex items-center justify-between text-xs font-bold text-rose-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Auxilio Vehicular SOS 24/7 (Sin seguro)</span>
            </div>
            <span>Pedir →</span>
          </Link>

          {/* Categoría 1: Servicios & Mecánica */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'servicios' ? '' : 'servicios')}
              className="w-full p-4 flex items-center justify-between text-xs font-semibold text-white/80"
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63" />
                </svg>
                <span>Servicios, Buscador & Diagnóstico</span>
              </div>
              <svg className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${mobileExpandedSection === 'servicios' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpandedSection === 'servicios' && (
              <div className="p-3 pt-0 space-y-1.5 border-t border-white/[0.04]">
                <Link
                  href="/buscar"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-blue-300 font-semibold hover:bg-white/[0.04] transition-colors"
                >
                  🔍 Buscador Inteligente de Categorías
                </Link>
                <a
                  href="/#servicios"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Servicios a Domicilio
                </a>
                <Link
                  href="/diagnostico"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Diagnóstico por Síntomas OBD2
                </Link>
                <Link
                  href="/estado"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Rastreo de Reparación en Vivo
                </Link>
                <Link
                  href="/historial"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Pasaporte Automotriz QR
                </Link>
              </div>
            )}
          </div>

          {/* Categoría 2: Tienda, Baterías & Mi Cuenta */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'tienda' ? '' : 'tienda')}
              className="w-full p-4 flex items-center justify-between text-xs font-semibold text-white/80"
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Tienda, Baterías & Mi Cuenta</span>
              </div>
              <svg className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${mobileExpandedSection === 'tienda' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpandedSection === 'tienda' && (
              <div className="p-3 pt-0 space-y-1.5 border-t border-white/[0.04]">
                <Link
                  href="/cuenta"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-blue-300 font-semibold hover:bg-white/[0.04] transition-colors"
                >
                  👤 Mi Cuenta, Guantera Digital & Puntos
                </Link>
                <Link
                  href="/tienda"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Tienda de Repuestos & Upgrades
                </Link>
                <Link
                  href="/baterias"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Catálogo de Baterías de Alta Rotación
                </Link>
                <Link
                  href="/telemetria"
                  onClick={handleNavLinkClick}
                  className="block p-2.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Monitor de Desgaste & Odómetro GPS
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href="/#agendar"
              onClick={handleNavLinkClick}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              <span>Agendar Hora a Domicilio</span>
              <span>→</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BARRA DE NAVEGACIÓN SUPERIOR DE ESCRITORIO (KAUFMANN)    */}
      {/* ========================================================= */}
      <nav ref={navRef} className="sticky top-4 z-50 w-full px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto bg-[#080a0d]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.8)] rounded-full px-6 py-3 flex items-center justify-between transition-all relative">
          {/* LADO IZQUIERDO: LOGO DE MARCA */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-base font-black tracking-tight text-white flex items-center gap-2.5 group shrink-0">
              <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                AB
              </span>
              <span>
                Auto<span className="text-blue-400 font-extrabold">Booking</span>
              </span>
            </Link>

            {/* MENÚS DESPLEGABLES PRINCIPALES */}
            {isCliente && (
              <div className="flex items-center gap-1 text-xs font-medium text-white/65">
                {/* DROPDOWN 1: SERVICIOS */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('servicios')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleDropdown('servicios')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer select-none ${
                      openDropdown === 'servicios'
                        ? 'bg-white/[0.08] text-white'
                        : 'hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Servicios</span>
                    <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'servicios' ? 'rotate-180 text-blue-400' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Panel Desplegable Servicios */}
                  {openDropdown === 'servicios' && (
                    <div className="absolute top-full left-0 mt-3 w-80 bg-[#0d1117]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 py-1 mb-1">
                        Atención Técnica & Seguimiento
                      </div>

                      <Link
                        href="/emergencia"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-500/[0.07] hover:bg-rose-500/15 border border-rose-500/20 transition-all group mb-1"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-rose-300 block leading-tight">
                            Emergencias SOS 24/7
                          </strong>
                          <span className="text-[11px] text-white/50 font-light leading-snug">
                            Grúas, puente de batería, vulca y cerrajería sin seguro.
                          </span>
                        </div>
                      </Link>

                      <a
                        href="/#servicios"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-blue-500/30">
                          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-xs font-semibold text-white/90 group-hover:text-blue-300 block transition-colors leading-tight">
                            Nuestros Servicios
                          </strong>
                          <span className="text-[11px] text-white/35 font-light leading-snug">
                            Mantenciones por KM, frenos, car audio y baterías.
                          </span>
                        </div>
                      </a>

                      <Link
                        href="/diagnostico"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-blue-500/30">
                          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-xs font-semibold text-white/90 group-hover:text-blue-300 block transition-colors leading-tight">
                            Diagnóstico con Escáner OBD2
                          </strong>
                          <span className="text-[11px] text-white/35 font-light leading-snug">
                            Detección computarizada de fallas y códigos de motor.
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/estado"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-blue-500/30">
                          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-xs font-semibold text-white/90 group-hover:text-blue-300 block transition-colors leading-tight">
                            Tracker en Vivo & Pasaporte QR
                          </strong>
                          <span className="text-[11px] text-white/35 font-light leading-snug">
                            Consulta el estado de reparación o historial por patente.
                          </span>
                        </div>
                      </Link>
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
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer select-none ${
                      openDropdown === 'tienda'
                        ? 'bg-white/[0.08] text-white'
                        : 'hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Catálogo</span>
                    <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'tienda' ? 'rotate-180 text-blue-400' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Panel Desplegable Tienda */}
                  {openDropdown === 'tienda' && (
                    <div className="absolute top-full left-0 mt-3 w-80 bg-[#0d1117]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 py-1 mb-1">
                        Repuestos & Monitoreo Inteligente
                      </div>

                      <Link
                        href="/tienda"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-blue-500/30">
                          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-xs font-semibold text-white/90 group-hover:text-blue-300 block transition-colors leading-tight">
                            Tienda de Repuestos
                          </strong>
                          <span className="text-[11px] text-white/35 font-light leading-snug">
                            Aceite Motul 5W30, frenos Brembo, CarPlay y bujías.
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/baterias"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-blue-500/30">
                          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-xs font-semibold text-white/90 group-hover:text-blue-300 block transition-colors leading-tight">
                            Baterías de Mayor Rotación
                          </strong>
                          <span className="text-[11px] text-white/35 font-light leading-snug">
                            Formatos DIN, JIS y AGM con instalación in situ.
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/telemetria"
                        onClick={handleNavLinkClick}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-blue-500/30">
                          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-xs font-semibold text-white/90 group-hover:text-blue-300 block transition-colors leading-tight">
                            Monitor de Desgaste & GPS
                          </strong>
                          <span className="text-[11px] text-white/35 font-light leading-snug">
                            Historial clínico, consumo de combustible y odómetro.
                          </span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* ENLACE DIRECTO: EMERGENCIA SOS 24/7 */}
                <Link
                  href="/emergencia"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    pathname === '/emergencia'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Emergencia 24/7</span>
                </Link>

                {/* ENLACE DIRECTO: BUSCADOR */}
                <Link
                  href="/buscar"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    pathname === '/buscar'
                      ? 'bg-white/[0.1] text-white'
                      : 'hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span>Buscar</span>
                </Link>
              </div>
            )}
          </div>

          {/* LADO DERECHO: MI CUENTA + PORTAL + CARRITO + CTA */}
          <div className="flex items-center gap-2.5">
            {/* Botón Mi Cuenta del Conductor */}
            {isCliente && (
              <Link
                href="/cuenta"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  pathname === '/cuenta'
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white/75 hover:text-white'
                }`}
              >
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="hidden xl:inline">Mi Cuenta</span>
              </Link>
            )}

            {/* DROPDOWN 3: SELECTOR DE PORTAL / ÁREA */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('portal')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleToggleDropdown('portal')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              >
                <span>{isTaller ? 'Panel Taller' : isPlanes ? 'Planes SaaS' : 'Plataforma'}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'portal' ? 'rotate-180 text-blue-400' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Panel Desplegable Portal */}
              {openDropdown === 'portal' && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-[#0d1117]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 py-1 mb-1">
                    Cambiar de Plataforma
                  </div>

                  <Link
                    href="/"
                    onClick={handleNavLinkClick}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
                      isCliente ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/[0.04] text-white/70'
                    }`}
                  >
                    <div>
                      <strong className="text-xs font-semibold block leading-tight">Portal Clientes</strong>
                      <span className="text-[10px] text-white/30">Atención a domicilio y SOS 24/7</span>
                    </div>
                  </Link>

                  <Link
                    href="/taller"
                    onClick={handleNavLinkClick}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
                      isTaller ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/[0.04] text-white/70'
                    }`}
                  >
                    <div>
                      <strong className="text-xs font-semibold block leading-tight">Panel Taller Mecánico</strong>
                      <span className="text-[10px] text-white/30">Citas, OTs, Inspección 360° y Stock</span>
                    </div>
                  </Link>

                  <Link
                    href="/planes"
                    onClick={handleNavLinkClick}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
                      isPlanes ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/[0.04] text-white/70'
                    }`}
                  >
                    <div>
                      <strong className="text-xs font-semibold block leading-tight">Planes SaaS Automotriz</strong>
                      <span className="text-[10px] text-white/30">Software para talleres y flotas</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Botón Carrito de Compras */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-blue-500/40 text-white/80 text-xs font-medium py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Abrir Carrito de Repuestos"
            >
              <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden lg:inline">Carrito</span>
              {totalItems > 0 && (
                <span className="bg-blue-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botón CTA Principal */}
            {isCliente ? (
              <a
                href="/#agendar"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-4 rounded-full shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <span>Agendar</span>
                <span className="font-bold">→</span>
              </a>
            ) : isPlanes ? (
              <a
                href="#demo"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-5 rounded-full shadow-lg transition-all"
              >
                Pedir Demo Gratis
              </a>
            ) : (
              <a
                href="/"
                className="bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white/80 font-medium text-xs py-2 px-4 rounded-full transition-all"
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
