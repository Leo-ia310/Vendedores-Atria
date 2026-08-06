/**
 * Contenido de la Academia Comercial ATRIA — 15 módulos.
 *
 * El CONTENIDO vive en código (versionado, rápido de editar). El PROGRESO y los
 * RESULTADOS de exámenes se guardan en Supabase vía la API interna de Next.
 *
 * Cada `id` debe existir también en la tabla `Modulos` del backend (mismo ModuleId)
 * para el gating de certificación. Los ids usados aquí: mod1..mod15.
 */

export type Seccion = { h: string; p: string[]; lista?: string[] };

export type RecursoDescargable = {
  titulo: string;
  descripcion?: string;
  href: string;
  formato?: string;
};

export type Modulo = {
  id: string;
  orden: number;
  titulo: string;
  objetivo: string;
  nivel: "Principiante" | "Intermedio" | "Avanzado";
  tiempo: string;
  obligatorio: boolean;
  video?: string; // etiqueta del placeholder de video
  videoSrc?: string;
  intro: string;
  secciones: Seccion[];
  ejemplos?: string[];
  erroresComunes?: string[];
  resumen: string[];
  checklist: string[];
  recursos?: Array<string | RecursoDescargable>;
  tieneExamen: boolean;
};

export const MODULOS: Modulo[] = [
  {
    id: "mod1",
    orden: 1,
    titulo: "Bienvenida a ATRIA",
    objetivo: "Entender qué es ATRIA, su propósito y el rol del asesor comercial.",
    nivel: "Principiante",
    tiempo: "15 min",
    obligatorio: true,
    video: "Video 1: Bienvenida a ATRIA",
    videoSrc: "/recursos/modulo-1/Modulo-1.mp4",
    intro:
      "Bienvenido al programa de vendedores de ATRIA. Antes de vender, hay que creer en lo que se vende y entender a quién ayuda. En este módulo conocerás la razón de ser de ATRIA y qué se espera de ti.",
    secciones: [
      {
        h: "Qué es ATRIA",
        p: [
          "ATRIA es un sistema integral de gestión comercial para pequeñas y medianas empresas de Latinoamérica. Une el punto de venta, el inventario, la contabilidad y, para restaurantes, el control de pedidos y menú en una sola plataforma.",
          "La idea central: cada evento del negocio (venta, compra, gasto) genera automáticamente su asiento contable. El dueño deja de cuadrar todo a mano.",
        ],
      },
      {
        h: "Misión, visión y valores",
        p: ["Ayudamos a que comercios y restaurantes dejen atrás el desorden de Excel, cuadernos y sistemas desconectados, con tecnología simple y potente."],
        lista: [
          "Misión: dar control y claridad a cada comercio.",
          "Visión: ser el sistema operativo del comercio en Latinoamérica.",
          "Valores: honestidad, simplicidad operativa, cercanía y soporte en español.",
        ],
      },
      {
        h: "Qué se espera de ti",
        p: ["El asesor es la cara de ATRIA. Tu trabajo es entender al negocio, mostrar cómo ATRIA lo ordena y acompañar la decisión con ética."],
        lista: [
          "Representar la marca con honestidad.",
          "Aprender el producto a fondo.",
          "Registrar bien tus prospectos y ventas.",
          "Cumplir las políticas comerciales.",
        ],
      },
    ],
    resumen: [
      "ATRIA integra POS, inventario, contabilidad automática y operación para restaurantes.",
      "El asesor es el puente entre el negocio y la solución.",
      "La ética y el registro correcto son la base del programa.",
    ],
    checklist: [
      "Sé explicar en una frase qué es ATRIA.",
      "Sé mencionar cuándo aplica a un comercio y cuándo a un restaurante.",
      "Conozco la misión y los valores.",
      "Entiendo qué se espera de mí como asesor.",
    ],
    recursos: [
      {
        titulo: "Video 1: Bienvenida a ATRIA",
        descripcion: "Archivo MP4 del primer video del módulo.",
        href: "/recursos/modulo-1/Modulo-1.mp4",
        formato: "MP4",
      },
      {
        titulo: "PDF: Bienvenida a ATRIA",
        descripcion: "Material de apoyo del módulo 1.",
        href: "/recursos/modulo-1/Modulo-01-Bienvenida-a-ATRIA.pdf",
        formato: "PDF",
      },
    ],
    tieneExamen: true,
  },
  {
    id: "mod2",
    orden: 2,
    titulo: "Dominio del producto",
    objetivo: "Conocer cada módulo real de ATRIA y conectarlo con un problema del cliente.",
    nivel: "Principiante",
    tiempo: "35 min",
    obligatorio: true,
    video: "Video 2: Dominio del producto",
    videoSrc: "/recursos/modulo-2/Academia-Comercial-Arca-Modulo-02.mp4",
    intro:
      "No se vende lo que no se entiende. Aquí verás cada módulo de ATRIA: qué hace, qué problema resuelve y qué tipo de cliente lo necesita.",
    secciones: [
      {
        h: "Punto de venta (POS)",
        p: ["Vende rápido, aplica descuentos, cobra mixto y sigue operando cuando el internet falla."],
        lista: ["Problema que resuelve: ventas lentas y sin registro.", "Cliente típico: cualquier comercio con caja."],
      },
      {
        h: "Pedidos y menú para restaurantes",
        p: ["Organiza el menú, toma pedidos, conecta la venta con caja y ayuda a mantener control del consumo de inventario."],
        lista: [
          "Problema que resuelve: pedidos perdidos, cobros desordenados y poca claridad de productos vendidos.",
          "Cliente típico: restaurante, cafetería, comida rápida, bar o cocina con pedidos frecuentes.",
        ],
      },
      {
        h: "Inventario",
        p: ["Controla existencias, lotes, vencimientos, almacenes y movimientos entre sucursales."],
        lista: ["Problema: pérdidas y quiebres de stock.", "Cliente: negocios con productos físicos."],
      },
      {
        h: "Contabilidad automática",
        p: ["Cada venta, compra, gasto y cobro genera su asiento sin volver a digitar. Libro diario, mayor y estados salen solos."],
        lista: ["Problema: contabilidad atrasada y cara.", "Cliente: negocios que hoy pagan a alguien para 'cuadrar'."],
      },
      {
        h: "Multi-sucursal y reportes",
        p: ["Consolida varias tiendas y entrega reportes de ventas, rentabilidad, cuentas por cobrar y stock bajo."],
      },
    ],
    ejemplos: [
      "Una ferretería con dos locales no sabe cuál es más rentable → ATRIA multi-sucursal + reportes.",
      "Una farmacia pierde productos vencidos → control de lotes y vencimientos del inventario.",
      "Un restaurante pierde control entre pedidos, caja e insumos → pedidos y menú conectados con inventario y reportes.",
    ],
    erroresComunes: [
      "Mostrar TODOS los módulos aunque el cliente solo necesite dos.",
      "Hablar de funciones sin conectarlas a un problema real.",
    ],
    resumen: [
      "Cada módulo resuelve un problema concreto.",
      "Conecta función → problema → beneficio.",
      "No todos los clientes necesitan todo.",
    ],
    checklist: [
      "Puedo describir cada módulo en una frase.",
      "Puedo explicar pedidos y menú para restaurantes.",
      "Sé qué problema resuelve cada uno.",
      "Puedo dar un ejemplo por módulo.",
    ],
    recursos: [
      {
        titulo: "PDF: Dominio del producto",
        descripcion: "Material de apoyo del módulo 2.",
        href: "/recursos/modulo-2/Modulo-02-Dominio-del-producto.pdf",
        formato: "PDF",
      },
      {
        titulo: "Presentación: Dominio del producto",
        descripcion: "Deck editable del módulo 2.",
        href: "/recursos/modulo-2/Modulo-02-Dominio-del-producto.pptx",
        formato: "PPTX",
      },
    ],
    tieneExamen: true,
  },
  {
    id: "mod3",
    orden: 3,
    titulo: "Cliente ideal",
    objetivo: "Identificar qué negocios necesitan ATRIA y cuáles no califican.",
    nivel: "Principiante",
    tiempo: "25 min",
    obligatorio: true,
    intro: "Vender a quien no lo necesita gasta tu tiempo. Aquí aprendes a reconocer al cliente ideal.",
    secciones: [
      {
        h: "El perfil de cliente ideal",
        p: ["Es el negocio que más se beneficia y más rápido decide."],
        lista: [
          "Tiene inventario y/o empleados.",
          "Usa Excel, cuaderno o un sistema obsoleto.",
          "No tiene reportes claros ni control.",
          "Tiene procesos manuales que le cuestan tiempo o dinero.",
        ],
      },
      {
        h: "Señales de oportunidad",
        p: ["Escucha frases como: 'no sé cuánto gané', 'se me pierde mercadería', 'la contadora va atrasada', 'tengo todo en cuadernos', 'los pedidos se confunden' o 'no sé qué platos dejan más margen'."],
      },
      {
        h: "Perfiles de ejemplo",
        p: [],
        lista: [
          "Ferretería con mucho SKU y descontrol de stock.",
          "Farmacia con vencimientos y lotes.",
          "Restaurante con pedidos, menú, caja e inventario de insumos.",
          "Cafetería con ventas rápidas y productos preparados.",
          "Distribuidora con varias rutas.",
          "Tienda con 2-3 sucursales.",
          "Negocio con empleados y cajas.",
        ],
      },
      {
        h: "Quién NO califica (por ahora)",
        p: [],
        lista: [
          "Vendedor ambulante sin inventario ni empleados.",
          "Negocio que acaba de comprar otro sistema.",
          "Quien no tiene ningún dolor ni intención de cambiar.",
        ],
      },
    ],
    resumen: [
      "El cliente ideal tiene inventario, empleados, pedidos o desorden operativo.",
      "Las señales de oportunidad se escuchan, no se adivinan.",
      "Descalificar a tiempo también es vender mejor.",
    ],
    checklist: [
      "Reconozco 3 señales de oportunidad.",
      "Sé describir 3 perfiles ideales.",
      "Sé cuándo un prospecto no califica.",
    ],
    tieneExamen: true,
  },
  {
    id: "mod4",
    orden: 4,
    titulo: "Fundamentos de ventas",
    objetivo: "Dominar las bases de la venta consultiva y ética.",
    nivel: "Principiante",
    tiempo: "30 min",
    obligatorio: true,
    intro: "Vender no es hablar mucho: es entender y ayudar a decidir. Estas son las bases.",
    secciones: [
      {
        h: "Informar vs vender",
        p: ["Informar es listar características. Vender es conectar una necesidad con una solución y ayudar a decidir."],
      },
      {
        h: "Venta consultiva y escucha activa",
        p: ["El asesor consultivo pregunta, escucha y recomienda. Habla menos y escucha más."],
        lista: ["Haz preguntas abiertas.", "Confirma lo que entendiste.", "No interrumpas ni interrogues."],
      },
      {
        h: "Necesidad, problema e impacto",
        p: ["Detrás de cada necesidad hay un problema, y detrás del problema un impacto (tiempo, dinero, riesgo). El impacto es lo que motiva la compra."],
      },
      {
        h: "Valor vs precio",
        p: ["El precio se compara; el valor se explica. Si el cliente ve el valor, el precio deja de ser el centro."],
      },
    ],
    erroresComunes: ["Hablar de precio antes de crear valor.", "Presentar sin haber diagnosticado."],
    resumen: [
      "Vender = conectar necesidad con solución.",
      "Escucha activa > monólogo.",
      "El impacto motiva la decisión.",
    ],
    checklist: ["Distingo informar de vender.", "Sé qué es venta consultiva.", "Puedo explicar valor vs precio."],
    tieneExamen: true,
  },
  {
    id: "mod5",
    orden: 5,
    titulo: "Prospección",
    objetivo: "Encontrar y contactar negocios potenciales de forma ética.",
    nivel: "Intermedio",
    tiempo: "35 min",
    obligatorio: true,
    intro: "Sin prospectos no hay ventas. Aquí aprendes a construir tu lista y a hacer contacto sin ser invasivo.",
    secciones: [
      {
        h: "Dónde encontrar negocios",
        p: [],
        lista: [
          "Google Maps y directorios locales.",
          "Redes sociales (páginas de negocios).",
          "Referidos de clientes y conocidos.",
          "Recorrido de zona (comercios físicos).",
        ],
      },
      {
        h: "Investigar antes de contactar",
        p: ["Antes de escribir, averigua a qué se dedica, tamaño aproximado y posible dolor. El contacto personalizado convierte más."],
      },
      {
        h: "Guiones de contacto",
        p: ["Usa un mensaje corto, personalizado y con un objetivo claro: agendar una breve conversación, no vender en el primer mensaje."],
        lista: [
          "WhatsApp: saludo + quién eres + valor + pregunta.",
          "Correo: asunto claro + 3 líneas + llamada a la acción.",
          "Llamada: presentarte, pedir 2 minutos, calificar.",
        ],
      },
      {
        h: "Reglas de respeto",
        p: ["Nada de spam masivo ni mensajes engañosos. Respeta horarios, leyes de privacidad y el 'no' del prospecto."],
      },
    ],
    ejemplos: [
      "WhatsApp comercio: 'Hola, soy [nombre], asesor de ATRIA. Ayudamos a ferreterías como la suya a controlar inventario y ventas en un solo lugar. ¿Le parece si le muestro en 10 min cómo funciona?'",
      "WhatsApp restaurante: 'Hola, soy [nombre], asesor de ATRIA. Ayudamos a restaurantes a ordenar pedidos, menú, caja e inventario. ¿Le muestro en 10 min un flujo sencillo?'",
    ],
    erroresComunes: ["Copiar-pegar el mismo mensaje a 200 números.", "Prometer cosas para lograr la reunión."],
    resumen: ["Construye una lista investigada.", "Personaliza el primer contacto.", "Nunca spam ni engaño."],
    checklist: ["Tengo 3 fuentes de prospectos.", "Tengo mi guion de WhatsApp.", "Conozco las reglas de respeto."],
    recursos: ["Plantilla de lista de prospectos", "Guiones de contacto"],
    tieneExamen: true,
  },
  {
    id: "mod6",
    orden: 6,
    titulo: "Descubrimiento de necesidades",
    objetivo: "Diagnosticar al cliente con preguntas, no con interrogatorios.",
    nivel: "Intermedio",
    tiempo: "30 min",
    obligatorio: true,
    intro: "El diagnóstico es el corazón de la venta consultiva. Quien pregunta bien, vende mejor.",
    secciones: [
      {
        h: "La conversación de diagnóstico",
        p: ["Es una charla guiada por preguntas abiertas que revela cómo trabaja hoy el negocio y qué le duele."],
        lista: [
          "¿Cómo registra sus ventas hoy?",
          "¿Cómo controla su inventario?",
          "¿Cuánto tiempo le toma un reporte?",
          "¿Qué procesos hace manualmente?",
          "¿Qué consecuencias le trae ese problema?",
        ],
      },
      {
        h: "Calificar: necesidad, autoridad, presupuesto, urgencia",
        p: ["Identifica si hay un dolor real, si hablas con quien decide, si hay dinero y si hay urgencia."],
      },
      {
        h: "Registrar en el CRM",
        p: ["Todo lo que descubras va al CRM: sin registro, el diagnóstico se pierde."],
      },
    ],
    erroresComunes: ["Interrogar en vez de conversar.", "No profundizar en el impacto del problema."],
    resumen: ["Diagnostica con preguntas abiertas.", "Califica NAPU.", "Registra lo aprendido."],
    checklist: ["Tengo 5 preguntas de diagnóstico.", "Sé calificar NAPU.", "Registro en el CRM."],
    tieneExamen: true,
  },
  {
    id: "mod7",
    orden: 7,
    titulo: "Presentación y demostración",
    objetivo: "Preparar y ejecutar demos que conectan cada función con un problema.",
    nivel: "Intermedio",
    tiempo: "35 min",
    obligatorio: true,
    video: "Aquí va un video de demostración comercial",
    intro: "Una buena demo no muestra todo: muestra lo que le importa al cliente que tienes enfrente.",
    secciones: [
      {
        h: "Preparar y personalizar",
        p: ["Con lo que descubriste, elige 2-3 módulos relevantes. No muestres funciones irrelevantes."],
      },
      {
        h: "Estructura de la demo",
        p: ["Conecta cada función con el problema del cliente y su impacto."],
        lista: [
          "Recap del dolor (1 min).",
          "Solución en vivo enfocada (el núcleo).",
          "Beneficio en dinero/tiempo.",
          "Cierre + próximo paso.",
        ],
      },
      {
        h: "Demos de 15, 30 y 45 minutos",
        p: ["15 min: solo el dolor principal. 30 min: dolor + contabilidad automática. 45 min: recorrido completo con reportes. En restaurantes, el flujo mínimo debe mostrar menú, pedido, cobro y efecto operativo."],
      },
    ],
    erroresComunes: ["Demo genérica sin diagnóstico.", "No definir el siguiente paso al terminar."],
    resumen: ["Personaliza según el diagnóstico.", "Función → problema → beneficio.", "Cierra con próximo paso."],
    checklist: ["Sé armar una demo de 15 min.", "Conecto función con problema.", "Defino el próximo paso."],
    recursos: [
      {
        titulo: "PDF: Guion de presentación y demostración",
        descripcion: "Material de apoyo del módulo 7.",
        href: "/recursos/modulo-7/Guion-Modulo-07-Presentacion-y-demostracion.pdf",
        formato: "PDF",
      },
      {
        titulo: "Presentación: Presentación y demostración",
        descripcion: "Deck editable del módulo 7.",
        href: "/recursos/modulo-7/Modulo-07-Presentacion-y-demostracion.pptx",
        formato: "PPTX",
      },
      {
        titulo: "Guion: Presentación y demostración",
        descripcion: "Guion editable para grabación o facilitación.",
        href: "/recursos/modulo-7/Guion-Modulo-07-Presentacion-y-demostracion.docx",
        formato: "DOCX",
      },
    ],
    tieneExamen: true,
  },
  {
    id: "mod8",
    orden: 8,
    titulo: "Manejo de objeciones",
    objetivo: "Responder objeciones con preguntas y valor, sin discutir.",
    nivel: "Intermedio",
    tiempo: "40 min",
    obligatorio: true,
    intro: "Una objeción no es un 'no': muchas veces es una duda o un miedo. Aquí aprendes a manejarlas.",
    secciones: [
      {
        h: "El método: aclarar antes de responder",
        p: ["Ante una objeción, primero pregunta para entender qué hay detrás. Luego responde con valor y un ejemplo."],
      },
      {
        h: "Objeciones frecuentes",
        p: ["Cada una tiene un significado real, algo que NO debes responder y una respuesta recomendada."],
        lista: [
          "'Está caro' → suele ser 'no veo el valor'. Recupera el impacto del problema.",
          "'Uso Excel' → muestra el costo oculto del error manual.",
          "'Déjame pensarlo' → pregunta qué falta para decidir.",
          "'Mis empleados no sabrán usarlo' → habla de la simplicidad y el soporte.",
          "'No confío en la nube' → explica respaldos y seguridad.",
        ],
      },
      {
        h: "Cuándo retirarse",
        p: ["Si no hay dolor, ni autoridad, ni intención real, retírate con respeto y deja la puerta abierta."],
      },
    ],
    erroresComunes: ["Rebatir de inmediato sin entender.", "Bajar el precio para 'cerrar'."],
    resumen: ["Aclara antes de responder.", "Responde con valor y ejemplo.", "Sabe cuándo retirarte."],
    checklist: ["Manejo 'está caro'.", "Manejo 'uso Excel'.", "Sé cuándo retirarme."],
    recursos: ["Guía de objeciones y respuestas"],
    tieneExamen: true,
  },
  {
    id: "mod9",
    orden: 9,
    titulo: "Seguimiento",
    objetivo: "Dar seguimiento efectivo sin acosar.",
    nivel: "Intermedio",
    tiempo: "25 min",
    obligatorio: true,
    intro: "La mayoría de las ventas se cierran en el seguimiento, no en el primer contacto.",
    secciones: [
      {
        h: "Cuándo y cómo",
        p: ["Cada seguimiento debe aportar algo (un dato, un caso, una respuesta), no solo '¿ya decidió?'."],
      },
      {
        h: "Secuencia recomendada (editable)",
        p: [],
        lista: [
          "Día 0: gracias + resumen de la reunión.",
          "Día 1: envío de propuesta.",
          "Día 3: aporta un caso o beneficio.",
          "Día 7: resuelve dudas pendientes.",
          "Día 14: última oferta de ayuda.",
          "Día 30: reactivación suave.",
        ],
      },
      {
        h: "Registrar y detectar pérdida de interés",
        p: ["Anota cada interacción y su próxima acción. Si el interés cae, cierra la oportunidad con respeto."],
      },
    ],
    erroresComunes: ["Seguir sin aportar valor.", "No registrar la próxima acción."],
    resumen: ["Cada seguimiento aporta algo.", "Usa una secuencia con fechas.", "Registra todo en el CRM."],
    checklist: ["Tengo mi secuencia de seguimiento.", "Registro la próxima acción.", "Sé cerrar una oportunidad perdida."],
    tieneExamen: true,
  },
  {
    id: "mod10",
    orden: 10,
    titulo: "Cierre",
    objetivo: "Reconocer señales de compra y cerrar con próximos pasos claros.",
    nivel: "Avanzado",
    tiempo: "30 min",
    obligatorio: true,
    intro: "Cerrar no es presionar: es facilitar una decisión que ya tiene sentido para el cliente.",
    secciones: [
      {
        h: "Señales de compra",
        p: ["Pregunta por precios, plazos, implementación o involucra a otra persona: son señales de que está listo."],
      },
      {
        h: "El cierre en 4 pasos",
        p: [],
        lista: [
          "Resume el valor y confirma la necesidad.",
          "Haz la pregunta de cierre.",
          "Define próximos pasos: registro, pago, implementación.",
          "Establece expectativas correctas (sin prometer de más)."],
      },
      {
        h: "Entrega a soporte",
        p: ["Tras el cierre, coordina la implementación y la entrega a soporte para un buen arranque del cliente."],
      },
    ],
    erroresComunes: ["No pedir el cierre nunca.", "Prometer funciones inexistentes para cerrar."],
    resumen: ["Detecta señales de compra.", "Cierra en 4 pasos.", "Entrega ordenada a soporte."],
    checklist: ["Reconozco señales de compra.", "Sé hacer la pregunta de cierre.", "Defino próximos pasos."],
    tieneExamen: true,
  },
  {
    id: "mod11",
    orden: 11,
    titulo: "CRM del vendedor",
    objetivo: "Usar el panel para registrar prospectos, actividades y ventas.",
    nivel: "Intermedio",
    tiempo: "20 min",
    obligatorio: true,
    intro: "Tu CRM es tu memoria y tu prueba. Lo que no está registrado, no existe (ni para comisiones).",
    secciones: [
      {
        h: "Etapas del pipeline",
        p: ["Mueve cada prospecto por etapas: nuevo, contactado, calificado, demo, propuesta, negociación, ganado/perdido."],
      },
      {
        h: "Registrar bien",
        p: [],
        lista: [
          "Datos de contacto verificables.",
          "Notas de cada interacción.",
          "Próxima acción con fecha.",
          "Evidencia para la atribución.",
        ],
      },
      {
        h: "Evitar duplicados y respetar propiedad",
        p: ["Antes de crear un prospecto, verifica que no exista. Respeta la propiedad del primer registro válido."],
      },
    ],
    resumen: ["Registra todo con evidencia.", "Actualiza etapas y próxima acción.", "Respeta la propiedad de prospectos."],
    checklist: ["Sé mover etapas.", "Registro próxima acción.", "Evito duplicados."],
    tieneExamen: true,
  },
  {
    id: "mod12",
    orden: 12,
    titulo: "Ética y cumplimiento",
    objetivo: "Interiorizar las reglas éticas del programa.",
    nivel: "Principiante",
    tiempo: "20 min",
    obligatorio: true,
    intro: "La confianza es tu activo más valioso. Una sola práctica engañosa la destruye.",
    secciones: [
      {
        h: "Lo que nunca se hace",
        p: [],
        lista: [
          "No mentir ni prometer funciones inexistentes.",
          "No alterar precios ni dar descuentos sin autorización.",
          "No falsificar ventas ni registrar prospectos ajenos.",
          "No usar información confidencial ni bases de datos ilegales.",
          "No acosar clientes ni suplantar a la empresa.",
          "No hablar mal de competidores.",
        ],
      },
      {
        h: "Consecuencias",
        p: ["El incumplimiento implica pérdida de comisiones, suspensión o terminación y revocación de la certificación."],
      },
    ],
    resumen: ["La ética es innegociable.", "Registrar prospectos ajenos es falta grave.", "Incumplir cuesta la certificación."],
    checklist: ["Conozco las prácticas prohibidas.", "Entiendo las consecuencias.", "Me comprometo con la ética."],
    recursos: ["Código de conducta"],
    tieneExamen: true,
  },
  {
    id: "mod13",
    orden: 13,
    titulo: "Comisiones",
    objetivo: "Comprender cómo se calculan, aprueban y pagan las comisiones.",
    nivel: "Principiante",
    tiempo: "20 min",
    obligatorio: true,
    intro: "Transparencia total: así funcionan tus ingresos.",
    secciones: [
      {
        h: "Estructura",
        p: ["15% sobre la primera venta y 5% sobre cada renovación. Los porcentajes son configurables por reglas vigentes."],
      },
      {
        h: "Reglas clave",
        p: [],
        lista: [
          "Solo ventas aprobadas y verificadas generan comisión.",
          "Si un cliente entra con tu link de referido y compra, la venta se atribuye a ti aunque complete la compra desde otra ubicación o dispositivo, siempre que siga asociada a ese referido.",
          "Ventas pendientes/rechazadas: sin comisión.",
          "Reembolso: comisión anulada o descontada.",
          "Duplicados: revisión administrativa.",
        ],
      },
      {
        h: "Atribución por link de referido",
        p: [
          "Tu link de referido identifica al cliente que llegó por tu recomendación. Si esa persona entra con tu link y luego compra, la comisión se acumula a tu cuenta siempre que la venta quede aprobada y no sea anulada.",
          "La ubicación física del cliente no importa: puede comprar desde cualquier ciudad o país. Lo importante es que la compra quede asociada al referido correcto y pase la validación de ATRIA.",
        ],
      },
      {
        h: "Cortes, pagos e impuestos",
        p: ["Las comisiones se programan y pagan según corte y método. Tú eres responsable de tus impuestos personales."],
      },
    ],
    resumen: ["15% primera venta / 5% renovación.", "El link de referido atribuye la compra al asesor aunque el cliente compre desde otra ubicación.", "Solo cuenta lo aprobado y verificado.", "El cálculo lo hace el backend."],
    checklist: ["Sé los porcentajes.", "Entiendo qué venta genera comisión.", "Sé cómo funciona la atribución por link de referido.", "Sé cómo y cuándo se paga."],
    recursos: ["Política de comisiones"],
    tieneExamen: true,
  },
  {
    id: "mod14",
    orden: 14,
    titulo: "Productividad del vendedor",
    objetivo: "Organizar metas, agenda e indicadores para mejorar continuamente.",
    nivel: "Avanzado",
    tiempo: "25 min",
    obligatorio: true,
    intro: "Los mejores vendedores no trabajan más horas: trabajan con método.",
    secciones: [
      {
        h: "Metas y agenda",
        p: ["Define metas semanales y bloquea tiempo para prospección, seguimientos y demos."],
      },
      {
        h: "Indicadores",
        p: ["Mide prospectos nuevos, reuniones, demos, propuestas y cierres. La conversión te dice dónde mejorar."],
      },
      {
        h: "Mejora continua",
        p: ["Revisa cada semana qué funcionó y prioriza las oportunidades con más probabilidad."],
      },
    ],
    resumen: ["Trabaja con metas y agenda.", "Mide tu conversión.", "Prioriza y mejora cada semana."],
    checklist: ["Tengo metas semanales.", "Mido mis indicadores.", "Reviso y ajusto."],
    tieneExamen: true,
  },
  {
    id: "mod15",
    orden: 15,
    titulo: "Examen final y certificación",
    objetivo: "Demostrar dominio integral para certificarte como asesor ATRIA.",
    nivel: "Avanzado",
    tiempo: "Sin límite",
    obligatorio: true,
    intro:
      "Este examen integra todo: producto, cliente ideal, prospección, diagnóstico, demo, objeciones, seguimiento, cierre, CRM, ética y comisiones. Prepárate y da lo mejor.",
    secciones: [
      {
        h: "Qué evalúa",
        p: ["Preguntas de selección múltiple, verdadero/falso, casos prácticos y situacionales."],
      },
      {
        h: "Requisitos para certificarte",
        p: ["Completar todos los módulos, aprobar sus exámenes, aprobar el examen final con el puntaje mínimo, realizar las simulaciones y aceptar los términos."],
      },
    ],
    resumen: ["El examen final integra todo el programa.", "Necesitas el puntaje mínimo configurado.", "Al aprobar todo, el sistema crea tus credenciales."],
    checklist: ["Repasé todos los módulos.", "Completé las simulaciones.", "Estoy listo para el examen final."],
    tieneExamen: true,
  },
];

const REFUERZOS_MODULOS: Record<string, Seccion[]> = {
  mod1: [
    {
      h: "Cómo explicarlo desde cero",
      p: [
        "Si alguien nunca ha escuchado de ATRIA, no empieces por una lista de funciones. Empieza por el problema: muchos negocios venden, compran, cobran y hacen inventario en lugares separados. Eso provoca errores, tiempo perdido y poca claridad para decidir.",
        "Una frase simple: ATRIA ayuda a que un comercio o restaurante controle ventas, pedidos, inventario, reportes y contabilidad desde una sola operación.",
      ],
      lista: [
        "Problema: desorden operativo.",
        "Solución: una plataforma conectada.",
        "Beneficio: menos errores, más control y mejores decisiones.",
      ],
    },
  ],
  mod2: [
    {
      h: "Mapa mental del producto",
      p: [
        "Piensa en ATRIA como una cadena: el negocio vende o toma un pedido, esa operación afecta caja, inventario, reportes y contabilidad. El asesor debe explicar esa conexión, no solo nombrar pantallas.",
        "Para comercios, el flujo más común es venta -> inventario -> reporte -> contabilidad. Para restaurantes, el flujo es menú -> pedido -> cobro -> inventario de insumos -> reporte.",
      ],
    },
  ],
  mod3: [
    {
      h: "Cómo decidir si vale la pena perseguir un prospecto",
      p: [
        "Un buen prospecto no es solo alguien con negocio: es alguien con dolor, operación repetida y necesidad de control. Si no hay dolor, presupuesto, autoridad o intención de cambiar, registra el contacto como futuro o descártalo con respeto.",
        "En restaurantes, una señal fuerte es que el dueño no sabe qué platos dejan margen, qué insumos se consumen más o dónde se pierden pedidos.",
      ],
    },
  ],
  mod4: [
    {
      h: "La estructura de una conversación comercial",
      p: [
        "Una conversación sana tiene apertura, diagnóstico, propuesta de valor, manejo de dudas y próximo paso. Si saltas directo a precio o cierre, el cliente siente presión. Si solo informas, el cliente no entiende por qué debería cambiar.",
        "La venta consultiva no obliga al cliente: le ayuda a entender su problema, medir el impacto y decidir con claridad.",
      ],
    },
  ],
  mod5: [
    {
      h: "Sistema simple de prospección semanal",
      p: [
        "Trabaja con una lista viva: nuevos negocios, contactados, respondieron, reunión agendada y descartados. Cada semana agrega prospectos nuevos y limpia los que no califican.",
        "Un buen mensaje de prospección debe sonar humano: menciona el tipo de negocio, el problema que puedes ayudar a ordenar y una pregunta concreta para abrir conversación.",
      ],
    },
  ],
  mod6: [
    {
      h: "Diagnóstico que descubre impacto",
      p: [
        "No basta con preguntar qué sistema usa. Debes descubrir cuánto cuesta el problema: horas perdidas, errores de caja, productos vencidos, pedidos confundidos, inventario que no cuadra o reportes que llegan tarde.",
        "El impacto es lo que convierte una función en valor. Sin impacto, ATRIA parece un gasto; con impacto, se entiende como inversión.",
      ],
    },
  ],
  mod7: [
    {
      h: "Demo guiada por el dolor",
      p: [
        "Antes de mostrar una pantalla, di qué problema vas a resolver. Por ejemplo: 'Usted me dijo que los pedidos se confunden; le mostraré cómo se toma un pedido, se cobra y queda registrado'.",
        "Una demo excelente no enseña todo ATRIA; enseña lo suficiente para que el cliente vea su operación más ordenada.",
      ],
    },
  ],
  mod8: [
    {
      h: "Biblioteca mental de objeciones",
      p: [
        "Cada objeción tiene una capa visible y una capa real. 'Está caro' puede significar falta de valor, falta de presupuesto o miedo a equivocarse. 'Déjeme pensarlo' puede significar que falta información, autoridad o urgencia.",
        "Responde con una pregunta breve antes de defender ATRIA. Así evitas discutir y entiendes qué debe resolverse.",
      ],
    },
  ],
  mod9: [
    {
      h: "Seguimiento con intención",
      p: [
        "El seguimiento no es insistir; es avanzar la decisión. Cada contacto debe tener una razón: enviar resumen, responder una duda, compartir una comparación, confirmar una fecha o cerrar la oportunidad.",
        "Si el cliente no comprará, registra la razón. Saber por qué se perdió una oportunidad ayuda a mejorar el discurso y evita perseguir cuentas frías.",
      ],
    },
  ],
  mod10: [
    {
      h: "Cierre sin presión",
      p: [
        "Cerrar es ordenar el siguiente paso cuando el cliente ya entendió el valor. Una buena pregunta de cierre puede ser: '¿Le parece que avancemos con el plan que cubre este flujo y coordinamos implementación?'.",
        "Si el cliente dice no, no lo tomes como fracaso automático. Cierra con respeto, registra el motivo y define si habrá seguimiento futuro.",
      ],
    },
  ],
  mod11: [
    {
      h: "El CRM de ATRIA vive aquí",
      p: [
        "El CRM que usarás para vender ATRIA está dentro de esta plataforma, en el panel del vendedor. No es una teoría externa: aquí registras prospectos, actualizas etapas, dejas notas, programas próximas acciones y registras ventas cuando el cliente compra.",
        "El CRM es la fuente de verdad del programa. Si un prospecto, llamada, demo o venta no está aquí, para el sistema no existe y no puede proteger tu seguimiento ni tus comisiones.",
      ],
    },
    {
      h: "Qué se registra en un prospecto",
      p: [
        "Un prospecto debe tener datos suficientes para reconocerlo y darle seguimiento: empresa, contacto, correo o WhatsApp, país, sector, fuente, etapa, valor estimado, próxima acción, fecha de seguimiento y notas.",
        "No llenes el CRM solo por llenar. Cada dato debe ayudarte a saber quién es el cliente, qué le duele, qué se acordó y cuál es el siguiente paso.",
      ],
      lista: [
        "Empresa/contacto: identifica a quién estás trabajando.",
        "Email/WhatsApp: permite retomar conversación.",
        "Sector: ayuda a personalizar la demo.",
        "Fuente: muestra de dónde viene la oportunidad.",
        "Valor estimado: ayuda a priorizar.",
        "Notas: resumen del dolor, autoridad, objeciones y acuerdos.",
      ],
    },
    {
      h: "Etapas reales del pipeline",
      p: [
        "Las etapas no son adornos: representan el estado real de la oportunidad. Si las usas bien, sabes qué trabajar hoy y qué está estancado.",
        "Mover una etapa sin que haya ocurrido algo real crea confusión. Por ejemplo, no pongas 'demo' si solo enviaste un mensaje; usa 'contactado' o 'respondió'.",
      ],
      lista: [
        "Nuevo: lo agregaste, pero aún no hay interacción.",
        "Contactado: ya escribiste o llamaste.",
        "Respondió: hay interés o al menos conversación.",
        "Calificado: confirmaste dolor, autoridad, presupuesto o urgencia.",
        "Reunión agendada: hay fecha para diagnóstico o demo.",
        "Demo: ya vio el flujo de ATRIA.",
        "Propuesta: recibió precio, plan o condiciones.",
        "Negociación: está comparando, pidiendo ajustes o validando decisión.",
        "Ganado: compró y se registra la venta.",
        "Perdido: decidió no comprar.",
        "Seguimiento futuro: no compra ahora, pero puede reactivarse.",
      ],
    },
    {
      h: "Próxima acción: el campo más importante",
      p: [
        "La próxima acción evita que el CRM sea un cementerio de contactos. Cada prospecto activo debe tener una acción concreta: llamar, enviar propuesta, confirmar demo, resolver duda, revisar comparación o cerrar oportunidad.",
        "Una próxima acción débil dice 'dar seguimiento'. Una próxima acción fuerte dice 'Enviar resumen de demo y confirmar decisión el jueves'.",
      ],
    },
    {
      h: "Actividades y evidencia",
      p: [
        "Cada interacción importante debe quedar como actividad: llamada, mensaje, reunión, nota o propuesta. Esto crea historial y permite entender qué pasó sin depender de memoria.",
        "La evidencia protege la atribución. Si otro vendedor registra el mismo cliente, el sistema y el administrador revisarán quién registró primero con información válida.",
      ],
    },
    {
      h: "Del CRM a la venta",
      p: [
        "Cuando el cliente compra, pasas de oportunidad a venta. En el panel de ventas registras cliente, plan, monto, tipo de venta y comprobante o referencia.",
        "La venta entra como pendiente. Un administrador debe aprobarla. Solo cuando se aprueba se calcula la comisión correspondiente.",
      ],
    },
    {
      h: "Cómo usarlo día a día",
      p: [
        "Empieza el día filtrando mentalmente tus prospectos: quién tiene próxima acción hoy, quién está en propuesta, quién está en negociación y quién debe cerrarse como perdido o futuro.",
        "Al terminar cada conversación, actualiza etapa, notas y próxima acción. No esperes al final de la semana: se olvidan detalles importantes.",
      ],
    },
    {
      h: "Errores que dañan tus comisiones",
      p: [
        "Los errores más graves son registrar tarde, registrar sin datos verificables, duplicar prospectos, inflar valor estimado, marcar ganado sin venta real o no guardar evidencia.",
        "Recuerda: el CRM no es vigilancia; es protección para ti, para el cliente y para ATRIA.",
      ],
    },
  ],
  mod12: [
    {
      h: "Ética en decisiones difíciles",
      p: [
        "La ética se prueba cuando hay presión por cerrar. Si el cliente pide una función que no existe, se responde con honestidad. Si pide descuento, se explica que solo pueden usarse opciones oficiales. Si decide no comprar, se respeta.",
        "Una venta mal cerrada puede traer reembolsos, pérdida de confianza y anulación de comisiones.",
      ],
    },
  ],
  mod13: [
    {
      h: "Cómo leer tus comisiones",
      p: [
        "Las comisiones dependen de ventas aprobadas. Una venta registrada no es lo mismo que una venta aprobada. Primero queda pendiente; luego administración valida comprobante, monto, cliente y estado.",
        "Si una venta se cancela, rechaza o reembolsa, la comisión puede no generarse o puede anularse.",
      ],
    },
  ],
  mod14: [
    {
      h: "Rutina mínima de productividad",
      p: [
        "Una rutina simple: prospectar todos los días, actualizar CRM después de cada contacto, revisar propuestas abiertas, agendar demos y medir conversión semanal.",
        "No necesitas hacer todo perfecto; necesitas que tu sistema sea repetible. Lo que se mide se puede mejorar.",
      ],
    },
  ],
  mod15: [
    {
      h: "Mentalidad para aprobar y vender",
      p: [
        "El examen final no busca memorizar frases: busca confirmar que puedes explicar ATRIA, diagnosticar un negocio, usar el CRM, manejar objeciones, respetar reglas y entender comisiones.",
        "Si repruebas, repasa los módulos con menor puntaje y vuelve a intentarlo. El examen final no tiene límite de intentos porque el objetivo es dominio real.",
      ],
    },
  ],
};

const TIEMPOS_REFORZADOS: Record<string, string> = {
  mod11: "45 min",
};

for (const modulo of MODULOS) {
  const refuerzos = REFUERZOS_MODULOS[modulo.id];
  if (refuerzos) modulo.secciones.push(...refuerzos);
  if (TIEMPOS_REFORZADOS[modulo.id]) modulo.tiempo = TIEMPOS_REFORZADOS[modulo.id];
  if (modulo.id === "mod11") {
    modulo.resumen.push(
      "El CRM de ATRIA se usa dentro de esta plataforma.",
      "Cada prospecto debe tener etapa, notas y próxima acción.",
      "Las ventas pasan por aprobación antes de generar comisión.",
    );
    modulo.checklist.push(
      "Sé crear un prospecto en el panel.",
      "Sé moverlo por etapas reales.",
      "Sé registrar actividades y próxima acción.",
      "Sé cuándo pasar de prospecto a venta.",
    );
  }
}

export function getModulo(id: string): Modulo | undefined {
  return MODULOS.find((m) => m.id === id);
}

export const MODULOS_OBLIGATORIOS = MODULOS.filter((m) => m.obligatorio);
