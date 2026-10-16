// app/lib/supabase.js
// Cliente y funciones de persistencia para Citas y Agendamientos
// Soporta Supabase en la nube con fallback inteligente a almacenamiento local

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const LOCAL_STORAGE_KEY = "autobooking_citas_v1";

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

export function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("tu-proyecto") &&
    !SUPABASE_ANON_KEY.includes("tu-anon-key")
  );
}

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

  // Fallback local
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
