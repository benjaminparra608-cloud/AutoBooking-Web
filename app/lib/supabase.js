// app/lib/supabase.js
// Cliente y funciones de persistencia para Citas, Agendamientos y Órdenes de Trabajo (OT)
// Soporta Supabase en la nube con fallback inteligente a almacenamiento local (localStorage)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const LOCAL_STORAGE_KEY = "autobooking_citas_v1";
const LOCAL_STORAGE_OT_KEY = "autobooking_ordenes_v1";

const DEMO_CITAS = [
  {
    id: "demo-1",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    patente: "ABCD-12",
    marca: "Toyota",
    modelo: "RAV4",
    km: "48500",
    servicio: "Mantenciones por KM",
    fecha: new Date().toISOString().split("T")[0],
    horario: "Mañana (9:00–13:00)",
    nombre: "Rodrigo Morales",
    email: "rodrigo.m@example.com",
    telefono: "+56987654321",
    comuna: "Providencia",
    direccion: "Av. Pedro de Valdivia 1234, Depto 402",
    comentario: "Revisar pastillas de freno delanteras que chillan un poco.",
    estado: "pendiente",
    notas_taller: ""
  },
  {
    id: "demo-2",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    patente: "GHJK-78",
    marca: "Chevrolet",
    modelo: "Sail",
    km: "62000",
    servicio: "Instalación y Venta de Baterías",
    fecha: new Date().toISOString().split("T")[0],
    horario: "Tarde (14:00–19:00)",
    nombre: "Camila Soto",
    email: "camila.soto@example.com",
    telefono: "+56976543210",
    comuna: "Ñuñoa",
    direccion: "Av. Irarrázaval 2800",
    comentario: "Auto no parte desde la mañana, batería descargada.",
    estado: "confirmada",
    notas_taller: "Mecánico asignado: Carlos"
  },
  {
    id: "demo-3",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    patente: "KLMN-34",
    marca: "Hyundai",
    modelo: "Tucson",
    km: "85000",
    servicio: "Escaner Automotriz",
    fecha: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    horario: "Mañana (9:00–13:00)",
    nombre: "Felipe Araya",
    email: "felipe.araya@example.com",
    telefono: "+56965432109",
    comuna: "Las Condes",
    direccion: "Apoquindo 4500",
    comentario: "Luz de Check Engine encendida en tablero.",
    estado: "en_taller",
    notas_taller: "Diagnóstico preliminar: sensor de oxígeno"
  }
];

const DEMO_ORDENES = [
  {
    id: "ot-demo-1",
    numero_ot: "OT-2026-001",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    cita_id: "demo-3",
    patente: "KLMN-34",
    marca: "Hyundai",
    modelo: "Tucson",
    ano: "2019",
    km: "85000",
    cliente_nombre: "Felipe Araya",
    cliente_telefono: "+56965432109",
    cliente_email: "felipe.araya@example.com",
    mecanico_asignado: "Carlos Henríquez",
    estado: "en_proceso", // ingresado | en_proceso | espera_repuestos | listo_entrega | entregado
    diagnostico: "Código P0135 (Resistencia calentador sensor de oxígeno O2 B1S1). Requiere reemplazo de sensor y limpieza de cuerpo de aceleración.",
    trabajos: [
      { id: "t-1", descripcion: "Diagnóstico computarizado avanzado y escaneo", precio: 25000, completado: true },
      { id: "t-2", descripcion: "Reemplazo de sensor de oxígeno delantero", precio: 30000, completado: false },
      { id: "t-3", descripcion: "Limpieza y calibración de cuerpo de aceleración", precio: 20000, completado: false }
    ],
    repuestos: [
      { id: "r-1", repuesto: "Sensor de oxígeno Bosch Original", cantidad: 1, precio: 58000 },
      { id: "r-2", repuesto: "Limpia carburador / spray de admisión", cantidad: 1, precio: 6500 }
    ],
    checklist: {
      luces: true,
      combustible: "1/2",
      ruedaRepuesto: true,
      rayones: "Detalle leve en parachoques trasero",
      documentos: true
    },
    total_mano_obra: 75000,
    total_repuestos: 64500,
    total_general: 139500,
    fecha_estimada: new Date().toISOString().split("T")[0],
    fecha_entrega: "",
    notas_internas: "Cliente autorizó presupuesto vía telefónica."
  },
  {
    id: "ot-demo-2",
    numero_ot: "OT-2026-002",
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    cita_id: null,
    patente: "GHJK-78",
    marca: "Chevrolet",
    modelo: "Sail",
    ano: "2018",
    km: "62000",
    cliente_nombre: "Camila Soto",
    cliente_telefono: "+56976543210",
    cliente_email: "camila.soto@example.com",
    mecanico_asignado: "Andrés Silva",
    estado: "listo_entrega",
    diagnostico: "Batería cumplió vida útil (3.5 años). Alternador cargando a 14.2V estable.",
    trabajos: [
      { id: "t-1", descripcion: "Diagnóstico sistema eléctrico y de carga", precio: 15000, completado: true },
      { id: "t-2", descripcion: "Instalación de batería y bornes nuevos", precio: 15000, completado: true }
    ],
    repuestos: [
      { id: "r-1", repuesto: "Batería Hankook 55Ah 12V Libre Mantención", cantidad: 1, precio: 68000 },
      { id: "r-2", repuesto: "Terminales de bronce para bornes", cantidad: 2, precio: 4000 }
    ],
    checklist: {
      luces: true,
      combustible: "3/4",
      ruedaRepuesto: true,
      rayones: "Sin rayones nuevos",
      documentos: true
    },
    total_mano_obra: 30000,
    total_repuestos: 72000,
    total_general: 102000,
    fecha_estimada: new Date().toISOString().split("T")[0],
    fecha_entrega: "",
    notas_internas: "Garantía de 18 meses activada con el proveedor."
  }
];

export function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("tu-proyecto") &&
    !SUPABASE_ANON_KEY.includes("tu-anon-key")
  );
}

// ==========================================
// SECCIÓN 1: CITAS Y AGENDAMIENTOS
// ==========================================

function getLocalCitas() {
  if (typeof window === "undefined") return DEMO_CITAS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEMO_CITAS));
      return DEMO_CITAS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error leyendo citas de localStorage:", e);
    return DEMO_CITAS;
  }
}

function saveLocalCitas(citas) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(citas));
  } catch (e) {
    console.error("Error guardando citas en localStorage:", e);
  }
}

export async function getCitas() {
  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/citas?select=*&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        return await res.json();
      }
      console.warn("Supabase respondió con error, usando datos locales:", res.statusText);
    } catch (err) {
      console.warn("Fallo en conexión con Supabase, usando respaldo local:", err);
    }
  }
  return getLocalCitas();
}

export async function createCita(nuevaCita) {
  const citaObj = {
    patente: (nuevaCita.patente || "").toUpperCase().trim(),
    marca: nuevaCita.marca || "",
    modelo: nuevaCita.modelo || "",
    km: nuevaCita.km || "",
    servicio: nuevaCita.servicio || "",
    fecha: nuevaCita.fecha || new Date().toISOString().split("T")[0],
    horario: nuevaCita.horario || "Mañana (9:00–13:00)",
    nombre: nuevaCita.nombre || "",
    email: nuevaCita.email || "",
    telefono: nuevaCita.telefono || "",
    comuna: nuevaCita.comuna || "",
    direccion: nuevaCita.direccion || "",
    comentario: nuevaCita.comentario || "",
    estado: nuevaCita.estado || "pendiente",
    notas_taller: nuevaCita.notas_taller || ""
  };

  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/citas`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(citaObj)
      });
      if (res.ok) {
        const created = await res.json();
        return created[0] || citaObj;
      }
    } catch (err) {
      console.warn("Error creando en Supabase, guardando local:", err);
    }
  }

  // Fallback local
  const localList = getLocalCitas();
  const createdLocal = {
    ...citaObj,
    id: "loc-" + Date.now(),
    created_at: new Date().toISOString()
  };
  saveLocalCitas([createdLocal, ...localList]);
  return createdLocal;
}

export async function updateCitaStatus(id, nuevoEstado, notas = null) {
  const patchPayload = { estado: nuevoEstado };
  if (notas !== null) {
    patchPayload.notas_taller = notas;
  }

  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/citas?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(patchPayload)
      });
      if (res.ok) {
        const data = await res.json();
        return data[0];
      }
    } catch (err) {
      console.warn("Error actualizando en Supabase, aplicando local:", err);
    }
  }

  const list = getLocalCitas();
  const updated = list.map((item) =>
    item.id === id ? { ...item, ...patchPayload } : item
  );
  saveLocalCitas(updated);
  return updated.find((c) => c.id === id);
}

export async function deleteCita(id) {
  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/citas?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn("Error eliminando en Supabase, eliminando local:", err);
    }
  }

  const list = getLocalCitas();
  const filtered = list.filter((item) => item.id !== id);
  saveLocalCitas(filtered);
  return true;
}

// ==========================================
// SECCIÓN 2: ÓRDENES DE TRABAJO (OT)
// ==========================================

function getLocalOrdenes() {
  if (typeof window === "undefined") return DEMO_ORDENES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_OT_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_OT_KEY, JSON.stringify(DEMO_ORDENES));
      return DEMO_ORDENES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error leyendo órdenes de trabajo de localStorage:", e);
    return DEMO_ORDENES;
  }
}

function saveLocalOrdenes(ordenes) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_OT_KEY, JSON.stringify(ordenes));
  } catch (e) {
    console.error("Error guardando órdenes de trabajo en localStorage:", e);
  }
}

export async function getOrdenes() {
  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/ordenes_trabajo?select=*&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        return await res.json();
      }
      console.warn("Supabase respondió con error al consultar OT, usando local:", res.statusText);
    } catch (err) {
      console.warn("Fallo conexión con Supabase para OT, usando local:", err);
    }
  }
  return getLocalOrdenes();
}

export async function createOrden(nuevaOT) {
  const localList = getLocalOrdenes();
  const nextNumber = `OT-${new Date().getFullYear()}-${String(localList.length + 1).padStart(3, "0")}`;

  const calcManoObra = (nuevaOT.trabajos || []).reduce((acc, t) => acc + (Number(t.precio) || 0), 0);
  const calcRepuestos = (nuevaOT.repuestos || []).reduce((acc, r) => acc + ((Number(r.precio) || 0) * (Number(r.cantidad) || 1)), 0);

  const otObj = {
    numero_ot: nuevaOT.numero_ot || nextNumber,
    cita_id: nuevaOT.cita_id || null,
    patente: (nuevaOT.patente || "").toUpperCase().trim(),
    marca: nuevaOT.marca || "",
    modelo: nuevaOT.modelo || "",
    ano: nuevaOT.ano || "",
    km: nuevaOT.km || "",
    cliente_nombre: nuevaOT.cliente_nombre || "",
    cliente_telefono: nuevaOT.cliente_telefono || "",
    cliente_email: nuevaOT.cliente_email || "",
    mecanico_asignado: nuevaOT.mecanico_asignado || "Sin Asignar",
    estado: nuevaOT.estado || "ingresado",
    diagnostico: nuevaOT.diagnostico || "",
    trabajos: nuevaOT.trabajos || [],
    repuestos: nuevaOT.repuestos || [],
    checklist: nuevaOT.checklist || {
      luces: true,
      combustible: "1/2",
      ruedaRepuesto: true,
      rayones: "Sin observaciones",
      documentos: true
    },
    total_mano_obra: calcManoObra,
    total_repuestos: calcRepuestos,
    total_general: calcManoObra + calcRepuestos,
    fecha_estimada: nuevaOT.fecha_estimada || new Date().toISOString().split("T")[0],
    fecha_entrega: nuevaOT.fecha_entrega || "",
    notas_internas: nuevaOT.notas_internas || ""
  };

  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/ordenes_trabajo`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(otObj)
      });
      if (res.ok) {
        const created = await res.json();
        return created[0] || otObj;
      }
    } catch (err) {
      console.warn("Error creando OT en Supabase, guardando local:", err);
    }
  }

  // Fallback local
  const createdLocal = {
    ...otObj,
    id: "ot-loc-" + Date.now(),
    created_at: new Date().toISOString()
  };
  saveLocalOrdenes([createdLocal, ...localList]);
  return createdLocal;
}

export async function updateOrden(id, updates) {
  // Recalcular totales si se modificaron trabajos o repuestos
  const payload = { ...updates };
  if (updates.trabajos || updates.repuestos) {
    const list = getLocalOrdenes();
    const current = list.find((o) => o.id === id) || {};
    const trabajos = updates.trabajos || current.trabajos || [];
    const repuestos = updates.repuestos || current.repuestos || [];
    const calcManoObra = trabajos.reduce((acc, t) => acc + (Number(t.precio) || 0), 0);
    const calcRepuestos = repuestos.reduce((acc, r) => acc + ((Number(r.precio) || 0) * (Number(r.cantidad) || 1)), 0);
    payload.total_mano_obra = calcManoObra;
    payload.total_repuestos = calcRepuestos;
    payload.total_general = calcManoObra + calcRepuestos;
  }

  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/ordenes_trabajo?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return data[0];
      }
    } catch (err) {
      console.warn("Error actualizando OT en Supabase, aplicando local:", err);
    }
  }

  const list = getLocalOrdenes();
  const updated = list.map((item) =>
    item.id === id ? { ...item, ...payload } : item
  );
  saveLocalOrdenes(updated);
  return updated.find((o) => o.id === id);
}

export async function deleteOrden(id) {
  if (isSupabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/ordenes_trabajo?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn("Error eliminando OT en Supabase, eliminando local:", err);
    }
  }

  const list = getLocalOrdenes();
  const filtered = list.filter((item) => item.id !== id);
  saveLocalOrdenes(filtered);
  return true;
}

// ==========================================
// 3. PERSISTENCIA DE PEDIDOS DE TIENDA & BATERÍAS
// ==========================================
export const LOCAL_STORAGE_STORE_ORDERS_KEY = "autobooking_pedidos_tienda_v1";

const DEMO_STORE_ORDERS = [
  {
    id: "ped-demo-101",
    numero_pedido: "PED-2026-0010",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    cliente_nombre: "Ignacio Valenzuela",
    cliente_telefono: "+56981234567",
    comuna: "Providencia",
    direccion: "Av. Holanda 1450, Depto 601",
    patente: "KLPW-89",
    vehiculo: "Chevrolet Sail 1.5",
    items: [
      {
        id: "bat-din55",
        nombre: "Batería DIN 55 (55Ah - 460 CCA)",
        codigo: "DIN 55 / 55530",
        cantidad: 1,
        precio: 89900,
        conInstalacion: true,
        precioInstalacion: 15000
      }
    ],
    subtotal: 89900,
    total_instalacion: 15000,
    costo_despacho: 0,
    total_general: 104900,
    requiere_instalacion: true,
    estado: "nuevo", // nuevo | en_preparacion | en_ruta | completado | cancelado
    ot_generada_id: null,
    mecanico_asignado: "Carlos Henríquez",
    notas: "Auto parado en subterráneo -2, llevar tester digital de alternador."
  },
  {
    id: "ped-demo-102",
    numero_pedido: "PED-2026-0009",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    cliente_nombre: "Marcela Fuentes",
    cliente_telefono: "+56992345678",
    comuna: "Las Condes",
    direccion: "Camino El Alba 9800",
    patente: "PXYZ-45",
    vehiculo: "Hyundai Tucson 2.0",
    items: [
      {
        id: "aceite-motul-5w30",
        nombre: "Kit Lubricación Motul 8100 X-Clean 5W30 (5L) + Filtro Mann",
        codigo: "MOTUL-5W30-MANN",
        cantidad: 1,
        precio: 54900,
        conInstalacion: true,
        precioInstalacion: 15000
      }
    ],
    subtotal: 54900,
    total_instalacion: 15000,
    costo_despacho: 0,
    total_general: 69900,
    requiere_instalacion: true,
    estado: "en_ruta",
    ot_generada_id: null,
    mecanico_asignado: "Andrés Silva",
    notas: "Cliente prefiere atención después de las 16:00 hrs."
  },
  {
    id: "ped-demo-103",
    numero_pedido: "PED-2026-0008",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    cliente_nombre: "Gonzalo Pinto",
    cliente_telefono: "+56973456789",
    comuna: "Ñuñoa",
    direccion: "Simón Bolívar 2340",
    patente: "LKVB-12",
    vehiculo: "Suzuki Swift 1.2",
    items: [
      {
        id: "bat-ns60l",
        nombre: "Batería NS60L / 55B24L (45Ah - 430 CCA)",
        codigo: "NS60L / 55B24L",
        cantidad: 1,
        precio: 84900,
        conInstalacion: false,
        precioInstalacion: 0
      }
    ],
    subtotal: 84900,
    total_instalacion: 0,
    costo_despacho: 0,
    total_general: 84900,
    requiere_instalacion: false,
    estado: "completado",
    ot_generada_id: null,
    mecanico_asignado: null,
    notas: "Solo despacho a conserjería del edificio."
  }
];

export function getLocalStoreOrders() {
  if (typeof window === "undefined") return DEMO_STORE_ORDERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STORE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_STORE_ORDERS_KEY, JSON.stringify(DEMO_STORE_ORDERS));
      return DEMO_STORE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error leyendo pedidos de tienda de localStorage:", err);
    return DEMO_STORE_ORDERS;
  }
}

export function saveLocalStoreOrders(orders) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_STORE_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Error guardando pedidos en localStorage:", err);
  }
}

export async function getStoreOrders() {
  return getLocalStoreOrders();
}

export async function createStoreOrder(orderData) {
  const list = getLocalStoreOrders();
  const nextNum = list.length + 11;
  const newOrder = {
    id: "ped-" + Date.now(),
    numero_pedido: `PED-2026-${String(nextNum).padStart(4, "0")}`,
    created_at: new Date().toISOString(),
    cliente_nombre: orderData.cliente_nombre || "Cliente Web",
    cliente_telefono: orderData.cliente_telefono || "",
    comuna: orderData.comuna || "Santiago",
    direccion: orderData.direccion || "",
    patente: (orderData.patente || "").toUpperCase(),
    vehiculo: orderData.vehiculo || "",
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    total_instalacion: orderData.total_instalacion || 0,
    costo_despacho: orderData.costo_despacho || 0,
    total_general: orderData.total_general || 0,
    requiere_instalacion: orderData.requiere_instalacion || false,
    estado: "nuevo",
    ot_generada_id: null,
    mecanico_asignado: null,
    notas: orderData.notas || ""
  };

  const updated = [newOrder, ...list];
  saveLocalStoreOrders(updated);
  return newOrder;
}

export async function updateStoreOrderStatus(id, newStatus, mecanicoAsignado = null) {
  const list = getLocalStoreOrders();
  const updated = list.map((order) => {
    if (order.id === id) {
      return {
        ...order,
        estado: newStatus,
        ...(mecanicoAsignado ? { mecanico_asignado: mecanicoAsignado } : {})
      };
    }
    return order;
  });
  saveLocalStoreOrders(updated);
  return updated.find((o) => o.id === id);
}

export async function deleteStoreOrder(id) {
  const list = getLocalStoreOrders();
  const updated = list.filter((o) => o.id !== id);
  saveLocalStoreOrders(updated);
  return true;
}

// Convertir un pedido de tienda directamente a Orden de Trabajo (OT) técnica en /taller
export async function convertStoreOrderToOT(orderId, mecanicoAsignado = "Carlos Henríquez") {
  const orders = getLocalStoreOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Pedido no encontrado");

  // Mapear items a trabajos y repuestos
  const repuestos = (order.items || []).map((item, idx) => ({
    id: `r-ped-${idx}`,
    repuesto: item.nombre,
    cantidad: item.cantidad || 1,
    precio: item.precio || 0
  }));

  const trabajos = (order.items || [])
    .filter((item) => item.conInstalacion || order.requiere_instalacion)
    .map((item, idx) => ({
      id: `t-ped-${idx}`,
      descripcion: `Instalación y diagnóstico técnico en terreno: ${item.nombre}`,
      precio: item.precioInstalacion || 15000,
      completado: false
    }));

  const nuevaOT = await createOrden({
    patente: order.patente || "POR-ASIG",
    marca: order.vehiculo ? order.vehiculo.split(" ")[0] : "Multimarca",
    modelo: order.vehiculo ? order.vehiculo.split(" ").slice(1).join(" ") : "Vehículo",
    ano: "2020",
    km: "45000",
    cliente_nombre: order.cliente_nombre,
    cliente_telefono: order.cliente_telefono,
    cliente_email: "",
    mecanico_asignado: mecanicoAsignado,
    estado: "ingresado",
    diagnostico: `Pedido web ${order.numero_pedido} con solicitud de instalación en domicilio (${order.comuna}).`,
    trabajos: trabajos.length > 0 ? trabajos : [{ id: "t-def", descripcion: "Entrega y diagnóstico en terreno", precio: 0, completado: false }],
    repuestos: repuestos,
    notas_internas: `Generado automáticamente desde Tienda Online (${order.numero_pedido}). Notas cliente: ${order.notas || "Sin observaciones"}`
  });

  // Marcar pedido con la OT generada y estado en preparación
  const updatedOrders = orders.map((o) =>
    o.id === orderId
      ? { ...o, ot_generada_id: nuevaOT.numero_ot, estado: "en_preparacion", mecanico_asignado: mecanicoAsignado }
      : o
  );
  saveLocalStoreOrders(updatedOrders);

  return nuevaOT;
}

// ==========================================
// 4. CONTROL DE INVENTARIO DE BATERÍAS TOP 8 Y REPUESTOS
// ==========================================
export const LOCAL_STORAGE_INVENTORY_KEY = "autobooking_inventario_v1";

const DEMO_INVENTARIO = [
  { id: "inv-din55", codigo: "DIN 55 / 55530", nombre: "Batería DIN 55 (55Ah 460CCA)", categoria: "Baterías", stock: 14, stockMinimo: 4, precioVenta: 89900, ubicacion: "Bodega Principal - Estante B1", icono: "🔋" },
  { id: "inv-55d23l", codigo: "55D23L / MF55D23L", nombre: "Batería 55D23L (60Ah 550CCA)", categoria: "Baterías", stock: 9, stockMinimo: 3, precioVenta: 98900, ubicacion: "Bodega Principal - Estante B2", icono: "🔋" },
  { id: "inv-ns60l", codigo: "NS60L / 55B24L", nombre: "Batería NS60L / 55B24L (45Ah 430CCA)", categoria: "Baterías", stock: 11, stockMinimo: 3, precioVenta: 84900, ubicacion: "Bodega Principal - Estante B3", icono: "🔋" },
  { id: "inv-ns40zl", codigo: "NS40ZL / 38B19L", nombre: "Batería NS40ZL (35Ah 330CCA)", categoria: "Baterías", stock: 7, stockMinimo: 3, precioVenta: 78900, ubicacion: "Bodega Principal - Estante B4", icono: "🔋" },
  { id: "inv-din60", codigo: "DIN 60 / 56030", nombre: "Batería DIN 60 (60Ah 540CCA)", categoria: "Baterías", stock: 8, stockMinimo: 3, precioVenta: 98900, ubicacion: "Bodega Principal - Estante B5", icono: "🔋" },
  { id: "inv-105d31l", codigo: "105D31L / 105D31R", nombre: "Batería 105D31L Diésel (90Ah 750CCA)", categoria: "Baterías", stock: 5, stockMinimo: 2, precioVenta: 139900, ubicacion: "Bodega Carga Pesada", icono: "🔋" },
  { id: "inv-80d26l", codigo: "80D26L / 75D26L", nombre: "Batería 80D26L SUV (70Ah 600CCA)", categoria: "Baterías", stock: 6, stockMinimo: 2, precioVenta: 118900, ubicacion: "Bodega Principal - Estante B6", icono: "🔋" },
  { id: "inv-din72", codigo: "DIN 72 / 57113", nombre: "Batería DIN 72 Furgones (72Ah 660CCA)", categoria: "Baterías", stock: 8, stockMinimo: 2, precioVenta: 128900, ubicacion: "Bodega Principal - Estante B7", icono: "🔋" },
  { id: "inv-q85", codigo: "Q85 / 95D23L EFB", nombre: "Batería Start-Stop Q85 EFB (65Ah 650CCA)", categoria: "Baterías Start-Stop", stock: 4, stockMinimo: 2, precioVenta: 169900, ubicacion: "Bodega Especial EFB", icono: "⚡" },
  { id: "inv-ln3", codigo: "LN3 / H6 AGM", nombre: "Batería Start-Stop LN3 AGM (70Ah 760CCA)", categoria: "Baterías Start-Stop", stock: 3, stockMinimo: 2, precioVenta: 219900, ubicacion: "Bodega Especial AGM", icono: "⚡" },
  { id: "inv-motul5w30", codigo: "MOTUL-8100-5W30", nombre: "Aceite Sintético Motul 8100 X-Clean 5W30 5L", categoria: "Lubricantes", stock: 16, stockMinimo: 5, precioVenta: 54900, ubicacion: "Rack Lubricantes", icono: "🛢️" },
  { id: "inv-brembo-cer", codigo: "BREMBO-CERAMIC", nombre: "Pastillas de Freno Brembo Cerámicas", categoria: "Frenos", stock: 12, stockMinimo: 4, precioVenta: 44900, ubicacion: "Estante Frenos A1", icono: "🛑" },
  { id: "inv-carplay9", codigo: "CARPLAY-9-WIRELESS", nombre: "Central Multimedia 9\" CarPlay/Android Auto", categoria: "Accesorios", stock: 5, stockMinimo: 2, precioVenta: 129900, ubicacion: "Vitrina Electrónica", icono: "🔊" }
];

export function getLocalInventory() {
  if (typeof window === "undefined") return DEMO_INVENTARIO;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INVENTORY_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_INVENTORY_KEY, JSON.stringify(DEMO_INVENTARIO));
      return DEMO_INVENTARIO;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error leyendo inventario de localStorage:", err);
    return DEMO_INVENTARIO;
  }
}

export function saveLocalInventory(inv) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_INVENTORY_KEY, JSON.stringify(inv));
  } catch (err) {
    console.error("Error guardando inventario en localStorage:", err);
  }
}

export async function getInventory() {
  return getLocalInventory();
}

export async function updateInventoryStock(id, newStock) {
  const list = getLocalInventory();
  const updated = list.map((item) =>
    item.id === id ? { ...item, stock: Math.max(0, Number(newStock) || 0) } : item
  );
  saveLocalInventory(updated);
  return updated.find((i) => i.id === id);
}

export async function adjustInventoryStock(id, delta) {
  const list = getLocalInventory();
  const updated = list.map((item) =>
    item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
  );
  saveLocalInventory(updated);
  return updated.find((i) => i.id === id);
}

