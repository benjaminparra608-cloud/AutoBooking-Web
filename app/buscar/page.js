'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import AutoBotAssistant from '../components/AutoBotAssistant';
import {
  RECOMMENDED_SEARCH_TAGS,
  DISCOVER_CATEGORIES,
  SEARCHABLE_CATALOG,
} from '../lib/emergencyCatalog';

function CategoryIcon({ name, className = 'w-6 h-6' }) {
  switch (name) {
    case 'wrench':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case 'bag':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'bolt':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case 'siren':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      );
    case 'qr':
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        </svg>
      );
  }
}

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('Las Condes, RM');
  const [patenteLookup, setPatenteLookup] = useState('');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCHABLE_CATALOG;
    return SEARCHABLE_CATALOG.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#080a0d] text-white pb-28 md:pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 md:pt-12">
        {/* Selector superior de ubicación estilo Portal Motores en tema oscuro */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#0d1117] border border-white/[0.08] rounded-full px-4 py-2 text-xs text-white/80">
            <span className="text-blue-400">📍</span>
            <span className="text-white/50">Atención en:</span>
            <select
              value={selectedComuna}
              onChange={(e) => setSelectedComuna(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Las Condes, RM" className="bg-[#0d1117]">Las Condes, RM</option>
              <option value="Providencia, RM" className="bg-[#0d1117]">Providencia, RM</option>
              <option value="Vitacura, RM" className="bg-[#0d1117]">Vitacura, RM</option>
              <option value="Ñuñoa, RM" className="bg-[#0d1117]">Ñuñoa, RM</option>
              <option value="La Florida, RM" className="bg-[#0d1117]">La Florida, RM</option>
              <option value="Viña del Mar, V" className="bg-[#0d1117]">Viña del Mar, V</option>
              <option value="Concepción, VIII" className="bg-[#0d1117]">Concepción, VIII</option>
            </select>
          </div>

          <Link
            href="/emergencia"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>¿En pana? Auxilio 24/7</span>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. BUSCADOR PRINCIPAL INTELIGENTE                         */}
        {/* ========================================================= */}
        <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-4">
            ¿Qué estás buscando para tu vehículo?
          </h1>

          <div className="relative mb-5">
            <svg
              className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca mantención, revisión técnica, batería AGM, grúa SOS, frenos..."
              className="w-full bg-[#080a0d] border border-white/[0.12] focus:border-blue-500 rounded-2xl pl-12 pr-24 py-4 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs text-white/70 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Chips de Búsquedas Recomendadas */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 block mb-2.5">
              Búsquedas recomendadas
            </span>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDED_SEARCH_TAGS.map((tag) => {
                const isActive = query.toLowerCase() === tag.query.toLowerCase();
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => setQuery(isActive ? '' : tag.query)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/25'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.08] text-white/75'
                    }`}
                  >
                    <span>{tag.label}</span>
                    {tag.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          tag.badge === 'SOS'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {tag.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. RESULTADOS EN TIEMPO REAL                              */}
        {/* ========================================================= */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">
              {query
                ? `Resultados para "${query}" (${filteredResults.length})`
                : 'Servicios y soluciones destacadas'}
            </h2>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Ver todo el catálogo
              </button>
            )}
          </div>

          {filteredResults.length === 0 ? (
            <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-8 text-center space-y-3">
              <p className="text-sm text-white/70">
                No encontramos coincidencias exactas para &ldquo;{query}&rdquo;.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/diagnostico"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Diagnosticar síntoma con IA
                </Link>
                <Link
                  href="/emergencia"
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                >
                  Pedir Auxilio SOS 24/7
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredResults.map((item) => {
                const isSos = item.category === 'Emergencia SOS';
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                      isSos
                        ? 'bg-rose-950/20 hover:bg-rose-950/35 border-rose-500/25 hover:border-rose-500/50'
                        : 'bg-[#0d1117] hover:bg-[#121822] border-white/[0.08] hover:border-blue-500/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSos
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-blue-500/15 text-blue-300'
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-[11px] text-white/45">⏱ {item.eta}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm font-black ${isSos ? 'text-rose-400' : 'text-white'}`}>
                        {item.price}
                      </div>
                      <span className="text-[11px] text-blue-400 font-semibold">Ver →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* 3. CONOCE NUESTRAS CATEGORÍAS (ESTILO PORTAL MOTORES)     */}
        {/* ========================================================= */}
        <section className="mb-12">
          <div className="mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
              Ecosistema Completo
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Conoce nuestras categorías
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DISCOVER_CATEGORIES.map((cat) => {
              const isEmergency = cat.accent === 'rose';
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className={`group rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                    isEmergency
                      ? 'bg-gradient-to-br from-rose-950/40 to-[#0d1117] border-rose-500/30 hover:border-rose-500/60'
                      : 'bg-[#0d1117] hover:bg-[#111722] border-white/[0.08] hover:border-blue-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                          isEmergency
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            : 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                        }`}
                      >
                        <CategoryIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isEmergency
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-white/[0.05] text-white/70'
                        }`}
                      >
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-white/55 leading-relaxed mb-4">{cat.subtitle}</p>
                  </div>

                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <span>Explorar</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. CONSULTA RÁPIDA POR PATENTE (TRACKER & PASAPORTE QR)   */}
        {/* ========================================================= */}
        <section className="bg-gradient-to-r from-[#0d1526] via-[#0d1117] to-[#0d1117] border border-blue-500/25 rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
                Consulta Digital por Patente
              </span>
              <h3 className="text-xl font-black text-white">
                ¿Tu auto está en el taller o buscas su Pasaporte QR?
              </h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Ingresa la patente para ver en vivo el estado de reparación o descargar el certificado de
                mantenciones selladas.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={patenteLookup}
                onChange={(e) => setPatenteLookup(e.target.value.toUpperCase())}
                placeholder="Ej. ABCD12"
                className="flex-1 bg-[#080a0d] border border-white/[0.12] rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
              />
              <Link
                href={patenteLookup.trim() ? `/estado/${encodeURIComponent(patenteLookup.trim())}` : '/estado'}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0"
              >
                Rastrear →
              </Link>
            </div>
          </div>
        </section>
        {/* ========================================================= */}
        {/* 5. ASISTENTE CONVERSACIONAL IA INTEGRADO                  */}
        {/* ========================================================= */}
        <section className="mt-10">
          <AutoBotAssistant embedded={true} />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
