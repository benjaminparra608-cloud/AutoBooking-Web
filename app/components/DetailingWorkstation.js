'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  INSUMOS_DETAILING_BASE,
  CHECKLIST_SALIDA_BASE,
  FASES_CONTROL_CALIDAD,
  PAQUETES_DETAILING,
  DEMO_TRABAJOS_DETAILING,
  calcularDilucion,
  getLocalDetailingInventory,
  saveLocalDetailingInventory,
  getLocalSalidaChecklist,
  saveLocalSalidaChecklist,
  getLocalDetailingJobs,
  saveLocalDetailingJobs
} from '../lib/detailingCatalog';

export default function DetailingWorkstation({ onBackToOverview }) {
  // Sub-pestaña activa: 'inventario' | 'salida' | 'proceso'
  const [subTab, setSubTab] = useState('proceso');

  // ==========================================
  // ESTADO - INVENTARIO DE INSUMOS Y QUÍMICOS
  // ==========================================
  const [insumos, setInsumos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todas'); // 'todas' | 'Químicos' | 'Maquinaria' | 'Accesorios' | 'compras'
  const [busquedaInsumo, setBusquedaInsumo] = useState('');

  // ==========================================
  // ESTADO - CHECKLIST DE SALIDA (A DOMICILIO)
  // ==========================================
  const [checklistSalida, setChecklistSalida] = useState([]);

  // ==========================================
  // ESTADO - TRABAJOS DE DETAILING (ORDEN DE ATAQUE)
  // ==========================================
  const [trabajos, setTrabajos] = useState([]);
  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(null);
  const [showNuevoTrabajoModal, setShowNuevoTrabajoModal] = useState(false);
  const [nuevoTrabajoForm, setNuevoTrabajoForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    cliente: '',
    telefono: '',
    paqueteId: PAQUETES_DETAILING[3].id, // Full Car Detailing por defecto
    notas: ''
  });

  // Modal de "Alerta al cerrar trabajo" (El toque mágico)
  const [showModalFinalizar, setShowModalFinalizar] = useState(null); // Contiene el trabajo que se está cerrando
  const [quimicosAjusteFinal, setQuimicosAjusteFinal] = useState({});

  // ==========================================
  // ESTADO - CALCULADORA DE DILUCIONES INTEGRADA
  // ==========================================
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcCapacidadMl, setCalcCapacidadMl] = useState(500);
  const [calcRatio, setCalcRatio] = useState(10);
  const [calcQuimicoSeleccionado, setCalcQuimicoSeleccionado] = useState(null);

  // Cargar datos persistidos
  useEffect(() => {
    const inv = getLocalDetailingInventory();
    setInsumos(inv);
    const sal = getLocalSalidaChecklist();
    setChecklistSalida(sal);
    const jobs = getLocalDetailingJobs();
    setTrabajos(jobs);
    if (jobs.length > 0) {
      setTrabajoSeleccionadoId(jobs[0].id);
    }
  }, []);

  // ==========================================
  // MANEJADORES: INVENTARIO INTELIGENTE TAP-FRIENDLY
  // ==========================================
  function handleCambiarNivelStock(insumoId, nuevoPorcentaje, nuevoEstado) {
    const updated = insumos.map((item) => {
      if (item.id === insumoId) {
        return {
          ...item,
          nivelPorcentaje: nuevoPorcentaje,
          estadoStock: nuevoEstado
        };
      }
      return item;
    });
    setInsumos(updated);
    saveLocalDetailingInventory(updated);
  }

  // Filtrado de insumos
  const insumosFiltrados = useMemo(() => {
    return insumos.filter((item) => {
      if (filtroCategoria === 'compras') {
        return item.nivelPorcentaje <= 25 || item.estadoStock === 'Comprar';
      }
      if (filtroCategoria !== 'todas' && item.categoria !== filtroCategoria) {
        return false;
      }
      if (busquedaInsumo.trim()) {
        const q = busquedaInsumo.toLowerCase();
        return (
          item.nombre.toLowerCase().includes(q) ||
          item.categoria.toLowerCase().includes(q) ||
          (item.dilucionRecomendada || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [insumos, filtroCategoria, busquedaInsumo]);

  const itemsPorComprar = useMemo(() => {
    return insumos.filter((i) => i.nivelPorcentaje <= 25 || i.estadoStock === 'Comprar');
  }, [insumos]);

  function handleCompartirListaComprasWhatsApp() {
    if (itemsPorComprar.length === 0) {
      alert('¡Excelente! No tienes insumos en nivel crítico ni por comprar.');
      return;
    }
    const lista = itemsPorComprar
      .map((i, idx) => `${idx + 1}. *${i.nombre}* (${i.categoria}) — Nivel: ${i.nivelPorcentaje}% (${i.envaseCapacidad})`)
      .join('\n');
    const msg = `📋 *LISTA DE REPOSICIÓN DETAILING / TALLER:*\n\n${lista}\n\nFavor cotizar o preparar pedido.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // ==========================================
  // MANEJADORES: CHECKLIST DE SALIDA (A DOMICILIO)
  // ==========================================
  function handleToggleSalidaItem(id) {
    const updated = checklistSalida.map((item) => {
      if (item.id === id) {
        return { ...item, completado: !item.completado };
      }
      return item;
    });
    setChecklistSalida(updated);
    saveLocalSalidaChecklist(updated);
  }

  function handleMarcarTodoSalida(completado) {
    const updated = checklistSalida.map((i) => ({ ...i, completado }));
    setChecklistSalida(updated);
    saveLocalSalidaChecklist(updated);
  }

  const progresoSalida = useMemo(() => {
    if (checklistSalida.length === 0) return 0;
    const listos = checklistSalida.filter((i) => i.completado).length;
    return Math.round((listos / checklistSalida.length) * 100);
  }, [checklistSalida]);

  // ==========================================
  // MANEJADORES: CONTROL DE CALIDAD POR ORDEN DE TRABAJO
  // ==========================================
  const trabajoActual = useMemo(() => {
    return trabajos.find((t) => t.id === trabajoSeleccionadoId) || trabajos[0];
  }, [trabajos, trabajoSeleccionadoId]);

  function handleTogglePaso(faseIndex, pasoId) {
    if (!trabajoActual) return;
    const nuevasFases = [...trabajoActual.fases];
    const fase = { ...nuevasFases[faseIndex] };
    fase.pasos = fase.pasos.map((p) => {
      if (p.id === pasoId) {
        return { ...p, completado: !p.completado };
      }
      return p;
    });
    nuevasFases[faseIndex] = fase;

    const updatedTrabajos = trabajos.map((t) => {
      if (t.id === trabajoActual.id) {
        return { ...t, fases: nuevasFases };
      }
      return t;
    });

    setTrabajos(updatedTrabajos);
    saveLocalDetailingJobs(updatedTrabajos);
  }

  function handleCrearNuevoTrabajo(e) {
    e.preventDefault();
    if (!nuevoTrabajoForm.patente || !nuevoTrabajoForm.modelo) {
      alert('Por favor indica al menos la Patente y Modelo del auto.');
      return;
    }

    const paquete =
      PAQUETES_DETAILING.find((p) => p.id === nuevoTrabajoForm.paqueteId) || PAQUETES_DETAILING[0];

    // Clonar las 7 fases maestras
    const fasesClonadas = JSON.parse(JSON.stringify(FASES_CONTROL_CALIDAD));

    const nuevoJob = {
      id: `det-${Date.now()}`,
      numero_ot: `DET-2026-${String(trabajos.length + 1).padStart(3, '0')}`,
      patente: nuevoTrabajoForm.patente.toUpperCase(),
      marca: nuevoTrabajoForm.marca || 'Vehículo',
      modelo: nuevoTrabajoForm.modelo,
      cliente: nuevoTrabajoForm.cliente || 'Cliente Taller',
      telefono: nuevoTrabajoForm.telefono || '',
      paqueteId: paquete.id,
      paqueteNombre: paquete.nombre,
      precioCLP: paquete.precioCLP,
      estado: 'en_proceso',
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      fases: fasesClonadas,
      consumosAplicados: false,
      notas: nuevoTrabajoForm.notas || ''
    };

    const updated = [nuevoJob, ...trabajos];
    setTrabajos(updated);
    saveLocalDetailingJobs(updated);
    setTrabajoSeleccionadoId(nuevoJob.id);
    setShowNuevoTrabajoModal(false);
    setNuevoTrabajoForm({
      patente: '',
      marca: '',
      modelo: '',
      cliente: '',
      telefono: '',
      paqueteId: PAQUETES_DETAILING[3].id,
      notas: ''
    });
  }

  // Calcular progreso total de pasos completados en el trabajo activo
  const progresoTrabajo = useMemo(() => {
    if (!trabajoActual || !trabajoActual.fases) return { total: 0, hechos: 0, pct: 0 };
    let total = 0;
    let hechos = 0;
    trabajoActual.fases.forEach((f) => {
      f.pasos.forEach((p) => {
        total += 1;
        if (p.completado) hechos += 1;
      });
    });
    const pct = total > 0 ? Math.round((hechos / total) * 100) : 0;
    return { total, hechos, pct };
  }, [trabajoActual]);

  // Abrir modal de finalización con el toque mágico
  function handleIniciarCierreTrabajo(job) {
    setShowModalFinalizar(job);
    // Inicializar mapa de químicos usados con sus estados actuales
    const inicial = {};
    insumos
      .filter((i) => i.esQuimico)
      .forEach((q) => {
        inicial[q.id] = { nivel: q.nivelPorcentaje, estado: q.estadoStock };
      });
    setQuimicosAjusteFinal(inicial);
  }

  function handleConfirmarFinalizacion() {
    if (!showModalFinalizar) return;

    // 1. Actualizar el estado del trabajo a 'terminado'
    const updatedJobs = trabajos.map((j) => {
      if (j.id === showModalFinalizar.id) {
        return {
          ...j,
          estado: 'terminado',
          horaFin: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return j;
    });
    setTrabajos(updatedJobs);
    saveLocalDetailingJobs(updatedJobs);

    // 2. Aplicar los ajustes de químicos seleccionados con un solo toque en el inventario
    const updatedInsumos = insumos.map((insumo) => {
      if (quimicosAjusteFinal[insumo.id]) {
        return {
          ...insumo,
          nivelPorcentaje: quimicosAjusteFinal[insumo.id].nivel,
          estadoStock: quimicosAjusteFinal[insumo.id].estado
        };
      }
      return insumo;
    });
    setInsumos(updatedInsumos);
    saveLocalDetailingInventory(updatedInsumos);

    const terminado = showModalFinalizar;
    setShowModalFinalizar(null);

    // Preguntar si desea enviar notificación al cliente por WhatsApp
    if (terminado.telefono) {
      const waMsg =
        `¡Hola ${terminado.cliente}! 🚗✨ Te informamos que tu vehículo *${terminado.marca} ${terminado.modelo}* (Patente *${terminado.patente}*) ha finalizado con éxito todas las 7 fases de su servicio *${terminado.paqueteNombre}* en AutoBooking Taller.\n\n` +
        `✅ Control de Calidad 100% aprobado.\n` +
        `💧 Llantas, descontaminado, sellado y cristales impecables.\n\n` +
        `¡Ya puedes coordinar la entrega o retiro de tu auto!`;
      const telLimpio = terminado.telefono.replace(/\D/g, '');
      window.open(`https://wa.me/${telLimpio}?text=${encodeURIComponent(waMsg)}`, '_blank');
    }
  }

  // ==========================================
  // CALCULADORA DE DILUCIONES
  // ==========================================
  const calculoDilucion = useMemo(() => {
    return calcularDilucion(calcCapacidadMl, calcRatio);
  }, [calcCapacidadMl, calcRatio]);

  function handleAbrirCalculadoraConQuimico(quimico) {
    setCalcQuimicoSeleccionado(quimico);
    if (quimico.ratioSugerido !== undefined) {
      setCalcRatio(quimico.ratioSugerido);
    }
    setShowCalcModal(true);
  }

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. ENCABEZADO DE LA ESTACIÓN DE DETAILING                 */}
      {/* ========================================================= */}
      <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5">
              <span>Detailing & Operaciones de Calidad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Control Técnico de Taller,{' '}
              <span className="text-white/40 font-light italic">
                Insumos & Fases
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-white/45 mt-1.5 max-w-2xl font-light leading-relaxed">
              Gestión táctil optimizada para celular: control de niveles químicos por porcentaje, checklist de salida para terreno y 7 fases de calidad estandarizadas.
            </p>
          </div>

          {/* Botones de acción rápida: Calculadora y Nuevo Trabajo */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setCalcQuimicoSeleccionado(null);
                setShowCalcModal(true);
              }}
              className="bg-white/[0.03] hover:bg-white/[0.06] text-white/80 hover:text-white border border-white/[0.08] px-4 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              title="Calculadora de diluciones de atomizador"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5" />
              </svg>
              <span>Calculadora de Diluciones</span>
            </button>

            <button
              onClick={() => setShowNuevoTrabajoModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Nuevo Trabajo Detailing</span>
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN EN 3 PESTAÑAS SUGERIDAS */}
        <div className="grid grid-cols-3 gap-2.5 mt-6 pt-5 border-t border-white/[0.06]">
          <button
            onClick={() => setSubTab('inventario')}
            className={`py-3 px-3 rounded-2xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer border ${
              subTab === 'inventario'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25'
                : 'bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white border-white/[0.06]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <span>Stock de Bodega</span>
            {itemsPorComprar.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${subTab === 'inventario' ? 'bg-white text-blue-600' : 'bg-rose-500/80 text-white'}`}>
                {itemsPorComprar.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('salida')}
            className={`py-3 px-3 rounded-2xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer border ${
              subTab === 'salida'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25'
                : 'bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white border-white/[0.06]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h1.125c.621 0 1.129.504 1.09 1.124" />
            </svg>
            <span>Checklist de Salida</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ml-1 ${subTab === 'salida' ? 'bg-white/20 text-white' : 'bg-white/[0.04] text-white/40'}`}>
              {progresoSalida}%
            </span>
          </button>

          <button
            onClick={() => setSubTab('proceso')}
            className={`py-3 px-3 rounded-2xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer border ${
              subTab === 'proceso'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25'
                : 'bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white border-white/[0.06]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <span>Control de Calidad (7 Fases)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ml-1 ${subTab === 'proceso' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              {trabajos.filter((t) => t.estado === 'en_proceso').length} act.
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PESTAÑA A: STOCK DE BODEGA & INVENTARIO INTELIGENTE     */}
      {/* ========================================================= */}
      {subTab === 'inventario' && (
        <div className="space-y-5">
          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'todas', label: 'Todos (12)' },
                { id: 'Químicos', label: 'Químicos' },
                { id: 'Maquinaria', label: 'Maquinaria' },
                { id: 'Accesorios', label: 'Accesorios' },
                { id: 'compras', label: `🚨 Lista de Compras (${itemsPorComprar.length})` }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFiltroCategoria(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filtroCategoria === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar insumo, químico o dilución..."
                value={busquedaInsumo}
                onChange={(e) => setBusquedaInsumo(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full sm:w-56"
              />

              {itemsPorComprar.length > 0 && (
                <button
                  onClick={handleCompartirListaComprasWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-md cursor-pointer"
                  title="Enviar lista de compras por WhatsApp"
                >
                  <span>📲</span>
                  <span className="hidden sm:inline">Pedir Insumos</span>
                </button>
              )}
            </div>
          </div>

          {/* Grilla de Insumos con Botones Grandes Tap-Friendly */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insumosFiltrados.map((item) => {
              // Colores según nivel de porcentaje
              let badgeColor = 'bg-emerald-950/70 border-emerald-700/60 text-emerald-400';
              let barColor = 'bg-emerald-500';
              if (item.nivelPorcentaje <= 25) {
                badgeColor = 'bg-rose-950/70 border-rose-700/60 text-rose-400';
                barColor = 'bg-rose-500';
              } else if (item.nivelPorcentaje <= 50) {
                badgeColor = 'bg-amber-950/70 border-amber-700/60 text-amber-300';
                barColor = 'bg-amber-400';
              }

              return (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between transition-all shadow-md relative ${
                    item.nivelPorcentaje <= 25 ? 'border-rose-900/60 shadow-rose-950/20' : 'border-slate-800'
                  }`}
                >
                  <div>
                    {/* Encabezado: Ícono, Nombre y Categoría */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {item.icono}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                              {item.categoria}
                            </span>
                            <span className="text-[11px] text-slate-500">{item.envaseCapacidad}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                            {item.nombre}
                          </h4>
                        </div>
                      </div>

                      {/* Badge de Nivel Actual */}
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${badgeColor}`}>
                        {item.nivelPorcentaje}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 line-clamp-2 font-light">
                      {item.descripcion}
                    </p>

                    {/* Dilución recomendada y calculadora */}
                    {item.dilucionRecomendada && (
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-2.5 mb-3 flex items-center justify-between gap-2">
                        <div className="text-[11px]">
                          <span className="text-slate-500 font-semibold block">Dilución sugerida:</span>
                          <span className="text-cyan-300 font-medium font-mono">{item.dilucionRecomendada}</span>
                        </div>
                        {item.esQuimico && (
                          <button
                            type="button"
                            onClick={() => handleAbrirCalculadoraConQuimico(item)}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Calcular mezcla en atomizador"
                          >
                            🧪 Mezclar
                          </button>
                        )}
                      </div>
                    )}

                    {/* Barra de Nivel de Envase */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Nivel en envase:</span>
                        <span className="font-bold">{item.estadoStock}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${barColor}`}
                          style={{ width: `${item.nivelPorcentaje}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SELECTOR RÁPIDO TAP-FRIENDLY (4 BOTONES DE UN SOLO TOQUE) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Actualizar Nivel con 1 Toque:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCambiarNivelStock(item.id, 100, 'OK')}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                          item.nivelPorcentaje === 100
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                            : 'bg-slate-950 hover:bg-emerald-950/50 text-slate-300 border-slate-800'
                        }`}
                        title="Envase lleno"
                      >
                        🟢 OK
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCambiarNivelStock(item.id, 50, 'Mitad')}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                          item.nivelPorcentaje === 50
                            ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md'
                            : 'bg-slate-950 hover:bg-amber-950/50 text-slate-300 border-slate-800'
                        }`}
                        title="Mitad de envase"
                      >
                        🟡 50%
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCambiarNivelStock(item.id, 25, 'Poco')}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                          item.nivelPorcentaje === 25
                            ? 'bg-orange-600 text-white border-orange-400 shadow-md'
                            : 'bg-slate-950 hover:bg-orange-950/50 text-slate-300 border-slate-800'
                        }`}
                        title="Queda poco"
                      >
                        🟠 25%
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCambiarNivelStock(item.id, 0, 'Comprar')}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                          item.nivelPorcentaje === 0
                            ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                            : 'bg-slate-950 hover:bg-rose-950/50 text-slate-300 border-slate-800'
                        }`}
                        title="Agotado o comprar"
                      >
                        🔴 0%
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-800/60">
                      <span>Ref. compra: ${item.costoAproxCLP.toLocaleString('es-CL')} CLP</span>
                      <span>{item.ubicacion}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PESTAÑA B: CHECKLIST DE SALIDA (A DOMICILIO)            */}
      {/* ========================================================= */}
      {subTab === 'salida' && (
        <div className="space-y-6">
          {/* Tarjeta de Resumen y Control de Salida */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🚐</span>
                <h3 className="text-xl font-bold text-white">Preparación de Carga & Herramientas</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                Revisa que subiste todas las máquinas, cubetas, alargadores y químicos al vehículo antes de salir al domicilio del cliente.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-center w-full sm:w-auto">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Carga Completa</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{progresoSalida}%</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleMarcarTodoSalida(true)}
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  ✓ Marcar Todo
                </button>
                <button
                  type="button"
                  onClick={() => handleMarcarTodoSalida(false)}
                  className="flex-1 sm:flex-none bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer border border-slate-800"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progresoSalida === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${progresoSalida}%` }}
            />
          </div>

          {/* Lista de Elementos en Casillas Grandes ("Tap-Friendly") */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {checklistSalida.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleSalidaItem(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                  item.completado
                    ? 'bg-emerald-950/40 border-emerald-600/60 text-white shadow-md'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                      item.completado
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-950 border border-slate-700 text-slate-500'
                    }`}
                  >
                    {item.completado ? '✓' : ''}
                  </div>
                  <div>
                    <span className="text-xs font-semibold block leading-tight">
                      {item.item}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.categoria}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    item.completado ? 'text-emerald-400 bg-emerald-950/80' : 'text-slate-500 bg-slate-950'
                  }`}
                >
                  {item.completado ? 'Arriba' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PESTAÑA C: CHECKLIST DE PROCESO & CONTROL DE CALIDAD   */}
      {/* ========================================================= */}
      {subTab === 'proceso' && (
        <div className="space-y-6">
          {/* Selector de Trabajo Activo */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Trabajo Seleccionado en Bahía:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {trabajoActual?.marca} {trabajoActual?.modelo}
                  </h3>
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300">
                    {trabajoActual?.patente}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    trabajoActual?.estado === 'terminado'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}>
                    {trabajoActual?.estado === 'terminado' ? '✓ Terminado' : '⚙️ En Proceso'}
                  </span>
                </div>
              </div>

              {/* Botón de Finalizar Trabajo (Toque Mágico) */}
              {trabajoActual?.estado !== 'terminado' ? (
                <button
                  type="button"
                  onClick={() => handleIniciarCierreTrabajo(trabajoActual)}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-3 px-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-stretch sm:self-auto"
                >
                  <span>✨ Finalizar Trabajo</span>
                  <span className="text-sm">→</span>
                </button>
              ) : (
                <div className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <span>🎉 Trabajo finalizado y descontado</span>
                </div>
              )}
            </div>

            {/* Selector de otros trabajos si hay más de 1 */}
            <div className="flex items-center gap-2 pt-3 overflow-x-auto">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">Cambiar vehículo:</span>
              {trabajos.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setTrabajoSeleccionadoId(j.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    j.id === trabajoActual?.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  {j.patente} ({j.modelo})
                </button>
              ))}
            </div>

            {/* Barra de progreso global del trabajo */}
            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">
                  Avance Control de Calidad: <strong className="text-white font-mono">{progresoTrabajo.hechos} / {progresoTrabajo.total} pasos completados</strong>
                </span>
                <span className="text-cyan-400 font-mono font-bold">{progresoTrabajo.pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progresoTrabajo.pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* LAS 7 FASES DE CONTROL DE CALIDAD (ORDEN DE ATAQUE ESTRICTO) */}
          <div className="space-y-4">
            {trabajoActual?.fases?.map((fase, fIndex) => {
              const pasosCompletados = fase.pasos.filter((p) => p.completado).length;
              const faseCompleta = pasosCompletados === fase.pasos.length;

              return (
                <div
                  key={fase.fase}
                  className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all shadow-md ${
                    faseCompleta ? 'border-emerald-800/80 bg-slate-900/90' : 'border-slate-800'
                  }`}
                >
                  {/* Encabezado de la fase */}
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                        {fase.icono}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{fase.nombre}</span>
                          {faseCompleta && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              ✓ Fase Lista
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-slate-400 block font-light">
                          {fase.descripcion}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {pasosCompletados}/{fase.pasos.length}
                      </span>
                    </div>
                  </div>

                  {/* Lista de pasos con casillas grandes táctiles */}
                  <div className="space-y-2.5">
                    {fase.pasos.map((paso) => (
                      <div
                        key={paso.id}
                        onClick={() => handleTogglePaso(fIndex, paso.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center gap-3.5 ${
                          paso.completado
                            ? 'bg-emerald-950/30 border-emerald-600/50 text-white'
                            : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/90 text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-all shrink-0 ${
                            paso.completado
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'bg-slate-900 border border-slate-700 text-slate-500'
                          }`}
                        >
                          {paso.completado ? '✓' : ''}
                        </div>
                        <span className={`text-xs leading-relaxed ${paso.completado ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {paso.texto}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: ALERTA AL CERRAR TRABAJO ("EL TOQUE MÁGICO")    */}
      {/* ========================================================= */}
      {showModalFinalizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-xl w-full relative shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    ¿Se está acabando algún químico que usaste hoy?
                  </h3>
                  <span className="text-xs text-slate-400">
                    Vehículo: {showModalFinalizar.marca} {showModalFinalizar.modelo} ({showModalFinalizar.patente})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModalFinalizar(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Marca con un solo toque el estado restante de cada químico utilizado en este servicio antes de cerrar la orden de trabajo:
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {insumos
                .filter((i) => i.esQuimico)
                .map((q) => {
                  const estadoActual = quimicosAjusteFinal[q.id]?.nivel ?? q.nivelPorcentaje;

                  return (
                    <div
                      key={q.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{q.icono}</span>
                        <div>
                          <span className="text-xs font-bold text-white block">{q.nombre}</span>
                          <span className="text-[10px] text-slate-400">
                            {q.envaseCapacidad} • Ref: {q.dilucionRecomendada}
                          </span>
                        </div>
                      </div>

                      {/* Botones de selección rápida 1-toque */}
                      <div className="grid grid-cols-4 gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setQuimicosAjusteFinal((prev) => ({
                              ...prev,
                              [q.id]: { nivel: 100, estado: 'OK' }
                            }))
                          }
                          className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-bold border transition-all cursor-pointer ${
                            estadoActual === 100
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          🟢 OK
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setQuimicosAjusteFinal((prev) => ({
                              ...prev,
                              [q.id]: { nivel: 50, estado: 'Mitad' }
                            }))
                          }
                          className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-bold border transition-all cursor-pointer ${
                            estadoActual === 50
                              ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          🟡 50%
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setQuimicosAjusteFinal((prev) => ({
                              ...prev,
                              [q.id]: { nivel: 25, estado: 'Poco' }
                            }))
                          }
                          className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-bold border transition-all cursor-pointer ${
                            estadoActual === 25
                              ? 'bg-orange-600 text-white border-orange-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          🟠 25%
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setQuimicosAjusteFinal((prev) => ({
                              ...prev,
                              [q.id]: { nivel: 0, estado: 'Comprar' }
                            }))
                          }
                          className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-bold border transition-all cursor-pointer ${
                            estadoActual === 0
                              ? 'bg-rose-600 text-white border-rose-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          🔴 0%
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowModalFinalizar(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmarFinalizacion}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>✓ Confirmar & Finalizar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: MINI CALCULADORA DE DILUCIONES INTEGRADA        */}
      {/* ========================================================= */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧪</span>
                <div>
                  <h3 className="text-lg font-black text-white">Calculadora de Diluciones</h3>
                  <span className="text-xs text-slate-400">
                    {calcQuimicoSeleccionado ? `Mezcla para: ${calcQuimicoSeleccionado.nombre}` : 'Dosificación exacta para atomizadores y pulverizadores'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCalcModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* 1. Selector de Capacidad de Botella */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  1. Tamaño del atomizador / botella:
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[300, 500, 750, 1000].map((ml) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => setCalcCapacidadMl(ml)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        calcCapacidadMl === ml
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {ml} ml
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={calcCapacidadMl}
                    onChange={(e) => setCalcCapacidadMl(Number(e.target.value) || 500)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    placeholder="Capacidad personalizada en ml..."
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                    ml
                  </span>
                </div>
              </div>

              {/* 2. Selector de Ratio de Dilución */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  2. Proporción de dilución recomendada:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-2">
                  {[
                    { r: 1, label: '1:1' },
                    { r: 4, label: '1:4' },
                    { r: 5, label: '1:5' },
                    { r: 10, label: '1:10' },
                    { r: 15, label: '1:15' },
                    { r: 20, label: '1:20' },
                    { r: 50, label: '1:50' }
                  ].map((item) => (
                    <button
                      key={item.r}
                      type="button"
                      onClick={() => setCalcRatio(item.r)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        calcRatio === item.r
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Tip: 1:4 (Motor/Grasa) • 1:5 (Ruedas) • 1:10 (Interior/APC) • 1:20 (Mantenimiento suave)
                </span>
              </div>

              {/* 3. RESULTADO EN GRANDE (LO QUE PIDIÓ EL USUARIO) */}
              <div className="bg-slate-950 border-2 border-cyan-500/60 rounded-3xl p-5 text-center shadow-inner relative overflow-hidden">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Dosificación para {calcCapacidadMl} ml (Dilución {calculoDilucion.proporcionTexto})
                </div>

                <div className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
                  Pon <span className="text-amber-400 font-mono">{calculoDilucion.mlProducto} ml</span> de producto
                </div>
                <div className="text-lg sm:text-xl font-bold text-cyan-300 mt-0.5">
                  y rellena con <span className="font-mono text-cyan-200">{calculoDilucion.mlAgua} ml</span> de agua
                </div>

                {/* Gráfico visual de la botella */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-3">
                  <div className="w-full max-w-xs h-6 bg-slate-900 rounded-full overflow-hidden border border-slate-700 flex">
                    <div
                      className="h-full bg-amber-500 flex items-center justify-center text-[10px] text-slate-950 font-black"
                      style={{ width: `${calculoDilucion.porcentajeProducto}%` }}
                      title={`Producto: ${calculoDilucion.mlProducto} ml`}
                    >
                      {calculoDilucion.porcentajeProducto > 15 ? `${calculoDilucion.porcentajeProducto}%` : ''}
                    </div>
                    <div
                      className="h-full bg-cyan-600 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${calculoDilucion.porcentajeAgua}%` }}
                      title={`Agua: ${calculoDilucion.mlAgua} ml`}
                    >
                      Agua ({calculoDilucion.mlAgua} ml)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCalcModal(false)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL: CREAR NUEVO TRABAJO DE DETAILING                 */}
      {/* ========================================================= */}
      {showNuevoTrabajoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚗</span>
                <h3 className="text-lg font-bold text-white">Nuevo Trabajo de Detailing</h3>
              </div>
              <button
                onClick={() => setShowNuevoTrabajoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearNuevoTrabajo} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Patente:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: BB-CL-20"
                    value={nuevoTrabajoForm.patente}
                    onChange={(e) => setNuevoTrabajoForm({ ...nuevoTrabajoForm, patente: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Modelo del Auto:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Chevrolet Sail 1.5"
                    value={nuevoTrabajoForm.modelo}
                    onChange={(e) => setNuevoTrabajoForm({ ...nuevoTrabajoForm, modelo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nombre Cliente:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Rodrigo Morales"
                    value={nuevoTrabajoForm.cliente}
                    onChange={(e) => setNuevoTrabajoForm({ ...nuevoTrabajoForm, cliente: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    WhatsApp Cliente:
                  </label>
                  <input
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={nuevoTrabajoForm.telefono}
                    onChange={(e) => setNuevoTrabajoForm({ ...nuevoTrabajoForm, telefono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Paquete de Servicio Contratado:
                </label>
                <select
                  value={nuevoTrabajoForm.paqueteId}
                  onChange={(e) => setNuevoTrabajoForm({ ...nuevoTrabajoForm, paqueteId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {PAQUETES_DETAILING.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — ${p.precioCLP.toLocaleString('es-CL')} CLP ({p.tiempoEstimado})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Notas / Áreas Críticas a Cuidar:
                </label>
                <textarea
                  rows="2"
                  placeholder="Ej: Cuidar polarizado luna trasera, manchas de barro en pasarruedas..."
                  value={nuevoTrabajoForm.notas}
                  onChange={(e) => setNuevoTrabajoForm({ ...nuevoTrabajoForm, notas: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNuevoTrabajoModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                >
                  Iniciar Trabajo (Desplegar 7 Fases)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
