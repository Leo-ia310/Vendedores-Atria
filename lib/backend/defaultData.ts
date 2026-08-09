import { MODULOS } from "@/lib/content/modulos";

export const CONFIG_DEFAULTS: Record<string, [string, string]> = {
  comision_primera_venta: ["0.20", "Porcentaje de comisión sobre el primer pago"],
  comision_renovacion: ["0.10", "Porcentaje de comisión sobre pagos recurrentes"],
  puntaje_minimo: ["85", "Puntaje mínimo para aprobar y certificar"],
  intentos_por_examen: ["3", "Intentos permitidos por examen de módulo"],
  intentos_examen_final: ["0", "El examen final no tiene límite de intentos"],
  version_terminos: ["2026.08", "Versión vigente de términos y condiciones"],
  moneda: ["USD", "Moneda base de comisiones"],
  whatsapp_soporte: ["50588662303", "WhatsApp de soporte"],
  mantenimiento: ["0", "1 = modo mantenimiento activo"],
};

export function defaultModuleRows() {
  return MODULOS.map((m) => ({
    ModuleId: m.id,
    Titulo: m.titulo,
    Descripcion: m.objetivo,
    Orden: m.orden,
    Obligatorio: m.obligatorio ? "true" : "false",
    Estado: "activo",
    TiempoEstimado: m.tiempo,
    PuntajeMinimo: 85,
  }));
}

export type QuestionRow = {
  QuestionId: string;
  ModuleId: string;
  Tipo: string;
  Pregunta: string;
  Opciones: string;
  RespuestaCorrecta: string;
  Explicacion: string;
  Puntaje: number;
  Estado: string;
};

const DEFAULT_COUNTERS: Record<string, number> = {};

export const DEFAULT_QUESTIONS: QuestionRow[] = [
  q("mod1", "opcion", "¿Qué integra ATRIA en una sola plataforma?", ["Solo redes sociales", "Punto de venta, inventario, contabilidad y operación comercial", "Solo contabilidad", "Solo mensajes por WhatsApp"], "Punto de venta, inventario, contabilidad y operación comercial", "ATRIA ayuda a controlar ventas, inventario, contabilidad y procesos del negocio en un solo lugar."),
  q("mod1", "opcion", "¿Cuál es el rol principal del asesor comercial?", ["Presionar para comprar", "Entender el negocio, mostrar valor y acompañar con ética", "Prometer descuentos", "Hacer soporte técnico avanzado"], "Entender el negocio, mostrar valor y acompañar con ética", "El asesor conecta necesidades reales con una solución y respeta el proceso del cliente."),
  q("mod1", "vf", "ATRIA debe venderse prometiendo ingresos garantizados al asesor.", ["Verdadero", "Falso"], "Falso", "Las comisiones dependen de actividad real, ventas aprobadas y reglas del programa."),

  q("mod2", "opcion", "¿Qué módulo controla lotes, vencimientos y almacenes?", ["Punto de venta", "Inventario", "Reportes", "CRM"], "Inventario", "El inventario maneja existencias, lotes, vencimientos y movimientos."),
  q("mod2", "opcion", "En un restaurante, ¿qué valor debe explicar el asesor?", ["Solo que se ve bonito", "Control de pedidos, menú, caja e inventario conectado", "Que no necesita capacitación", "Que elimina todo el personal"], "Control de pedidos, menú, caja e inventario conectado", "Para restaurantes importa conectar pedidos y menú con control operativo y financiero."),
  q("mod2", "opcion", "Una demostración de producto debe conectar...", ["Función con problema y beneficio", "Precio con presión", "Todos los botones con prisa", "Opiniones personales"], "Función con problema y beneficio", "El cliente entiende mejor cuando cada función responde a un dolor específico."),

  q("mod3", "opcion", "¿Cuál es una señal de oportunidad?", ["Todo está perfecto", "Procesos manuales y descontrol de inventario", "No tiene ningún dolor", "No quiere hablar con nadie"], "Procesos manuales y descontrol de inventario", "Los negocios con procesos manuales suelen perder tiempo, dinero y control."),
  q("mod3", "opcion", "¿Qué restaurante califica mejor como prospecto?", ["Uno sin pedidos ni inventario", "Uno con menú, pedidos, caja e inventario desordenados", "Uno que no quiere cambiar nada", "Uno cerrado permanentemente"], "Uno con menú, pedidos, caja e inventario desordenados", "ATRIA aporta más cuando existe operación diaria que necesita control."),
  q("mod3", "vf", "Descalificar a tiempo a un prospecto sin necesidad real también es vender mejor.", ["Verdadero", "Falso"], "Verdadero", "Evita perder tiempo y mantiene una relación respetuosa."),

  q("mod4", "vf", "Vender es conectar una necesidad con una solución.", ["Verdadero", "Falso"], "Verdadero", "Vender no es solo informar características."),
  q("mod4", "opcion", "¿Qué significa venta consultiva?", ["Hablar más que el cliente", "Preguntar, escuchar y recomendar según el caso", "Mostrar todos los módulos", "Cerrar a cualquier costo"], "Preguntar, escuchar y recomendar según el caso", "La venta consultiva parte del diagnóstico y de la escucha activa."),
  q("mod4", "opcion", "Cuando el cliente solo pregunta precio, conviene primero...", ["Bajar el precio", "Entender el problema y el impacto", "Terminar la conversación", "Prometer una promoción falsa"], "Entender el problema y el impacto", "El precio se defiende mejor cuando el valor está claro."),

  q("mod5", "vf", "Está permitido enviar spam masivo a prospectos.", ["Verdadero", "Falso"], "Falso", "Nunca spam ni mensajes engañosos."),
  q("mod5", "opcion", "¿Cuál es un buen primer contacto?", ["Mensaje corto, personalizado y con una pregunta clara", "Un texto larguísimo copiado a todos", "Solo mandar el precio", "Insistir diez veces el mismo día"], "Mensaje corto, personalizado y con una pregunta clara", "La prospección ética respeta el tiempo del prospecto."),
  q("mod5", "opcion", "¿Dónde puedes encontrar prospectos reales?", ["Solo esperando que lleguen", "Google Maps, referidos, redes y recorrido de zona", "Bases ilegales de datos", "Mensajes al azar sin contexto"], "Google Maps, referidos, redes y recorrido de zona", "La lista debe construirse con investigación y respeto."),

  q("mod6", "opcion", "En el diagnóstico, ¿qué hay que hacer?", ["Interrogar", "Preguntar y escuchar", "Presentar de inmediato", "Hablar primero de precio"], "Preguntar y escuchar", "El diagnóstico se basa en escucha activa."),
  q("mod6", "opcion", "¿Cuál es una pregunta abierta útil?", ["¿Usa sistema, sí o no?", "¿Cómo controla sus ventas e inventario hoy?", "¿Compra hoy?", "¿Le parece caro?"], "¿Cómo controla sus ventas e inventario hoy?", "Las preguntas abiertas revelan procesos, dolores e impacto."),
  q("mod6", "opcion", "NAPU ayuda a calificar...", ["Necesidad, autoridad, presupuesto y urgencia", "Nombre, apellido, país y usuario", "Nivel, agenda, producto y utilidad", "Nada importante"], "Necesidad, autoridad, presupuesto y urgencia", "Calificar evita vender a quien no puede o no necesita decidir."),

  q("mod7", "opcion", "Una buena demo debe...", ["Mostrar todo", "Conectar función con el problema del cliente", "Durar horas", "Evitar el cierre"], "Conectar función con el problema del cliente", "Personaliza según el diagnóstico."),
  q("mod7", "opcion", "En una demo corta para restaurante, ¿qué conviene mostrar primero?", ["Todo el sistema completo", "Pedido, menú, cobro y control de inventario relacionado", "Configuraciones internas avanzadas", "Solo la pantalla de inicio"], "Pedido, menú, cobro y control de inventario relacionado", "La demo debe enfocarse en el flujo diario del restaurante."),
  q("mod7", "vf", "Una demo sin próximo paso claro puede enfriar una oportunidad buena.", ["Verdadero", "Falso"], "Verdadero", "Toda demo debe cerrar con una acción concreta."),

  q("mod8", "opcion", "Ante una objeción primero se debe...", ["Rebatir", "Preguntar para entender", "Bajar el precio", "Ignorar"], "Preguntar para entender", "Aclara antes de responder."),
  q("mod8", "opcion", "Cuando el cliente dice 'está caro', muchas veces significa...", ["No ve suficiente valor todavía", "Quiere que lo insulten", "Ya compró seguro", "No tiene negocio"], "No ve suficiente valor todavía", "Recupera el impacto del problema antes de hablar de precio."),
  q("mod8", "vf", "Si el cliente decide no comprar, debes cerrar con respeto y dejar la puerta abierta.", ["Verdadero", "Falso"], "Verdadero", "Un no bien manejado puede convertirse en una oportunidad futura."),

  q("mod9", "vf", "Cada seguimiento debe aportar valor.", ["Verdadero", "Falso"], "Verdadero", "El seguimiento aporta datos, casos o respuestas."),
  q("mod9", "opcion", "Después de una demo, ¿qué seguimiento es mejor?", ["Enviar resumen, propuesta y próximo paso", "Escribir solo '¿ya decidió?' cada hora", "No registrar nada", "Cambiar el precio sin permiso"], "Enviar resumen, propuesta y próximo paso", "El seguimiento ordenado ayuda a decidir sin acosar."),
  q("mod9", "opcion", "Si el interés cae, lo correcto es...", ["Cerrar la oportunidad con respeto y registrar la razón", "Insistir sin parar", "Borrar el prospecto", "Prometer algo inexistente"], "Cerrar la oportunidad con respeto y registrar la razón", "Registrar pérdida de interés mejora tu pipeline."),

  q("mod10", "opcion", "¿Qué es una señal de compra?", ["Silencio total", "Preguntar por plazos e implementación", "Colgar la llamada", "No responder nunca"], "Preguntar por plazos e implementación", "Indica que el cliente está cerca de decidir."),
  q("mod10", "vf", "Cerrar significa presionar aunque el cliente no vea valor.", ["Verdadero", "Falso"], "Falso", "Cerrar es facilitar una decisión con valor claro y próximos pasos."),
  q("mod10", "opcion", "Si el cliente decide no comprar ahora, debes...", ["Cerrar con respeto, registrar y definir si habrá seguimiento futuro", "Enojarte", "Ofrecer descuento no autorizado", "Eliminar toda la conversación"], "Cerrar con respeto, registrar y definir si habrá seguimiento futuro", "Una salida profesional protege la relación y el CRM."),

  q("mod11", "vf", "Lo que no está registrado en el CRM no cuenta para comisiones.", ["Verdadero", "Falso"], "Verdadero", "El registro con evidencia es clave."),
  q("mod11", "opcion", "¿Qué debe tener un prospecto bien registrado?", ["Datos verificables, etapa, notas y próxima acción", "Solo el nombre", "Un apodo sin contacto", "Nada, se recuerda de memoria"], "Datos verificables, etapa, notas y próxima acción", "El CRM protege el seguimiento y la atribución."),
  q("mod11", "opcion", "Si un cliente no compra, la etapa correcta puede ser...", ["Perdido o seguimiento futuro, según el caso", "Ganado", "Aprobada", "Pagada"], "Perdido o seguimiento futuro, según el caso", "El pipeline debe reflejar la realidad de la oportunidad."),
  q("mod11", "opcion", "¿Dónde se lleva el CRM de vendedores de ATRIA?", ["En esta plataforma, dentro del panel del vendedor", "Solo en una libreta personal", "En mensajes sueltos de WhatsApp", "No se lleva CRM"], "En esta plataforma, dentro del panel del vendedor", "El CRM operativo del vendedor vive aquí, en el panel."),
  q("mod11", "opcion", "¿Cuál es una próxima acción bien escrita?", ["Dar seguimiento", "Enviar propuesta y confirmar decisión el jueves", "Ver qué pasa", "Hablar algún día"], "Enviar propuesta y confirmar decisión el jueves", "La próxima acción debe ser concreta y accionable."),
  q("mod11", "vf", "Una venta registrada genera comisión inmediatamente, aunque no haya sido aprobada.", ["Verdadero", "Falso"], "Falso", "La comisión se calcula cuando administración aprueba la venta."),

  q("mod12", "vf", "Se pueden ofrecer descuentos sin autorización.", ["Verdadero", "Falso"], "Falso", "Modificar precios sin autorización es una falta grave."),
  q("mod12", "vf", "Está prohibido hablar mal de competidores para cerrar una venta.", ["Verdadero", "Falso"], "Verdadero", "Compite por valor y profesionalismo, no por ataques."),
  q("mod12", "opcion", "¿Qué práctica protege la ética del programa?", ["Registrar evidencia real y no prometer funciones inexistentes", "Inflar montos", "Registrar prospectos ajenos", "Ocultar condiciones"], "Registrar evidencia real y no prometer funciones inexistentes", "La confianza se sostiene con registros reales y promesas correctas."),

  q("mod13", "opcion", "¿Cuál es la comisión del primer pago?", ["5%", "10%", "15%", "20%"], "20%", "Primer pago 20%, pago recurrente 10%."),
  q("mod13", "opcion", "¿Cuál es la comisión por pago recurrente?", ["5%", "10%", "15%", "0%"], "10%", "Los pagos recurrentes aprobados pagan 10%."),
  q("mod13", "vf", "Una venta rechazada o reembolsada no debe generar comisión vigente.", ["Verdadero", "Falso"], "Verdadero", "Solo las ventas aprobadas y verificadas generan comisiones."),
  q("mod13", "vf", "Si un cliente entra con tu link de referido y compra desde otra ubicación, la comisión se acumula a tu cuenta si la venta es aprobada.", ["Verdadero", "Falso"], "Verdadero", "El link de referido atribuye la compra al asesor, sin importar desde dónde compre el cliente, siempre que la venta sea válida y aprobada."),

  q("mod14", "vf", "Medir la conversión ayuda a mejorar.", ["Verdadero", "Falso"], "Verdadero", "Los indicadores guían la mejora continua."),
  q("mod14", "opcion", "¿Qué métrica ayuda a revisar el embudo?", ["Prospectos, demos, propuestas y cierres", "Solo likes personales", "Color favorito", "Cantidad de mensajes sin respuesta"], "Prospectos, demos, propuestas y cierres", "El embudo muestra dónde mejorar."),
  q("mod14", "opcion", "Una buena agenda semanal debe incluir...", ["Prospección, seguimiento, demos y revisión de indicadores", "Solo improvisar", "Esperar clientes", "Evitar registrar actividades"], "Prospección, seguimiento, demos y revisión de indicadores", "La productividad comercial necesita método."),

  q("mod15", "opcion", "¿Qué debes completar antes de certificarte?", ["Solo registrarme", "Módulos, exámenes, simulaciones y términos", "Solo ventas", "Solo el CRM"], "Módulos, exámenes, simulaciones y términos", "La certificación exige completar todo el flujo."),
  q("mod15", "vf", "El examen final integra producto, venta consultiva, CRM, ética y comisiones.", ["Verdadero", "Falso"], "Verdadero", "El final valida dominio integral del programa."),
  q("mod15", "opcion", "Al certificarte, el sistema genera...", ["Credenciales y códigos del vendedor", "Un descuento automático", "Un cliente comprado", "Un pago garantizado"], "Credenciales y códigos del vendedor", "La certificación crea el perfil de vendedor para operar en el panel."),

  q("final", "opcion", "¿Qué integra ATRIA en una propuesta para comercio y restaurante?", ["Solo una caja registradora", "Ventas, inventario, contabilidad, pedidos, menú y reportes según el negocio", "Solo redes sociales", "Solo hojas de cálculo"], "Ventas, inventario, contabilidad, pedidos, menú y reportes según el negocio", "El asesor debe adaptar el valor al tipo de operación del cliente."),
  q("final", "vf", "La atribución es del primer registro válido con evidencia.", ["Verdadero", "Falso"], "Verdadero", "La política de prospectos protege el primer registro válido."),
  q("final", "opcion", "Ante 'está caro', lo mejor es...", ["Bajar el precio", "Recuperar el impacto del problema", "Insistir sin escuchar", "Retirarse sin preguntar"], "Recuperar el impacto del problema", "Normalmente significa que aún no ve el valor."),
  q("final", "opcion", "¿Qué NO se debe hacer?", ["Registrar prospectos ajenos", "Escuchar", "Diagnosticar", "Dar seguimiento"], "Registrar prospectos ajenos", "Es una falta ética."),
  q("final", "vf", "ATRIA genera asientos contables automáticamente cuando corresponde.", ["Verdadero", "Falso"], "Verdadero", "Cada evento operativo relevante puede alimentar la contabilidad."),
  q("final", "opcion", "Si un restaurante pregunta por ATRIA, ¿qué flujo conviene explicar?", ["Menú, pedido, cobro, inventario y reporte", "Solo facturación anual", "Solo colores de pantalla", "Solo una promesa de descuento"], "Menú, pedido, cobro, inventario y reporte", "El restaurante necesita ver su operación diaria de punta a punta."),
  q("final", "opcion", "Cuando un cliente decide no comprar, el asesor debe...", ["Cerrar con respeto y registrar el motivo", "Presionarlo más", "Hablar mal de su decisión", "Inventar una promoción"], "Cerrar con respeto y registrar el motivo", "Un cierre perdido bien gestionado mantiene la relación y mejora datos."),
  q("final", "opcion", "¿Qué debe registrar el asesor en el CRM?", ["Datos verificables, etapa, notas, evidencia y próxima acción", "Solo un nombre", "Nada si cree recordar", "Solo la comisión esperada"], "Datos verificables, etapa, notas, evidencia y próxima acción", "El CRM sostiene seguimiento, atribución y comisiones."),
  q("final", "vf", "Se puede prometer una función inexistente si ayuda a cerrar rápido.", ["Verdadero", "Falso"], "Falso", "La ética comercial prohíbe promesas falsas."),
  q("final", "opcion", "¿Cuál es la comisión por pago recurrente?", ["5%", "10%", "15%", "0%"], "10%", "Los pagos recurrentes aprobados pagan 10%."),
  q("final", "opcion", "Una demo efectiva se construye con base en...", ["Diagnóstico del cliente", "Un recorrido genérico por todos los botones", "Presión por precio", "Adivinanzas"], "Diagnóstico del cliente", "La demo debe resolver los dolores detectados."),
  q("final", "vf", "El examen final se puede repetir sin límite de intentos.", ["Verdadero", "Falso"], "Verdadero", "El objetivo es demostrar dominio, no bloquear al alumno por intentos."),
];

function q(
  moduleId: string,
  tipo: string,
  pregunta: string,
  opciones: string[],
  respuestaCorrecta: string,
  explicacion: string,
): QuestionRow {
  const index = DEFAULT_COUNTERS[moduleId] = (DEFAULT_COUNTERS[moduleId] || 0) + 1;
  return {
    QuestionId: `q_${moduleId}_${index}`,
    ModuleId: moduleId,
    Tipo: tipo,
    Pregunta: pregunta,
    Opciones: JSON.stringify(opciones),
    RespuestaCorrecta: respuestaCorrecta,
    Explicacion: explicacion,
    Puntaje: 1,
    Estado: "activo",
  };
}
