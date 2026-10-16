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
