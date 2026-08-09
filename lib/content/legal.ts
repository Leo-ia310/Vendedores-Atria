/**
 * Documentos legales del programa de vendedores.
 * ⚠️ Borradores orientativos: deben ser revisados por un abogado autorizado en cada
 * jurisdicción donde opere el programa antes de considerarse definitivos.
 */

export type DocLegal = {
  slug: string;
  titulo: string;
  resumen: string;
  secciones: Array<{ h: string; p: string[] }>;
};

export const VERSION_LEGAL = "2026.08";

export const DOCS_LEGALES: DocLegal[] = [
  {
    slug: "terminos",
    titulo: "Términos del programa de vendedores",
    resumen: "Condiciones generales para participar como asesor comercial certificado de ATRIA.",
    secciones: [
      { h: "1. Objeto", p: ["Estos términos regulan la participación de una persona como asesor comercial independiente de ATRIA a través de la Academia Comercial ATRIA. La participación no crea una relación laboral, de sociedad ni de representación exclusiva, salvo acuerdo escrito distinto."] },
      { h: "2. Requisitos de participación", p: ["El participante debe ser mayor de edad, proporcionar información veraz, completar la capacitación, aprobar las evaluaciones y aceptar todas las políticas del programa.", "ATRIA puede aprobar, rechazar o suspender la participación cuando exista incumplimiento de estas condiciones."] },
      { h: "3. Certificación", p: ["La certificación se obtiene únicamente al cumplir todos los requisitos configurados (módulos, exámenes, examen final, simulaciones, aceptación de términos y puntaje mínimo). La certificación puede revocarse por incumplimiento del código de conducta."] },
      { h: "4. Obligaciones del asesor", p: ["Representar a ATRIA con honestidad, no prometer funcionalidades inexistentes, no modificar precios sin autorización, registrar correctamente sus prospectos y ventas, y respetar la propiedad de prospectos de otros asesores."] },
      { h: "5. Comisiones", p: ["Las comisiones se rigen por la Política de comisiones. Se calculan sobre ventas aprobadas y verificadas. Ver el documento específico."] },
      { h: "6. Suspensión y terminación", p: ["ATRIA puede suspender o terminar la participación por fraude, prácticas engañosas, incumplimiento de políticas o inactividad prolongada. Ver Política de suspensión y terminación."] },
      { h: "7. Modificaciones", p: ["ATRIA puede actualizar estos términos. La versión aceptada por cada participante queda registrada con fecha y hora. El uso continuado tras una actualización implica su aceptación."] },
    ],
  },
  {
    slug: "comisiones",
    titulo: "Política de comisiones",
    resumen: "Cómo se calculan, aprueban y pagan las comisiones del programa.",
    secciones: [
      { h: "1. Estructura", p: ["Comisión por el primer pago del cliente: 20%.", "Comisión por cada pago recurrente posterior: 10%.", "Los porcentajes son configurables por ATRIA y rigen los vigentes al momento de aprobarse la venta."] },
      { h: "2. Requisitos para reconocer una comisión", p: ["El cliente debe estar registrado correctamente por el asesor con evidencia.", "La venta debe estar aprobada y verificada por ATRIA.", "No se reconocen comisiones sobre ventas pendientes, rechazadas, canceladas o reembolsadas."] },
      { h: "3. Atribución y duplicados", p: ["La atribución corresponde al primer asesor que registró correctamente al prospecto con evidencia. Los prospectos duplicados pasan a revisión administrativa; no se aceptan disputas sin evidencia registrada."] },
      { h: "4. Cálculo", p: ["La comisión se calcula en el backend a partir del monto de la venta y el porcentaje configurado. El sistema no confía en montos calculados por el frontend."] },
      { h: "5. Cortes, pagos y método", p: ["Las comisiones aprobadas se programan y se pagan según la fecha de corte y el método acordado. El asesor es responsable de sus obligaciones fiscales personales cuando correspondan."] },
      { h: "6. Reembolsos y fraude", p: ["Un reembolso anula o descuenta la comisión asociada. El fraude implica pérdida de comisiones y posible terminación."] },
      { h: "7. Ejemplo", p: ["Para un plan de USD 45: primer pago ≈ USD 9.00 (20%); cada pago recurrente ≈ USD 4.50 (10%)."] },
    ],
  },
  {
    slug: "privacidad",
    titulo: "Política de privacidad",
    resumen: "Cómo tratamos los datos personales de participantes y prospectos.",
    secciones: [
      { h: "1. Datos que recopilamos", p: ["Datos de registro del candidato (nombre, contacto, país), progreso de capacitación, resultados de exámenes, prospectos y ventas que el asesor registra, y registros técnicos como fecha, hora e IP de ciertas acciones."] },
      { h: "2. Finalidad", p: ["Gestionar la capacitación, la certificación, el cálculo de comisiones y la administración del programa."] },
      { h: "3. Conservación y seguridad", p: ["Los datos se almacenan con medidas razonables de seguridad. Las contraseñas se guardan solo como hash con salt, nunca en texto plano.", "El sistema utiliza Supabase/PostgreSQL como base de datos del programa."] },
      { h: "4. Derechos", p: ["El titular puede solicitar acceso, rectificación o eliminación de sus datos personales escribiendo a soporte."] },
      { h: "5. Prospectos de terceros", p: ["El asesor es responsable de obtener y tratar la información de sus prospectos conforme a la ley aplicable y de no usar bases de datos ilegales."] },
    ],
  },
  {
    slug: "conducta",
    titulo: "Código de conducta",
    resumen: "Reglas éticas obligatorias para todo asesor certificado.",
    secciones: [
      { h: "Principios", p: ["No mentir ni prometer funcionalidades inexistentes.", "No alterar precios ni ofrecer descuentos sin autorización.", "No falsificar ventas ni registrar prospectos ajenos.", "No usar información confidencial ni bases de datos ilegales.", "No acosar clientes ni usar prácticas engañosas o discriminatorias.", "No compartir credenciales ni suplantar a la empresa.", "No hablar negativamente de competidores ni publicar material no autorizado."] },
      { h: "Consecuencias", p: ["El incumplimiento puede derivar en pérdida de comisiones, suspensión o terminación del programa y revocación de la certificación."] },
    ],
  },
  {
    slug: "prospectos",
    titulo: "Política de prospectos",
    resumen: "Propiedad, registro y atribución de prospectos.",
    secciones: [
      { h: "1. Propiedad", p: ["Un prospecto pertenece al primer asesor que lo registró correctamente con evidencia en el CRM."] },
      { h: "2. Registro correcto", p: ["Debe incluir datos de contacto verificables y el origen. Los registros incompletos o sin evidencia no otorgan prioridad de atribución."] },
      { h: "3. Duplicados y disputas", p: ["Los duplicados se resuelven a favor del primer registro válido. Las disputas se revisan administrativamente y requieren evidencia."] },
      { h: "4. Inactividad", p: ["ATRIA puede liberar prospectos sin actividad por un período prolongado para permitir su reasignación."] },
    ],
  },
  {
    slug: "antifraude",
    titulo: "Política antifraude",
    resumen: "Prevención y sanción de prácticas fraudulentas.",
    secciones: [
      { h: "Conductas prohibidas", p: ["Registrar ventas falsas, inflar montos, crear clientes ficticios, manipular evidencias o coludir para desviar comisiones."] },
      { h: "Sanciones", p: ["El fraude comprobado implica anulación de comisiones, terminación inmediata y las acciones legales que correspondan."] },
    ],
  },
  {
    slug: "marca",
    titulo: "Uso de marca",
    resumen: "Condiciones para usar el nombre y los materiales de ATRIA.",
    secciones: [
      { h: "Uso autorizado", p: ["El asesor puede usar los materiales oficiales provistos por ATRIA para fines comerciales del programa."] },
      { h: "Restricciones", p: ["No se permite modificar el logo, crear dominios o cuentas que induzcan a confusión, ni publicar material no autorizado."] },
    ],
  },
  {
    slug: "confidencialidad",
    titulo: "Confidencialidad",
    resumen: "Manejo de información reservada.",
    secciones: [
      { h: "Obligación", p: ["El asesor mantiene en reserva la información no pública a la que acceda por el programa (precios especiales, datos de clientes, procesos internos) y no la usa fuera de su rol."] },
    ],
  },
  {
    slug: "suspension",
    titulo: "Suspensión y terminación",
    resumen: "Cuándo y cómo se suspende o termina la participación.",
    secciones: [
      { h: "Causas", p: ["Incumplimiento del código de conducta, fraude, inactividad prolongada o solicitud del propio asesor."] },
      { h: "Efectos", p: ["La suspensión limita el acceso al panel. La terminación cierra la cuenta; las comisiones ya aprobadas y no afectadas por fraude se liquidan según la política de pagos."] },
    ],
  },
  {
    slug: "pagos",
    titulo: "Pagos",
    resumen: "Fechas, métodos y responsabilidades.",
    secciones: [
      { h: "Programación", p: ["Las comisiones aprobadas se programan a una fecha estimada y se pagan por el método acordado."] },
      { h: "Responsabilidad fiscal", p: ["El asesor es responsable de declarar y pagar los impuestos que le correspondan según su jurisdicción."] },
    ],
  },
  {
    slug: "disputas",
    titulo: "Disputas",
    resumen: "Cómo se resuelven los desacuerdos.",
    secciones: [
      { h: "Procedimiento", p: ["Las disputas sobre atribución o comisiones se presentan a soporte con evidencia. ATRIA revisa y comunica una resolución. Las disputas sin evidencia registrada no proceden."] },
    ],
  },
  {
    slug: "propiedad-intelectual",
    titulo: "Propiedad intelectual",
    resumen: "Titularidad de contenidos y materiales.",
    secciones: [
      { h: "Titularidad", p: ["El contenido de la academia, los materiales comerciales y la plataforma son propiedad de ATRIA. Se licencian para uso dentro del programa y no pueden redistribuirse sin autorización."] },
    ],
  },
  {
    slug: "limitacion",
    titulo: "Limitación de responsabilidad",
    resumen: "Alcance de la responsabilidad de ATRIA.",
    secciones: [
      { h: "Alcance", p: ["ATRIA no garantiza ingresos específicos; las comisiones dependen de la actividad del asesor. En la medida permitida por la ley, ATRIA no responde por daños indirectos derivados del uso del programa."] },
    ],
  },
];

export function getDocLegal(slug: string): DocLegal | undefined {
  return DOCS_LEGALES.find((d) => d.slug === slug);
}
