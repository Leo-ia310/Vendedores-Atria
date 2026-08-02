/**
 * Base de conocimiento del Asistente Comercial ATRIA.
 *
 * EDITABLE: agrega o modifica intenciones sin tocar el motor. Cada intención se
 * evalúa por puntaje (ver engine.ts). Mantén las respuestas honestas: no inventes
 * funcionalidades. El asistente es lógico (basado en reglas), no una IA generativa.
 */

export type Intencion = {
  id: string;
  categoria: string;
  prioridad: number; // desempata; mayor gana ante puntajes similares
  keywords: string[]; // frases/palabras clave (se normalizan)
  sinonimos?: string[];
  patrones?: string[]; // expresiones regulares (string) opcionales
  respuesta: string;
  quickReplies?: string[]; // sugerencias de seguimiento
  contexto?: string[]; // ids de intención previos que dan bonificación
};

export const CATEGORIAS = [
  { id: "general", label: "General" },
  { id: "producto", label: "Producto ATRIA" },
  { id: "academia", label: "Academia" },
  { id: "comisiones", label: "Comisiones" },
  { id: "crm", label: "CRM y ventas" },
  { id: "cuenta", label: "Acceso y cuenta" },
  { id: "soporte", label: "Soporte" },
];

export const SALUDOS_QUICK = [
  "¿Qué es ATRIA?",
  "¿Cómo funcionan las comisiones?",
  "¿Cómo me certifico?",
  "Tengo un problema para entrar",
];

export const KNOWLEDGE: Intencion[] = [
  // --- Conversacionales ---
  {
    id: "saludo",
    categoria: "general",
    prioridad: 90,
    keywords: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "que tal", "saludos", "hey"],
    respuesta: "¡Hola! Soy el Asistente Comercial ATRIA. Puedo ayudarte con el producto, la academia, las comisiones, tu cuenta y más. ¿Qué necesitas?",
    quickReplies: SALUDOS_QUICK,
  },
  {
    id: "agradecimiento",
    categoria: "general",
    prioridad: 90,
    keywords: ["gracias", "muchas gracias", "te agradezco", "genial gracias", "perfecto gracias"],
    respuesta: "¡Con gusto! ¿Te ayudo con algo más?",
    quickReplies: ["Ver comisiones", "Cómo hacer una demo", "Contactar soporte"],
  },
  {
    id: "despedida",
    categoria: "general",
    prioridad: 90,
    keywords: ["adios", "hasta luego", "nos vemos", "chao", "bye", "hasta pronto"],
    respuesta: "¡Éxitos con tus ventas! Aquí estaré cuando me necesites.",
  },
  {
    id: "frustracion",
    categoria: "soporte",
    prioridad: 95,
    keywords: ["no sirve", "no funciona", "no entiendo nada", "estoy molesto", "esto es malo", "no me ayudas", "pesimo", "que fastidio"],
    respuesta: "Lamento la molestia. Vamos paso a paso. Cuéntame en pocas palabras qué necesitas, o si prefieres, puedo pasarte con soporte humano.",
    quickReplies: ["Contactar soporte", "Empezar de nuevo"],
  },

  // --- Producto ---
  {
    id: "que_es_arca",
    categoria: "producto",
    prioridad: 60,
    keywords: ["que es atria", "que es arca", "que es el producto", "que vendo", "que es el sistema", "de que trata atria", "de que trata arca", "explicame atria", "explicame arca"],
    sinonimos: ["que es", "producto"],
    respuesta: "ATRIA es un sistema integral de gestión comercial para PYMEs de Latinoamérica: une punto de venta, inventario, reportes, contabilidad y, para restaurantes, control de menú y pedidos. La venta se explica conectando cada función con un problema real del negocio.",
    quickReplies: ["¿Qué módulos tiene?", "¿Sirve para restaurantes?", "¿Quién es el cliente ideal?"],
  },
  {
    id: "modulos",
    categoria: "producto",
    prioridad: 60,
    keywords: ["que modulos", "modulos de atria", "modulos de arca", "funciones de atria", "funciones de arca", "que hace atria", "que hace arca", "caracteristicas"],
    sinonimos: ["modulos", "funciones"],
    respuesta: "ATRIA incluye: Punto de venta (POS), pedidos y menú para restaurantes, Inventario (lotes, vencimientos, multi-almacén), Facturación, Contabilidad automática, Multi-sucursal y Reportes. Conecta cada función con un problema real del cliente al presentarlo.",
    quickReplies: ["¿Sirve para restaurantes?", "¿Qué es la contabilidad automática?", "¿Cómo hago una demo?"],
  },
  {
    id: "restaurantes",
    categoria: "producto",
    prioridad: 58,
    keywords: ["restaurante", "restaurantes", "menu", "menú", "pedido", "pedidos", "mesa", "mesas", "cafeteria", "cafetería", "bar", "comida"],
    sinonimos: ["restaurante", "menu", "pedido"],
    respuesta: "Sí. Para restaurantes, ATRIA se presenta como una forma de ordenar menú, pedidos, cobros, caja, inventario de insumos y reportes. La demo debe mostrar el flujo diario: tomar pedido, cobrar, registrar la venta y revisar información útil para decidir.",
    quickReplies: ["Cliente ideal", "Cómo hacer una demo", "Manejo de objeciones"],
  },
  {
    id: "cliente_ideal",
    categoria: "producto",
    prioridad: 55,
    keywords: ["cliente ideal", "a quien le vendo", "quien necesita atria", "quien necesita arca", "que negocios", "tipo de cliente"],
    respuesta: "El cliente ideal tiene inventario, empleados, pedidos o procesos manuales; usa Excel, cuadernos o un sistema obsoleto; y no tiene reportes claros. Ejemplos: ferreterías, farmacias, distribuidoras, tiendas con varias sucursales, restaurantes y cafeterías.",
    quickReplies: ["¿Cómo detecto oportunidades?", "Ver módulo de cliente ideal"],
  },
  {
    id: "planes_precios",
    categoria: "producto",
    prioridad: 60,
    keywords: ["precio", "precios", "cuanto cuesta", "planes", "que planes", "cuanto vale", "costo de atria", "costo de arca"],
    sinonimos: ["plan", "tarifa"],
    respuesta: "ATRIA tiene 3 planes: Demo (gratis), Pro ($45.99/mes) y Enterprise ($199/mes). El plan Pro es la base más común para calcular comisiones.",
    quickReplies: ["¿Cómo son las comisiones?", "Ver ejemplo de comisión"],
  },
  {
    id: "demo",
    categoria: "producto",
    prioridad: 55,
    keywords: ["como hago una demo", "hacer demo", "demostracion", "presentar atria", "presentar arca", "como presento"],
    respuesta: "Prepara la demo con lo que descubriste del cliente: muestra 2-3 módulos relevantes y conecta cada función con su problema. Hay estructuras de 15, 30 y 45 minutos en el módulo 'Presentación y demostración'.",
    quickReplies: ["Ver módulo de demostración", "Manejo de objeciones"],
  },

  // --- Comisiones ---
  {
    id: "comision_general",
    categoria: "comisiones",
    prioridad: 70,
    keywords: ["comision", "comisiones", "cuanto gano", "cuanto me pagan", "como gano", "ganancias"],
    sinonimos: ["comision", "pago"],
    respuesta: "Ganas 15% sobre la primera venta de cada cliente y 5% sobre cada renovación. Solo se reconocen ventas aprobadas y verificadas. El cálculo lo hace el sistema automáticamente.",
    quickReplies: ["Ver ejemplo", "¿Cuándo me pagan?", "Comisión por renovación"],
  },
  {
    id: "comision_ejemplo",
    categoria: "comisiones",
    prioridad: 65,
    keywords: ["ejemplo de comision", "ejemplo comision", "cuanto por plan pro", "ejemplo", "cuanto de 45"],
    contexto: ["comision_general", "planes_precios"],
    respuesta: "Para el plan Pro de $45.99: tu primera venta ≈ $6.90 (15%) y cada renovación ≈ $2.30 (5%). No hay límite de clientes.",
    quickReplies: ["¿Cuándo me pagan?", "¿Qué es una renovación?"],
  },
  {
    id: "comision_pago",
    categoria: "comisiones",
    prioridad: 60,
    keywords: ["cuando me pagan", "fecha de pago", "cuando cobro", "como recibo el pago", "metodo de pago"],
    respuesta: "Las comisiones aprobadas se programan a una fecha estimada y se pagan por el método acordado. Puedes ver el estado (pendiente, aprobada, pagada) en tu panel de Comisiones.",
    quickReplies: ["Ver mis comisiones", "Política de comisiones"],
  },
  {
    id: "comision_disputa",
    categoria: "comisiones",
    prioridad: 55,
    keywords: ["otro vendedor registro", "cliente duplicado", "me quitaron el cliente", "disputa", "atribucion"],
    respuesta: "La atribución es del primer asesor que registró correctamente al prospecto con evidencia. Los duplicados pasan a revisión administrativa. Sin evidencia registrada no proceden las disputas.",
    quickReplies: ["Política de prospectos", "Registrar un prospecto"],
  },

  // --- Academia / certificación ---
  {
    id: "academia",
    categoria: "academia",
    prioridad: 60,
    keywords: ["academia", "capacitacion", "curso", "modulos de capacitacion", "aprender a vender"],
    respuesta: "La academia tiene 15 módulos: desde bienvenida y producto hasta prospección, objeciones, cierre, CRM, ética y comisiones. Avanzas módulo por módulo; cada uno tiene su examen.",
    quickReplies: ["¿Cómo me certifico?", "¿Cómo son los exámenes?"],
  },
  {
    id: "examenes",
    categoria: "academia",
    prioridad: 60,
    keywords: ["examen", "examenes", "exámenes", "como son los examenes", "cómo son los exámenes", "aprobar examen", "cuantos intentos", "cuántos intentos", "reprobe", "reprobé"],
    respuesta: "Cada módulo tiene un examen con calificación automática y puntaje mínimo (por defecto 85%). Los módulos normales tienen intentos configurables; el examen final se puede repetir sin límite hasta demostrar dominio.",
    quickReplies: ["¿Cómo me certifico?", "¿Qué pasa si no apruebo?"],
  },
  {
    id: "certificacion",
    categoria: "academia",
    prioridad: 65,
    keywords: ["certificacion", "como me certifico", "certificarme", "obtener certificado", "requisitos certificacion"],
    respuesta: "Para certificarte debes: completar todos los módulos, aprobar sus exámenes y el examen final, hacer al menos 3 simulaciones y aceptar los términos, con el puntaje mínimo. Al cumplir todo, el sistema crea tus credenciales de vendedor automáticamente.",
    quickReplies: ["¿Cuándo recibo mi cuenta?", "Ir a certificación"],
  },
  {
    id: "simulaciones",
    categoria: "academia",
    prioridad: 55,
    keywords: ["simulacion", "simulaciones", "simulador", "practicar ventas", "escenarios"],
    respuesta: "El simulador te pone frente a distintos tipos de cliente (apurado, desconfiado, sensible al precio, etc.). Cada decisión suma puntos por saludo, preguntas, escucha, objeciones, cierre y ética. Necesitas al menos 3 para certificarte.",
    quickReplies: ["Ir al simulador", "¿Cómo me certifico?"],
  },

  // --- CRM / ventas ---
  {
    id: "registrar_prospecto",
    categoria: "crm",
    prioridad: 60,
    keywords: ["registrar prospecto", "agregar prospecto", "nuevo prospecto", "como registro un cliente", "crm"],
    respuesta: "En tu panel, entra a 'CRM y prospectos' y pulsa 'Nuevo prospecto'. Registra empresa, contacto y datos verificables. Mueve el prospecto por etapas y registra cada actividad. Evita duplicados.",
    quickReplies: ["¿Cómo doy seguimiento?", "Etapas del CRM"],
  },
  {
    id: "registrar_venta",
    categoria: "crm",
    prioridad: 60,
    keywords: ["registrar venta", "como registro una venta", "cerre una venta", "reportar venta"],
    respuesta: "En 'Ventas' pulsa 'Registrar venta' e indica cliente, plan, monto y comprobante. La venta entra como pendiente y genera comisión automáticamente cuando un administrador la aprueba.",
    quickReplies: ["¿Cuándo me pagan?", "Ver mis ventas"],
  },
  {
    id: "seguimiento",
    categoria: "crm",
    prioridad: 55,
    keywords: ["seguimiento", "dar seguimiento", "como hago seguimiento", "cuando dar seguimiento"],
    respuesta: "Cada seguimiento debe aportar algo (un dato, un caso, una respuesta), no solo '¿ya decidió?'. Usa una secuencia (día 0, 1, 3, 7, 14, 30) y registra la próxima acción en el CRM.",
    quickReplies: ["Ver módulo de seguimiento", "Registrar actividad"],
  },
  {
    id: "objeciones",
    categoria: "crm",
    prioridad: 55,
    keywords: ["objeciones", "el cliente dice caro", "manejo de objeciones", "me dicen que es caro", "usan excel"],
    respuesta: "Ante una objeción, primero pregunta para entender qué hay detrás, luego responde con valor y un ejemplo. 'Está caro' suele significar 'no veo el valor': recupera el impacto del problema. Nunca bajes el precio por tu cuenta.",
    quickReplies: ["Ver módulo de objeciones", "Practicar en el simulador"],
  },

  // --- Cuenta / acceso ---
  {
    id: "acceso",
    categoria: "cuenta",
    prioridad: 65,
    keywords: ["no puedo entrar", "iniciar sesion", "problema para entrar", "no me deja entrar", "login", "acceso"],
    respuesta: "Para entrar usa tu correo personal y tu contraseña en la página de inicio de sesión. Si es tu primer ingreso como vendedor, el sistema te pedirá cambiar la contraseña temporal.",
    quickReplies: ["Olvidé mi contraseña", "Contactar soporte"],
  },
  {
    id: "password",
    categoria: "cuenta",
    prioridad: 65,
    keywords: ["olvide mi contraseña", "recuperar contraseña", "cambiar contraseña", "reset password", "no recuerdo la clave"],
    sinonimos: ["contraseña", "clave", "password"],
    respuesta: "Usa 'Recuperar acceso' en la página de inicio de sesión: te enviaremos un código para restablecerla. Si ya iniciaste sesión, puedes cambiarla desde tu perfil.",
    quickReplies: ["Ir a recuperar acceso", "Contactar soporte"],
  },
  {
    id: "cuando_recibo_cuenta",
    categoria: "cuenta",
    prioridad: 55,
    keywords: ["cuando recibo mi cuenta", "cuando me dan acceso", "cuando soy vendedor", "cuando me certifican"],
    respuesta: "Recibes tu cuenta de vendedor automáticamente al certificarte: cuando completas todos los módulos, apruebas los exámenes y el final, haces las simulaciones y aceptas los términos.",
    quickReplies: ["¿Cómo me certifico?", "Ir a certificación"],
  },

  // --- Soporte / legal ---
  {
    id: "soporte",
    categoria: "soporte",
    prioridad: 60,
    keywords: ["soporte", "ayuda humana", "hablar con alguien", "contactar", "whatsapp", "necesito ayuda"],
    respuesta: "Si necesitas ayuda humana, puedes escribir al WhatsApp de soporte. Cuéntame primero tu caso por si puedo resolverlo aquí mismo.",
    quickReplies: ["Escribir por WhatsApp"],
  },
  {
    id: "terminos",
    categoria: "soporte",
    prioridad: 50,
    keywords: ["terminos", "condiciones", "politicas", "reglas", "codigo de conducta", "privacidad"],
    respuesta: "Tienes los documentos del programa (términos, comisiones, privacidad, código de conducta, prospectos y más) en la sección Legal. Se registra la versión que aceptas al certificarte.",
    quickReplies: ["Ver términos", "Política de comisiones"],
  },
  {
    id: "etica",
    categoria: "soporte",
    prioridad: 55,
    keywords: ["puedo dar descuento", "cambiar precio", "es etico", "puedo prometer", "reglas eticas"],
    respuesta: "No se permite modificar precios ni ofrecer descuentos sin autorización, ni prometer funciones inexistentes, ni registrar prospectos ajenos. La ética es innegociable y su incumplimiento puede costar la certificación.",
    quickReplies: ["Código de conducta", "Ver módulo de ética"],
  },
];
