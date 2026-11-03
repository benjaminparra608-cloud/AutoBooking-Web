'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { DEFAULT_USER_VEHICLES, AUTOPOINTS_REWARDS } from '../lib/emergencyCatalog';
import { whatsappUrl } from '../lib/config';

export default function CuentaPage() {
  // Perfil del conductor
  const [profile, setProfile] = useState({
    nombre: 'Cristóbal Morales',
    email: 'cristobal.conductor@autobooking.cl',
    telefono: '+56 9 8267 4570',
    comuna: 'Las Condes, Santiago',
    verificado: false,
    codigoReferido: 'AB-CRIS80',
  });

  // Estado de pestañas activas dentro de Mi Cuenta
  const [activeSection, setActiveSection] = useState('autos'); // 'autos' | 'reservas' | 'puntos' | 'referidos' | 'ajustes'

  // Vehículos y Billetera Digital de Documentos
  const [vehicles, setVehicles] = useState(DEFAULT_USER_VEHICLES);
  const [selectedVehicleIdx, setSelectedVehicleIdx] = useState(0);
  const [newVehicleModal, setNewVehicleModal] = useState(false);
  const [newVehicleForm, setNewVehicleForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    anio: '2023',
    kilometraje: '25000',
  });

  // Puntos AutoPoints y cupones canjeados
  const [autoPoints, setAutoPoints] = useState(160);
  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  // Modal de verificación de teléfono ("Conviértete en usuario verificado")
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('4829');

  // Solicitudes SOS o reservas guardadas localmente
  const [sosHistory, setSosHistory] = useState([]);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('autobooking_driver_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedVehicles = localStorage.getItem('autobooking_driver_vehicles');
      if (savedVehicles) setVehicles(JSON.parse(savedVehicles));

      const savedPoints = localStorage.getItem('autobooking_driver_points');
      if (savedPoints) setAutoPoints(Number(savedPoints));

      const savedRedeemed = localStorage.getItem('autobooking_driver_redeemed');
      if (savedRedeemed) setRedeemedCodes(JSON.parse(savedRedeemed));

      const savedSos = localStorage.getItem('autobooking_sos_requests');
      if (savedSos) setSosHistory(JSON.parse(savedSos));
    } catch {
      // ignore storage errors
    }
  }, []);

  function saveProfile(updated) {
    setProfile(updated);
    try {
      localStorage.setItem('autobooking_driver_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function handleVerifyPhone() {
    const updated = { ...profile, verificado: true };
    saveProfile(updated);
    const nextPts = autoPoints + 40;
    setAutoPoints(nextPts);
    try {
      localStorage.setItem('autobooking_driver_points', String(nextPts));
    } catch {
      // ignore
    }
    setVerifyModalOpen(false);
  }

  function handleAddVehicle(e) {
    e.preventDefault();
    if (!newVehicleForm.patente.trim() || !newVehicleForm.marca.trim()) return;
    const created = {
      id: `veh-${Date.now()}`,
      patente: newVehicleForm.patente.trim().toUpperCase(),
      marca: newVehicleForm.marca.trim(),
      modelo: newVehicleForm.modelo.trim() || 'Modelo Estándar',
      anio: Number(newVehicleForm.anio) || 2023,
      kilometraje: Number(newVehicleForm.kilometraje) || 0,
      combustible: 'Gasolina 95',
      vin: 'VIN-POR-VERIFICAR',
      documentos: [
        {
          id: 'doc-rt',
          nombre: 'Revisión Técnica y Gases',
          vence: '2027-05-30',
          estado: 'al_dia',
          entidad: 'Planta PRT Certificada',
          folio: 'PRT-NUEVO',
        },
        {
          id: 'doc-soap',
          nombre: 'Seguro Obligatorio (SOAP)',
          vence: '2027-03-31',
          estado: 'al_dia',
          entidad: 'Aseguradora Nacional',
          folio: 'SOAP-ACTIVO',
        },
        {
          id: 'doc-permiso',
          nombre: 'Permiso de Circulación',
          vence: '2027-03-31',
          estado: 'al_dia',
          entidad: 'Dirección de Tránsito Municipal',
          folio: 'PC-VIGENTE',
        },
        {
          id: 'doc-padron',
          nombre: 'Padrón / Certificado de Inscripción',
          vence: 'Indefinido',
          estado: 'al_dia',
          entidad: 'Registro Civil',
          folio: 'RVM-OK',
        },
      ],
    };

    const nextList = [...vehicles, created];
    setVehicles(nextList);
    setSelectedVehicleIdx(nextList.length - 1);
    setNewVehicleModal(false);
    setNewVehicleForm({ patente: '', marca: '', modelo: '', anio: '2023', kilometraje: '25000' });
    try {
      localStorage.setItem('autobooking_driver_vehicles', JSON.stringify(nextList));
    } catch {
      // ignore
    }
  }

  function handleCycleDocStatus(docId) {
    const order = ['al_dia', 'proximo', 'vencido'];
    const updatedVehicles = vehicles.map((v, idx) => {
      if (idx !== selectedVehicleIdx) return v;
      return {
        ...v,
        documentos: v.documentos.map((d) => {
          if (d.id !== docId) return d;
          const nextState = order[(order.indexOf(d.estado) + 1) % order.length];
          return { ...d, estado: nextState };
        }),
      };
    });
    setVehicles(updatedVehicles);
    try {
      localStorage.setItem('autobooking_driver_vehicles', JSON.stringify(updatedVehicles));
    } catch {
      // ignore
    }
  }

  function handleRedeemReward(reward) {
    if (redeemedCodes.includes(reward.code)) return;
    if (autoPoints < reward.costPoints) return;
    const nextPts = autoPoints - reward.costPoints;
    const nextRedeemed = [...redeemedCodes, reward.code];
    setAutoPoints(nextPts);
    setRedeemedCodes(nextRedeemed);
    try {
      localStorage.setItem('autobooking_driver_points', String(nextPts));
      localStorage.setItem('autobooking_driver_redeemed', JSON.stringify(nextRedeemed));
    } catch {
      // ignore
    }
  }

  function handleCopyText(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(''), 2500);
    }
  }

  const activeVehicle = vehicles[selectedVehicleIdx] || vehicles[0];
  const referralShareUrl = `https://autobooking.cl/?ref=${profile.codigoReferido}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0d1117&color=60a5fa&data=${encodeURIComponent(
    referralShareUrl
  )}`;

  return (
    <div className="min-h-screen bg-[#080a0d] text-white pb-28 md:pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 md:pt-12">
        {/* ========================================================= */}
        {/* 1. CABECERA DE PERFIL + BANNER DE VERIFICACIÓN            */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
          {/* Tarjeta principal del conductor */}
          <div className="lg:col-span-7 bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-600/25 shrink-0">
                {profile.nombre
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-white">{profile.nombre}</h1>
                  {profile.verificado ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      ✓ Conductor Verificado
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                      Verificación pendiente
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/55 mt-0.5">{profile.email}</p>
                <p className="text-xs text-white/45 mt-0.5">
                  📍 {profile.comuna} · 📱 {profile.telefono}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-center justify-between sm:justify-end bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block">
                  Saldo AutoPoints
                </span>
                <span className="text-2xl font-black text-white">{autoPoints} pts</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('puntos')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white cursor-pointer"
              >
                Canjear
              </button>
            </div>
          </div>

          {/* Banner "Conviértete en usuario verificado" (Estilo Portal Motores en tema oscuro) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/45 via-[#0d1117] to-[#0d1117] border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-between">
            {profile.verificado ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                  Seguridad Activa
                </span>
                <h2 className="text-base font-bold text-white">
                  Tu teléfono y cuenta de conductor están verificados
                </h2>
                <p className="text-xs text-white/60 leading-relaxed">
                  Tienes despacho prioritario en emergencias SOS 24/7 y alertas automáticas de vencimiento de
                  Revisión Técnica y SOAP.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                    Seguridad y Beneficios (+40 pts)
                  </span>
                  <h2 className="text-base font-bold text-white mb-1">
                    Conviértete en un conductor verificado
                  </h2>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">
                    Verifica tu número móvil para habilitar rescate SOS en 1 clic, alertas de documentos por
                    WhatsApp y recibir <strong>+40 AutoPoints</strong> de regalo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Verificar mi teléfono ahora →
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. GRILLA DE 6 ACCESOS RÁPIDOS (ESTILO PORTAL MOTORES)    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            {
              id: 'reservas',
              label: 'Reservas & SOS',
              sub: `${sosHistory.length + 1} activas`,
              icon: '📅',
              action: () => setActiveSection('reservas'),
            },
            {
              id: 'autos',
              label: 'Mis Autos',
              sub: `${vehicles.length} registrado(s)`,
              icon: '🚗',
              action: () => setActiveSection('autos'),
            },
            {
              id: 'cotizaciones',
              label: 'Cotizaciones',
              sub: 'Precios al instante',
              icon: '📋',
              href: '/#agendar',
            },
            {
              id: 'compras',
              label: 'Mis Puntos',
              sub: `${autoPoints} AutoPoints`,
              icon: '🎁',
              action: () => setActiveSection('puntos'),
            },
            {
              id: 'referidos',
              label: 'Trae a un amigo',
              sub: 'Gana +80 pts',
              icon: '🤝',
              action: () => setActiveSection('referidos'),
            },
            {
              id: 'conversaciones',
              label: 'Conversaciones',
              sub: 'WhatsApp directo',
              icon: '💬',
              external: whatsappUrl('Hola AutoBooking, escribo desde Mi Cuenta de conductor.'),
            },
          ].map((card) => {
            const isSelected = activeSection === card.id;
            const content = (
              <>
                <span className="text-2xl mb-2 block">{card.icon}</span>
                <strong className="text-xs font-bold text-white block">{card.label}</strong>
                <span className="text-[11px] text-white/45 block mt-0.5">{card.sub}</span>
              </>
            );

            if (card.href) {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="bg-[#0d1117] hover:bg-[#121824] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl p-4 text-left transition-all"
                >
                  {content}
                </Link>
              );
            }
            if (card.external) {
              return (
                <a
                  key={card.id}
                  href={card.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0d1117] hover:bg-[#121824] border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-4 text-left transition-all"
                >
                  {content}
                </a>
              );
            }
            return (
              <button
                key={card.id}
                type="button"
                onClick={card.action}
                className={`rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-600/10'
                    : 'bg-[#0d1117] hover:bg-[#121824] border-white/[0.08]'
                }`}
              >
                {content}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. SECCIÓN DINÁMICA SEGÚN TAB SELECCIONADA                */}
        {/* ========================================================= */}

        {/* TAB A: MIS AUTOS & BILLETERA DIGITAL DE DOCUMENTOS */}
        {activeSection === 'autos' && (
          <section className="space-y-6 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
                  Guantera Digital Inteligente
                </span>
                <h2 className="text-2xl font-black text-white">
                  Mis Vehículos y Documentación Legal
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setNewVehicleModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer self-start sm:self-auto"
              >
                + Agregar otro vehículo
              </button>
            </div>

            {/* Selector de autos registrados */}
            <div className="flex flex-wrap gap-2.5">
              {vehicles.map((veh, idx) => (
                <button
                  key={veh.id}
                  type="button"
                  onClick={() => setSelectedVehicleIdx(idx)}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-all ${
                    selectedVehicleIdx === idx
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-[#0d1117] text-white/70 border-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="px-2 py-0.5 rounded bg-black/30 font-mono text-[11px]">
                    {veh.patente}
                  </span>
                  <span>
                    {veh.marca} {veh.modelo} ({veh.anio})
                  </span>
                </button>
              ))}
            </div>

            {/* Ficha del vehículo seleccionado + Documentos */}
            {activeVehicle && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Tarjeta resumen del auto */}
                <div className="lg:col-span-5 bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.1] font-mono text-sm font-black tracking-widest text-white">
                        🇨🇱 {activeVehicle.patente}
                      </span>
                      <span className="text-xs text-white/50">Año {activeVehicle.anio}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-1">
                      {activeVehicle.marca} {activeVehicle.modelo}
                    </h3>
                    <p className="text-xs text-white/50 mb-5">
                      Odómetro estimado: {Number(activeVehicle.kilometraje).toLocaleString('es-CL')} km ·{' '}
                      {activeVehicle.combustible}
                    </p>

                    <div className="space-y-2.5 border-t border-white/[0.06] pt-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/50">Próxima mantención sugerida:</span>
                        <span className="text-white font-semibold">
                          {(Math.ceil(activeVehicle.kilometraje / 10000) * 10000).toLocaleString('es-CL')} km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Pasaporte Digital QR:</span>
                        <Link
                          href={`/historial/${encodeURIComponent(activeVehicle.patente)}`}
                          className="text-blue-400 hover:underline font-semibold"
                        >
                          Ver certificado →
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Rastreo en Taller:</span>
                        <Link
                          href={`/estado/${encodeURIComponent(activeVehicle.patente)}`}
                          className="text-emerald-400 hover:underline font-semibold"
                        >
                          Ver estado en vivo →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <Link
                      href="/#agendar"
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center"
                    >
                      Agendar Mantención
                    </Link>
                    <Link
                      href="/emergencia"
                      className="py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 font-bold text-xs text-center"
                    >
                      Pedir Auxilio SOS
                    </Link>
                  </div>
                </div>

                {/* Billetera de 4 Documentos del Vehículo */}
                <div className="lg:col-span-7 bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Documentos del Vehículo ({activeVehicle.patente})
                      </h3>
                      <p className="text-xs text-white/50">
                        Haz clic en el estado de cualquier documento para actualizar su vigencia.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeVehicle.documentos.map((doc) => {
                      const badgeStyle =
                        doc.estado === 'al_dia'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : doc.estado === 'proximo'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-300';

                      const badgeText =
                        doc.estado === 'al_dia'
                          ? 'Al día'
                          : doc.estado === 'proximo'
                          ? 'Próximo a vencer'
                          : 'Vencido';

                      return (
                        <div
                          key={doc.id}
                          className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <strong className="text-xs font-bold text-white leading-snug">
                                {doc.nombre}
                              </strong>
                              <button
                                type="button"
                                onClick={() => handleCycleDocStatus(doc.id)}
                                className={`px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 cursor-pointer ${badgeStyle}`}
                                title="Clic para cambiar estado"
                              >
                                {badgeText}
                              </button>
                            </div>
                            <p className="text-[11px] text-white/50">{doc.entidad}</p>
                            <p className="text-[11px] text-white/40 font-mono mt-0.5">
                              Folio: {doc.folio}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px]">
                            <span className="text-white/45">Vencimiento: {doc.vence}</span>
                            {doc.id === 'doc-rt' && doc.estado !== 'al_dia' && (
                              <Link href="/#agendar" className="text-blue-400 font-semibold hover:underline">
                                Agendar Pre-PRT →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB B: RESERVAS & SOLICITUDES SOS */}
        {activeSection === 'reservas' && (
          <section className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
                  Agenda & Emergencias
                </span>
                <h2 className="text-xl font-black text-white">Mis Reservas y Asistencias en Ruta</h2>
              </div>
              <Link
                href="/#agendar"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                + Nueva Reserva
              </Link>
            </div>

            <div className="space-y-3">
              {/* Reserva preventiva de ejemplo */}
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold uppercase">
                    Mantención Programada
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Mantención 40.000 KM + Escáner OBD2 — Mazda CX-5 (PJKW-84)
                  </h3>
                  <p className="text-xs text-white/50">
                    Modalidad: A domicilio en {profile.comuna} · Valor estimado: $65.000
                  </p>
                </div>
                <Link
                  href="/estado/PJKW-84"
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white shrink-0 text-center"
                >
                  Ver Tracker en Vivo →
                </Link>
              </div>

              {/* Solicitudes SOS guardadas */}
              {sosHistory.map((sos) => (
                <div
                  key={sos.id}
                  className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase">
                      Emergencia SOS · {sos.id}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {sos.serviceTitle} ({sos.patente})
                    </h3>
                    <p className="text-xs text-white/55">
                      {sos.comuna} · {sos.createdAt} · Tarifa: ${Number(sos.price).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <Link
                    href="/emergencia"
                    className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white shrink-0 text-center"
                  >
                    Ver Detalle SOS
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB C: MIS PUNTOS AUTOPOINTS & CUPONES (FASE 4) */}
        {activeSection === 'puntos' && (
          <section className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
                  Club de Beneficios AutoBooking
                </span>
                <h2 className="text-2xl font-black text-white">
                  Mis Puntos y Promociones Disponibles
                </h2>
                <p className="text-xs text-white/55 mt-1">
                  Acumula puntos en cada mantención, compra de batería o invitando amigos.
                </p>
              </div>
              <div className="bg-blue-600/15 border border-blue-500/30 rounded-2xl px-5 py-3 text-right">
                <span className="text-[10px] uppercase tracking-wider text-blue-300 font-bold block">
                  Puntos Disponibles
                </span>
                <span className="text-3xl font-black text-white">{autoPoints} pts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AUTOPOINTS_REWARDS.map((rew) => {
                const isRedeemed = redeemedCodes.includes(rew.code);
                const canAfford = autoPoints >= rew.costPoints;
                return (
                  <div
                    key={rew.id}
                    className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold">
                          {rew.badge}
                        </span>
                        <span className="text-sm font-black text-amber-400">
                          {rew.costPoints} AutoPoints
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{rew.title}</h3>
                      <p className="text-xs text-white/55 leading-relaxed">{rew.description}</p>
                    </div>

                    {isRedeemed ? (
                      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-300 block">Cupón desbloqueado:</span>
                          <strong className="text-sm font-mono text-white">{rew.code}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(rew.code)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                        >
                          {copiedCode === rew.code ? '¡Copiado!' : 'Copiar código'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleRedeemReward(rew)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-white/[0.04] text-white/35 cursor-not-allowed'
                        }`}
                      >
                        {canAfford
                          ? `Canjear por ${rew.costPoints} pts`
                          : `Te faltan ${rew.costPoints - autoPoints} pts`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB D: TRAE A UN AMIGO (QR + +80 PUNTOS - FASE 4) */}
        {activeSection === 'referidos' && (
          <section className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  🎁 Programa de Referidos AutoBooking
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  ¡Invita a un amigo y gana +80 AutoPoints!
                </h2>
                <p className="text-sm text-white/65 leading-relaxed">
                  Comparte tu código personal o pide a tu amigo que escanee tu código QR. Cuando realice su
                  primera mantención, compra de batería o asistencia en ruta, ambos reciben{' '}
                  <strong className="text-white">+80 AutoPoints</strong> equivalentes a descuentos directos.
                </p>

                <div className="bg-black/40 border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/45 block">
                      Tu código único de embajador
                    </span>
                    <strong className="text-xl font-mono font-black text-blue-400">
                      {profile.codigoReferido}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyText(profile.codigoReferido)}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white cursor-pointer"
                    >
                      {copiedCode === profile.codigoReferido ? '✓ Copiado' : 'Copiar código'}
                    </button>
                    <a
                      href={whatsappUrl(
                        `¡Hola! Te regalo descuento en tu próxima mantención o emergencia automotriz 24/7 en AutoBooking usando mi código ${profile.codigoReferido}: ${referralShareUrl}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                    >
                      Compartir por WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 text-center">
                <div className="p-3 rounded-2xl bg-[#0d1117] border border-blue-500/30 mb-3">
                  <img
                    src={qrImageUrl}
                    alt="Código QR de Referido AutoBooking"
                    className="w-40 h-40 rounded-xl"
                  />
                </div>
                <strong className="text-xs font-bold text-white block">
                  Escanea para compartir en persona
                </strong>
                <span className="text-[11px] text-white/45">
                  Aplica para servicios a domicilio y rescate SOS
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 4. MI CUENTA & DESCUBRE (ESTILO PORTAL MOTORES)           */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Configuración de Mi Cuenta */}
          <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">
              Ajustes de Mi Cuenta
            </h3>

            {[
              {
                title: 'Direcciones guardadas',
                sub: `${profile.comuna} (Domicilio principal y Oficina)`,
                badge: '2 activas',
                onClick: () => setActiveSection('autos'),
              },
              {
                title: 'Métodos de pago y facturación',
                sub: 'Transferencia electrónica, Webpay y factura empresa (RUT)',
                badge: 'Configurado',
                onClick: () => setActiveSection('puntos'),
              },
              {
                title: 'Trae a un amigo (+80 pts)',
                sub: `Código activo: ${profile.codigoReferido}`,
                badge: 'QR listo',
                onClick: () => setActiveSection('referidos'),
              },
              {
                title: 'Mis Puntos y Beneficios',
                sub: `${autoPoints} AutoPoints acumulados para canje`,
                badge: 'Canjear',
                onClick: () => setActiveSection('puntos'),
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.onClick}
                className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <strong className="text-xs font-bold text-white block">{item.title}</strong>
                  <span className="text-[11px] text-white/50">{item.sub}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[10px] font-semibold text-blue-300">
                  {item.badge} →
                </span>
              </button>
            ))}
          </div>

          {/* Columna 2: Descubre más en AutoBooking */}
          <div className="bg-[#0d1117] border border-white/[0.08] rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">
              Descubre en AutoBooking
            </h3>

            <Link
              href="/emergencia"
              className="w-full p-3.5 rounded-2xl bg-rose-950/25 hover:bg-rose-950/40 border border-rose-500/30 flex items-center justify-between transition-all"
            >
              <div>
                <strong className="text-xs font-bold text-rose-200 block">
                  Emergencias SOS 24/7 sin seguro
                </strong>
                <span className="text-[11px] text-white/55">
                  Grúas, puente de batería, neumáticos y cerrajería en minutos
                </span>
              </div>
              <span className="text-xs font-bold text-rose-400">SOS →</span>
            </Link>

            <Link
              href="/telemetria"
              className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between transition-all"
            >
              <div>
                <strong className="text-xs font-bold text-white block">
                  Consumo de Combustible & Telemetría GPS
                </strong>
                <span className="text-[11px] text-white/50">
                  Calcula gasto de bencina, desgaste de piezas y restricción vehicular
                </span>
              </div>
              <span className="text-xs font-bold text-blue-400">Abrir →</span>
            </Link>

            <Link
              href="/historial"
              className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between transition-all"
            >
              <div>
                <strong className="text-xs font-bold text-white block">
                  Pasaporte Digital Automotriz QR
                </strong>
                <span className="text-[11px] text-white/50">
                  Aumenta el valor de reventa de tu auto con historial certificado
                </span>
              </div>
              <span className="text-xs font-bold text-blue-400">Ver QR →</span>
            </Link>

            <Link
              href="/planes"
              className="w-full p-3.5 rounded-2xl bg-blue-950/25 hover:bg-blue-950/40 border border-blue-500/25 flex items-center justify-between transition-all"
            >
              <div>
                <strong className="text-xs font-bold text-blue-200 block">
                  ¿Tienes un taller mecánico o grúa? Súmate a la red
                </strong>
                <span className="text-[11px] text-white/55">
                  Conoce nuestro software SaaS multi-taller y recibe órdenes
                </span>
              </div>
              <span className="text-xs font-bold text-blue-400">Planes →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL: AGREGAR NUEVO VEHÍCULO A LA BILLETERA              */}
      {/* ========================================================= */}
      {newVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddVehicle}
            className="bg-[#0d1117] border border-white/[0.12] rounded-3xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-black text-white">Registrar Vehículo en Mi Guantera</h3>
              <button
                type="button"
                onClick={() => setNewVehicleModal(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Patente (formato chileno)</label>
              <input
                type="text"
                required
                value={newVehicleForm.patente}
                onChange={(e) =>
                  setNewVehicleForm({ ...newVehicleForm, patente: e.target.value.toUpperCase() })
                }
                placeholder="Ej. ABCD-12"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Marca</label>
                <input
                  type="text"
                  required
                  value={newVehicleForm.marca}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, marca: e.target.value })}
                  placeholder="Ej. Toyota"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Modelo</label>
                <input
                  type="text"
                  required
                  value={newVehicleForm.modelo}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, modelo: e.target.value })}
                  placeholder="Ej. RAV4 Hybrid"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Año</label>
                <input
                  type="number"
                  value={newVehicleForm.anio}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, anio: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Kilometraje actual</label>
                <input
                  type="number"
                  value={newVehicleForm.kilometraje}
                  onChange={(e) =>
                    setNewVehicleForm({ ...newVehicleForm, kilometraje: e.target.value })
                  }
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
            >
              Guardar Vehículo y Crear Billetera de Documentos
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VERIFICAR TELÉFONO (+40 AUTOPOINTS)                */}
      {/* ========================================================= */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-white/[0.12] rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-black text-white">Verificación de Conductor</h3>
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/65 leading-relaxed">
              Confirma tu número móvil <strong>{profile.telefono}</strong> e ingresa el código de
              validación para activar alertas de documentos y sumar <strong>+40 AutoPoints</strong>.
            </p>

            <div>
              <label className="text-xs text-white/60 block mb-1">Teléfono móvil</label>
              <input
                type="tel"
                value={profile.telefono}
                onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white mb-3"
              />
              <label className="text-xs text-white/60 block mb-1">Código SMS de demostración</label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-center font-mono text-base font-bold tracking-widest text-emerald-400"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyPhone}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
            >
              ✓ Confirmar y Recibir +40 AutoPoints
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
