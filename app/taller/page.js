'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import DetailingWorkstation from '../components/DetailingWorkstation';
import {
  getCitas,
  createCita,
  updateCitaStatus,
  deleteCita,
  getOrdenes,
  createOrden,
  updateOrden,
  deleteOrden,
  isSupabaseConfigured,
  getStoreOrders,
  updateStoreOrderStatus,
  deleteStoreOrder,
  convertStoreOrderToOT,
  getInventory,
  updateInventoryStock,
  adjustInventoryStock,
  signInOwner,
  signUpOwner,
  signOutOwner,
  getCurrentOwnerSession,
  DEMO_TALLERES
} from '../lib/supabase';
import { SERVICES, ZONES, whatsappUrl } from '../lib/config';

// Estados de Citas
const ESTADOS_CITAS = [
  { id: 'todos', label: 'Todas', color: 'bg-slate-800 text-slate-300' },
  { id: 'pendiente', label: 'Pendientes', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'confirmada', label: 'Confirmadas', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'en_taller', label: 'En Taller', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'completada', label: 'Completadas', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'cancelada', label: 'Canceladas', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

// Estados de Órdenes de Trabajo (OT)
const ESTADOS_OT = [
  { id: 'todos', label: 'Todas', color: 'bg-slate-800 text-slate-300' },
  { id: 'ingresado', label: 'Ingresado', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'en_proceso', label: 'En Proceso', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'espera_repuestos', label: 'Espera Repuestos', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'listo_entrega', label: 'Listo Entrega', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'entregado', label: 'Entregado', color: 'bg-slate-700 text-slate-300 border-slate-600' },
];

const MECANICOS_TALLER = ['Carlos Henríquez', 'Andrés Silva', 'Matías Morales', 'Roberto Díaz'];

export default function TallerPage() {
  const [activeTab, setActiveTab] = useState('citas'); // 'citas' | 'ordenes' | 'vehiculos' | 'config'
  const [hasSupabase, setHasSupabase] = useState(false);

  // ==========================================
  // ESTADOS - AUTENTICACIÓN MULTI-TENANT
  // ==========================================
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Registro de nuevo taller
  const [regNombre, setRegNombre] = useState('');
  const [regTallerNombre, setRegTallerNombre] = useState('');
  const [regTelefono, setRegTelefono] = useState('+569');
  const [regComuna, setRegComuna] = useState('Santiago');
  const [regSlug, setRegSlug] = useState('');

  // ==========================================
  // ESTADOS - CITAS
  // ==========================================
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [filterEstadoCita, setFilterEstadoCita] = useState('todos');
  const [searchQueryCita, setSearchQueryCita] = useState('');
  const [filterFechaCita, setFilterFechaCita] = useState('todas'); // 'todas' | 'hoy'
  const [showNewCitaModal, setShowNewCitaModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [notasCitaTemp, setNotasCitaTemp] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const [newCitaForm, setNewCitaForm] = useState({
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

  // ==========================================
  // ESTADOS - ÓRDENES DE TRABAJO (OT)
  // ==========================================
  const [ordenes, setOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);
  const [filterEstadoOT, setFilterEstadoOT] = useState('todos');
  const [searchQueryOT, setSearchQueryOT] = useState('');
  const [selectedOT, setSelectedOT] = useState(null);
  const [showNewOTModal, setShowNewOTModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printOTData, setPrintOTData] = useState(null);

  const initialOTForm = {
    cita_id: null,
    patente: '',
    marca: '',
    modelo: '',
    ano: '2020',
    km: '',
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    mecanico_asignado: MECANICOS_TALLER[0],
    estado: 'ingresado',
    diagnostico: '',
    trabajos: [
      { id: 't-1', descripcion: 'Revisión técnica de ingreso e inspección', precio: 20000, completado: false }
    ],
    repuestos: [],
    checklist: {
      luces: true,
      combustible: '1/2',
      ruedaRepuesto: true,
      rayones: 'Sin observaciones de ingreso',
      documentos: true
    },
    fecha_estimada: new Date().toISOString().split('T')[0],
    notas_internas: ''
  };

  const [newOTForm, setNewOTForm] = useState(initialOTForm);

  // Estados temporales para agregar trabajo/repuesto en modal OT
  const [nuevoTrabajoDesc, setNuevoTrabajoDesc] = useState('');
  const [nuevoTrabajoPrecio, setNuevoTrabajoPrecio] = useState('');
  const [nuevoRepuestoNombre, setNuevoRepuestoNombre] = useState('');
  const [nuevoRepuestoCant, setNuevoRepuestoCant] = useState('1');
  const [nuevoRepuestoPrecio, setNuevoRepuestoPrecio] = useState('');

  // ==========================================
  // ESTADOS - HISTORIAL DE VEHÍCULOS
  // ==========================================
  const [patenteSeleccionada, setPatenteSeleccionada] = useState('');
  const [busquedaHistorial, setBusquedaHistorial] = useState('');

  // ==========================================
  // ESTADOS - FIDELIZACIÓN & RECORDATORIOS
  // ==========================================
  const [filterFidelizacion, setFilterFidelizacion] = useState('requieren_atencion');
  const [contactadosMap, setContactadosMap] = useState({});
  const [busquedaFidelizacion, setBusquedaFidelizacion] = useState('');
  const [modalEditarMensaje, setModalEditarMensaje] = useState(null);

  // ==========================================
  // ESTADOS - PEDIDOS DE TIENDA & BATERÍAS
  // ==========================================
  const [pedidosTienda, setPedidosTienda] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [filterEstadoPedido, setFilterEstadoPedido] = useState('todos');
  const [searchQueryPedido, setSearchQueryPedido] = useState('');
  const [modalConvertirOT, setModalConvertirOT] = useState(null);
  const [mecanicoSeleccionadoParaOT, setMecanicoSeleccionadoParaOT] = useState(MECANICOS_TALLER[0]);

  // ==========================================
  // ESTADOS - INVENTARIO DE BATERÍAS & REPUESTOS
  // ==========================================
  const [inventarioList, setInventarioList] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(true);
  const [filterCategoriaInv, setFilterCategoriaInv] = useState('todas');
  const [searchQueryInv, setSearchQueryInv] = useState('');

  // ==========================================
  // CARGA INICIAL & MULTI-TENANT
  // ==========================================
  useEffect(() => {
    setHasSupabase(isSupabaseConfigured());
    initAuthAndData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  async function initAuthAndData() {
    setCheckingAuth(true);
    try {
      const sess = await getCurrentOwnerSession();
      if (sess) {
        setSession(sess);
        await cargarDatos(sess.taller?.id);
      }
    } catch (err) {
      console.warn('Error verificando sesión previa:', err);
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleLogin(e) {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const sess = await signInOwner(authEmail, authPassword);
      setSession(sess);
      await cargarDatos(sess.taller?.id);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setAuthError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleDemoLogin(tallerDemo) {
    setAuthLoading(true);
    setAuthError('');
    try {
      const demoSess = {
        user: { id: `user-${tallerDemo.slug}`, email: tallerDemo.email, user_metadata: { nombre: 'Dueño de Taller' } },
        taller: tallerDemo,
        rol: 'dueno'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('autobooking_owner_session', JSON.stringify(demoSess));
      }
      setSession(demoSess);
      await cargarDatos(tallerDemo.id);
    } catch (err) {
      setAuthError('Error accediendo a demo');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!regTallerNombre.trim() || !authEmail.trim() || !authPassword.trim()) {
      setAuthError('Por favor completa todos los campos requeridos.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const cleanSlug = regSlug.trim() || regTallerNombre.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const sess = await signUpOwner({
        email: authEmail,
        password: authPassword,
        nombre: regNombre || 'Dueño de Taller',
        tallerNombre: regTallerNombre,
        telefono: regTelefono,
        comuna: regComuna,
        slug: cleanSlug
      });
      setSession(sess);
      await cargarDatos(sess.taller?.id);
    } catch (err) {
      console.error('Error en registro:', err);
      setAuthError(err.message || 'Error registrando el taller.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await signOutOwner();
    setSession(null);
    setCitas([]);
    setOrdenes([]);
  }

  function handleCopyBookingLink() {
    if (!session?.taller?.slug) return;
    const url = `${window.location.origin}/${session.taller.slug}/agendar`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  async function cargarDatos(tallerId = null) {
    const tid = tallerId || session?.taller?.id;
    await Promise.all([cargarCitas(tid), cargarOrdenes(tid), cargarPedidos(), cargarInventario()]);
  }

  async function cargarPedidos() {
    setLoadingPedidos(true);
    try {
      const data = await getStoreOrders();
      setPedidosTienda(data || []);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    } finally {
      setLoadingPedidos(false);
    }
  }

  async function cargarInventario() {
    setLoadingInventario(true);
    try {
      const data = await getInventory();
      setInventarioList(data || []);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    } finally {
      setLoadingInventario(false);
    }
  }

  async function cargarCitas(tallerId = null) {
    setLoadingCitas(true);
    try {
      const tid = tallerId || session?.taller?.id;
      const data = await getCitas(tid);
      setCitas(data || []);
    } catch (err) {
      console.error('Error cargando citas:', err);
    } finally {
      setLoadingCitas(false);
    }
  }

  async function cargarOrdenes(tallerId = null) {
    setLoadingOrdenes(true);
    try {
      const tid = tallerId || session?.taller?.id;
      const data = await getOrdenes(tid);
      setOrdenes(data || []);
    } catch (err) {
      console.error('Error cargando órdenes:', err);
    } finally {
      setLoadingOrdenes(false);
    }
  }

  // ==========================================
  // ACCIONES - CITAS
  // ==========================================
  async function handleCambiarEstadoCita(id, nuevoEstado) {
    try {
      await updateCitaStatus(id, nuevoEstado);
      setCitas(prev =>
        prev.map(c => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
      if (selectedCita && selectedCita.id === id) {
        setSelectedCita(prev => ({ ...prev, estado: nuevoEstado }));
      }
    } catch (err) {
      console.error('Error actualizando estado cita:', err);
    }
  }

  async function handleGuardarNotasCita() {
    if (!selectedCita) return;
    setSavingNote(true);
    try {
      await updateCitaStatus(selectedCita.id, selectedCita.estado, notasCitaTemp);
      setCitas(prev =>
        prev.map(c => (c.id === selectedCita.id ? { ...c, notas_taller: notasCitaTemp } : c))
      );
      setSelectedCita(prev => ({ ...prev, notas_taller: notasCitaTemp }));
    } catch (err) {
      console.error('Error guardando notas cita:', err);
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
    if (!newCitaForm.patente || !newCitaForm.nombre || !newCitaForm.telefono) {
      alert('Por favor completa al menos Patente, Nombre y Teléfono');
      return;
    }

    try {
      const created = await createCita({
        ...newCitaForm,
        estado: 'confirmada'
      }, session?.taller?.id);
      setCitas(prev => [created, ...prev]);
      setShowNewCitaModal(false);
      setNewCitaForm({
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

  // Generar Orden de Trabajo automáticamente a partir de una Cita
  function handleGenerarOTDesdeCita(cita) {
    setNewOTForm({
      cita_id: cita.id,
      patente: cita.patente,
      marca: cita.marca,
      modelo: cita.modelo,
      ano: '',
      km: cita.km || '',
      cliente_nombre: cita.nombre,
      cliente_telefono: cita.telefono,
      cliente_email: cita.email || '',
      mecanico_asignado: MECANICOS_TALLER[0],
      estado: 'ingresado',
      diagnostico: cita.comentario
        ? `Servicio: ${cita.servicio}. Observación del cliente: "${cita.comentario}"`
        : `Servicio solicitado: ${cita.servicio}`,
      trabajos: [
        {
          id: 't-' + Date.now(),
          descripcion: `Ejecución de servicio: ${cita.servicio}`,
          precio: 35000,
          completado: false
        }
      ],
      repuestos: [],
      checklist: {
        luces: true,
        combustible: '1/2',
        ruedaRepuesto: true,
        rayones: 'Sin observaciones de ingreso',
        documentos: true
      },
      fecha_estimada: cita.fecha,
      notas_internas: `Generada automáticamente desde cita #${cita.id.slice(-6)}`
    });

    // Actualizar la cita a "en_taller"
    handleCambiarEstadoCita(cita.id, 'en_taller');
    setShowNewOTModal(true);
    setActiveTab('ordenes');
  }

  // ==========================================
  // ACCIONES - ÓRDENES DE TRABAJO
  // ==========================================
  async function handleCrearOT(e) {
    e.preventDefault();
    if (!newOTForm.patente || !newOTForm.cliente_nombre) {
      alert('Por favor completa al menos Patente y Nombre de cliente.');
      return;
    }

    try {
      const created = await createOrden(newOTForm, session?.taller?.id);
      setOrdenes(prev => [created, ...prev]);
      setShowNewOTModal(false);
      setNewOTForm(initialOTForm);
    } catch (err) {
      console.error('Error creando OT:', err);
      alert('Error creando la Orden de Trabajo');
    }
  }

  async function handleCambiarEstadoOT(id, nuevoEstado) {
    try {
      const updated = await updateOrden(id, { estado: nuevoEstado });
      setOrdenes(prev => prev.map(o => (o.id === id ? { ...o, estado: nuevoEstado } : o)));
      if (selectedOT?.id === id) {
        setSelectedOT(prev => ({ ...prev, estado: nuevoEstado }));
      }
    } catch (err) {
      console.error('Error actualizando estado OT:', err);
    }
  }

  async function handleToggleTrabajoOT(otId, trabajoId) {
    const ot = ordenes.find(o => o.id === otId);
    if (!ot) return;
    const updatedTrabajos = (ot.trabajos || []).map(t =>
      t.id === trabajoId ? { ...t, completado: !t.completado } : t
    );
    try {
      await updateOrden(otId, { trabajos: updatedTrabajos });
      setOrdenes(prev => prev.map(o => (o.id === otId ? { ...o, trabajos: updatedTrabajos } : o)));
      if (selectedOT?.id === otId) {
        setSelectedOT(prev => ({ ...prev, trabajos: updatedTrabajos }));
      }
    } catch (err) {
      console.error('Error actualizando trabajo:', err);
    }
  }

  async function handleAgregarTrabajoEnSelectedOT() {
    if (!nuevoTrabajoDesc.trim()) return;
    const nuevo = {
      id: 't-' + Date.now(),
      descripcion: nuevoTrabajoDesc.trim(),
      precio: Number(nuevoTrabajoPrecio) || 0,
      completado: false
    };
    const updatedTrabajos = [...(selectedOT.trabajos || []), nuevo];
    try {
      const updated = await updateOrden(selectedOT.id, { trabajos: updatedTrabajos });
      setOrdenes(prev => prev.map(o => (o.id === selectedOT.id ? updated : o)));
      setSelectedOT(updated);
      setNuevoTrabajoDesc('');
      setNuevoTrabajoPrecio('');
    } catch (err) {
      console.error('Error agregando trabajo:', err);
    }
  }

  async function handleAgregarRepuestoEnSelectedOT() {
    if (!nuevoRepuestoNombre.trim()) return;
    const nuevo = {
      id: 'r-' + Date.now(),
      repuesto: nuevoRepuestoNombre.trim(),
      cantidad: Number(nuevoRepuestoCant) || 1,
      precio: Number(nuevoRepuestoPrecio) || 0
    };
    const updatedRepuestos = [...(selectedOT.repuestos || []), nuevo];
    try {
      const updated = await updateOrden(selectedOT.id, { repuestos: updatedRepuestos });
      setOrdenes(prev => prev.map(o => (o.id === selectedOT.id ? updated : o)));
      setSelectedOT(updated);
      setNuevoRepuestoNombre('');
      setNuevoRepuestoCant('1');
      setNuevoRepuestoPrecio('');
    } catch (err) {
      console.error('Error agregando repuesto:', err);
    }
  }

  async function handleEliminarOT(id) {
    if (!confirm('¿Seguro que deseas eliminar esta Orden de Trabajo?')) return;
    try {
      await deleteOrden(id);
      setOrdenes(prev => prev.filter(o => o.id !== id));
      if (selectedOT?.id === id) setSelectedOT(null);
    } catch (err) {
      console.error('Error eliminando OT:', err);
    }
  }

  function handleImprimirOT(ot) {
    setPrintOTData(ot);
    setShowPrintModal(true);
    setTimeout(() => {
      window.print();
    }, 400);
  }

  function notificarOTPorWhatsApp(ot) {
    let estadoTexto = 'se encuentra en revisión técnica';
    if (ot.estado === 'en_proceso') estadoTexto = 'está actualmente en reparación y mantención en taller';
    if (ot.estado === 'espera_repuestos') estadoTexto = 'está en espera de repuestos específicos autorizados';
    if (ot.estado === 'listo_entrega') estadoTexto = 'está ¡LISTO PARA ENTREGA! Puedes pasar a retirarlo';
    if (ot.estado === 'entregado') estadoTexto = 'ha sido entregado exitosamente. ¡Gracias por confiar en AutoBooking!';

    const totalClp = Number(ot.total_general || 0).toLocaleString('es-CL');
    const msg = `Hola ${ot.cliente_nombre}, te informamos desde el taller AutoBooking que tu orden de trabajo *${ot.numero_ot}* para el vehículo *${ot.marca} ${ot.modelo}* (${ot.patente}) ${estadoTexto}. Total presupuestado: $${totalClp} CLP. ¿Tienes alguna duda o consulta?`;
    window.open(`https://wa.me/${(ot.cliente_telefono || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // ==========================================
  // ACCIONES - PEDIDOS DE TIENDA & BATERÍAS
  // ==========================================
  async function handleCambiarEstadoPedido(id, nuevoEstado, mecanico = null) {
    try {
      const updated = await updateStoreOrderStatus(id, nuevoEstado, mecanico);
      setPedidosTienda(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      console.error('Error actualizando pedido:', err);
    }
  }

  async function handleEliminarPedido(id) {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
    try {
      await deleteStoreOrder(id);
      setPedidosTienda(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error eliminando pedido:', err);
    }
  }

  async function handleConfirmarConversionOT() {
    if (!modalConvertirOT) return;
    try {
      const nuevaOT = await convertStoreOrderToOT(modalConvertirOT.id, mecanicoSeleccionadoParaOT);
      setOrdenes(prev => [nuevaOT, ...prev]);
      setPedidosTienda(prev =>
        prev.map(p =>
          p.id === modalConvertirOT.id
            ? { ...p, ot_generada_id: nuevaOT.numero_ot, estado: 'en_preparacion', mecanico_asignado: mecanicoSeleccionadoParaOT }
            : p
        )
      );
      setModalConvertirOT(null);
      alert(`¡Orden de Trabajo ${nuevaOT.numero_ot} creada con éxito y asignada a ${mecanicoSeleccionadoParaOT}!`);
      setActiveTab('ordenes');
    } catch (err) {
      console.error('Error convirtiendo pedido a OT:', err);
      alert('Error convirtiendo pedido a Orden de Trabajo');
    }
  }

  // ==========================================
  // ACCIONES - CONTROL DE INVENTARIO
  // ==========================================
  async function handleAjustarStock(id, delta) {
    try {
      const updated = await adjustInventoryStock(id, delta);
      setInventarioList(prev => prev.map(i => (i.id === id ? updated : i)));
    } catch (err) {
      console.error('Error ajustando stock:', err);
    }
  }

  async function handleActualizarStock(id, nuevoStock) {
    try {
      const updated = await updateInventoryStock(id, nuevoStock);
      setInventarioList(prev => prev.map(i => (i.id === id ? updated : i)));
    } catch (err) {
      console.error('Error actualizando stock:', err);
    }
  }

  // ==========================================
  // FILTROS Y MEMOS
  // ==========================================
  const hoyStr = new Date().toISOString().split('T')[0];

  const kpisCitas = useMemo(() => {
    return {
      total: citas.length,
      pendientes: citas.filter(c => c.estado === 'pendiente').length,
      confirmadas: citas.filter(c => c.estado === 'confirmada').length,
      enTaller: citas.filter(c => c.estado === 'en_taller').length,
      hoy: citas.filter(c => c.fecha === hoyStr).length
    };
  }, [citas, hoyStr]);

  const citasFiltradas = useMemo(() => {
    return citas.filter(c => {
      if (filterEstadoCita !== 'todos' && c.estado !== filterEstadoCita) return false;
      if (filterFechaCita === 'hoy' && c.fecha !== hoyStr) return false;
      if (searchQueryCita.trim()) {
        const q = searchQueryCita.toLowerCase();
        return (
          (c.patente || '').toLowerCase().includes(q) ||
          (c.nombre || '').toLowerCase().includes(q) ||
          (c.telefono || '').toLowerCase().includes(q) ||
          `${c.marca || ''} ${c.modelo || ''}`.toLowerCase().includes(q) ||
          (c.servicio || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [citas, filterEstadoCita, filterFechaCita, searchQueryCita, hoyStr]);

  const kpisOT = useMemo(() => {
    return {
      total: ordenes.length,
      ingresado: ordenes.filter(o => o.estado === 'ingresado').length,
      enProceso: ordenes.filter(o => o.estado === 'en_proceso').length,
      esperaRepuestos: ordenes.filter(o => o.estado === 'espera_repuestos').length,
      listoEntrega: ordenes.filter(o => o.estado === 'listo_entrega').length,
      totalFacturado: ordenes.reduce((acc, o) => acc + (Number(o.total_general) || 0), 0)
    };
  }, [ordenes]);

  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter(o => {
      if (filterEstadoOT !== 'todos' && o.estado !== filterEstadoOT) return false;
      if (searchQueryOT.trim()) {
        const q = searchQueryOT.toLowerCase();
        return (
          (o.numero_ot || '').toLowerCase().includes(q) ||
          (o.patente || '').toLowerCase().includes(q) ||
          (o.cliente_nombre || '').toLowerCase().includes(q) ||
          (o.mecanico_asignado || '').toLowerCase().includes(q) ||
          `${o.marca || ''} ${o.modelo || ''}`.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ordenes, filterEstadoOT, searchQueryOT]);

  // Lista única de vehículos para historial
  const todosLosVehiculos = useMemo(() => {
    const map = new Map();
    // Procesar de citas
    citas.forEach(c => {
      if (!c.patente) return;
      const key = c.patente.toUpperCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          patente: key,
          marca: c.marca,
          modelo: c.modelo,
          km: c.km,
          cliente: c.nombre,
          telefono: c.telefono
        });
      }
    });
    // Procesar de órdenes
    ordenes.forEach(o => {
      if (!o.patente) return;
      const key = o.patente.toUpperCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          patente: key,
          marca: o.marca,
          modelo: o.modelo,
          km: o.km,
          cliente: o.cliente_nombre,
          telefono: o.cliente_telefono
        });
      }
    });
    return Array.from(map.values());
  }, [citas, ordenes]);

  const vehiculosFiltrados = useMemo(() => {
    if (!busquedaHistorial.trim()) return todosLosVehiculos;
    const q = busquedaHistorial.toLowerCase();
    return todosLosVehiculos.filter(v =>
      v.patente.toLowerCase().includes(q) ||
      (v.cliente || '').toLowerCase().includes(q) ||
      `${v.marca} ${v.modelo}`.toLowerCase().includes(q)
    );
  }, [todosLosVehiculos, busquedaHistorial]);

  // ==========================================
  // MEMOS Y CÁLCULOS - FIDELIZACIÓN
  // ==========================================
  const fidelizacionData = useMemo(() => {
    const ahora = new Date();
    return todosLosVehiculos.map((v, idx) => {
      const citasAuto = citas.filter(c => (c.patente || '').toUpperCase().trim() === v.patente);
      const ordenesAuto = ordenes.filter(o => (o.patente || '').toUpperCase().trim() === v.patente);

      const fechas = [
        ...citasAuto.map(c => c.fecha),
        ...ordenesAuto.map(o => o.created_at ? o.created_at.split('T')[0] : o.fecha_estimada)
      ].filter(Boolean).sort().reverse();

      // Para una demo realista, si no hay fecha calculamos fechas distribuidas (ej. 30 a 210 días)
      const baseDias = (idx % 3 === 0 ? 195 : idx % 3 === 1 ? 105 : 45);
      const ultimaFecha = fechas[0] || new Date(ahora.getTime() - baseDias * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const fechaObj = new Date(ultimaFecha);
      const diffMs = ahora - (isNaN(fechaObj.getTime()) ? new Date() : fechaObj);
      const diasPasados = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      const ultimoServicio = ordenesAuto[0]?.trabajos?.[0]?.descripcion || citasAuto[0]?.servicio || 'Mantenciones por KM';
      const kmNumerico = parseInt((v.km || '45000').toString().replace(/\D/g, ''), 10) || 45000;
      const kmEstimadoActual = kmNumerico + Math.round((diasPasados / 30) * 1250);

      let estadoAtencion = 'al_dia';
      let prioridad = 'Baja';
      let colorEstado = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      let textoEstado = 'Al día (< 90 días)';
      let recomendacion = 'Revisión periódica de rutina y niveles';

      if (diasPasados >= 180) {
        estadoAtencion = 'urgente';
        prioridad = 'Alta';
        colorEstado = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
        textoEstado = '🚨 Vencido (> 6 meses)';
        recomendacion = 'Mantención integral: cambio de aceite, filtros y chequeo de frenos';
      } else if (diasPasados >= 90) {
        estadoAtencion = 'proximo';
        prioridad = 'Media';
        colorEstado = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        textoEstado = '⚠️ Próximo (> 3 meses)';
        recomendacion = 'Revisión preventiva de fluidos y pastillas de freno';
      }

      const estaContactado = !!contactadosMap[v.patente];

      return {
        ...v,
        ultimaFecha,
        diasPasados,
        ultimoServicio,
        kmEstimadoActual,
        estadoAtencion,
        prioridad,
        colorEstado,
        textoEstado,
        recomendacion,
        estaContactado,
        fechaContactado: contactadosMap[v.patente]
      };
    }).sort((a, b) => b.diasPasados - a.diasPasados);
  }, [todosLosVehiculos, citas, ordenes, contactadosMap]);

  const kpisFidelizacion = useMemo(() => {
    return {
      total: fidelizacionData.length,
      requierenAtencion: fidelizacionData.filter(f => f.diasPasados >= 90).length,
      urgentes: fidelizacionData.filter(f => f.diasPasados >= 180).length,
      contactados: Object.keys(contactadosMap).length,
      potencialRecuperacion: fidelizacionData.filter(f => f.diasPasados >= 90).length * 65000
    };
  }, [fidelizacionData, contactadosMap]);

  const fidelizacionFiltrada = useMemo(() => {
    return fidelizacionData.filter(item => {
      if (filterFidelizacion === 'requieren_atencion' && item.diasPasados < 90) return false;
      if (filterFidelizacion === 'urgentes' && item.diasPasados < 180) return false;
      if (filterFidelizacion === 'contactados' && !item.estaContactado) return false;

      if (busquedaFidelizacion.trim()) {
        const q = busquedaFidelizacion.toLowerCase();
        return (
          item.patente.toLowerCase().includes(q) ||
          (item.cliente || '').toLowerCase().includes(q) ||
          (item.telefono || '').toLowerCase().includes(q) ||
          `${item.marca || ''} ${item.modelo || ''}`.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [fidelizacionData, filterFidelizacion, busquedaFidelizacion]);

  const pedidosFiltrados = useMemo(() => {
    return pedidosTienda.filter(p => {
      const matchEstado = filterEstadoPedido === 'todos' || p.estado === filterEstadoPedido;
      const matchQuery =
        !searchQueryPedido.trim() ||
        p.numero_pedido.toLowerCase().includes(searchQueryPedido.toLowerCase()) ||
        p.cliente_nombre.toLowerCase().includes(searchQueryPedido.toLowerCase()) ||
        (p.patente || '').toLowerCase().includes(searchQueryPedido.toLowerCase()) ||
        (p.comuna || '').toLowerCase().includes(searchQueryPedido.toLowerCase());
      return matchEstado && matchQuery;
    });
  }, [pedidosTienda, filterEstadoPedido, searchQueryPedido]);

  const kpisPedidos = useMemo(() => {
    return {
      total: pedidosTienda.length,
      nuevos: pedidosTienda.filter(p => p.estado === 'nuevo').length,
      enRuta: pedidosTienda.filter(p => p.estado === 'en_ruta' || p.estado === 'en_preparacion').length,
      instalaciones: pedidosTienda.filter(p => p.requiere_instalacion).length,
      totalVentasCLP: pedidosTienda.reduce((acc, p) => acc + (p.total_general || 0), 0)
    };
  }, [pedidosTienda]);

  const inventarioFiltrado = useMemo(() => {
    return inventarioList.filter(item => {
      const matchCat = filterCategoriaInv === 'todas' || item.categoria === filterCategoriaInv;
      const matchQuery =
        !searchQueryInv.trim() ||
        item.nombre.toLowerCase().includes(searchQueryInv.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchQueryInv.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [inventarioList, filterCategoriaInv, searchQueryInv]);

  const kpisInventario = useMemo(() => {
    return {
      totalUnidades: inventarioList.reduce((acc, i) => acc + (i.stock || 0), 0),
      bateriasTotal: inventarioList.filter(i => i.categoria.includes('Baterías')).reduce((acc, i) => acc + (i.stock || 0), 0),
      criticos: inventarioList.filter(i => i.stock <= (i.stockMinimo || 3)).length,
      valorTotalCLP: inventarioList.reduce((acc, i) => acc + ((i.stock || 0) * (i.precioVenta || 0)), 0)
    };
  }, [inventarioList]);

  function handleEnviarWhatsAppRecordatorio(item, textoPersonalizado = null) {
    const telefono = (item.telefono || '').replace(/\D/g, '');
    const cliente = item.cliente || 'Estimado/a cliente';
    const vehiculo = `${item.marca || ''} ${item.modelo || ''}`.trim() || 'tu vehículo';

    const defaultMsg = `Hola ${cliente}, te saludamos del equipo técnico de AutoBooking 🚗.\n\n` +
      `Esperamos que tu ${vehiculo} (${item.patente}) esté funcionando excelente. ` +
      `Revisando nuestra pauta técnica, vemos que tu última mantención fue hace ${item.diasPasados} días (${item.ultimoServicio}), ` +
      `y el kilometraje estimado ya bordea los ${item.kmEstimadoActual.toLocaleString('es-CL')} km.\n\n` +
      `Para proteger la vida útil del motor y tu seguridad, te recomendamos una ${item.recomendacion}.\n\n` +
      `¿Te gustaría que agendemos tu visita técnica a domicilio para esta semana? Responde a este mensaje y coordinamos tu horario preferido.`;

    const finalMsg = textoPersonalizado || defaultMsg;

    setContactadosMap(prev => ({
      ...prev,
      [item.patente]: new Date().toLocaleDateString('es-CL')
    }));

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(finalMsg)}`, '_blank');
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#080a0d] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white/60 text-sm tracking-wide">Validando acceso al taller...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-28 relative selection:bg-blue-600 selection:text-white">
        <Navbar />

        <main className="max-w-xl mx-auto px-4 pt-10 sm:pt-16">
          {/* Badge & Título */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              Portal SaaS B2B • AutoBooking Red
            </span>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">
              Acceso a Talleres
            </h1>
            <p className="text-white/50 text-sm font-light max-w-md mx-auto">
              Gestiona tus citas en tiempo real, órdenes de trabajo técnicas y tu portal exclusivo de agendamiento.
            </p>
          </div>

          {/* Tarjeta de Acceso Rápido Demo (1-Click) */}
          <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Acceso Inmediato de Demostración
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Sin Contraseña
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_TALLERES[0])}
                disabled={authLoading}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-blue-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-300">
                  SC
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white group-hover:text-blue-300 truncate">
                    Taller San Cristóbal
                  </div>
                  <div className="text-[11px] text-white/40">Providencia • Plan Pro</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_TALLERES[1])}
                disabled={authLoading}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-300">
                  FE
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white group-hover:text-emerald-300 truncate">
                    Frenos & Baterías Express
                  </div>
                  <div className="text-[11px] text-white/40">Las Condes • Taller Móvil</div>
                </div>
              </button>
            </div>
          </div>

          {/* Formulario Login / Register */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d121c]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Tabs */}
            <div className="flex border-b border-white/[0.08] mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-medium uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-medium uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Registrar Nuevo Taller
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="ejemplo@taller.cl"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  {authLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Ingresando...</span>
                    </>
                  ) : (
                    <span>Entrar a mi Taller</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Nombre del Taller</label>
                  <input
                    type="text"
                    required
                    value={regTallerNombre}
                    onChange={(e) => {
                      setRegTallerNombre(e.target.value);
                      if (!regSlug) {
                        setRegSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                      }
                    }}
                    placeholder="ej. Taller Mecánico San Cristóbal"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1.5 font-medium">Tu Nombre</label>
                    <input
                      type="text"
                      required
                      value={regNombre}
                      onChange={(e) => setRegNombre(e.target.value)}
                      placeholder="ej. Carlos Silva"
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1.5 font-medium">Comuna</label>
                    <select
                      value={regComuna}
                      onChange={(e) => setRegComuna(e.target.value)}
                      className="w-full bg-[#0d121c] border border-white/[0.08] focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    >
                      {ZONES.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1.5 font-medium">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={regTelefono}
                      onChange={(e) => setRegTelefono(e.target.value)}
                      placeholder="+56912345678"
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1.5 font-medium">Link de Agendamiento</label>
                    <div className="text-[11px] text-white/40 mt-2 font-mono truncate">
                      /{regSlug || 'tu-taller'}/agendar
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="contacto@mitaller.cl"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  {authLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registrando taller...</span>
                    </>
                  ) : (
                    <span>Crear Cuenta & Activar 14 Días Gratis</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0d] text-white font-sans pb-28 relative">
      <Navbar />

      {/* BARRA IDENTIDAD DEL TALLER AUTENTICADO */}
      <div className="bg-[#0b0e14] border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-sm text-blue-300">
              {(session?.taller?.nombre || 'T').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">
                  {session?.taller?.nombre || 'Mi Taller'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25 uppercase">
                  {session?.taller?.plan_suscripcion || 'Plan Pro'}
                </span>
                {session?.taller?.comuna && (
                  <span className="text-xs text-white/40 hidden sm:inline">
                    • {session.taller.comuna}
                  </span>
                )}
              </div>
              <div className="text-xs text-white/40 flex items-center gap-1.5">
                <span>Sesión: {session?.user?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Link al portal de agendamiento público con botón de copiar */}
            {session?.taller?.slug && (
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs">
                <span className="text-white/40 text-[11px] hidden sm:inline">Portal Clientes:</span>
                <span className="text-blue-400 font-mono text-xs truncate max-w-[160px] sm:max-w-none">
                  /{session.taller.slug}/agendar
                </span>
                <button
                  type="button"
                  onClick={handleCopyBookingLink}
                  className="ml-1 text-white/60 hover:text-white px-1.5 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[11px] font-medium transition-all cursor-pointer"
                  title="Copiar enlace directo para enviar a clientes por WhatsApp o redes sociales"
                >
                  {copiedLink ? '¡Copiado!' : 'Copiar'}
                </button>
                <Link
                  href={`/${session.taller.slug}/agendar`}
                  target="_blank"
                  className="ml-1 text-white/40 hover:text-blue-300 transition-colors"
                  title="Abrir página pública de agendamiento"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-white/50 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              title="Cerrar sesión de este taller"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* HEADER TALLER */}
      <header className="bg-[#080a0d] border-b border-white/[0.06] pt-10 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400/80 bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 rounded-full">
                Operaciones & Taller
              </span>
              {hasSupabase ? (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase Conectado
                </span>
              ) : (
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Configurar conexión con Supabase"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Modo Local Activo (Conectar Supabase)
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Gestión Técnica <span className="text-white/40 font-light italic">AutoBooking</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/45 mt-1 font-light">
              Control de agendamientos, órdenes de trabajo (OT) y fichas de vehículos en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={cargarDatos}
              disabled={loadingCitas || loadingOrdenes}
              className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white/80 hover:text-white px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
              title="Recargar datos"
            >
              <svg className={`w-3.5 h-3.5 ${loadingCitas || loadingOrdenes ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Actualizar</span>
            </button>

            {activeTab === 'citas' ? (
              <button
                onClick={() => setShowNewCitaModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Nueva Cita</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setNewOTForm(initialOTForm);
                  setShowNewOTModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Nueva OT</span>
              </button>
            )}
          </div>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS DEL PANEL */}
        <div className="max-w-6xl mx-auto mt-6 flex gap-2 border-b border-white/[0.08] pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('citas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'citas'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            <span>Citas y Agenda</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.06] font-mono">
              {citas.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ordenes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ordenes'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span>Órdenes de Trabajo (OT)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              {ordenes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vehiculos')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vehiculos'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h1.125c.621 0 1.129.504 1.09 1.124" />
            </svg>
            <span>Historial por Patente</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.06] font-mono">
              {todosLosVehiculos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('fidelizacion')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'fidelizacion'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span>Fidelización & Recordatorios</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-blue-400 border border-blue-500/20 font-mono">
              {kpisFidelizacion.requierenAtencion}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pedidos'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>Pedidos Tienda & Baterías</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/80 border border-white/[0.06] font-mono">
              {kpisPedidos.nuevos > 0 ? `${kpisPedidos.nuevos} nuevos` : kpisPedidos.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventario'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <span>Inventario & Stock</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.06] font-mono">
              {kpisInventario.totalUnidades} un.
            </span>
          </button>

          <button
            onClick={() => setActiveTab('detailing')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'detailing'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span>Detailing & Pro Checklist</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              7 Fases
            </span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'border-b-2 border-transparent text-white/40 hover:text-white/80 font-medium'
            }`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Conexión Supabase</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ========================================================= */}
        {/* TAB 1: CITAS Y AGENDAMIENTOS                              */}
        {/* ========================================================= */}
        {activeTab === 'citas' && (
          <div className="space-y-6">

            {/* KPIS CITAS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div
                onClick={() => { setFilterEstadoCita('todos'); setFilterFechaCita('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Citas</div>
                <div className="text-2xl font-extrabold text-white">{kpisCitas.total}</div>
                <div className="text-[11px] text-slate-500 mt-1">Registradas</div>
              </div>

              <div
                onClick={() => { setFilterEstadoCita('pendiente'); setFilterFechaCita('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Pendientes</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300">{kpisCitas.pendientes}</div>
                <div className="text-[11px] text-amber-400/70 mt-1">Por confirmar</div>
              </div>

              <div
                onClick={() => { setFilterEstadoCita('confirmada'); setFilterFechaCita('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Confirmadas</div>
                <div className="text-2xl font-extrabold text-blue-300">{kpisCitas.confirmadas}</div>
                <div className="text-[11px] text-slate-500 mt-1">Agendadas firmes</div>
              </div>

              <div
                onClick={() => { setFilterEstadoCita('en_taller'); setFilterFechaCita('todas'); }}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">En Taller</div>
                <div className="text-2xl font-extrabold text-cyan-300">{kpisCitas.enTaller}</div>
                <div className="text-[11px] text-slate-500 mt-1">En atención</div>
              </div>

              <div
                onClick={() => { setFilterFechaCita('hoy'); setFilterEstadoCita('todos'); }}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition-all col-span-2 sm:col-span-1"
              >
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Para Hoy</div>
                <div className="text-2xl font-extrabold text-emerald-300">{kpisCitas.hoy}</div>
                <div className="text-[11px] text-slate-500 mt-1">{hoyStr}</div>
              </div>
            </div>

            {/* FILTROS CITAS */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por patente, cliente, teléfono o auto..."
                  value={searchQueryCita}
                  onChange={e => setSearchQueryCita(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {ESTADOS_CITAS.map(est => (
                  <button
                    key={est.id}
                    onClick={() => setFilterEstadoCita(est.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterEstadoCita === est.id
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
            {loadingCitas ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <div className="text-3xl mb-2 animate-spin inline-block">🔄</div>
                <p>Cargando agendamientos...</p>
              </div>
            ) : citasFiltradas.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">🚗</div>
                <h3 className="text-lg font-bold text-white mb-1">No hay agendamientos con este filtro</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  {searchQueryCita || filterEstadoCita !== 'todos'
                    ? 'Prueba limpiando los filtros para ver todos los agendamientos.'
                    : 'Aún no hay citas registradas.'}
                </p>
                <button
                  onClick={() => setShowNewCitaModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Registrar cita manual
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {citasFiltradas.map(cita => {
                  const estadoObj = ESTADOS_CITAS.find(e => e.id === cita.estado) || ESTADOS_CITAS[1];
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
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-mono font-bold tracking-widest text-sm shadow-inner">
                            <span className="text-[10px] text-cyan-400 mr-1.5 font-sans font-extrabold">CL</span>
                            {cita.patente || 'S/PATENTE'}
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${estadoObj.color}`}>
                            {estadoObj.label}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mb-1">
                          {cita.marca} {cita.modelo}
                          {cita.km && (
                            <span className="text-xs font-normal text-slate-400 ml-2">
                              ({Number(cita.km).toLocaleString('es-CL')} km)
                            </span>
                          )}
                        </h4>

                        <div className="text-xs font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
                          <span>🔧</span>
                          <span>{cita.servicio}</span>
                        </div>

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

                        <div className="text-xs text-slate-300 space-y-1 mb-3">
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>👤</span>
                            <span>{cita.nombre}</span>
                          </div>
                          <div className="text-slate-400 flex items-center justify-between">
                            <span>📞 {cita.telefono}</span>
                            <button
                              onClick={() => {
                                const msg = `Hola ${cita.nombre}, te contactamos desde AutoBooking respecto a tu cita para el ${cita.fecha} (${cita.horario}) de tu vehículo ${cita.marca} ${cita.modelo}.`;
                                window.open(`https://wa.me/${(cita.telefono || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
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

                      {/* ACCIONES DE CITA */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        <div className="flex gap-1.5">
                          {cita.estado === 'pendiente' && (
                            <button
                              onClick={() => handleCambiarEstadoCita(cita.id, 'confirmada')}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ✓ Confirmar Cita
                            </button>
                          )}
                          {cita.estado === 'confirmada' && (
                            <button
                              onClick={() => handleGenerarOTDesdeCita(cita)}
                              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>📋</span>
                              Generar OT
                            </button>
                          )}
                          {cita.estado === 'en_taller' && (
                            <button
                              onClick={() => handleCambiarEstadoCita(cita.id, 'completada')}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ✅ Marcar Listo
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedCita(cita);
                              setNotasCitaTemp(cita.notas_taller || '');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Detalle
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

        {/* ========================================================= */}
        {/* TAB 2: ÓRDENES DE TRABAJO (OT) - HABILITADO COMPLETO     */}
        {/* ========================================================= */}
        {activeTab === 'ordenes' && (
          <div className="space-y-6">

            {/* KPIS DE ÓRDENES DE TRABAJO */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div
                onClick={() => setFilterEstadoOT('todos')}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total OTs</div>
                <div className="text-2xl font-extrabold text-white">{kpisOT.total}</div>
                <div className="text-[11px] text-slate-500 mt-1">Activas e históricas</div>
              </div>

              <div
                onClick={() => setFilterEstadoOT('ingresado')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Ingresados</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300">{kpisOT.ingresado}</div>
                <div className="text-[11px] text-amber-400/70 mt-1">Check-in listo</div>
              </div>

              <div
                onClick={() => setFilterEstadoOT('en_proceso')}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">En Proceso</div>
                <div className="text-2xl font-extrabold text-cyan-300">{kpisOT.enProceso}</div>
                <div className="text-[11px] text-slate-500 mt-1">En banco de trabajo</div>
              </div>

              <div
                onClick={() => setFilterEstadoOT('espera_repuestos')}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Repuestos</div>
                <div className="text-2xl font-extrabold text-purple-300">{kpisOT.esperaRepuestos}</div>
                <div className="text-[11px] text-purple-400/70 mt-1">En espera repuestos</div>
              </div>

              <div
                onClick={() => setFilterEstadoOT('listo_entrega')}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Listos</div>
                <div className="text-2xl font-extrabold text-emerald-300">{kpisOT.listoEntrega}</div>
                <div className="text-[11px] text-emerald-400/70 mt-1">Para entrega cliente</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2 sm:col-span-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Facturado</div>
                <div className="text-xl font-extrabold text-cyan-300">${kpisOT.totalFacturado.toLocaleString('es-CL')}</div>
                <div className="text-[11px] text-slate-500 mt-1">Mano obra + Repuestos</div>
              </div>
            </div>

            {/* FILTROS Y BÚSQUEDA OT */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por #OT, patente, cliente, auto o mecánico..."
                  value={searchQueryOT}
                  onChange={e => setSearchQueryOT(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {ESTADOS_OT.map(est => (
                  <button
                    key={est.id}
                    onClick={() => setFilterEstadoOT(est.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterEstadoOT === est.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {est.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTADO DE ÓRDENES */}
            {loadingOrdenes ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <div className="text-3xl mb-2 animate-spin inline-block">🔄</div>
                <p>Cargando órdenes de trabajo...</p>
              </div>
            ) : ordenesFiltradas.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-white mb-1">No se encontraron Órdenes de Trabajo</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  {searchQueryOT || filterEstadoOT !== 'todos'
                    ? 'No hay órdenes que coincidan con la búsqueda.'
                    : 'Crea tu primera Orden de Trabajo o genera una directamente desde las Citas confirmadas.'}
                </p>
                <button
                  onClick={() => {
                    setNewOTForm(initialOTForm);
                    setShowNewOTModal(true);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  ➕ Crear Nueva Orden de Trabajo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordenesFiltradas.map(ot => {
                  const estadoObj = ESTADOS_OT.find(e => e.id === ot.estado) || ESTADOS_OT[1];
                  const trabajosList = ot.trabajos || [];
                  const trabajosCompletados = trabajosList.filter(t => t.completado).length;

                  return (
                    <div
                      key={ot.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                    >
                      <div>
                        {/* Cabecera OT */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-lg">
                              {ot.numero_ot}
                            </span>
                            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-slate-100 font-mono font-bold text-xs tracking-wider">
                              <span className="text-[9px] text-cyan-400 mr-1 font-sans">CL</span>
                              {ot.patente}
                            </div>
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${estadoObj.color}`}>
                            {estadoObj.label}
                          </span>
                        </div>

                        {/* Vehículo */}
                        <h4 className="text-base font-bold text-white mb-0.5">
                          {ot.marca} {ot.modelo} {ot.ano && `(${ot.ano})`}
                        </h4>
                        <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                          <span>{ot.km ? `${Number(ot.km).toLocaleString('es-CL')} km` : 'Km no indicado'}</span>
                          <span className="text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                            👨‍🔧 {ot.mecanico_asignado || 'Sin Asignar'}
                          </span>
                        </div>

                        {/* Diagnóstico */}
                        {ot.diagnostico && (
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-3 text-xs text-slate-300">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">Diagnóstico:</span>
                            <p className="line-clamp-2">{ot.diagnostico}</p>
                          </div>
                        )}

                        {/* Tareas checklist resumen */}
                        <div className="mb-3 space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Avance trabajos:</span>
                            <span className="font-semibold text-slate-200">
                              {trabajosCompletados} de {trabajosList.length} listos
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-cyan-500 h-1.5 transition-all"
                              style={{
                                width: trabajosList.length > 0 ? `${(trabajosCompletados / trabajosList.length) * 100}%` : '0%'
                              }}
                            />
                          </div>
                        </div>

                        {/* Datos Cliente y Total */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 text-xs flex justify-between items-center mb-3">
                          <div>
                            <div className="font-bold text-slate-200">{ot.cliente_nombre}</div>
                            <div className="text-slate-500 text-[11px]">{ot.cliente_telefono}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase">Total General</span>
                            <span className="text-sm font-extrabold text-cyan-400">
                              ${Number(ot.total_general || 0).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción OT */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        {/* Selector de estado rápido */}
                        <div className="flex gap-1.5">
                          {ot.estado === 'ingresado' && (
                            <button
                              onClick={() => handleCambiarEstadoOT(ot.id, 'en_proceso')}
                              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ▶ Iniciar Reparación
                            </button>
                          )}
                          {ot.estado === 'en_proceso' && (
                            <button
                              onClick={() => handleCambiarEstadoOT(ot.id, 'listo_entrega')}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ✅ Listo para Entrega
                            </button>
                          )}
                          {ot.estado === 'espera_repuestos' && (
                            <button
                              onClick={() => handleCambiarEstadoOT(ot.id, 'en_proceso')}
                              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              ▶ Reanudar Trabajo
                            </button>
                          )}
                          {ot.estado === 'listo_entrega' && (
                            <button
                              onClick={() => handleCambiarEstadoOT(ot.id, 'entregado')}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              🚗 Marcar Entregado
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOT(ot)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Editar OT
                          </button>
                        </div>

                        {/* Botones secundarios: WhatsApp + Imprimir */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => notificarOTPorWhatsApp(ot)}
                            className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>💬</span>
                            Notificar
                          </button>
                          <button
                            onClick={() => handleImprimirOT(ot)}
                            className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>🖨️</span>
                            Imprimir
                          </button>
                        </div>

                        {/* Botón rápido Checklist Detailing */}
                        <button
                          onClick={() => setActiveTab('detailing')}
                          className="w-full bg-slate-950 hover:bg-slate-800 border border-amber-500/25 text-amber-300 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>✨</span>
                          <span>Checklist Detailing & Diluciones</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HISTORIAL POR PATENTE (COMPLETO)                   */}
        {/* ========================================================= */}
        {activeTab === 'vehiculos' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-950 border border-violet-800 flex items-center justify-center text-2xl">
                    🚗
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Historial Técnico por Vehículo</h3>
                    <p className="text-xs text-slate-400">
                      Selecciona o busca cualquier patente para ver todas sus citas, órdenes de trabajo, repuestos y costos acumulados.
                    </p>
                  </div>
                </div>

                {/* Buscador de patentes */}
                <div className="relative w-full md:w-72">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar patente o cliente..."
                    value={busquedaHistorial}
                    onChange={e => setBusquedaHistorial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Selector de patentes */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
                {vehiculosFiltrados.map(v => (
                  <button
                    key={v.patente}
                    onClick={() => setPatenteSeleccionada(v.patente)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      patenteSeleccionada === v.patente
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>CL</span>
                    <span>{v.patente}</span>
                    <span className="font-sans font-normal text-slate-400 text-[11px]">({v.marca} {v.modelo})</span>
                  </button>
                ))}
              </div>

              {/* Ficha detallada del vehículo seleccionado */}
              {patenteSeleccionada ? (
                (() => {
                  const citasAuto = citas.filter(c => c.patente?.toUpperCase() === patenteSeleccionada);
                  const ordenesAuto = ordenes.filter(o => o.patente?.toUpperCase() === patenteSeleccionada);
                  const autoInfo = todosLosVehiculos.find(v => v.patente === patenteSeleccionada) || {};
                  const gastoTotal = ordenesAuto.reduce((acc, o) => acc + (Number(o.total_general) || 0), 0);

                  return (
                    <div className="space-y-6">
                      {/* Tarjeta resumen del vehículo */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center font-mono font-extrabold text-xl text-cyan-400">
                            {patenteSeleccionada.slice(0, 4)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-lg text-white">{patenteSeleccionada}</span>
                              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">Chile</span>
                            </div>
                            <div className="text-sm font-bold text-slate-300 mt-0.5">
                              {autoInfo.marca} {autoInfo.modelo}
                            </div>
                            <div className="text-xs text-slate-500">
                              Propietario registrado: <strong className="text-slate-300">{autoInfo.cliente}</strong> (📞 {autoInfo.telefono})
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Visitas</span>
                            <span className="text-lg font-extrabold text-white">{citasAuto.length + ordenesAuto.length}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Órdenes OT</span>
                            <span className="text-lg font-extrabold text-cyan-400">{ordenesAuto.length}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Invertido</span>
                            <span className="text-lg font-extrabold text-emerald-400">${gastoTotal.toLocaleString('es-CL')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Línea de tiempo de servicios y OT */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Historial de Órdenes e Intervenciones</h4>

                        {ordenesAuto.length === 0 && citasAuto.length === 0 ? (
                          <div className="text-center p-8 bg-slate-950 rounded-xl text-slate-500 text-xs">
                            No hay registros técnicos para este vehículo.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Mostrar OTs */}
                            {ordenesAuto.map(ot => (
                              <div key={ot.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                                      {ot.numero_ot}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      {new Date(ot.created_at).toLocaleDateString('es-CL')}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900 text-slate-300">
                                      Mecánico: {ot.mecanico_asignado}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-300 font-semibold mb-1">
                                    {ot.diagnostico || 'Sin diagnóstico detallado'}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Trabajos realizados: {(ot.trabajos || []).map(t => t.descripcion).join(', ') || 'Mano de obra general'}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="text-xs font-bold text-cyan-400 block">${Number(ot.total_general || 0).toLocaleString('es-CL')}</span>
                                    <span className="text-[10px] text-slate-500">{ot.estado}</span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedOT(ot)}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Ver OT
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Mostrar Citas */}
                            {citasAuto.map(c => (
                              <div key={c.id} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 flex justify-between items-center text-xs">
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-slate-400 font-semibold">Agendamiento: {c.servicio}</span>
                                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">{c.fecha}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500">Cliente: {c.nombre} (Comuna: {c.comuna})</div>
                                </div>
                                <span className="text-[11px] text-slate-400 capitalize bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                                  {c.estado}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Selecciona una patente arriba para ver su expediente técnico completo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: FIDELIZACIÓN & RECORDATORIOS DE MANTENCIÓN (OPCIÓN 5) */}
        {/* ========================================================= */}
        {activeTab === 'fidelizacion' && (
          <div className="space-y-6">

            {/* BANNER PRO SAAS */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/40 border border-amber-800/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                    ⭐ Módulo de Retención y Fidelización
                  </span>
                  <span className="text-xs text-slate-400 font-semibold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                    Plan Taller Pro
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Recordatorios de Mantención por <span className="text-emerald-400">WhatsApp</span>
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  El sistema analiza la última fecha y kilometraje de cada vehículo para recordarle proactivamente a tus clientes cuándo les toca cambio de aceite, frenos o mantención periódica. ¡Recupera clientes que no volvían con 1 solo clic!
                </p>
              </div>

              <div className="bg-slate-950/80 border border-amber-900/60 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
                <span className="text-xs text-amber-400 font-bold block mb-0.5">Potencial Recuperable Estimado</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ${kpisFidelizacion.potencialRecuperacion.toLocaleString('es-CL')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">en servicios preventivos del mes</span>
              </div>
            </div>

            {/* KPIS DE FIDELIZACIÓN */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div
                onClick={() => setFilterFidelizacion('todos')}
                className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
                  filterFidelizacion === 'todos' ? 'border-amber-400 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Clientes</div>
                <div className="text-2xl font-extrabold text-white">{kpisFidelizacion.total}</div>
                <div className="text-[11px] text-slate-500 mt-1">Vehículos registrados</div>
              </div>

              <div
                onClick={() => setFilterFidelizacion('requieren_atencion')}
                className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
                  filterFidelizacion === 'requieren_atencion' ? 'border-amber-400 bg-amber-950/20' : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Por Contactar</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300">{kpisFidelizacion.requierenAtencion}</div>
                <div className="text-[11px] text-amber-400/70 mt-1">&gt; 90 días sin mantención</div>
              </div>

              <div
                onClick={() => setFilterFidelizacion('urgentes')}
                className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
                  filterFidelizacion === 'urgentes' ? 'border-rose-400 bg-rose-950/20' : 'border-slate-800 hover:border-rose-500/40'
                }`}
              >
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Riesgo Deserción</span>
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                </div>
                <div className="text-2xl font-extrabold text-rose-300">{kpisFidelizacion.urgentes}</div>
                <div className="text-[11px] text-rose-400/70 mt-1">&gt; 6 meses sin volver</div>
              </div>

              <div
                onClick={() => setFilterFidelizacion('contactados')}
                className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
                  filterFidelizacion === 'contactados' ? 'border-emerald-400 bg-emerald-950/20' : 'border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Contactados</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-300">{kpisFidelizacion.contactados}</div>
                <div className="text-[11px] text-emerald-400/70 mt-1">Recordatorio enviado</div>
              </div>
            </div>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => setFilterFidelizacion('requieren_atencion')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterFidelizacion === 'requieren_atencion'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ⚠️ Requieren Atención ({kpisFidelizacion.requierenAtencion})
                </button>
                <button
                  onClick={() => setFilterFidelizacion('urgentes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterFidelizacion === 'urgentes'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🚨 Urgentes &gt; 6 meses ({kpisFidelizacion.urgentes})
                </button>
                <button
                  onClick={() => setFilterFidelizacion('todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterFidelizacion === 'todos'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todos ({kpisFidelizacion.total})
                </button>
                <button
                  onClick={() => setFilterFidelizacion('contactados')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterFidelizacion === 'contactados'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ✅ Ya Contactados ({kpisFidelizacion.contactados})
                </button>
              </div>

              <div className="relative w-full md:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar patente, cliente, auto..."
                  value={busquedaFidelizacion}
                  onChange={(e) => setBusquedaFidelizacion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* LISTADO DE TARJETAS DE FIDELIZACIÓN */}
            {fidelizacionFiltrada.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                <span className="text-4xl block mb-2">🎉</span>
                <p className="font-bold text-white text-base">¡Excelente trabajo! No hay clientes pendientes con este filtro.</p>
                <p className="text-xs text-slate-500 mt-1">Todos tus clientes están al día o ya recibieron su recordatorio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fidelizacionFiltrada.map((item) => (
                  <div
                    key={item.patente}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Cabecera de la tarjeta */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="font-mono font-bold text-sm bg-slate-950 border border-slate-700 px-3 py-1 rounded-lg text-slate-100 tracking-wider">
                            <span className="text-[10px] text-cyan-400 mr-1.5 font-sans">CL</span>
                            {item.patente}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white leading-tight">
                              {item.marca} {item.modelo}
                            </h3>
                            <span className="text-[11px] text-slate-400">
                              {item.cliente || 'Cliente sin registrar'}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.colorEstado}`}>
                          {item.textoEstado}
                        </span>
                      </div>

                      {/* Métricas del vehículo y tiempo transcurrido */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs mb-3">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Último servicio:</span>
                          <span className="text-slate-300 font-semibold text-[11px] truncate block" title={item.ultimoServicio}>
                            {item.ultimoServicio}
                          </span>
                          <span className="text-amber-400/90 text-[10px] font-medium block mt-0.5">
                            Hace {item.diasPasados} días ({item.ultimaFecha})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Kilometraje actual est.:</span>
                          <span className="text-slate-200 font-bold text-xs font-mono">
                            ~{item.kmEstimadoActual.toLocaleString('es-CL')} km
                          </span>
                          <span className="text-slate-500 text-[10px] block mt-0.5">
                            (+{Math.round((item.diasPasados / 30) * 1250).toLocaleString('es-CL')} km estimados)
                          </span>
                        </div>
                      </div>

                      {/* Recomendación inteligente */}
                      <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-2.5 mb-4 text-xs text-amber-200 flex items-start gap-2">
                        <span className="text-sm shrink-0">💡</span>
                        <div>
                          <strong className="font-semibold text-amber-300">Recomendación sugerida:</strong> {item.recomendacion}
                        </div>
                      </div>

                      {/* Estado de contacto previo si existe */}
                      {item.estaContactado && (
                        <div className="mb-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <span>✅</span> Recordatorio enviado el <strong>{item.fechaContactado}</strong>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">Contactado</span>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleEnviarWhatsAppRecordatorio(item)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
                        </svg>
                        <span>Enviar WhatsApp (1-Clic)</span>
                      </button>

                      <button
                        onClick={() => {
                          const vehiculo = `${item.marca || ''} ${item.modelo || ''}`.trim() || 'tu vehículo';
                          const defaultMsg = `Hola ${item.cliente || 'Estimado/a cliente'}, te saludamos del equipo técnico de AutoBooking 🚗.\n\n` +
                            `Esperamos que tu ${vehiculo} (${item.patente}) esté funcionando excelente. ` +
                            `Vemos que tu última mantención fue hace ${item.diasPasados} días (${item.ultimoServicio}), ` +
                            `y el kilometraje estimado bordea los ${item.kmEstimadoActual.toLocaleString('es-CL')} km.\n\n` +
                            `Te recomendamos una ${item.recomendacion}.\n\n` +
                            `🎁 Por ser cliente frecuente, tenemos un 10% de descuento en mano de obra si agendamos esta semana. ¿Qué día te acomodaría?`;
                          setModalEditarMensaje({ item, mensaje: defaultMsg });
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                        title="Personalizar texto antes de enviar"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => {
                          setPatenteSeleccionada(item.patente);
                          setActiveTab('vehiculos');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                        title="Ver historial técnico completo"
                      >
                        👁️ Historial
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CONFIGURACIÓN SUPABASE                             */}
        {/* ========================================================= */}
        {activeTab === 'config' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Configuración de Base de Datos Supabase</h3>
                <p className="text-xs text-slate-400">Conecta tu base de datos PostgreSQL en la nube para sincronizar Citas y Órdenes de Trabajo.</p>
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
                  ? 'Todas las citas, órdenes de trabajo y cambios se guardan directamente en tu base de datos Supabase en tiempo real.'
                  : 'Las citas y órdenes se guardan en el navegador. Para sincronizarlas entre computadores y celulares del taller, conecta tu proyecto Supabase gratis.'}
              </p>
            </div>

            {/* Pasos para conectar */}
            <div className="space-y-4 text-xs text-slate-300">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Pasos para conectar Supabase (Gratis):</h4>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">Paso 1: Crear proyecto en Supabase</div>
                <p className="text-slate-400">
                  Ingresa a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">supabase.com</a> y crea un proyecto gratuito.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">Paso 2: Ejecutar el script SQL</div>
                <p className="text-slate-400">
                  En el menú de Supabase ve a <strong>SQL Editor</strong>, abre una consulta y pega el contenido del archivo <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">supabase_schema.sql</code> (incluye tablas de Citas y Órdenes de Trabajo). Haz clic en <strong>Run</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">Paso 3: Copiar credenciales a .env.local</div>
                <p className="text-slate-400">
                  En Supabase ve a <strong>Project Settings → API</strong>, copia la URL del proyecto y la anon public key, y pégalas en <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">.env.local</code>:
                </p>
                <pre className="bg-slate-900 p-3 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PEDIDOS DE TIENDA ONLINE & BATERÍAS               */}
        {/* ========================================================= */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            {/* KPIS DE PEDIDOS TIENDA */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div
                onClick={() => setFilterEstadoPedido('todos')}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Pedidos</div>
                <div className="text-2xl font-extrabold text-white">{kpisPedidos.total}</div>
                <div className="text-[11px] text-slate-500 mt-1">Registrados en tienda</div>
              </div>

              <div
                onClick={() => setFilterEstadoPedido('nuevo')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Nuevos</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300">{kpisPedidos.nuevos}</div>
                <div className="text-[11px] text-amber-400/70 mt-1">Por procesar o asignar</div>
              </div>

              <div
                onClick={() => setFilterEstadoPedido('en_ruta')}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">En Ruta / Taller</div>
                <div className="text-2xl font-extrabold text-cyan-300">{kpisPedidos.enRuta}</div>
                <div className="text-[11px] text-slate-500 mt-1">Con mecánico o despacho</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Ventas Tienda</div>
                <div className="text-2xl font-extrabold text-emerald-300">
                  ${Math.round(kpisPedidos.totalVentasCLP / 1000)}k <span className="text-xs font-normal text-slate-400">CLP</span>
                </div>
                <div className="text-[11px] text-emerald-400/70 mt-1">{kpisPedidos.instalaciones} con instalación</div>
              </div>
            </div>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Filtro por Estado */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'nuevo', label: 'Nuevos' },
                  { id: 'en_preparacion', label: 'En Preparación' },
                  { id: 'en_ruta', label: 'En Ruta' },
                  { id: 'completado', label: 'Completados' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterEstadoPedido(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterEstadoPedido === tab.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Input de Búsqueda */}
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por cliente, pedido, patente o comuna..."
                  value={searchQueryPedido}
                  onChange={e => setSearchQueryPedido(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* LISTADO DE PEDIDOS DE TIENDA */}
            {pedidosFiltrados.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                <span className="text-4xl block mb-2">🛒</span>
                <h4 className="text-lg font-bold text-white mb-1">No hay pedidos con este filtro</h4>
                <p className="text-xs text-slate-400">
                  Los pedidos generados por clientes desde la Tienda Online o el Catálogo de Baterías aparecerán automáticamente aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pedidosFiltrados.map(pedido => {
                  let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                  let estadoTexto = 'Nuevo Pedido';
                  if (pedido.estado === 'en_preparacion') {
                    badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                    estadoTexto = 'En Preparación';
                  } else if (pedido.estado === 'en_ruta') {
                    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                    estadoTexto = 'En Ruta de Despacho';
                  } else if (pedido.estado === 'completado') {
                    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                    estadoTexto = 'Completado';
                  }

                  const waMsg = `¡Hola ${pedido.cliente_nombre}! Te escribimos de AutoBooking para coordinar tu pedido *${pedido.numero_pedido}* (${(pedido.items || []).map(i => i.nombre).join(', ')}). ¿En qué horario te acomoda recibir la visita o entrega en ${pedido.comuna}?`;
                  const waUrl = `https://wa.me/${(pedido.cliente_telefono || '').replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`;

                  return (
                    <div
                      key={pedido.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl transition-all hover:border-slate-700"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🛍️</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-white">
                                {pedido.numero_pedido}
                              </span>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                                {estadoTexto}
                              </span>
                              {pedido.requiere_instalacion && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                                  🔧 Con Instalación
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                              Recibido el {new Date(pedido.created_at).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>

                        {/* Total y Selector de Estado */}
                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase">Total Pedido:</span>
                            <span className="text-lg font-mono font-black text-amber-300">
                              ${Number(pedido.total_general || 0).toLocaleString('es-CL')} CLP
                            </span>
                          </div>

                          <select
                            value={pedido.estado}
                            onChange={e => handleCambiarEstadoPedido(pedido.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 font-semibold"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="en_preparacion">En Preparación</option>
                            <option value="en_ruta">En Ruta</option>
                            <option value="completado">Completado</option>
                          </select>
                        </div>
                      </div>

                      {/* DATOS DEL CLIENTE Y PRODUCTOS */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4 text-xs">
                        {/* Columna Cliente */}
                        <div className="md:col-span-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Cliente:</span>
                            <strong className="text-white text-sm block">{pedido.cliente_nombre}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Contacto & Destino:</span>
                            <span className="text-slate-300 font-mono block">📞 {pedido.cliente_telefono || 'Sin teléfono'}</span>
                            <span className="text-slate-300 block">📍 Comuna: {pedido.comuna} {pedido.direccion ? `(${pedido.direccion})` : ''}</span>
                          </div>
                          {pedido.patente && (
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehículo / Patente:</span>
                              <span className="font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block">
                                {pedido.patente}
                              </span>
                            </div>
                          )}
                          {pedido.mecanico_asignado && (
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Mecánico asignado:</span>
                              <span className="text-emerald-400 font-bold">👨‍🔧 {pedido.mecanico_asignado}</span>
                            </div>
                          )}
                        </div>

                        {/* Columna Items del Pedido */}
                        <div className="md:col-span-7 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold mb-2">
                              Productos Solicitados:
                            </span>
                            <div className="space-y-2">
                              {(pedido.items || []).map((it, idx) => (
                                <div key={idx} className="flex justify-between items-start border-b border-slate-900 pb-1.5">
                                  <div>
                                    <strong className="text-white font-medium block">
                                      {it.nombre}
                                    </strong>
                                    {it.codigo && (
                                      <span className="text-[10px] font-mono text-amber-400">
                                        Código: {it.codigo}
                                      </span>
                                    )}
                                    {it.conInstalacion && (
                                      <span className="text-[10px] text-cyan-400 block">
                                        + Con Instalación a Domicilio (${(it.precioInstalacion || 0).toLocaleString('es-CL')})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0 ml-3">
                                    <span className="text-slate-400 font-mono">x{it.cantidad || 1}</span>
                                    <span className="text-white font-mono font-bold block">
                                      ${((it.precio || 0) * (it.cantidad || 1)).toLocaleString('es-CL')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {pedido.notas && (
                            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                              Observaciones: &ldquo;{pedido.notas}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BARRA DE ACCIÓN INFERIOR */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          {pedido.ot_generada_id ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
                              <span>✓</span> Orden de Trabajo Vinculada: <strong>{pedido.ot_generada_id}</strong>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">
                              Sin Orden de Trabajo técnica generada aún.
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-stretch sm:self-auto">
                          {/* Botón WhatsApp */}
                          {pedido.cliente_telefono && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>💬</span> WhatsApp
                            </a>
                          )}

                          {/* Botón Convertir a OT */}
                          {!pedido.ot_generada_id && (
                            <button
                              onClick={() => {
                                setModalConvertirOT(pedido);
                                setMecanicoSeleccionadoParaOT(MECANICOS_TALLER[0]);
                              }}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>📋</span> Convertir a OT
                            </button>
                          )}

                          <button
                            onClick={() => handleEliminarPedido(pedido.id)}
                            className="bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs p-2 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar pedido"
                          >
                            🗑️
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

        {/* ========================================================= */}
        {/* TAB 6: CONTROL DE INVENTARIO BATERÍAS & REPUESTOS          */}
        {/* ========================================================= */}
        {activeTab === 'inventario' && (
          <div className="space-y-6">
            {/* KPIS DE INVENTARIO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div
                onClick={() => setFilterCategoriaInv('todas')}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Unidades</div>
                <div className="text-2xl font-extrabold text-white">{kpisInventario.totalUnidades}</div>
                <div className="text-[11px] text-slate-500 mt-1">En bodega activa</div>
              </div>

              <div
                onClick={() => setFilterCategoriaInv('Baterías')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Baterías Frecuentes</div>
                <div className="text-2xl font-extrabold text-amber-300">{kpisInventario.bateriasTotal}</div>
                <div className="text-[11px] text-amber-400/70 mt-1">DIN, JIS y Start-Stop</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Stock Crítico</span>
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                </div>
                <div className="text-2xl font-extrabold text-rose-400">{kpisInventario.criticos}</div>
                <div className="text-[11px] text-rose-400/70 mt-1">≤ 3 unidades restantes</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Valoración Bodega</div>
                <div className="text-2xl font-extrabold text-emerald-300">
                  ${Math.round(kpisInventario.valorTotalCLP / 1000).toLocaleString('es-CL')}k
                </div>
                <div className="text-[11px] text-emerald-400/70 mt-1">Precio venta proyectado</div>
              </div>
            </div>

            {/* FILTROS Y BÚSQUEDA DE INVENTARIO */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Categorías */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'todas', label: 'Todo' },
                  { id: 'Baterías', label: 'Baterías Frecuentes' },
                  { id: 'Baterías Start-Stop', label: 'Start-Stop' },
                  { id: 'Lubricantes', label: 'Aceites' },
                  { id: 'Frenos', label: 'Frenos' },
                  { id: 'Accesorios', label: 'Accesorios' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategoriaInv(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterCategoriaInv === cat.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Input de Búsqueda */}
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por código (ej: DIN 55, 55D23L, Motul)..."
                  value={searchQueryInv}
                  onChange={e => setSearchQueryInv(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* TABLA / GRILLA DE CONTROL DE STOCK */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Producto / Repuesto</th>
                      <th className="py-3.5 px-3 font-bold font-mono">Código Comercial</th>
                      <th className="py-3.5 px-3 font-bold">Categoría & Ubicación</th>
                      <th className="py-3.5 px-3 font-bold text-right">Precio Venta</th>
                      <th className="py-3.5 px-3 font-bold text-center">Control de Stock</th>
                      <th className="py-3.5 px-4 font-bold text-center">Estado</th>
                      <th className="py-3.5 px-3 font-bold text-center">Reposición</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {inventarioFiltrado.map(item => {
                      const esCritico = item.stock <= (item.stockMinimo || 3);
                      const esMedio = !esCritico && item.stock <= (item.stockMinimo || 3) * 2;

                      let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                      let statusText = 'Stock Normal';
                      if (esCritico) {
                        statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse';
                        statusText = '🚨 Crítico';
                      } else if (esMedio) {
                        statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                        statusText = '⚠️ Medio';
                      }

                      const reposicionMsg = `Hola distribuidor, necesitamos cotizar reposición de stock para nuestro taller AutoBooking:\n\n📦 *Producto:* ${item.nombre}\n🏷️ *Código:* ${item.codigo}\n📊 *Stock actual:* ${item.stock} unidades\n¿Tienen disponibilidad para despacho esta semana?`;
                      const reposicionUrl = whatsappUrl(reposicionMsg);

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{item.icono || '📦'}</span>
                              <strong className="text-white font-medium block">
                                {item.nombre}
                              </strong>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 font-mono font-bold text-amber-300 text-xs">
                            {item.codigo}
                          </td>

                          <td className="py-3.5 px-3">
                            <span className="text-slate-200 block font-medium">{item.categoria}</span>
                            <span className="text-[10px] text-slate-500 block">{item.ubicacion}</span>
                          </td>

                          <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                            ${item.precioVenta.toLocaleString('es-CL')}
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
                              <button
                                onClick={() => handleAjustarStock(item.id, -1)}
                                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                                title="Descontar 1 unidad"
                              >
                                -
                              </button>
                              <span className="w-9 font-mono font-black text-sm text-center text-white">
                                {item.stock}
                              </span>
                              <button
                                onClick={() => handleAjustarStock(item.id, 1)}
                                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                                title="Agregar 1 unidad"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBadge}`}>
                              {statusText}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <a
                              href={reposicionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg transition-colors"
                              title="Pedir reposición por WhatsApp"
                            >
                              <span>📦</span> Pedir
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: DETAILING & CONTROL DE CALIDAD (7 FASES)           */}
        {/* ========================================================= */}
        {activeTab === 'detailing' && (
          <DetailingWorkstation onBackToOverview={() => setActiveTab('ordenes')} />
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL CONVERTIR PEDIDO DE TIENDA A ORDEN DE TRABAJO (OT)  */}
      {/* ========================================================= */}
      {modalConvertirOT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setModalConvertirOT(null)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📋</span>
              <h3 className="text-xl font-bold text-white">Convertir Pedido a Orden de Trabajo</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Se creará automáticamente una OT técnica oficial en el taller para coordinar la instalación en terreno.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 mb-5">
              <div>
                <span className="text-slate-500 block">Pedido:</span>
                <strong className="text-white font-mono text-sm">{modalConvertirOT.numero_pedido}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Cliente:</span>
                <span className="text-slate-200 font-bold">{modalConvertirOT.cliente_nombre}</span> ({modalConvertirOT.cliente_telefono})
              </div>
              <div>
                <span className="text-slate-500 block">Comuna y Destino:</span>
                <span className="text-slate-200">{modalConvertirOT.comuna}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total a facturar:</span>
                <span className="text-amber-400 font-mono font-bold">${Number(modalConvertirOT.total_general || 0).toLocaleString('es-CL')} CLP</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Asignar Mecánico Responsable:
              </label>
              <select
                value={mecanicoSeleccionadoParaOT}
                onChange={e => setMecanicoSeleccionadoParaOT(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-semibold"
              >
                {MECANICOS_TALLER.map(m => (
                  <option key={m} value={m}>{m} (Mecánico Terreno)</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalConvertirOT(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarConversionOT}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>✓</span> Crear Orden de Trabajo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETALLE DE CITA & NOTAS                             */}
      {/* ========================================================= */}
      {selectedCita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
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
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ESTADOS_CITAS.find(e => e.id === selectedCita.estado)?.color}`}>
                {ESTADOS_CITAS.find(e => e.id === selectedCita.estado)?.label}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {selectedCita.marca} {selectedCita.modelo}
            </h3>
            <p className="text-sm text-cyan-400 font-semibold mb-6">
              Servicio: {selectedCita.servicio}
            </p>

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
            </div>

            {selectedCita.comentario && (
              <div className="mb-6">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Comentario del cliente:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                  &ldquo;{selectedCita.comentario}&rdquo;
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs text-cyan-400 font-bold block mb-1.5">Notas Internas del Taller:</label>
              <textarea
                value={notasCitaTemp}
                onChange={e => setNotasCitaTemp(e.target.value)}
                placeholder="Observaciones de trabajo, mecánicos asignados o repuestos..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 min-h-[90px]"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleGuardarNotasCita}
                  disabled={savingNote}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {savingNote ? 'Guardando...' : 'Guardar Notas'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-400 font-semibold block mb-2">Cambiar estado del agendamiento:</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {ESTADOS_CITAS.filter(e => e.id !== 'todos').map(est => (
                  <button
                    key={est.id}
                    onClick={() => handleCambiarEstadoCita(selectedCita.id, est.id)}
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

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleEliminarCita(selectedCita.id)}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Eliminar Agendamiento
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleGenerarOTDesdeCita(selectedCita);
                      setSelectedCita(null);
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📋</span>
                    Generar OT
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

      {/* ========================================================= */}
      {/* MODAL NUEVA CITA MANUAL                                   */}
      {/* ========================================================= */}
      {showNewCitaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNewCitaModal(false)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-white mb-1">Registrar Cita en Taller</h3>
            <p className="text-xs text-slate-400 mb-6">Ingresa los datos para registrar un agendamiento directo.</p>

            <form onSubmit={handleCrearCitaManual} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Patente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: ABCD-12"
                    value={newCitaForm.patente}
                    onChange={e => setNewCitaForm({ ...newCitaForm, patente: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Kilometraje</label>
                  <input
                    type="number"
                    placeholder="Ej: 50000"
                    value={newCitaForm.km}
                    onChange={e => setNewCitaForm({ ...newCitaForm, km: e.target.value })}
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
                    value={newCitaForm.marca}
                    onChange={e => setNewCitaForm({ ...newCitaForm, marca: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: RAV4"
                    value={newCitaForm.modelo}
                    onChange={e => setNewCitaForm({ ...newCitaForm, modelo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Servicio *</label>
                <select
                  value={newCitaForm.servicio}
                  onChange={e => setNewCitaForm({ ...newCitaForm, servicio: e.target.value })}
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
                    value={newCitaForm.fecha}
                    onChange={e => setNewCitaForm({ ...newCitaForm, fecha: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Horario *</label>
                  <select
                    value={newCitaForm.horario}
                    onChange={e => setNewCitaForm({ ...newCitaForm, horario: e.target.value })}
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
                    value={newCitaForm.nombre}
                    onChange={e => setNewCitaForm({ ...newCitaForm, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Teléfono Cliente *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={newCitaForm.telefono}
                    onChange={e => setNewCitaForm({ ...newCitaForm, telefono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewCitaModal(false)}
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

      {/* ========================================================= */}
      {/* MODAL CREAR / EDITAR ORDEN DE TRABAJO (OT)                */}
      {/* ========================================================= */}
      {(showNewOTModal || selectedOT) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full relative shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowNewOTModal(false);
                setSelectedOT(null);
              }}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Encabezado */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono font-extrabold text-base text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-lg">
                {selectedOT ? selectedOT.numero_ot : 'NUEVA ORDEN DE TRABAJO'}
              </span>
              {selectedOT && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ESTADOS_OT.find(e => e.id === selectedOT.estado)?.color}`}>
                  {ESTADOS_OT.find(e => e.id === selectedOT.estado)?.label}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {selectedOT ? `${selectedOT.marca} ${selectedOT.modelo} (${selectedOT.patente})` : 'Crear Orden de Trabajo (OT)'}
            </h3>

            {/* FORMULARIO CREACIÓN O EDICIÓN */}
            {selectedOT ? (
              // VISTA DE EDICIÓN DE OT EXISTENTE
              <div className="space-y-6 text-xs">
                {/* Selector rápido de estado */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-2">Estado del vehículo en taller:</span>
                  <div className="flex flex-wrap gap-2">
                    {ESTADOS_OT.filter(e => e.id !== 'todos').map(est => (
                      <button
                        key={est.id}
                        onClick={() => handleCambiarEstadoOT(selectedOT.id, est.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedOT.estado === est.id
                            ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {est.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Datos del Cliente y Vehículo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Cliente:</span>
                    <span className="font-bold text-slate-200 text-sm">{selectedOT.cliente_nombre}</span>
                    <span className="text-slate-400 block mt-0.5">📞 {selectedOT.cliente_telefono}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mecánico Asignado:</span>
                    <select
                      value={selectedOT.mecanico_asignado}
                      onChange={async e => {
                        const val = e.target.value;
                        const updated = await updateOrden(selectedOT.id, { mecanico_asignado: val });
                        setOrdenes(prev => prev.map(o => (o.id === selectedOT.id ? updated : o)));
                        setSelectedOT(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-semibold mt-1"
                    >
                      {MECANICOS_TALLER.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Trabajos y Mano de Obra */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>🛠️</span> Mano de Obra & Trabajos
                    </h4>
                    <span className="text-cyan-400 font-bold">
                      Subtotal: ${(selectedOT.total_mano_obra || 0).toLocaleString('es-CL')}
                    </span>
                  </div>

                  {/* Lista de trabajos */}
                  <div className="space-y-2">
                    {(selectedOT.trabajos || []).map(t => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800"
                      >
                        <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={Boolean(t.completado)}
                            onChange={() => handleToggleTrabajoOT(selectedOT.id, t.id)}
                            className="w-4 h-4 accent-cyan-500 rounded"
                          />
                          <span className={`text-xs ${t.completado ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                            {t.descripcion}
                          </span>
                        </label>
                        <span className="font-mono text-slate-300 font-semibold">
                          ${(t.precio || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Agregar nuevo trabajo */}
                  <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                    <input
                      type="text"
                      placeholder="Nueva labor o mantención..."
                      value={nuevoTrabajoDesc}
                      onChange={e => setNuevoTrabajoDesc(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500"
                    />
                    <input
                      type="number"
                      placeholder="Precio CLP"
                      value={nuevoTrabajoPrecio}
                      onChange={e => setNuevoTrabajoPrecio(e.target.value)}
                      className="w-28 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500"
                    />
                    <button
                      onClick={handleAgregarTrabajoEnSelectedOT}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>

                {/* Repuestos e Insumos */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>📦</span> Repuestos & Materiales
                    </h4>
                    <span className="text-cyan-400 font-bold">
                      Subtotal: ${(selectedOT.total_repuestos || 0).toLocaleString('es-CL')}
                    </span>
                  </div>

                  {/* Lista de repuestos */}
                  <div className="space-y-2">
                    {(selectedOT.repuestos || []).length === 0 ? (
                      <p className="text-slate-500 text-xs py-1">No hay repuestos asociados a esta orden.</p>
                    ) : (
                      (selectedOT.repuestos || []).map(r => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs"
                        >
                          <span className="text-slate-200 font-medium">
                            {r.repuesto} <span className="text-slate-500">x{r.cantidad}</span>
                          </span>
                          <span className="font-mono text-slate-300 font-semibold">
                            ${((r.precio || 0) * (r.cantidad || 1)).toLocaleString('es-CL')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Agregar nuevo repuesto */}
                  <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                    <input
                      type="text"
                      placeholder="Nombre repuesto (ej: Filtro aceite)..."
                      value={nuevoRepuestoNombre}
                      onChange={e => setNuevoRepuestoNombre(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500"
                    />
                    <input
                      type="number"
                      placeholder="Cant."
                      value={nuevoRepuestoCant}
                      onChange={e => setNuevoRepuestoCant(e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                    <input
                      type="number"
                      placeholder="Precio Unit."
                      value={nuevoRepuestoPrecio}
                      onChange={e => setNuevoRepuestoPrecio(e.target.value)}
                      className="w-28 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500"
                    />
                    <button
                      onClick={handleAgregarRepuestoEnSelectedOT}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>

                {/* Resumen Total y Acciones */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">Total Presupuestado (Mano de obra + Repuestos):</span>
                    <span className="text-2xl font-extrabold text-cyan-400">
                      ${Number(selectedOT.total_general || 0).toLocaleString('es-CL')} CLP
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => notificarOTPorWhatsApp(selectedOT)}
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>💬</span> WhatsApp
                    </button>
                    <button
                      onClick={() => handleImprimirOT(selectedOT)}
                      className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🖨️</span> Imprimir Hoja
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleEliminarOT(selectedOT.id)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold hover:underline cursor-pointer"
                  >
                    Eliminar Orden de Trabajo
                  </button>
                  <button
                    onClick={() => setSelectedOT(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2 rounded-xl cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              // FORMULARIO DE CREACIÓN DE NUEVA OT
              <form onSubmit={handleCrearOT} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Patente *</label>
                    <input
                      type="text"
                      required
                      placeholder="ABCD-12"
                      value={newOTForm.patente}
                      onChange={e => setNewOTForm({ ...newOTForm, patente: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Marca *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Toyota"
                      value={newOTForm.marca}
                      onChange={e => setNewOTForm({ ...newOTForm, marca: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Modelo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: RAV4"
                      value={newOTForm.modelo}
                      onChange={e => setNewOTForm({ ...newOTForm, modelo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Año</label>
                    <input
                      type="text"
                      placeholder="2020"
                      value={newOTForm.ano}
                      onChange={e => setNewOTForm({ ...newOTForm, ano: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Nombre Cliente *</label>
                    <input
                      type="text"
                      required
                      placeholder="Juan Pérez"
                      value={newOTForm.cliente_nombre}
                      onChange={e => setNewOTForm({ ...newOTForm, cliente_nombre: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Teléfono Cliente *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={newOTForm.cliente_telefono}
                      onChange={e => setNewOTForm({ ...newOTForm, cliente_telefono: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Mecánico Asignado</label>
                    <select
                      value={newOTForm.mecanico_asignado}
                      onChange={e => setNewOTForm({ ...newOTForm, mecanico_asignado: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    >
                      {MECANICOS_TALLER.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Diagnóstico / Motivo de Ingreso</label>
                  <textarea
                    rows={2}
                    placeholder="Describe los síntomas, fallas o requerimientos del cliente..."
                    value={newOTForm.diagnostico}
                    onChange={e => setNewOTForm({ ...newOTForm, diagnostico: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                {/* Checklist rápido */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-bold block">Checklist de Recepción:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={newOTForm.checklist.luces}
                        onChange={e => setNewOTForm({
                          ...newOTForm,
                          checklist: { ...newOTForm.checklist, luces: e.target.checked }
                        })}
                        className="accent-cyan-500"
                      />
                      Luces operativas
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={newOTForm.checklist.ruedaRepuesto}
                        onChange={e => setNewOTForm({
                          ...newOTForm,
                          checklist: { ...newOTForm.checklist, ruedaRepuesto: e.target.checked }
                        })}
                        className="accent-cyan-500"
                      />
                      Rueda repuesto
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={newOTForm.checklist.documentos}
                        onChange={e => setNewOTForm({
                          ...newOTForm,
                          checklist: { ...newOTForm.checklist, documentos: e.target.checked }
                        })}
                        className="accent-cyan-500"
                      />
                      Documentos
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Comb.:</span>
                      <select
                        value={newOTForm.checklist.combustible}
                        onChange={e => setNewOTForm({
                          ...newOTForm,
                          checklist: { ...newOTForm.checklist, combustible: e.target.value }
                        })}
                        className="bg-slate-900 border border-slate-800 rounded p-1 text-slate-200"
                      >
                        <option>1/4</option>
                        <option>1/2</option>
                        <option>3/4</option>
                        <option>Lleno</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewOTModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-colors cursor-pointer"
                  >
                    Guardar e Ingresar OT
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA DE IMPRESIÓN (HOJA DE TRABAJO TALLER)                */}
      {/* ========================================================= */}
      {showPrintModal && printOTData && (
        <div className="fixed inset-0 z-50 bg-white text-slate-950 p-8 overflow-y-auto print:block">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h1 className="text-2xl font-black">AutoBooking — Taller Automotriz</h1>
                <p className="text-xs text-slate-600">Hoja de Trabajo y Recepción de Vehículo</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-bold">{printOTData.numero_ot}</span>
                <span className="block text-xs text-slate-500">Fecha: {new Date(printOTData.created_at).toLocaleDateString('es-CL')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border p-3 rounded-lg bg-slate-50">
              <div>
                <p><strong>Cliente:</strong> {printOTData.cliente_nombre}</p>
                <p><strong>Teléfono:</strong> {printOTData.cliente_telefono}</p>
                <p><strong>Mecánico a cargo:</strong> {printOTData.mecanico_asignado}</p>
              </div>
              <div>
                <p><strong>Patente:</strong> <span className="font-mono font-bold text-sm">{printOTData.patente}</span></p>
                <p><strong>Vehículo:</strong> {printOTData.marca} {printOTData.modelo} ({printOTData.ano || 'S/A'})</p>
                <p><strong>Kilometraje:</strong> {printOTData.km ? `${printOTData.km} km` : 'No indicado'}</p>
              </div>
            </div>

            <div className="text-xs">
              <h3 className="font-bold border-b pb-1 mb-2">Diagnóstico Inicial:</h3>
              <p className="italic text-slate-700">{printOTData.diagnostico || 'Sin observaciones'}</p>
            </div>

            <div className="text-xs">
              <h3 className="font-bold border-b pb-1 mb-2">Labores y Trabajos:</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-1">Descripción</th>
                    <th className="py-1 text-right">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {(printOTData.trabajos || []).map((t, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-1.5">[ ] {t.descripcion}</td>
                      <td className="py-1.5 text-right font-mono">${(t.precio || 0).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs">
              <h3 className="font-bold border-b pb-1 mb-2">Repuestos Requeridos:</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-1">Repuesto</th>
                    <th className="py-1 text-center">Cant.</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(printOTData.repuestos || []).map((r, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-1.5">{r.repuesto}</td>
                      <td className="py-1.5 text-center">{r.cantidad}</td>
                      <td className="py-1.5 text-right font-mono">${((r.precio || 0) * (r.cantidad || 1)).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-3 flex justify-between items-center text-sm font-bold">
              <span>Total Estimado a Pagar:</span>
              <span className="text-lg font-mono">${Number(printOTData.total_general || 0).toLocaleString('es-CL')} CLP</span>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-10 text-center text-xs">
              <div className="border-t pt-2">Firma Mecánico a Cargo</div>
              <div className="border-t pt-2">Firma y Aprobación Cliente</div>
            </div>

            <div className="flex justify-center gap-3 pt-6 print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-cyan-600 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Imprimir Ahora
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="bg-slate-300 text-slate-800 font-bold px-5 py-2 rounded-xl text-xs"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL EDITAR MENSAJE DE RECORDATORIO (WHATSAPP)          */}
      {/* ========================================================= */}
      {modalEditarMensaje && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl">
            <button
              onClick={() => setModalEditarMensaje(null)}
              className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✏️</span>
              <h3 className="text-xl font-bold text-white">Personalizar Mensaje de WhatsApp</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Vehículo: <strong>{modalEditarMensaje.item.marca} {modalEditarMensaje.item.modelo} ({modalEditarMensaje.item.patente})</strong> — Cliente: {modalEditarMensaje.item.cliente}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Texto del mensaje a enviar:
              </label>
              <textarea
                rows="8"
                value={modalEditarMensaje.mensaje}
                onChange={(e) => setModalEditarMensaje({ ...modalEditarMensaje, mensaje: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalEditarMensaje(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEnviarWhatsAppRecordatorio(modalEditarMensaje.item, modalEditarMensaje.mensaje);
                  setModalEditarMensaje(null);
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>📲</span>
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
