// ===== Configuración del negocio =====
// Todo lo que vayas a cambiar seguido (número, horario, servicios, zonas) vive acá.

export const WHATSAPP_NUMBER = "56900000000"; // TODO: reemplaza por el número real, formato 569XXXXXXXX

// Mismo Access Key usado en la landing de 1312MOTORSPORTS (llega al mismo correo).
// Si quieres separar los agendamientos de ambos sitios, saca un key nuevo gratis en https://web3forms.com
export const WEB3FORMS_ACCESS_KEY = "c6b804a3-8309-4850-87b4-fedd3c534e77";

// Horario de atención: días 1=Lunes ... 6=Sábado, 0=Domingo (cerrado)
export const OPEN_DAYS = [1, 2, 3, 4, 5, 6];
export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 19;

export const SERVICES = [
  "Instalación y Venta de Baterías",
  "Servicio de frenos",
  "Diagnósticos Eléctricos",
  "Car Audio",
  "Mantenciones por KM",
  "Escaner Automotriz",
  "Inspección Técnica Pre-Compra",
];

export const ZONES = [
  {
    name: "Centro",
    comunas: [
      "Independencia",
      "Recoleta",
      "Santiago",
      "Estación Central",
      "Quinta Normal",
      "Pedro Aguirre Cerda",
      "San Joaquín",
    ],
  },
  {
    name: "Oriente",
    comunas: [
      "Lo Barnechea",
      "Vitacura",
      "Las Condes",
      "Providencia",
      "Ñuñoa",
      "La Reina",
      "Macul",
      "Peñalolén",
    ],
  },
  {
    name: "Sur",
    comunas: [
      "La Cisterna",
      "La Granja",
      "La Florida",
      "San Ramón",
      "El Bosque",
      "La Pintana",
      "San Bernardo",
      "Puente Alto",
      "San José de Maipo",
      "Pirque",
    ],
  },
];

// ===== Horario de atención =====

export function isOpenNow(date) {
  const day = date.getDay();
  const hour = date.getHours();
  return OPEN_DAYS.includes(day) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

export function nextOpenDate(date) {
  const next = new Date(date);
  if (date.getHours() >= CLOSE_HOUR || !OPEN_DAYS.includes(date.getDay())) {
    next.setDate(next.getDate() + 1);
  }
  while (!OPEN_DAYS.includes(next.getDay())) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export function toDateInputValue(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateEs(date) {
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
