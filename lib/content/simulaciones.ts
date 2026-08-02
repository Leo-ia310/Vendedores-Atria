/**
 * Simulador comercial basado en árboles de decisión, sin IA de pago.
 *
 * Cada escenario es un grafo de nodos. En cada nodo el "cliente" dice algo y el
 * aspirante elige una respuesta. Cada opción otorga puntos y marca criterios
 * (saludo, preguntas, escucha, necesidad, objeciones, cierre, etica, proximoPaso).
 * El puntaje final = puntos obtenidos / puntos máximos posibles en el camino.
 */

export type Criterio =
  | "saludo"
  | "preguntas"
  | "escucha"
  | "necesidad"
  | "objeciones"
  | "informacion"
  | "cierre"
  | "etica"
  | "proximoPaso";

export const CRITERIO_LABEL: Record<Criterio, string> = {
  saludo: "Saludo y apertura",
  preguntas: "Preguntas de diagnóstico",
  escucha: "Escucha activa",
  necesidad: "Identificación de necesidad",
  objeciones: "Manejo de objeciones",
  informacion: "Información correcta",
  cierre: "Cierre",
  etica: "Ética",
  proximoPaso: "Próximo paso",
};

export type Opcion = {
  texto: string;
  puntos: number; // 0..3
  criterios: Criterio[];
  feedback?: string;
  respuestaCliente?: string;
  siguiente: string; // id del siguiente nodo o "fin"
};

export type Nodo = {
  id: string;
  cliente: string;
  opciones: Opcion[];
};

export type Escenario = {
  id: string;
  titulo: string;
  perfil: string;
  descripcion: string;
  dificultad: "Fácil" | "Media" | "Difícil";
  inicio: string;
  nodos: Record<string, Nodo>;
};

export const ESCENARIOS: Escenario[] = [
  {
    id: "sim-apurado",
    titulo: "Cliente apurado",
    perfil: "Dueño de ferretería con poco tiempo",
    descripcion: "Tiene 5 minutos entre clientes. Debes captar interés sin abrumarlo.",
    dificultad: "Media",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "Mire, ando corriendo. ¿Qué me viene a ofrecer? Rápido.",
        opciones: [
          { texto: "Hola, soy asesor de ATRIA. En una frase: le ayudo a controlar ventas e inventario en un solo lugar. ¿Le doy 2 minutos o prefiere que agende?", puntos: 3, criterios: ["saludo", "necesidad", "proximoPaso"], feedback: "Excelente: saludo, valor en una frase y respeto por su tiempo.", siguiente: "n2" },
          { texto: "Le explico todos los módulos: POS, inventario, contabilidad, pedidos, menú, multi-sucursal, reportes...", puntos: 1, criterios: ["informacion"], feedback: "La información es correcta, pero lo saturaste para el poco tiempo que tenía.", siguiente: "saturado" },
          { texto: "Es el mejor sistema del mercado, tiene que comprarlo ya.", puntos: 0, criterios: [], respuestaCliente: "No, gracias. Si viene a presionar, prefiero no comprar.", feedback: "Presión sin diagnóstico. Perdiste la conversación antes de crear valor.", siguiente: "fin" },
        ],
      },
      saturado: {
        id: "saturado",
        cliente: "Me habló demasiado. Si es así de complicado, no tengo tiempo.",
        opciones: [
          { texto: "Tiene razón, fui muy amplio. Me enfoco solo en una cosa: ¿qué le descuadra más, caja o inventario?", puntos: 2, criterios: ["escucha", "preguntas"], feedback: "Buena recuperación: reconoces el error y vuelves al dolor principal.", siguiente: "n3" },
          { texto: "No es complicado, solo necesita que yo se lo explique completo.", puntos: 0, criterios: [], respuestaCliente: "No voy a comprar algo que ya empezó complicado. Gracias.", feedback: "Defenderte en vez de escuchar aumenta la resistencia.", siguiente: "fin" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "A ver... 2 minutos. ¿Qué gano yo con eso?",
        opciones: [
          { texto: "¿Cómo controla hoy su inventario? Con eso le muestro exactamente dónde ahorraría tiempo.", puntos: 3, criterios: ["preguntas", "escucha"], feedback: "Bien: pregunta antes de presentar.", siguiente: "n3" },
          { texto: "Gana reportes, contabilidad automática, control de stock y mucho más.", puntos: 1, criterios: ["informacion"], feedback: "Correcto, pero genérico. Necesitas aterrizarlo a su problema.", siguiente: "duda" },
          { texto: "Primero hablemos de precio, porque el plan Pro es el que más conviene.", puntos: 0, criterios: [], feedback: "Saltaste al precio sin crear valor.", siguiente: "precio" },
        ],
      },
      duda: {
        id: "duda",
        cliente: "Suena bien, pero eso me lo han dicho otros sistemas.",
        opciones: [
          { texto: "Entiendo. Para no hablar en abstracto: ¿dónde se le pierde más tiempo hoy?", puntos: 3, criterios: ["escucha", "preguntas"], feedback: "Volviste al diagnóstico y bajaste la promesa a terreno real.", siguiente: "n3" },
          { texto: "Le aseguro que ATRIA nunca falla.", puntos: 0, criterios: [], respuestaCliente: "Eso no me da confianza. Mejor lo dejamos aquí.", feedback: "Los absolutos suelen sonar poco creíbles.", siguiente: "fin" },
        ],
      },
      precio: {
        id: "precio",
        cliente: "Si empieza por precio, seguro es caro.",
        opciones: [
          { texto: "Puede ser una inversión importante. Por eso prefiero comparar contra lo que pierde hoy por descuadres. ¿Le parece?", puntos: 2, criterios: ["objeciones", "preguntas"], feedback: "Recuperas la conversación hacia valor.", siguiente: "n3" },
          { texto: "Entonces se lo bajo para que compre.", puntos: 0, criterios: [], respuestaCliente: "No me da confianza que cambie el precio así. No voy a comprar.", feedback: "Descuentos no autorizados dañan la ética y la confianza.", siguiente: "fin" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Uf, el inventario lo llevo en un cuaderno y siempre hay descuadres.",
        opciones: [
          { texto: "Eso es justo lo que ATRIA resuelve: cada venta descuenta stock. ¿Le agendo una demo de 15 min mañana para ver su caso?", puntos: 3, criterios: ["necesidad", "cierre", "proximoPaso"], respuestaCliente: "Mañana a las 10 puedo. Envíeme el enlace.", feedback: "Conectaste dolor, solución y próximo paso.", siguiente: "fin" },
          { texto: "Debería dejar el cuaderno, eso está mal.", puntos: 0, criterios: [], feedback: "Juzgar al cliente no ayuda. Enfócate en la solución.", siguiente: "molesto" },
          { texto: "Entonces cómprelo hoy y ya se le arregla todo.", puntos: 0, criterios: [], respuestaCliente: "No voy a comprar así, necesito entenderlo primero.", feedback: "Presionar antes de una demo corta el proceso.", siguiente: "fin" },
        ],
      },
      molesto: {
        id: "molesto",
        cliente: "No me regañe. Yo hago lo que puedo con lo que tengo.",
        opciones: [
          { texto: "Tiene razón, disculpe. No era criticarlo; mi punto es ayudarle a que ese control sea más fácil.", puntos: 2, criterios: ["escucha", "etica"], feedback: "Buena reparación: asumiste el error y bajaste la tensión.", siguiente: "n3" },
          { texto: "Pero es la verdad. Así no puede crecer.", puntos: 0, criterios: [], respuestaCliente: "Gracias, pero no quiero seguir. No voy a comprar.", feedback: "Insistir en el juicio rompe la relación.", siguiente: "fin" },
        ],
      },
    },
  },
  {
    id: "sim-desconfiado",
    titulo: "Cliente desconfiado",
    perfil: "Administradora que ya fue 'quemada' por otro software",
    descripcion: "Desconfía de promesas. Debes generar confianza con honestidad.",
    dificultad: "Difícil",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "Ya me vendieron un sistema antes y fue un desastre. ¿Por qué le creería?",
        opciones: [
          { texto: "Entiendo, es válido. No le voy a prometer magia: ¿qué salió mal la vez pasada para no repetirlo?", puntos: 3, criterios: ["escucha", "preguntas", "etica"], feedback: "Validaste y preguntaste. Así se construye confianza.", siguiente: "n2" },
          { texto: "Porque ATRIA sí funciona, se lo garantizo al 100%.", puntos: 0, criterios: [], feedback: "Garantías vacías aumentan la desconfianza.", siguiente: "desconfia" },
          { texto: "Eso fue culpa del otro proveedor, no nuestra.", puntos: 0, criterios: [], feedback: "Culpar a otros no resuelve el miedo del cliente.", siguiente: "desconfia" },
        ],
      },
      desconfia: {
        id: "desconfia",
        cliente: "Todos dicen lo mismo. No quiero otro problema.",
        opciones: [
          { texto: "Tiene razón en desconfiar. Podemos empezar con una demo enfocada en un solo proceso y usted decide si vale la pena avanzar.", puntos: 2, criterios: ["escucha", "etica", "proximoPaso"], feedback: "Recuperaste con honestidad y bajo riesgo.", siguiente: "n2" },
          { texto: "Si no confía, entonces no hay nada que hacer.", puntos: 0, criterios: [], respuestaCliente: "Perfecto, entonces no compro.", feedback: "Retirarte con brusquedad pierde una oportunidad recuperable.", siguiente: "fin" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Nadie me capacitó y era complicadísimo. Nadie contestaba soporte.",
        opciones: [
          { texto: "Gracias por decírmelo. ATRIA es simple y el soporte es en español; además le acompaño en la implementación. ¿Le muestro lo básico en 15 min?", puntos: 3, criterios: ["necesidad", "informacion", "proximoPaso"], feedback: "Respondes al dolor real con información correcta.", siguiente: "n3" },
          { texto: "Bueno, este es distinto, confíe en mí.", puntos: 0, criterios: [], feedback: "Pides confianza sin darle razones.", siguiente: "desconfia" },
          { texto: "Le vendo el plan más barato y si no le gusta cancela.", puntos: 1, criterios: ["objeciones"], feedback: "Reduce riesgo, pero sigues sin responder a capacitación y soporte.", siguiente: "n3" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "¿Y si no me sirve? No quiero amarrarme.",
        opciones: [
          { texto: "Por eso empezamos con una demo y usted decide sin presión. Si no le aporta, no avanzamos.", puntos: 3, criterios: ["etica", "cierre"], respuestaCliente: "Eso sí me parece razonable. Hagamos la demo.", feedback: "Honestidad + cierre suave. Perfecto.", siguiente: "fin" },
          { texto: "Tiene que decidir hoy o pierde la promoción.", puntos: 0, criterios: [], respuestaCliente: "Entonces prefiero no comprar. No me gusta decidir bajo presión.", feedback: "Falsa urgencia rompe la confianza que construiste.", siguiente: "fin" },
          { texto: "Puede pensarlo. Le envío un resumen y acordamos una fecha para revisar dudas.", puntos: 2, criterios: ["etica", "proximoPaso"], respuestaCliente: "Envíemelo y lo revisamos la próxima semana. Hoy no voy a comprar.", feedback: "Aceptas el no inmediato y dejas seguimiento claro.", siguiente: "fin" },
        ],
      },
    },
  },
  {
    id: "sim-excel",
    titulo: "Cliente que usa Excel",
    perfil: "Contador de una distribuidora",
    descripcion: "Está cómodo con Excel. Debes mostrar el costo oculto sin atacarlo.",
    dificultad: "Media",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "Yo con mi Excel me arreglo bien, ¿para qué cambiar?",
        opciones: [
          { texto: "Excel es potente. ¿Cuánto tiempo le toma al mes cuadrar inventario y ventas con él?", puntos: 3, criterios: ["escucha", "preguntas"], feedback: "Reconoces lo bueno y llevas al costo oculto.", siguiente: "n2" },
          { texto: "Excel es obsoleto, ya nadie serio lo usa.", puntos: 0, criterios: [], feedback: "Atacar su herramienta lo pone a la defensiva.", siguiente: "defensivo" },
          { texto: "No necesita cambiar si todo le funciona; ¿qué parte le gustaría mejorar si pudiera?", puntos: 2, criterios: ["escucha", "preguntas"], feedback: "Buena apertura: respetas su postura y buscas oportunidad.", siguiente: "n2" },
        ],
      },
      defensivo: {
        id: "defensivo",
        cliente: "Pues yo soy contador y sé usar Excel. Si viene a decirme eso, mal empezamos.",
        opciones: [
          { texto: "Tiene razón, me expresé mal. Excel es útil; lo que quiero comparar es el tiempo que le consume operar todo manual.", puntos: 2, criterios: ["escucha", "etica"], feedback: "Reparaste el error y volviste al costo operativo.", siguiente: "n2" },
          { texto: "Aunque sepa usarlo, un sistema siempre es mejor.", puntos: 0, criterios: [], respuestaCliente: "No estoy de acuerdo. Mejor no seguimos.", feedback: "Generalizar sin evidencia cierra la puerta.", siguiente: "fin" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Pues... varios días, y a veces hay errores de fórmulas.",
        opciones: [
          { texto: "Ahí está el punto: en ATRIA cada venta actualiza stock y contabilidad sola, sin fórmulas ni recaptura. Menos errores y días recuperados.", puntos: 3, criterios: ["necesidad", "informacion"], feedback: "Conectaste el dolor con el valor real.", siguiente: "n3" },
          { texto: "Con ATRIA nunca más tendrá un error, jamás.", puntos: 1, criterios: [], feedback: "Evita absolutos; sé honesto con los beneficios.", siguiente: "duda" },
          { texto: "Entonces Excel no sirve.", puntos: 0, criterios: [], feedback: "Vuelves a atacar su herramienta.", siguiente: "defensivo" },
        ],
      },
      duda: {
        id: "duda",
        cliente: "Eso de 'nunca' me suena exagerado.",
        opciones: [
          { texto: "Tiene razón. Lo correcto es que reduce recapturas y errores manuales; siempre hay que operar bien y revisar datos.", puntos: 2, criterios: ["etica", "informacion"], feedback: "Corrección honesta: recupera credibilidad.", siguiente: "n3" },
          { texto: "No es exagerado, se lo prometo.", puntos: 0, criterios: [], respuestaCliente: "No compro promesas absolutas. Gracias.", feedback: "Doblar la promesa aumenta el riesgo.", siguiente: "fin" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Interesante... ¿cómo sería pasar mis datos?",
        opciones: [
          { texto: "Le muestro en una demo cómo cargar su catálogo y lo acompaño. ¿Agendamos?", puntos: 3, criterios: ["cierre", "proximoPaso"], respuestaCliente: "Sí, agendemos. Quiero ver esa carga.", feedback: "Buen cierre con próximo paso concreto.", siguiente: "fin" },
          { texto: "Eso lo vemos después, primero pague.", puntos: 0, criterios: [], respuestaCliente: "No. Si no sé cómo migro, no voy a comprar.", feedback: "Saltarte pasos y presionar el pago ahuyenta.", siguiente: "fin" },
          { texto: "Le envío una guía y si prefiere lo dejamos para cuando tenga tiempo.", puntos: 2, criterios: ["proximoPaso", "etica"], respuestaCliente: "Envíemela. Por ahora no compro, pero lo revisaré.", feedback: "Aceptas un cierre no inmediato y mantienes oportunidad.", siguiente: "fin" },
        ],
      },
    },
  },
  {
    id: "sim-precio",
    titulo: "Cliente sensible al precio",
    perfil: "Dueño de tienda pequeña",
    descripcion: "Todo lo mide por precio. Debes llevar la conversación al valor.",
    dificultad: "Media",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "¿Cuánto cuesta? Si es caro, ni sigo.",
        opciones: [
          { texto: "Con gusto le explico la inversión. Antes, ¿cuánto calcula que pierde al mes por descuadres o falta de control?", puntos: 3, criterios: ["preguntas", "necesidad"], feedback: "Reencuadras precio como inversión frente al costo del problema.", siguiente: "n2" },
          { texto: "Es baratísimo, casi regalado.", puntos: 0, criterios: [], feedback: "Devaluar el producto no ayuda ni es honesto.", siguiente: "n2" },
          { texto: "Si lo primero es precio, quizá no sea el momento. ¿Quiere que lo dejemos para después?", puntos: 1, criterios: ["etica"], feedback: "Respetas, pero te retiraste antes de diagnosticar.", siguiente: "no_compra" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Mmm, la verdad se me pierde bastante mercadería.",
        opciones: [
          { texto: "Entonces el control de inventario de ATRIA se paga al evitar esas pérdidas. Le muestro con números en una demo.", puntos: 3, criterios: ["necesidad", "cierre", "proximoPaso"], respuestaCliente: "Si me lo muestra con números, lo veo.", feedback: "Valor mayor que precio, con evidencia y próximo paso.", siguiente: "fin" },
          { texto: "Igual, si le parece caro le hago un descuento por mi cuenta.", puntos: 0, criterios: [], respuestaCliente: "No me da confianza que cambie las reglas. No voy a comprar.", feedback: "Nunca ofrezcas descuentos sin autorización.", siguiente: "fin" },
          { texto: "¿Qué monto mensual sí le parecería razonable si le reduce esas pérdidas?", puntos: 2, criterios: ["preguntas", "objeciones"], feedback: "Buena pregunta para entender presupuesto, pero falta sostener valor.", siguiente: "n3" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Si no pasa de poco dinero, tal vez. Pero no quiero meterme en otra mensualidad.",
        opciones: [
          { texto: "Lo entiendo. Comparemos mensualidad contra pérdidas y horas manuales; si no le da sentido, no avanzamos.", puntos: 3, criterios: ["objeciones", "etica", "proximoPaso"], respuestaCliente: "Hagamos esa comparación. Si no me da, no compro.", feedback: "Muy bien: transparencia y decisión informada.", siguiente: "fin" },
          { texto: "Toda empresa seria paga sistemas, no sea cerrado.", puntos: 0, criterios: [], respuestaCliente: "No voy a comprar. Gracias.", feedback: "Invalidar al cliente destruye confianza.", siguiente: "fin" },
        ],
      },
      no_compra: {
        id: "no_compra",
        cliente: "Sí, mejor después. Hoy no voy a comprar nada.",
        opciones: [
          { texto: "Claro. Lo registro como seguimiento futuro y le escribo con un ejemplo breve, sin insistir.", puntos: 3, criterios: ["etica", "proximoPaso"], respuestaCliente: "Así está bien. Escríbame la próxima semana.", feedback: "Manejaste un no con respeto y dejaste siguiente paso.", siguiente: "fin" },
          { texto: "Pero si no compra hoy perderá una oportunidad.", puntos: 0, criterios: [], respuestaCliente: "No, gracias. No me contacte más.", feedback: "Presionar después de un no empeora el resultado.", siguiente: "fin" },
        ],
      },
    },
  },
  {
    id: "sim-restaurante",
    titulo: "Restaurante con pedidos desordenados",
    perfil: "Dueña de restaurante familiar con menú cambiante",
    descripcion: "Necesita ordenar pedidos, menú, caja e inventario sin sentir que el sistema será pesado.",
    dificultad: "Media",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "Aquí los pedidos se confunden y a veces cobramos mal, pero no tengo tiempo para sistemas complicados.",
        opciones: [
          { texto: "Entiendo. Antes de mostrarle algo: ¿cómo toman pedidos hoy y quién actualiza el menú cuando cambia un precio?", puntos: 3, criterios: ["escucha", "preguntas"], feedback: "Excelente: diagnosticas el flujo real del restaurante.", siguiente: "n2" },
          { texto: "ATRIA resuelve todo y ya no tendrá ningún error.", puntos: 0, criterios: [], feedback: "Promesa absoluta. En restaurante, eso suena riesgoso.", siguiente: "desconfia" },
          { texto: "Le vendo el plan Pro y luego vemos los pedidos.", puntos: 0, criterios: [], respuestaCliente: "No voy a comprar si ni siquiera vio cómo trabajo.", feedback: "Cerraste antes de entender la operación.", siguiente: "fin" },
        ],
      },
      desconfia: {
        id: "desconfia",
        cliente: "Eso de que no habrá errores no me lo creo. La cocina cambia mucho.",
        opciones: [
          { texto: "Tiene razón: ningún sistema reemplaza operar bien. ATRIA ayuda a ordenar menú, pedido y cobro para reducir errores manuales.", puntos: 2, criterios: ["etica", "objeciones", "informacion"], feedback: "Corriges la promesa y explicas valor real.", siguiente: "n2" },
          { texto: "Si no me cree, no puedo ayudarle.", puntos: 0, criterios: [], respuestaCliente: "Entonces no compro.", feedback: "Una objeción no se abandona; se aclara.", siguiente: "fin" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Los meseros anotan en papel. A veces cocina no entiende y caja cobra otra cosa.",
        opciones: [
          { texto: "Entonces la demo debe ir directo a menú, pedido, cobro y reporte. Así ve si ese flujo le baja confusión.", puntos: 3, criterios: ["necesidad", "informacion", "proximoPaso"], feedback: "Conectaste el dolor con un flujo de demo claro.", siguiente: "n3" },
          { texto: "Le mostraré primero contabilidad avanzada y reportes generales.", puntos: 1, criterios: ["informacion"], feedback: "Puede ser útil, pero no responde al dolor principal.", siguiente: "perdida" },
          { texto: "Eso es problema de sus meseros.", puntos: 0, criterios: [], respuestaCliente: "No me interesa que culpen a mi equipo. No voy a comprar.", feedback: "Culpar al personal corta la confianza.", siguiente: "fin" },
        ],
      },
      perdida: {
        id: "perdida",
        cliente: "No me habló de pedidos ni menú, que es lo que me duele.",
        opciones: [
          { texto: "Gracias por frenarme. Volvamos a lo importante: pedido, menú, cobro y cómo se refleja en inventario.", puntos: 2, criterios: ["escucha", "necesidad"], feedback: "Buena recuperación: aceptas la corrección.", siguiente: "n3" },
          { texto: "La contabilidad es más importante que los pedidos.", puntos: 0, criterios: [], respuestaCliente: "Para mí no. No compro algo que no atiende mi problema.", feedback: "Imponer prioridad en vez de escuchar pierde la venta.", siguiente: "fin" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "El menú cambia seguido. Hay platos que entran y salen según insumos.",
        opciones: [
          { texto: "Perfecto para revisar control de menú: productos activos, precios, disponibilidad y efecto en caja. ¿Quiere que lo veamos con un ejemplo de su menú?", puntos: 3, criterios: ["informacion", "cierre", "proximoPaso"], respuestaCliente: "Sí, con mi menú lo entiendo mejor. Hagamos la demo.", feedback: "Personalizaste la demo y pediste próximo paso.", siguiente: "fin" },
          { texto: "Entonces mejor no cambie tanto el menú.", puntos: 0, criterios: [], respuestaCliente: "Ese es mi negocio. Mejor no seguimos.", feedback: "No adaptes el cliente al sistema; adapta la demo al cliente.", siguiente: "fin" },
          { texto: "Le puedo hacer un desarrollo especial sin consultar.", puntos: 0, criterios: [], respuestaCliente: "No quiero promesas raras. No voy a comprar.", feedback: "Prometer personalizaciones sin autorización es una falta.", siguiente: "fin" },
          { texto: "Si hoy no quiere avanzar, puedo dejarle una guía y retomamos cuando tenga menos movimiento.", puntos: 2, criterios: ["etica", "proximoPaso"], respuestaCliente: "Hoy no compro, pero escríbame el lunes con esa guía.", feedback: "Buen manejo del no: respetas el momento y registras seguimiento.", siguiente: "fin" },
        ],
      },
    },
  },
  {
    id: "sim-listo",
    titulo: "Cliente listo para comprar",
    perfil: "Gerente decidido",
    descripcion: "Ya quiere comprar. No lo compliques: cierra bien y con próximos pasos.",
    dificultad: "Fácil",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "Me convenció. ¿Cómo lo contrato?",
        opciones: [
          { texto: "Perfecto. Confirmo el plan que se ajusta a usted, registramos su empresa y coordinamos la implementación. ¿Le parece?", puntos: 3, criterios: ["cierre", "informacion", "proximoPaso"], feedback: "Cierre ordenado con próximos pasos claros.", siguiente: "n2" },
          { texto: "Deje que le siga mostrando más funciones primero.", puntos: 0, criterios: [], feedback: "Sobrevender cuando ya decidió puede enfriar la venta.", siguiente: "se_enfria" },
          { texto: "Pague ya y luego vemos todo.", puntos: 0, criterios: [], respuestaCliente: "No, así no. Necesito claridad antes de pagar.", feedback: "Cierre brusco sin pasos claros.", siguiente: "fin" },
        ],
      },
      se_enfria: {
        id: "se_enfria",
        cliente: "Ahora me está confundiendo. Yo ya quería saber el proceso.",
        opciones: [
          { texto: "Tiene razón. No agrego más información: plan, registro, pago e implementación. Vamos paso a paso.", puntos: 2, criterios: ["escucha", "cierre", "proximoPaso"], feedback: "Recuperas claridad y vuelves al cierre.", siguiente: "n2" },
          { texto: "Pero debe conocer todo antes de comprar.", puntos: 0, criterios: [], respuestaCliente: "Lo pensaré mejor. Hoy no compro.", feedback: "Ignorar una señal de compra puede perder el cierre.", siguiente: "fin" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Listo. ¿Y después quién me ayuda a arrancar?",
        opciones: [
          { texto: "Lo entrego a soporte para la puesta en marcha y le doy seguimiento. Registro todo para que su comisión y su servicio queden claros.", puntos: 3, criterios: ["proximoPaso", "etica"], respuestaCliente: "Perfecto, avancemos.", feedback: "Entrega a soporte + registro correcto. Impecable.", siguiente: "fin" },
          { texto: "Ya no es mi problema, yo solo vendo.", puntos: 0, criterios: [], respuestaCliente: "Entonces no compro. Necesito acompañamiento.", feedback: "El acompañamiento inicial es parte de tu rol.", siguiente: "fin" },
          { texto: "Le digo a soporte, pero primero registro la venta y la evidencia correspondiente.", puntos: 2, criterios: ["etica", "proximoPaso"], respuestaCliente: "Bien, mientras quede claro el proceso.", feedback: "Correcto, aunque pudo sonar más cercano.", siguiente: "fin" },
        ],
      },
    },
  },
  {
    id: "sim-descuento",
    titulo: "Cliente que pide descuento",
    perfil: "Comprador negociador",
    descripcion: "Presiona por descuento. Debes sostener el valor con ética.",
    dificultad: "Difícil",
    inicio: "n1",
    nodos: {
      n1: {
        id: "n1",
        cliente: "Me interesa, pero solo si me hace un buen descuento.",
        opciones: [
          { texto: "Entiendo. Yo no manejo descuentos por mi cuenta, pero puedo mostrarle por qué la inversión vale la pena y consultar opciones oficiales si existen.", puntos: 3, criterios: ["etica", "objeciones"], feedback: "Ética intacta: no inventas descuentos y sostienes el valor.", siguiente: "n2" },
          { texto: "Claro, le doy 30% y ya.", puntos: 0, criterios: [], respuestaCliente: "Si cambia el precio así, no me da confianza. No compro.", feedback: "Modificar precios sin autorización es falta grave.", siguiente: "fin" },
          { texto: "Si solo quiere descuento, quizá ATRIA no es para usted.", puntos: 1, criterios: ["etica"], feedback: "Pones límite, pero te faltó explorar la objeción.", siguiente: "n2" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Es que otro sistema es más barato.",
        opciones: [
          { texto: "Puede ser. La diferencia está en lo que incluye para su caso. ¿Comparamos pedidos, inventario, reportes, soporte y contabilidad?", puntos: 3, criterios: ["objeciones", "informacion"], feedback: "Compites por valor, sin hablar mal del competidor.", siguiente: "n3" },
          { texto: "Ese sistema es malísimo, no sirve.", puntos: 0, criterios: [], feedback: "Hablar mal de competidores está prohibido.", siguiente: "molesto" },
          { texto: "Entonces compre el otro.", puntos: 0, criterios: [], respuestaCliente: "Está bien, eso haré. No compro ATRIA.", feedback: "Retirarte sin explorar valor pierde la oportunidad.", siguiente: "fin" },
        ],
      },
      molesto: {
        id: "molesto",
        cliente: "No me gusta que hablen mal de otros. Yo necesito comparar, no chismes.",
        opciones: [
          { texto: "Tiene razón. Comparo por criterios objetivos: qué incluye, soporte, implementación y costo total.", puntos: 2, criterios: ["etica", "objeciones"], feedback: "Buena reparación: vuelves a lo profesional.", siguiente: "n3" },
          { texto: "Pero es verdad, ellos no sirven.", puntos: 0, criterios: [], respuestaCliente: "Gracias, no voy a comprar.", feedback: "Insistir en atacar destruye credibilidad.", siguiente: "fin" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Está bien, muéstreme la comparación. Si no veo diferencia, no compro.",
        opciones: [
          { texto: "Le agendo una demo enfocada en su negocio y le llevo la comparación por escrito. ¿Mañana?", puntos: 3, criterios: ["cierre", "proximoPaso"], respuestaCliente: "Mañana está bien. Si la diferencia es clara, avanzamos.", feedback: "Cierre con próximo paso y material de apoyo.", siguiente: "fin" },
          { texto: "No necesito comparar; ATRIA es mejor.", puntos: 0, criterios: [], respuestaCliente: "Entonces no compro. Necesito decidir con datos.", feedback: "Afirmar sin evidencia no maneja la objeción.", siguiente: "fin" },
          { texto: "Perfecto. Si después de comparar no le conviene, cerramos la oportunidad sin problema.", puntos: 2, criterios: ["etica", "proximoPaso"], respuestaCliente: "Me gusta esa claridad. Revisemos mañana.", feedback: "Buena confianza, aunque falta pedir cierre con más fuerza.", siguiente: "fin" },
        ],
      },
    },
  },
];

export function getEscenario(id: string): Escenario | undefined {
  return ESCENARIOS.find((e) => e.id === id);
}
