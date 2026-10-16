'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import {
  getCitas,
  createCita,
  updateCitaStatus,
  deleteCita,
  isSupabaseConfigured
} from '../lib/supabase';
import { SERVICES, ZONES, whatsappUrl } from '../lib/config';

const ESTADOS = [
  { id: 'todos', label: 'Todas', color: 'bg-slate-800 text-slate-300' },
  { id: 'pendiente', label: 'Pendientes', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'confirmada', label: 'Confirmadas', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'en_taller', label: 'En Taller', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'completada', label: 'Completadas', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'cancelada', label: 'Canceladas', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

export default function TallerPage() {
  const [activeTab, setActiveTab] = useState('citas'); // 'citas' | 'ordenes' | 'vehiculos' | 'config'
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFecha, setFilterFecha] = useState('todas'); // 'todas' | 'hoy'

  // Modales
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [notasTemp, setNotasTemp] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Formulario nueva cita manual
  const [newForm, setNewForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    km: '',
    servicio: SERVICES[0] || 'Mantenciones por KM',
    fecha: new Date().toISOString().split('T')[0],
    horario: 'Mañana (9:00–13:00)',
    nombre: '',
    telefono: '',
    email: '',
    comuna: 'Santiago',
    direccion: '',
    comentario: '',
    notas_taller: ''
  });

  const [hasSupabase, setHasSupabase] = useState(false);

  useEffect(() => {
    setHasSupabase(isSupabaseConfigured());
    cargarCitas();
  }, []);

  async function cargarCitas() {
    setLoading(true);
    try {
      const data = await getCitas();
      setCitas(data || []);
    } catch (err) {
      console.error('Error cargando citas:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCambiarEstado(id, nuevoEstado) {
    try {
      await updateCitaStatus(id, nuevoEstado);
      setCitas(prev =>
        prev.map(c => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
      if (selectedCita && selectedCita.id === id) {
        setSelectedCita(prev => ({ ...prev, estado: nuevoEstado }));
      }
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  }

  async function handleGuardarNotas() {
    if (!selectedCita) return;
    setSavingNote(true);
    try {
      await updateCitaStatus(selectedCita.id, selectedCita.estado, notasTemp);
      setCitas(prev =>
        prev.map(c => (c.id === selectedCita.id ? { ...c, notas_taller: notasTemp } : c))
      );
      setSelectedCita(prev => ({ ...prev, notas_taller: notasTemp }));
    } catch (err) {
      console.error('Error guardando notas:', err);
    } finally {
      setSavingNote(false);
    }
  }

  async function handleEliminarCita(id) {
    if (!confirm('¿Estás seguro de eliminar este agendamiento?')) return;
    try {
      await deleteCita(id);
      setCitas(prev => prev.filter(c => c.id !== id));
      if (selectedCita?.id === id) setSelectedCita(null);
    } catch (err) {
      console.error('Error eliminando cita:', err);
    }
  }

  async function handleCrearCitaManual(e) {
    e.preventDefault();
    if (!newForm.patente || !newForm.nombre || !newForm.telefono) {
      alert('Por favor completa al menos Patente, Nombre y Teléfono');
      return;
    }

    try {
      const created = await createCita({
        ...newForm,
        estado: 'confirmada'
      });
      setCitas(prev => [created, ...prev]);
      setShowNewModal(false);
      setNewForm({
        patente: '',
        marca: '',
        modelo: '',
        km: '',
        servicio: SERVICES[0] || 'Mantenciones por KM',
        fecha: new Date().toISOString().split('T')[0],
        horario: 'Mañana (9:00–13:00)',
        nombre: '',
        telefono: '',
        email: '',
        comuna: 'Santiago',
        direccion: '',
        comentario: '',
        notas_taller: ''
      });
    } catch (err) {
      console.error('Error creando cita:', err);
      alert('Hubo un error al registrar la cita.');
    }
  }

  const hoyStr = new Date().toISOString().split('T')[0];

  // Métricas
  const kpis = useMemo(() => {
    return {
      total: citas.length,
      pendientes: citas.filter(c => c.estado === 'pendiente').length,
      confirmadas: citas.filter(c => c.estado === 'confirmada').length,
      enTaller: citas.filter(c => c.estado === 'en_taller').length,
      hoy: citas.filter(c => c.fecha === hoyStr).length
    };
  }, [citas, hoyStr]);

  // Citas filtradas
  const citasFiltradas = useMemo(() => {
    return citas.filter(c => {
      // Filtro de estado
      if (filterEstado !== 'todos' && c.estado !== filterEstado) return false;
      // Filtro de fecha
      if (filterFecha === 'hoy' && c.fecha !== hoyStr) return false;
      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchPatente = (c.patente || '').toLowerCase().includes(query);
        const matchNombre = (c.nombre || '').toLowerCase().includes(query);
        const matchTelefono = (c.telefono || '').toLowerCase().includes(query);
        const matchVehiculo = `${c.marca || ''} ${c.modelo || ''}`.toLowerCase().includes(query);
        const matchServicio = (c.servicio || '').toLowerCase().includes(query);
        return matchPatente || matchNombre || matchTelefono || matchVehiculo || matchServicio;
      }
      return true;
    });
  }, [citas, filterEstado, filterFecha, searchQuery, hoyStr]);

  function abrirWhatsAppCliente(cita) {
    const msg = `Hola ${cita.nombre}, te contactamos desde el taller de AutoBooking respecto a tu cita para el vehículo ${cita.marca} ${cita.modelo} (Patente: ${cita.patente}) programada para el ${cita.fecha} (${cita.horario}). ¿En qué te podemos ayudar?`;
    window.open(`https://wa.me/${(cita.telefono || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 relative">
      <Navbar />

      {/* HEADER TALLER */}
      <header className="bg-gradient-to-b from-cyan-950/70 via-slate-900 to-slate-950 border-b border-slate-800/80 pt-8 pb-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold bg-cyan-950 border border-cyan-800 text-cyan-400 px-3 py-0.5 rounded-full">
                🔧 Operaciones & Taller
              </span>
              {hasSupabase ? (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase Conectado
                </span>
              ) : (
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-xs font-medium text-amber-400 bg-amber-950/50 border border-amber-800/50 hover:bg-amber-900/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Haz clic para ver cómo conectar con tu base de datos Supabase"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Modo Local Activo (Conectar Supabase)
                </button>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Gestión de <span className="text-cyan-400">AutoBooking</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Administración de agendamientos, vehículos y órdenes del taller en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={cargarCitas}
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title="Recargar citas"
            >
              <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
              Actualizar
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
            >
              <span>➕</span>
              Nueva Cita
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS DEL PANEL */}
        <div className="max-w-6xl mx-auto mt-6 flex gap-2 border-b border-slate-800 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('citas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'citas'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📅</span>
            Citas y Agenda
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {citas.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ordenes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ordenes'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📋</span>
            Órdenes de Trabajo (OT)
          </button>

          <button
            onClick={() => setActiveTab('vehiculos')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'vehiculos'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚗</span>
            Historial por Patente
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚙️</span>
            Conexión Supabase
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* 1. VISTA DE CITAS Y AGENDAMIENTOS */}
        {activeTab === 'citas' && (
          <div className="space-y-6">

            {/* TARJETAS KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div
                onClick={() => { setFilterEstado('todos'); setFilterFecha('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Citas</div>
                <div className="text-2xl font-extrabold text-white">{kpis.total}</div>
                <div className="text-[11px] text-slate-500 mt-1">Registradas</div>
              </div>

              <div
                onClick={() => { setFilterEstado('pendiente'); setFilterFecha('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Pendientes</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300">{kpis.pendientes}</div>
                <div className="text-[11px] text-amber-400/70 mt-1">Por confirmar</div>
              </div>

              <div
                onClick={() => { setFilterEstado('confirmada'); setFilterFecha('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Confirmadas</div>
                <div className="text-2xl font-extrabold text-blue-300">{kpis.confirmadas}</div>
                <div className="text-[11px] text-slate-500 mt-1">Agendadas firmes</div>
              </div>

              <div
                onClick={() => { setFilterEstado('en_taller'); setFilterFecha('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">En Taller</div>
                <div className="text-2xl font-extrabold text-cyan-300">{kpis.enTaller}</div>
                <div className="text-[11px] text-slate-500 mt-1">En atención</div>
              </div>

              <div
                onClick={() => { setFilterFecha('hoy'); setFilterEstado('todos'); }}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition-all col-span-2 sm:col-span-1"
              >
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Para Hoy</div>
                <div className="text-2xl font-extrabold text-emerald-300">{kpis.hoy}</div>
                <div className="text-[11px] text-slate-500 mt-1">{hoyStr}</div>
              </div>
            </div>

            {/* FILTROS Y BÚSQUEDA */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              {/* Barra de búsqueda */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por patente, cliente, teléfono o auto..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Botones de filtro de estado */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {ESTADOS.map(est => (
                  <button
                    key={est.id}
                    onClick={() => setFilterEstado(est.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterEstado === est.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {est.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTADO DE CITAS */}
            {loading ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <div className="text-3xl mb-2 animate-spin inline-block">🔄</div>
                <p>Cargando agendamientos...</p>
              </div>
            ) : citasFiltradas.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">🚗</div>
                <h3 className="text-lg font-bold text-white mb-1">No se encontraron agendamientos</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  {searchQuery || filterEstado !== 'todos'
                    ? 'No hay citas que coincidan con los filtros seleccionados.'
                    : 'Aún no hay citas registradas. Los agendamientos que hagan los clientes en la web aparecerán aquí automáticamente.'}
                </p>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Registrar primera cita manual
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {citasFiltradas.map(cita => {
                  const estadoObj = ESTADOS.find(e => e.id === cita.estado) || ESTADOS[1];
                  const esHoy = cita.fecha === hoyStr;

                  return (
                    <div
                      key={cita.id}
                      className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-700 shadow-sm ${
                        cita.estado === 'pendiente'
                          ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/10'
                          : 'border-slate-800'
                      }`}
                    >
                      {/* Cabecera de la tarjeta: Patente + Estado */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {/* Patente formato placa patente */}
                          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-mono font-bold tracking-widest text-sm shadow-inner">
                            <span className="text-[10px] text-cyan-400 mr-1.5 font-sans font-extrabold">CL</span>
                            {cita.patente || 'S/PATENTE'}
                          </div>

                          {/* Badge estado */}
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${estadoObj.color}`}>
                            {estadoObj.label}
                          </span>
                        </div>

                        {/* Datos del Vehículo */}
                        <h4 className="text-base font-bold text-white mb-1">
                          {cita.marca} {cita.modelo}
                          {cita.km && (
                            <span className="text-xs font-normal text-slate-400 ml-2">
                              ({Number(cita.km).toLocaleString('es-CL')} km)
                            </span>
                          )}
                        </h4>

                        {/* Servicio solicitado */}
                        <div className="text-xs font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
                          <span>🔧</span>
                          <span>{cita.servicio}</span>
                        </div>

                        {/* Fecha y Horario */}
                        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 mb-3 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-500">Fecha:</span>
                            <span className={`font-semibold ${esHoy ? 'text-emerald-400' : 'text-slate-200'}`}>
                              {cita.fecha} {esHoy && '(Hoy)'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-500">Horario:</span>
                            <span className="font-semibold text-slate-200">{cita.horario}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-500">Comuna:</span>
                            <span className="font-semibold text-slate-200">{cita.comuna || 'No indicada'}</span>
                          </div>
                        </div>

                        {/* Datos del Cliente */}
                        <div className="text-xs text-slate-300 space-y-1 mb-3">
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>👤</span>
                            <span>{cita.nombre}</span>
                          </div>
                          <div className="text-slate-400 flex items-center justify-between">
                            <span>📞 {cita.telefono}</span>
                            <button
                              onClick={() => abrirWhatsAppCliente(cita)}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                              title="Abrir chat en WhatsApp"
                            >
                              <span>💬 WhatsApp</span>
                            </button>
                          </div>
                          {cita.comentario && (
                            <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 mt-2 italic">
                              &ldquo;{cita.comentario}&rdquo;
                            </p>
                          )}
                          {cita.notas_taller && (
                            <div className="text-[11px] text-cyan-300 bg-cyan-950/30 border border-cyan-800/30 p-2 rounded-lg mt-2">
                              <strong>Nota taller:</strong> {cita.notas_taller}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botones de acción rápida por tarjeta */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        {/* Selector rápido de estado */}
                        <div className="flex gap-1.5">
                          {cita.estado === 'pendiente' && (
                            <button
                              onClick={() => handleCambiarEstado(cita.id, 'confirmada')}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ✓ Confirmar Cita
                            </button>
                          )}
                          {cita.estado === 'confirmada' && (
                            <button
                              onClick={() => handleCambiarEstado(cita.id, 'en_taller')}
                              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              🚘 Ingresar a Taller
                            </button>
                          )}
                          {cita.estado === 'en_taller' && (
                            <button
                              onClick={() => handleCambiarEstado(cita.id, 'completada')}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ✅ Marcar Listo
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedCita(cita);
                              setNotasTemp(cita.notas_taller || '');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Detalle / Notas
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. VISTA DE ÓRDENES DE TRABAJO (OT) */}
        {activeTab === 'ordenes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-3xl mx-auto mb-4">
              📋
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Órdenes de Trabajo (OT)</h3>
            <p className="text-slate-300 text-sm mb-6 max-w-lg mx-auto">
              Este módulo permitirá convertir cualquier cita confirmada en una orden de trabajo con checklist técnico, repuestos utilizados, costo total y firma de entrega.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-cyan-400 font-bold text-sm mb-1">1. Checklist de Ingreso</div>
                <div className="text-xs text-slate-400">Inspección de daños, nivel de combustible y pertenencias.</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-cyan-400 font-bold text-sm mb-1">2. Repuestos y Horas</div>
                <div className="text-xs text-slate-400">Cálculo de mano de obra y repuestos automáticos.</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-cyan-400 font-bold text-sm mb-1">3. Hoja de Entrega</div>
                <div className="text-xs text-slate-400">PDF de garantía y resumen para el cliente.</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('citas')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Volver a Citas y Agenda
            </button>
          </div>
        )}

        {/* 3. VISTA DE HISTORIAL POR PATENTE */}
        {activeTab === 'vehiculos' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-950 border border-violet-800 flex items-center justify-center text-2xl">
                🚗
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Historial de Vehículos por Patente</h3>
                <p className="text-xs text-slate-400">Consulta el historial de servicios realizados a cada vehículo que ha visitado el taller.</p>
              </div>
            </div>

            {/* Selector de patentes registradas */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Patentes registradas recientemente</h4>
              {citas.length === 0 ? (
                <p className="text-xs text-slate-500">No hay vehículos registrados aún.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from(new Set(citas.map(c => c.patente))).filter(Boolean).map(patente => {
                    const citasAuto = citas.filter(c => c.patente === patente);
                    const ultimo = citasAuto[0];
                    return (
                      <div key={patente} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <div className="font-mono font-bold text-cyan-400 tracking-wider text-sm">{patente}</div>
                          <div className="text-xs text-slate-300 mt-0.5">{ultimo.marca} {ultimo.modelo}</div>
                          <div className="text-[11px] text-slate-500">{citasAuto.length} servicio(s) registrado(s)</div>
                        </div>
                        <button
                          onClick={() => {
                            setSearchQuery(patente);
                            setActiveTab('citas');
                          }}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          Ver Citas
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. VISTA DE CONFIGURACIÓN / SUPABASE */}
        {activeTab === 'config' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Configuración de Base de Datos Supabase</h3>
                <p className="text-xs text-slate-400">Conecta tu base de datos PostgreSQL en la nube para sincronizar todos los agendamientos.</p>
              </div>
            </div>

            {/* Estado actual */}
            <div className={`p-4 rounded-2xl border ${hasSupabase ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-amber-950/40 border-amber-800/60'}`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <span>{hasSupabase ? '🟢' : '🟡'}</span>
                <span className={hasSupabase ? 'text-emerald-300' : 'text-amber-300'}>
                  {hasSupabase ? 'Supabase conectado correctamente' : 'Operando en Modo Local (LocalStorage)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {hasSupabase
                  ? 'Todas las citas y cambios de estado se guardan directamente en tu base de datos Supabase en tiempo real.'
                  : 'Las citas se guardan en el navegador. Para que los agendamientos se sincronicen entre múltiples computadores y celulares, configura tu proyecto Supabase gratuito siguiendo los pasos a continuación.'}
              </p>
            </div>

            {/* Pasos para conectar */}
            <div className="space-y-4 text-xs text-slate-300">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Pasos para conectar Supabase (Gratis):</h4>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">Paso 1: Crear proyecto en Supabase</div>
                <p className="text-slate-400">
                  Ingresa a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">supabase.com</a>, crea una cuenta gratis y crea un nuevo proyecto llamado <strong>AutoBooking</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">Paso 2: Ejecutar el script SQL</div>
                <p className="text-slate-400">
                  En el menú lateral de Supabase, ve a <strong>SQL Editor</strong>, abre una nueva consulta y pega el contenido del archivo <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">supabase_schema.sql</code> que dejamos en la raíz de tu proyecto. Luego haz clic en <strong>Run</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">Paso 3: Copiar las credenciales a .env.local</div>
                <p className="text-slate-400">
                  Ve a <strong>Project Settings → API</strong> en Supabase y copia la <strong>URL del proyecto</strong> y la <strong>anon public key</strong>. Pégalas en tu archivo <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">.env.local</code>:
                </p>
                <pre className="bg-slate-900 p-3 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL DETALLE DE CITA & NOTAS TALLER */}
      {selectedCita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Botón cerrar */}
            <button
              onClick={() => setSelectedCita(null)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="font-mono font-bold text-lg bg-slate-950 border border-slate-700 px-3 py-1 rounded-lg text-slate-100 tracking-wider">
                <span className="text-xs text-cyan-400 mr-2 font-sans">CL</span>
                {selectedCita.patente || 'S/PATENTE'}
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ESTADOS.find(e => e.id === selectedCita.estado)?.color}`}>
                {ESTADOS.find(e => e.id === selectedCita.estado)?.label}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {selectedCita.marca} {selectedCita.modelo}
            </h3>
            <p className="text-sm text-cyan-400 font-semibold mb-6">
              Servicio: {selectedCita.servicio}
            </p>

            {/* Grid datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs mb-6">
              <div>
                <span className="text-slate-500 block">Cliente:</span>
                <span className="font-bold text-slate-200 text-sm">{selectedCita.nombre}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Teléfono:</span>
                <span className="font-bold text-slate-200 text-sm">{selectedCita.telefono}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Fecha y Horario:</span>
                <span className="font-semibold text-slate-200">{selectedCita.fecha} ({selectedCita.horario})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Comuna / Dirección:</span>
                <span className="font-semibold text-slate-200">{selectedCita.comuna} {selectedCita.direccion ? `— ${selectedCita.direccion}` : ''}</span>
              </div>
              {selectedCita.km && (
                <div>
                  <span className="text-slate-500 block">Kilometraje:</span>
                  <span className="font-semibold text-slate-200">{Number(selectedCita.km).toLocaleString('es-CL')} km</span>
                </div>
              )}
              {selectedCita.email && (
                <div>
                  <span className="text-slate-500 block">Correo electrónico:</span>
                  <span className="font-semibold text-slate-200">{selectedCita.email}</span>
                </div>
              )}
            </div>

            {selectedCita.comentario && (
              <div className="mb-6">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Comentario del cliente:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                  &ldquo;{selectedCita.comentario}&rdquo;
                </div>
              </div>
            )}

            {/* Notas internas del taller */}
            <div className="mb-6">
              <label className="text-xs text-cyan-400 font-bold block mb-1.5 flex items-center justify-between">
                <span>Notas Internas del Taller (Mecánico asignado, repuestos, cotización):</span>
              </label>
              <textarea
                value={notasTemp}
                onChange={e => setNotasTemp(e.target.value)}
                placeholder="Escribe notas de trabajo, mecánicos asignados o repuestos requeridos..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 min-h-[90px]"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleGuardarNotas}
                  disabled={savingNote}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {savingNote ? 'Guardando...' : 'Guardar Notas'}
                </button>
              </div>
            </div>

            {/* Cambio de Estado */}
            <div className="border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-400 font-semibold block mb-2">Cambiar estado del agendamiento:</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {ESTADOS.filter(e => e.id !== 'todos').map(est => (
                  <button
                    key={est.id}
                    onClick={() => handleCambiarEstado(selectedCita.id, est.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCita.estado === est.id
                        ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {est.label}
                  </button>
                ))}
              </div>

              {/* Botones inferiores */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleEliminarCita(selectedCita.id)}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Eliminar Agendamiento
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirWhatsAppCliente(selectedCita)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>💬</span>
                    Contactar Cliente
                  </button>
                  <button
                    onClick={() => setSelectedCita(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVA CITA MANUAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-white mb-1">Registrar Cita en Taller</h3>
            <p className="text-xs text-slate-400 mb-6">Ingresa los datos del cliente y vehículo para agendar directamente en el sistema.</p>

            <form onSubmit={handleCrearCitaManual} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Patente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: ABCD-12"
                    value={newForm.patente}
                    onChange={e => setNewForm({ ...newForm, patente: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Kilometraje</label>
                  <input
                    type="number"
                    placeholder="Ej: 50000"
                    value={newForm.km}
                    onChange={e => setNewForm({ ...newForm, km: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Toyota"
                    value={newForm.marca}
                    onChange={e => setNewForm({ ...newForm, marca: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: RAV4"
                    value={newForm.modelo}
                    onChange={e => setNewForm({ ...newForm, modelo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Servicio *</label>
                <select
                  value={newForm.servicio}
                  onChange={e => setNewForm({ ...newForm, servicio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {SERVICES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={newForm.fecha}
                    onChange={e => setNewForm({ ...newForm, fecha: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Horario *</label>
                  <select
                    value={newForm.horario}
                    onChange={e => setNewForm({ ...newForm, horario: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option>Mañana (9:00–13:00)</option>
                    <option>Tarde (14:00–19:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nombre Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={newForm.nombre}
                    onChange={e => setNewForm({ ...newForm, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Teléfono Cliente *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={newForm.telefono}
                    onChange={e => setNewForm({ ...newForm, telefono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Comuna</label>
                  <input
                    type="text"
                    placeholder="Ej: Providencia"
                    value={newForm.comuna}
                    onChange={e => setNewForm({ ...newForm, comuna: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={newForm.email}
                    onChange={e => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Notas internas del taller</label>
                <textarea
                  placeholder="Mecánico a cargo, observaciones..."
                  value={newForm.notas_taller}
                  onChange={e => setNewForm({ ...newForm, notas_taller: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[70px]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-colors cursor-pointer"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
