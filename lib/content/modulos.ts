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

export type Modulo = {
  id: string;
  orden: number;
  titulo: string;
  objetivo: string;
  nivel: "Principiante" | "Intermedio" | "Avanzado";
  tiempo: string;
  obligatorio: boolean;
  video?: string; // etiqueta del placeholder de video
  intro: string;
  secciones: Seccion[];
  ejemplos?: string[];
  erroresComunes?: string[];
  resumen: string[];
  checklist: string[];
  recursos?: string[];
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
    video: "Aquí va un video de bienvenida",
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
    video: "Aquí va un video demostrativo de ATRIA",
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
    recursos: ["Ficha de producto (PDF)", "Comparativa Excel vs ATRIA"],
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
    recursos: ["Guion de demo 15/30/45"],
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
          "Ventas pendientes/rechazadas: sin comisión.",
          "Reembolso: comisión anulada o descontada.",
          "Duplicados: revisión administrativa.",
        ],
      },
      {
        h: "Cortes, pagos e impuestos",
        p: ["Las comisiones se programan y pagan según corte y método. Tú eres responsable de tus impuestos personales."],
      },
    ],
    resumen: ["15% primera venta / 5% renovación.", "Solo cuenta lo aprobado y verificado.", "El cálculo lo hace el backend."],
    checklist: ["Sé los porcentajes.", "Entiendo qué venta genera comisión.", "Sé cómo y cuándo se paga."],
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

export function getModulo(id: string): Modulo | undefined {
  return MODULOS.find((m) => m.id === id);
}

export const MODULOS_OBLIGATORIOS = MODULOS.filter((m) => m.obligatorio);
