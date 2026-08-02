import { MODULOS } from "@/lib/content/modulos";

export const CONFIG_DEFAULTS: Record<string, [string, string]> = {
  comision_primera_venta: ["0.15", "Porcentaje de comision sobre la primera venta"],
  comision_renovacion: ["0.05", "Porcentaje de comision sobre renovaciones"],
  puntaje_minimo: ["85", "Puntaje minimo para aprobar y certificar"],
  intentos_por_examen: ["3", "Intentos permitidos por examen de modulo"],
  intentos_examen_final: ["2", "Intentos permitidos en el examen final"],
  version_terminos: ["2026.08", "Version vigente de terminos y condiciones"],
  moneda: ["USD", "Moneda base de comisiones"],
  whatsapp_soporte: ["50500000000", "WhatsApp de soporte"],
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
  q("mod1", "opcion", "Que integra ARCA en una sola plataforma?", ["Solo POS", "POS, inventario y contabilidad", "Solo contabilidad", "Redes sociales"], "POS, inventario y contabilidad", "ARCA conecta ventas, inventario y contabilidad automatica."),
  q("mod2", "opcion", "Que modulo controla lotes y vencimientos?", ["POS", "Inventario", "Reportes", "Facturacion"], "Inventario", "El inventario maneja lotes, vencimientos y almacenes."),
  q("mod3", "opcion", "Cual es una senal de oportunidad?", ["Todo perfecto", "Procesos manuales y descontrol de inventario", "No tiene empleados", "No vende"], "Procesos manuales y descontrol de inventario", "Los negocios con procesos manuales son buenos prospectos."),
  q("mod4", "vf", "Vender es conectar una necesidad con una solucion.", ["Verdadero", "Falso"], "Verdadero", "Vender no es solo informar caracteristicas."),
  q("mod5", "vf", "Esta permitido enviar spam masivo a prospectos.", ["Verdadero", "Falso"], "Falso", "Nunca spam ni mensajes enganosos."),
  q("mod6", "opcion", "En el diagnostico, que hay que hacer?", ["Interrogar", "Preguntar y escuchar", "Presentar de inmediato", "Hablar de precio"], "Preguntar y escuchar", "El diagnostico se basa en escucha activa."),
  q("mod7", "opcion", "Una buena demo debe...", ["Mostrar todo", "Conectar funcion con el problema del cliente", "Durar horas", "Evitar el cierre"], "Conectar funcion con el problema del cliente", "Personaliza segun el diagnostico."),
  q("mod8", "opcion", "Ante una objecion primero se debe...", ["Rebatir", "Preguntar para entender", "Bajar el precio", "Ignorar"], "Preguntar para entender", "Aclara antes de responder."),
  q("mod9", "vf", "Cada seguimiento debe aportar valor.", ["Verdadero", "Falso"], "Verdadero", "El seguimiento aporta datos, casos o respuestas."),
  q("mod10", "opcion", "Que es una senal de compra?", ["Silencio", "Preguntar por plazos e implementacion", "Colgar", "Ninguna"], "Preguntar por plazos e implementacion", "Indica que el cliente esta cerca de decidir."),
  q("mod11", "vf", "Lo que no esta registrado en el CRM no cuenta para comisiones.", ["Verdadero", "Falso"], "Verdadero", "El registro con evidencia es clave."),
  q("mod12", "vf", "Se pueden ofrecer descuentos sin autorizacion.", ["Verdadero", "Falso"], "Falso", "Modificar precios sin autorizacion es una falta grave."),
  q("mod13", "opcion", "Cual es la comision de la primera venta?", ["5%", "10%", "15%", "20%"], "15%", "Primera venta 15%, renovacion 5%."),
  q("mod14", "vf", "Medir la conversion ayuda a mejorar.", ["Verdadero", "Falso"], "Verdadero", "Los indicadores guian la mejora continua."),
  q("mod15", "opcion", "Que debes completar antes de certificarte?", ["Solo registrarme", "Modulos, examenes, simulaciones y terminos", "Solo ventas", "Solo el CRM"], "Modulos, examenes, simulaciones y terminos", "La certificacion exige completar todo el flujo."),
  q("final", "opcion", "Comision por renovacion?", ["5%", "10%", "15%", "0%"], "5%", "Las renovaciones pagan 5%."),
  q("final", "vf", "La atribucion es del primer registro valido con evidencia.", ["Verdadero", "Falso"], "Verdadero", "La politica de prospectos protege el primer registro valido."),
  q("final", "opcion", "Ante 'esta caro', lo mejor es...", ["Bajar el precio", "Recuperar el impacto del problema", "Insistir", "Retirarse"], "Recuperar el impacto del problema", "Normalmente significa que aun no ve el valor."),
  q("final", "opcion", "Que NO se debe hacer?", ["Registrar prospectos ajenos", "Escuchar", "Diagnosticar", "Dar seguimiento"], "Registrar prospectos ajenos", "Es una falta etica."),
  q("final", "vf", "ARCA genera asientos contables automaticamente.", ["Verdadero", "Falso"], "Verdadero", "Cada evento genera su asiento."),
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
