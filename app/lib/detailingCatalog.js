// app/lib/detailingCatalog.js
// Catálogo maestro de insumos de detailing, checklist de salida a domicilio,
// fases de control de calidad para órdenes de trabajo y calculadora de diluciones.

export const LOCAL_STORAGE_DETAILING_INV_KEY = 'autobooking_detailing_inv_v1';
export const LOCAL_STORAGE_DETAILING_JOBS_KEY = 'autobooking_detailing_jobs_v1';
export const LOCAL_STORAGE_DETAILING_SALIDA_KEY = 'autobooking_detailing_salida_v1';

// ==========================================
// 1. LOS 12 BÁSICOS PARA EMPRENDER / TALLER DETAILING
// ==========================================
export const INSUMOS_DETAILING_BASE = [
  {
    id: 'hidrolavadora',
    nombre: 'Hidrolavadora de Alta Presión',
    categoria: 'Maquinaria',
    icono: '💧',
    descripcion: 'Lavado a presión sin contacto para remover suciedad pesada.',
    nivelPorcentaje: 100, // 100% | 50% | 25% | 0%
    estadoStock: 'OK', // 'OK' | 'Mitad' | 'Poco' | 'Comprar'
    costoAproxCLP: 149900,
    envaseCapacidad: '1 unidad',
    dilucionRecomendada: 'Directo (Red de agua)',
    consumoPorAutoMl: 0,
    esQuimico: false,
    ubicacion: 'Furgón / Rack Maquinaria'
  },
  {
    id: 'aspiradora',
    nombre: 'Aspiradora de Líquidos y Sólidos',
    categoria: 'Maquinaria',
    icono: '🌪️',
    descripcion: 'Aspirado profundo de alfombras, maletero e interiores húmedos.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 89900,
    envaseCapacidad: '1 unidad',
    dilucionRecomendada: 'Directo (220V)',
    consumoPorAutoMl: 0,
    esQuimico: false,
    ubicacion: 'Furgón / Rack Maquinaria'
  },
  {
    id: 'cubetas_grit_guard',
    nombre: 'Cubetas con Separador Grit Guard',
    categoria: 'Accesorios',
    icono: '🪣',
    descripcion: 'Sistema de 2 cubos (Lavado y Enjuague) para atrapar partículas al fondo.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 24900,
    envaseCapacidad: 'Set de 2 cubos',
    dilucionRecomendada: 'N/A',
    consumoPorAutoMl: 0,
    esQuimico: false,
    ubicacion: 'Furgón / Estante Lavado'
  },
  {
    id: 'guante_toalla',
    nombre: 'Guante de Lavado & Toalla de Secado',
    categoria: 'Accesorios',
    icono: '🧤',
    descripcion: 'Guante de microfibra de lana suave y toalla Twisted Loop de 1200 GSM.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 19900,
    envaseCapacidad: 'Set 2 piezas',
    dilucionRecomendada: 'Lavar con agua tibia y jabón neutro',
    consumoPorAutoMl: 0,
    esQuimico: false,
    ubicacion: 'Bolsa de Microfibras Limpias'
  },
  {
    id: 'microfibras_colores',
    nombre: 'Microfibras Separadas por Colores',
    categoria: 'Accesorios',
    icono: '🧣',
    descripcion: 'Azul (Pintura), Amarilla (Interiores), Negra (Ruedas/Escape). Evita contaminación cruzada.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 15900,
    envaseCapacidad: 'Pack 12 unidades',
    dilucionRecomendada: 'N/A',
    consumoPorAutoMl: 0,
    esQuimico: false,
    ubicacion: 'Caja Organizadora Microfibras'
  },
  {
    id: 'brochas_cepillos',
    nombre: 'Brochas y Cepillos de Varios Tamaños',
    categoria: 'Accesorios',
    icono: '🖌️',
    descripcion: 'Brochas de pelo sintético para emblemas, molduras, rejillas y cepillos para llantas.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 18900,
    envaseCapacidad: 'Set 5 brochas + 2 cepillos',
    dilucionRecomendada: 'N/A',
    consumoPorAutoMl: 0,
    esQuimico: false,
    ubicacion: 'Maletín de Pinceles y Detalle'
  },
  {
    id: 'shampoo',
    nombre: 'Shampoo Automotriz pH Neutro',
    categoria: 'Químicos',
    icono: '🧼',
    descripcion: 'Jabón concentrado con alta lubricidad para foam lance y cubo.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 18900,
    envaseCapacidad: '1000 ml',
    dilucionRecomendada: '1:10 Foam Lance | 1:200 Balde',
    ratioSugerido: 10,
    consumoPorAutoMl: 50,
    esQuimico: true,
    ubicacion: 'Rack Químicos Exteriores'
  },
  {
    id: 'apc_multiproposito',
    nombre: 'Limpiador Multipropósito (APC)',
    categoria: 'Químicos',
    icono: '🧴',
    descripcion: 'All Purpose Cleaner para tableros, plásticos, tapices y vano motor.',
    nivelPorcentaje: 50,
    estadoStock: 'Mitad',
    costoAproxCLP: 14900,
    envaseCapacidad: '1000 ml',
    dilucionRecomendada: '1:10 Interior | 1:4 Motor y Suciedad Pesada',
    ratioSugerido: 10,
    consumoPorAutoMl: 40,
    esQuimico: true,
    ubicacion: 'Rack Químicos Interiores'
  },
  {
    id: 'desengrasante',
    nombre: 'Desengrasante Concentrado Automotriz',
    categoria: 'Químicos',
    icono: '⚙️',
    descripcion: 'Removedor de grasa, ferodo de frenos y brea en llantas y pasarruedas.',
    nivelPorcentaje: 25,
    estadoStock: 'Poco',
    costoAproxCLP: 12900,
    envaseCapacidad: '1000 ml',
    dilucionRecomendada: '1:5 Llantas y Pasarruedas | 1:3 Motor',
    ratioSugerido: 5,
    consumoPorAutoMl: 60,
    esQuimico: true,
    ubicacion: 'Rack Químicos Ruedas'
  },
  {
    id: 'limpia_cristales',
    nombre: 'Limpiador de Cristales Antiestático',
    categoria: 'Químicos',
    icono: '🪟',
    descripcion: 'Limpiavidrios sin amoníaco, apto para polarizados y lunas térmicas.',
    nivelPorcentaje: 100,
    estadoStock: 'OK',
    costoAproxCLP: 9900,
    envaseCapacidad: '500 ml',
    dilucionRecomendada: '1:10 Concentrado o Listo para Usar',
    ratioSugerido: 10,
    consumoPorAutoMl: 30,
    esQuimico: true,
    ubicacion: 'Rack Químicos Terminación'
  },
  {
    id: 'acondicionador_plasticos',
    nombre: 'Acondicionador para Plásticos & Llantas',
    categoria: 'Químicos',
    icono: '✨',
    descripcion: 'Hidratador base agua con protección UV para plásticos exteriores y neumáticos (acabado satinado).',
    nivelPorcentaje: 50,
    estadoStock: 'Mitad',
    costoAproxCLP: 16900,
    envaseCapacidad: '500 ml',
    dilucionRecomendada: 'Listo para usar o 1:1',
    ratioSugerido: 1,
    consumoPorAutoMl: 35,
    esQuimico: true,
    ubicacion: 'Rack Químicos Terminación'
  },
  {
    id: 'cera_sellador',
    nombre: 'Cera Líquida o Sellador de Pintura',
    categoria: 'Químicos',
    icono: '🛡️',
    descripcion: 'Sellador sintético hidrofóbico en spray con repelencia de agua y brillo espejo.',
    nivelPorcentaje: 25,
    estadoStock: 'Poco',
    costoAproxCLP: 22900,
    envaseCapacidad: '500 ml',
    dilucionRecomendada: 'Listo para usar (Spray)',
    ratioSugerido: 0,
    consumoPorAutoMl: 25,
    esQuimico: true,
    ubicacion: 'Rack Químicos Terminación'
  }
];

// ==========================================
// 2. CHECKLIST DE SALIDA (A DOMICILIO)
// ==========================================
export const CHECKLIST_SALIDA_BASE = [
  { id: 'cs-1', item: 'Hidrolavadora de alta presión + manguera reforzada', completado: true, categoria: 'Maquinaria' },
  { id: 'cs-2', item: 'Aspiradora húmedo/seco + boquilla rinconera y cepillo', completado: true, categoria: 'Maquinaria' },
  { id: 'cs-3', item: 'Alargador eléctrico industrial de 25m + adaptador Schuko', completado: true, categoria: 'Herramientas' },
  { id: 'cs-4', item: 'Manguera de jardín (15m) + acoples rápidos universales', completado: true, categoria: 'Herramientas' },
  { id: 'cs-5', item: '2 Cubetas con filtro Grit Guard (Lavado y Aclarado)', completado: true, categoria: 'Lavado' },
  { id: 'cs-6', item: 'Cañón de espuma (Snow Foam Lance)', completado: true, categoria: 'Lavado' },
  { id: 'cs-7', item: '2 Guantes de microfibra de lavado suaves', completado: true, categoria: 'Microfibras' },
  { id: 'cs-8', item: '2 Toallas de secado Twisted Loop 1200 GSM', completado: true, categoria: 'Microfibras' },
  { id: 'cs-9', item: 'Pack de 10 microfibras limpias clasificadas por color', completado: true, categoria: 'Microfibras' },
  { id: 'cs-10', item: 'Kit de 5 brochas de detailing + cepillos para llantas y neumáticos', completado: true, categoria: 'Herramientas' },
  { id: 'cs-11', item: 'Atomizador con Shampoo pH neutro diluido', completado: true, categoria: 'Químicos' },
  { id: 'cs-12', item: 'Atomizador con APC limpiador multipropósito (1:10)', completado: true, categoria: 'Químicos' },
  { id: 'cs-13', item: 'Atomizador con Desengrasante de llantas (1:5)', completado: true, categoria: 'Químicos' },
  { id: 'cs-14', item: 'Atomizador con Limpia Cristales sin amoníaco', completado: true, categoria: 'Químicos' },
  { id: 'cs-15', item: 'Acondicionador de neumáticos y plásticos + aplicadores', completado: true, categoria: 'Químicos' },
  { id: 'cs-16', item: 'Cera líquida selladora en spray + microfibra de brillo', completado: true, categoria: 'Químicos' },
  { id: 'cs-17', item: 'Caja con guantes de nitrilo y linterna LED de inspección', completado: true, categoria: 'Seguridad' }
];

// ==========================================
// 3. FASES DE CONTROL DE CALIDAD (ORDEN DE ATAQUE ESTRICTO)
// ==========================================
export const FASES_CONTROL_CALIDAD = [
  {
    fase: 1,
    nombre: '1. Llantas y Pasos de Rueda',
    icono: '🛞',
    color: 'from-amber-500 to-orange-500',
    descripcion: 'Limpieza profunda de la zona más contaminada para no ensuciar la carrocería después.',
    quimicosAsociados: ['desengrasante'],
    pasos: [
      { id: 'f1-p1', texto: 'Rociar desengrasante diluido (1:5) en pasos de rueda y dejar actuar 2 min.', completado: false },
      { id: 'f1-p2', texto: 'Cepillar el interior del pasarrueda con cepillo de cerdas duras.', completado: false },
      { id: 'f1-p3', texto: 'Limpiar garganta interior de la llanta con cepillo cilíndrico.', completado: false },
      { id: 'f1-p4', texto: 'Detallar cara frontal, pernos y calipers con brocha suave.', completado: false },
      { id: 'f1-p5', texto: 'Desengrasar flanco del neumático con cepillo de cerdas medias.', completado: false },
      { id: 'f1-p6', texto: 'Enjuagar abundantemente a alta presión de arriba hacia abajo.', completado: false }
    ]
  },
  {
    fase: 2,
    nombre: '2. Prelavado y Lavado de Contacto',
    icono: '🚿',
    color: 'from-cyan-500 to-blue-500',
    descripcion: 'Remoción de la suciedad exterior sin generar micro-rayas (swirls).',
    quimicosAsociados: ['shampoo'],
    pasos: [
      { id: 'f2-p1', texto: 'Aplicar Snow Foam espesa sobre auto seco para ablandar película de tráfico.', completado: false },
      { id: 'f2-p2', texto: 'Pincelar con brocha suave emblemas, rejillas, marcos de ventana y molduras.', completado: false },
      { id: 'f2-p3', texto: 'Enjuague a alta presión removiendo la espuma y el 80% de suciedad.', completado: false },
      { id: 'f2-p4', texto: 'Lavado con guante de microfibra usando técnica de 2 cubetas (Lavado y Aclarado).', completado: false },
      { id: 'f2-p5', texto: 'Movimientos rectilíneos (sin círculos) desde el techo hacia las taloneras.', completado: false },
      { id: 'f2-p6', texto: 'Enjuague final a baja presión por escurrimiento laminar.', completado: false }
    ]
  },
  {
    fase: 3,
    nombre: '3. Descontaminado de Pintura',
    icono: '🧲',
    color: 'from-purple-500 to-indigo-500',
    descripcion: 'Eliminación de polvillo de frenos férrico y partículas incrustadas en el barniz.',
    quimicosAsociados: ['desengrasante'],
    pasos: [
      { id: 'f3-p1', texto: 'Rociar descontaminante férrico sobre pintura y llantas.', completado: false },
      { id: 'f3-p2', texto: 'Dejar reaccionar 3 a 5 min hasta observar sangrado púrpura.', completado: false },
      { id: 'f3-p3', texto: 'Enjuague abundante sin permitir que el químico se seque al sol.', completado: false },
      { id: 'f3-p4', texto: 'Pasada suave con barra de arcilla (Clay Bar) y lubricante si el paquete lo incluye.', completado: false }
    ]
  },
  {
    fase: 4,
    nombre: '4. Secado Seguro',
    icono: '💨',
    color: 'from-teal-500 to-emerald-500',
    descripcion: 'Secado sin fricción para evitar marcas de agua o rayas.',
    quimicosAsociados: [],
    pasos: [
      { id: 'f4-p1', texto: 'Extender toalla Twisted Loop y deslizar suavemente por gravedad.', completado: false },
      { id: 'f4-p2', texto: 'Secar con toalla pequeña o aire las carcasas de espejos, parrilla y junturas.', completado: false },
      { id: 'f4-p3', texto: 'Abrir puertas y secar marcos interiores, umbrales y borde del baúl.', completado: false }
    ]
  },
  {
    fase: 5,
    nombre: '5. Detailing de Interior',
    icono: '💺',
    color: 'from-amber-600 to-yellow-500',
    descripcion: 'Limpieza profunda de habitáculo, aspirado y desinfección de superficies.',
    quimicosAsociados: ['apc_multiproposito'],
    pasos: [
      { id: 'f5-p1', texto: 'Retirar alfombrillas y sacudir en seco antes de lavar o aspirar.', completado: false },
      { id: 'f5-p2', texto: 'Aspirado profundo de piso, debajo de butacas, pliegues de asientos y maleta.', completado: false },
      { id: 'f5-p3', texto: 'Limpiar tablero, consola central y volante con APC (1:10) y microfibra limpia.', completado: false },
      { id: 'f5-p4', texto: 'Pincelar rejillas de aire acondicionado y botones con brocha antiestática.', completado: false },
      { id: 'f5-p5', texto: 'Limpiar paneles de puertas y manillas sin dejar residuos grasos.', completado: false },
      { id: 'f5-p6', texto: 'Acondicionar plásticos internos con acabado mate sedoso anti-UV.', completado: false }
    ]
  },
  {
    fase: 6,
    nombre: '6. Sellado y Plásticos Exteriores',
    icono: '🛡️',
    color: 'from-rose-500 to-pink-500',
    descripcion: 'Protección hidrofóbica de la pintura y restauración de gomas y molduras.',
    quimicosAsociados: ['cera_sellador', 'acondicionador_plasticos'],
    pasos: [
      { id: 'f6-p1', texto: 'Aplicar cera líquida o sellador panel por panel con microfibra suave.', completado: false },
      { id: 'f6-p2', texto: 'Retirar sobrante con una segunda toalla seca logrando brillo espejo.', completado: false },
      { id: 'f6-p3', texto: 'Nutrir plásticos negros exteriores con acondicionador resistente al agua.', completado: false },
      { id: 'f6-p4', texto: 'Aplicar acondicionador en flanco de neumáticos logrando acabado uniforme.', completado: false }
    ]
  },
  {
    fase: 7,
    nombre: '7. Cristales y Revisión Final (Control Calidad)',
    icono: '🔍',
    color: 'from-cyan-400 to-teal-400',
    descripcion: 'Transparencia absoluta en cristales y chequeo de entrega impecable.',
    quimicosAsociados: ['limpia_cristales'],
    pasos: [
      { id: 'f7-p1', texto: 'Limpiar cara interior de parabrisas con limpiavidrios y toalla tipo waffle.', completado: false },
      { id: 'f7-p2', texto: 'Limpiar cara exterior de vidrios, luneta y espejos retrovisores sin vetas.', completado: false },
      { id: 'f7-p3', texto: 'Inspeccionar el vehículo completo 360° con linterna de detalle.', completado: false },
      { id: 'f7-p4', texto: 'Aplicar toque de fragancia sutil interior y colocar protector de papel si aplica.', completado: false }
    ]
  }
];

// ==========================================
// 4. PAQUETES DE SERVICIOS PREDEFINIDOS
// ==========================================
export const PAQUETES_DETAILING = [
  {
    id: 'lavado_basico',
    nombre: 'Lavado Exterior & Aspirado Rápido',
    precioCLP: 29900,
    tiempoEstimado: '1h 15m',
    fasesIncluidas: [1, 2, 4, 7],
    consumosEstimadosMl: { shampoo: 40, desengrasante: 30, limpia_cristales: 20 }
  },
  {
    id: 'lavado_descontaminado',
    nombre: 'Lavado Pro + Descontaminado Férrico',
    precioCLP: 45900,
    tiempoEstimado: '2h 00m',
    fasesIncluidas: [1, 2, 3, 4, 6, 7],
    consumosEstimadosMl: { shampoo: 50, desengrasante: 60, limpia_cristales: 30, cera_sellador: 20, acondicionador_plasticos: 25 }
  },
  {
    id: 'detailing_interior_full',
    nombre: 'Detailing Interior Profundo (Tapiz & Plásticos)',
    precioCLP: 59900,
    tiempoEstimado: '2h 30m',
    fasesIncluidas: [5, 7],
    consumosEstimadosMl: { apc_multiproposito: 60, limpia_cristales: 30 }
  },
  {
    id: 'full_detailing_pro',
    nombre: 'Full Car Detailing Pro (Exterior 7 Fases + Interior)',
    precioCLP: 84900,
    tiempoEstimado: '3h 30m',
    fasesIncluidas: [1, 2, 3, 4, 5, 6, 7],
    consumosEstimadosMl: {
      shampoo: 50,
      apc_multiproposito: 50,
      desengrasante: 60,
      limpia_cristales: 35,
      acondicionador_plasticos: 35,
      cera_sellador: 30
    }
  },
  {
    id: 'sellado_ceramico',
    nombre: 'Tratamiento Sellador Cerámico / Acrílico',
    precioCLP: 129900,
    tiempoEstimado: '4h 30m',
    fasesIncluidas: [1, 2, 3, 4, 5, 6, 7],
    consumosEstimadosMl: {
      shampoo: 50,
      apc_multiproposito: 40,
      desengrasante: 60,
      limpia_cristales: 35,
      acondicionador_plasticos: 40,
      cera_sellador: 45
    }
  }
];

// ==========================================
// 5. TRABAJOS DE DEMO INICIALES
// ==========================================
export const DEMO_TRABAJOS_DETAILING = [
  {
    id: 'det-job-1',
    numero_ot: 'DET-2026-001',
    patente: 'BB-CL-20',
    marca: 'Chevrolet',
    modelo: 'Sail 1.5',
    cliente: 'Matías Silva',
    telefono: '+56987654321',
    paqueteId: 'full_detailing_pro',
    paqueteNombre: 'Full Car Detailing Pro (Exterior 7 Fases + Interior)',
    precioCLP: 84900,
    estado: 'en_proceso', // 'en_espera' | 'en_proceso' | 'terminado'
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '09:30',
    fases: JSON.parse(JSON.stringify(FASES_CONTROL_CALIDAD)),
    consumosAplicados: false,
    notas: 'Cliente solicita especial atención en manchas de café en butaca copiloto.'
  },
  {
    id: 'det-job-2',
    numero_ot: 'DET-2026-002',
    patente: 'KD-99-12',
    marca: 'Toyota',
    modelo: 'RAV4 2.5',
    cliente: 'Fernanda Muñoz',
    telefono: '+56991234567',
    paqueteId: 'lavado_descontaminado',
    paqueteNombre: 'Lavado Pro + Descontaminado Férrico',
    precioCLP: 45900,
    estado: 'en_espera',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '14:00',
    fases: JSON.parse(JSON.stringify(FASES_CONTROL_CALIDAD)),
    consumosAplicados: false,
    notas: 'Llantas muy contaminadas con ferodo de pastillas de freno.'
  }
];

// ==========================================
// 6. CALCULADORA DE DILUCIONES MATEMÁTICA
// ==========================================
export function calcularDilucion(capacidadBotellaMl, proporcionRatio) {
  const cap = Math.max(50, Number(capacidadBotellaMl) || 500);
  const ratio = Math.max(0, Number(proporcionRatio) || 10);

  if (ratio === 0) {
    // Producto puro (listo para usar)
    return {
      capacidadBotellaMl: cap,
      ratio: 0,
      proporcionTexto: 'Puro (1:0)',
      mlProducto: cap,
      mlAgua: 0,
      porcentajeProducto: 100,
      porcentajeAgua: 0,
      instruccion: `Usa ${cap} ml de producto puro sin diluir.`
    };
  }

  // Fórmula estándar de dilución en detailing: 1 parte de producto por cada R partes de agua
  // Total de partes = 1 + R
  const totalPartes = 1 + ratio;
  const mlProducto = Math.round(cap / totalPartes);
  const mlAgua = cap - mlProducto;
  const porcentajeProducto = Math.round((mlProducto / cap) * 100);

  return {
    capacidadBotellaMl: cap,
    ratio,
    proporcionTexto: `1:${ratio}`,
    mlProducto,
    mlAgua,
    porcentajeProducto,
    porcentajeAgua: 100 - porcentajeProducto,
    instruccion: `Agrega ${mlProducto} ml de producto concentrado y rellena con ${mlAgua} ml de agua.`
  };
}

// ==========================================
// 7. FUNCIONES DE PERSISTENCIA (LOCALSTORAGE + SUPABASE COMPATIBLE)
// ==========================================
export function getLocalDetailingInventory() {
  if (typeof window === 'undefined') return INSUMOS_DETAILING_BASE;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DETAILING_INV_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_DETAILING_INV_KEY, JSON.stringify(INSUMOS_DETAILING_BASE));
      return INSUMOS_DETAILING_BASE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error leyendo inventario detailing de localStorage:', e);
    return INSUMOS_DETAILING_BASE;
  }
}

export function saveLocalDetailingInventory(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_DETAILING_INV_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Error guardando inventario detailing en localStorage:', e);
  }
}

export function getLocalSalidaChecklist() {
  if (typeof window === 'undefined') return CHECKLIST_SALIDA_BASE;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DETAILING_SALIDA_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_DETAILING_SALIDA_KEY, JSON.stringify(CHECKLIST_SALIDA_BASE));
      return CHECKLIST_SALIDA_BASE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error leyendo checklist salida de localStorage:', e);
    return CHECKLIST_SALIDA_BASE;
  }
}

export function saveLocalSalidaChecklist(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_DETAILING_SALIDA_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error guardando checklist salida en localStorage:', e);
  }
}

export function getLocalDetailingJobs() {
  if (typeof window === 'undefined') return DEMO_TRABAJOS_DETAILING;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DETAILING_JOBS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_DETAILING_JOBS_KEY, JSON.stringify(DEMO_TRABAJOS_DETAILING));
      return DEMO_TRABAJOS_DETAILING;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error leyendo trabajos detailing de localStorage:', e);
    return DEMO_TRABAJOS_DETAILING;
  }
}

export function saveLocalDetailingJobs(jobs) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_DETAILING_JOBS_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.warn('Error guardando trabajos detailing en localStorage:', e);
  }
}
