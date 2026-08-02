/**
 * Simulador comercial basado en árboles de decisión — sin IA de pago.
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
          { texto: "Hola, soy asesor de ARCA. En una frase: le ayudo a controlar ventas e inventario en un solo lugar. ¿Le doy 2 minutos o prefiere que agende?", puntos: 3, criterios: ["saludo", "necesidad", "proximoPaso"], feedback: "Excelente: saludo, valor en una frase y respeto por su tiempo.", siguiente: "n2" },
          { texto: "Le explico todos los módulos: POS, inventario, contabilidad, multi-sucursal, reportes…", puntos: 0, criterios: [], feedback: "Lo abrumaste. Con un cliente apurado, ve al grano.", siguiente: "n2" },
          { texto: "Es el mejor sistema del mercado, tiene que comprarlo ya.", puntos: 0, criterios: [], feedback: "Presión sin valor ni ética. Evítalo.", siguiente: "n2" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "A ver… 2 minutos. ¿Qué gano yo con eso?",
        opciones: [
          { texto: "¿Cómo controla hoy su inventario? Con eso le muestro exactamente dónde ahorraría tiempo.", puntos: 3, criterios: ["preguntas", "escucha"], feedback: "Bien: pregunta antes de presentar.", siguiente: "n3" },
          { texto: "Gana reportes, contabilidad automática, control de stock y mucho más.", puntos: 1, criterios: ["informacion"], feedback: "Información correcta, pero sin diagnóstico pierde fuerza.", siguiente: "n3" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Uf, el inventario lo llevo en un cuaderno y siempre hay descuadres.",
        opciones: [
          { texto: "Eso es justo lo que ARCA resuelve: cada venta descuenta stock solo. ¿Le agendo una demo de 15 min mañana?", puntos: 3, criterios: ["necesidad", "cierre", "proximoPaso"], feedback: "Conectaste dolor→solución y definiste próximo paso.", siguiente: "fin" },
          { texto: "Debería dejar el cuaderno, eso está mal.", puntos: 0, criterios: [], feedback: "Juzgar al cliente no ayuda. Enfócate en la solución.", siguiente: "fin" },
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
          { texto: "Porque ARCA sí funciona, se lo garantizo al 100%.", puntos: 0, criterios: [], feedback: "Garantías vacías aumentan la desconfianza.", siguiente: "n2" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Nadie me capacitó y era complicadísimo. Nadie contestaba el soporte.",
        opciones: [
          { texto: "Gracias por decírmelo. ARCA es simple y el soporte es en español; además le acompaño en la implementación. ¿Le muestro lo básico en 15 min?", puntos: 3, criterios: ["necesidad", "informacion", "proximoPaso"], feedback: "Respondes al dolor real con información correcta.", siguiente: "n3" },
          { texto: "Bueno, este es distinto, confíe en mí.", puntos: 0, criterios: [], feedback: "Otra vez pides confianza sin darle razones.", siguiente: "n3" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "¿Y si no me sirve? No quiero amarrarme.",
        opciones: [
          { texto: "Por eso empezamos con una demo y usted decide sin presión. Si no le aporta, no avanzamos.", puntos: 3, criterios: ["etica", "cierre"], feedback: "Honestidad + cierre suave. Perfecto.", siguiente: "fin" },
          { texto: "Tiene que decidir hoy o pierde la promoción.", puntos: 0, criterios: [], feedback: "Falsa urgencia rompe la confianza que construiste.", siguiente: "fin" },
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
          { texto: "Excel es obsoleto, ya nadie serio lo usa.", puntos: 0, criterios: [], feedback: "Atacar su herramienta lo pone a la defensiva.", siguiente: "n2" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Pues… varios días, y a veces hay errores de fórmulas.",
        opciones: [
          { texto: "Ahí está el punto: en ARCA cada venta actualiza stock y contabilidad sola, sin fórmulas ni recaptura. Menos errores y días recuperados.", puntos: 3, criterios: ["necesidad", "informacion"], feedback: "Conectaste el dolor (tiempo/errores) con el valor real.", siguiente: "n3" },
          { texto: "Con ARCA nunca más tendrá un error, jamás.", puntos: 1, criterios: [], feedback: "Evita absolutos; sé honesto con los beneficios.", siguiente: "n3" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Interesante… ¿cómo sería pasar mis datos?",
        opciones: [
          { texto: "Le muestro en una demo cómo cargar su catálogo y lo acompaño. ¿Agendamos?", puntos: 3, criterios: ["cierre", "proximoPaso"], feedback: "Buen cierre con próximo paso concreto.", siguiente: "fin" },
          { texto: "Eso lo vemos después, primero pague.", puntos: 0, criterios: [], feedback: "Saltarte pasos y presionar el pago ahuyenta.", siguiente: "fin" },
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
        ],
      },
      n2: {
        id: "n2",
        cliente: "Mmm, la verdad se me pierde bastante mercadería.",
        opciones: [
          { texto: "Entonces el control de inventario de ARCA se paga solo al evitar esas pérdidas. Le muestro con números en una demo.", puntos: 3, criterios: ["necesidad", "cierre", "proximoPaso"], feedback: "Valor > precio, con evidencia y próximo paso.", siguiente: "fin" },
          { texto: "Igual, si le parece caro le hago un descuento por mi cuenta.", puntos: 0, criterios: [], feedback: "Nunca ofrezcas descuentos sin autorización. Falta grave.", siguiente: "fin" },
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
          { texto: "Deje que le siga mostrando más funciones primero.", puntos: 0, criterios: [], feedback: "Sobrevender cuando ya decidió puede enfriar la venta.", siguiente: "n2" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Listo. ¿Y después quién me ayuda a arrancar?",
        opciones: [
          { texto: "Lo entrego a soporte para la puesta en marcha y le doy seguimiento. Registro todo para que su comisión y su servicio queden claros.", puntos: 3, criterios: ["proximoPaso", "etica"], feedback: "Entrega a soporte + registro correcto. Impecable.", siguiente: "fin" },
          { texto: "Ya no es mi problema, yo solo vendo.", puntos: 0, criterios: [], feedback: "El acompañamiento inicial es parte de tu rol.", siguiente: "fin" },
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
          { texto: "Claro, le doy 30% y ya.", puntos: 0, criterios: [], feedback: "Modificar precios sin autorización es falta grave.", siguiente: "n2" },
        ],
      },
      n2: {
        id: "n2",
        cliente: "Es que otro sistema es más barato.",
        opciones: [
          { texto: "Puede ser. La diferencia es la contabilidad automática y el soporte en español. ¿Comparamos qué incluye cada uno para su caso?", puntos: 3, criterios: ["objeciones", "informacion"], feedback: "Compites por valor, sin hablar mal del competidor.", siguiente: "n3" },
          { texto: "Ese sistema es malísimo, no sirve.", puntos: 0, criterios: [], feedback: "Hablar mal de competidores está prohibido.", siguiente: "n3" },
        ],
      },
      n3: {
        id: "n3",
        cliente: "Está bien, muéstreme la comparación.",
        opciones: [
          { texto: "Le agendo una demo enfocada en su negocio y le llevo la comparación por escrito. ¿Mañana?", puntos: 3, criterios: ["cierre", "proximoPaso"], feedback: "Cierre con próximo paso y material de apoyo.", siguiente: "fin" },
        ],
      },
    },
  },
];

export function getEscenario(id: string): Escenario | undefined {
  return ESCENARIOS.find((e) => e.id === id);
}
