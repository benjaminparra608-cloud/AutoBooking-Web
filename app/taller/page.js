'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function TallerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative">
      <Navbar />

      {/* HERO TALLER */}
      <header className="bg-gradient-to-b from-cyan-900 via-slate-900 to-slate-950 border-b border-cyan-900/40 py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            🔧 Área interna
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-white">
            Panel <span className="text-cyan-400">Taller</span>
          </h1>
          <p className="text-lg text-slate-300 mb-2">
            Gestión interna de citas, órdenes de trabajo y seguimiento de vehículos.
          </p>
          <p className="text-sm text-slate-500">
            Esta sección está en construcción — las funcionalidades se irán habilitando próximamente.
          </p>
        </div>
      </header>

      {/* GRID DE MÓDULOS (placeholders) */}
      <main className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-slate-400 mb-8 uppercase tracking-wider text-center">
          Módulos del sistema
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Módulo 1: Citas del día */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/50 flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Citas del día</h3>
              <p className="text-sm text-slate-400">
                Visualiza y gestiona todas las reservas programadas para hoy y los próximos días.
              </p>
            </div>
            <span className="mt-auto inline-block text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Próximamente
            </span>
          </div>

          {/* Módulo 2: Órdenes de trabajo */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Órdenes de Trabajo</h3>
              <p className="text-sm text-slate-400">
                Crea, asigna y sigue el avance de cada orden de trabajo vinculada a un vehículo.
              </p>
            </div>
            <span className="mt-auto inline-block text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Próximamente
            </span>
          </div>

          {/* Módulo 3: Historial de vehículos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-violet-950 border border-violet-800/50 flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Historial de Vehículos</h3>
              <p className="text-sm text-slate-400">
                Registro completo de intervenciones, patentes y kilometrajes de cada cliente.
              </p>
            </div>
            <span className="mt-auto inline-block text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Próximamente
            </span>
          </div>

          {/* Módulo 4: Asignación de mecánicos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800/50 flex items-center justify-center text-2xl">
              👨‍🔧
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Asignación de Mecánicos</h3>
              <p className="text-sm text-slate-400">
                Distribuye las citas entre el equipo según disponibilidad y especialidad.
              </p>
            </div>
            <span className="mt-auto inline-block text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Próximamente
            </span>
          </div>

          {/* Módulo 5: Reportes y métricas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Reportes & Métricas</h3>
              <p className="text-sm text-slate-400">
                Resumen de servicios realizados, ingresos y rendimiento del taller por período.
              </p>
            </div>
            <span className="mt-auto inline-block text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Próximamente
            </span>
          </div>

          {/* Módulo 6: Notificaciones automáticas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-800/50 flex items-center justify-center text-2xl">
              🔔
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Notificaciones Auto.</h3>
              <p className="text-sm text-slate-400">
                Confirmaciones y recordatorios automáticos por WhatsApp para clientes agendados.
              </p>
            </div>
            <span className="mt-auto inline-block text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Próximamente
            </span>
          </div>

        </div>

        {/* CTA de retroalimentación */}
        <div className="mt-14 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400 mb-2 text-sm">
            ¿Tienes prioridades o funciones específicas en mente para el panel?
          </p>
          <p className="text-slate-500 text-xs">
            Comenta con el equipo de desarrollo para planificar la hoja de ruta.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
