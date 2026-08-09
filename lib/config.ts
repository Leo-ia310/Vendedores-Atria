/**
 * Configuración central de la Academia Comercial ATRIA.
 *
 * Estos valores son la fuente de verdad del FRONTEND (textos, planes de ejemplo,
 * reglas de UI). Los valores sensibles para cálculo (comisiones, puntaje mínimo)
 * también existen en la tabla `Configuracion` del backend y SIEMPRE se recalculan
 * allí — el frontend nunca decide montos de comisión.
 */

export const MARCA = {
  producto: process.env.NEXT_PUBLIC_BRAND || "ATRIA",
  programa: process.env.NEXT_PUBLIC_PROGRAMA || "Academia Comercial ATRIA",
  emailSoporte: process.env.NEXT_PUBLIC_EMAIL_SOPORTE || "soporte@atria.app",
  whatsappSoporte: process.env.NEXT_PUBLIC_WHATSAPP_SOPORTE || "50588662303",
  grupoWhatsApp: process.env.NEXT_PUBLIC_WHATSAPP_GRUPO || "https://chat.whatsapp.com/JLg2SfFrHZKDAr24FH5wdR",
  redes: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/",
  },
} as const;

/** Reglas de comisión (reflejo de la tabla Configuracion; el backend es la autoridad). */
export const COMISIONES = {
  porcentajePrimeraVenta: 0.2, // 20%
  porcentajeRenovacion: 0.1, // 10%
  moneda: "USD",
} as const;

/** Requisitos de certificación. */
export const CERTIFICACION = {
  puntajeMinimo: 85, // %
  intentosPorExamen: 3,
  intentosExamenFinal: null,
} as const;

/** Planes de ATRIA usados para ejemplos de comisión en la landing (fuente: SaaS ATRIA). */
export const PLANES_EJEMPLO = [
  { nombre: "Demo", precioMensual: 0 },
  { nombre: "Pro", precioMensual: 39, destacado: true },
  { nombre: "Enterprise", precioMensual: 149 },
] as const;

/** Devuelve el ejemplo de comisión para un precio mensual dado. */
export function ejemploComision(precioMensual: number) {
  return {
    primeraVenta: +(precioMensual * COMISIONES.porcentajePrimeraVenta).toFixed(2),
    renovacion: +(precioMensual * COMISIONES.porcentajeRenovacion).toFixed(2),
  };
}

/** Etapas del pipeline CRM. */
export const ETAPAS_CRM = [
  { id: "nuevo", nombre: "Nuevo", color: "neutral" },
  { id: "contactado", nombre: "Contactado", color: "info" },
  { id: "respondio", nombre: "Respondió", color: "info" },
  { id: "calificado", nombre: "Calificado", color: "info" },
  { id: "reunion", nombre: "Reunión agendada", color: "warning" },
  { id: "demo", nombre: "Demo realizada", color: "warning" },
  { id: "propuesta", nombre: "Propuesta enviada", color: "warning" },
  { id: "negociacion", nombre: "Negociación", color: "warning" },
  { id: "ganado", nombre: "Ganado", color: "success" },
  { id: "perdido", nombre: "Perdido", color: "error" },
  { id: "futuro", nombre: "Seguimiento futuro", color: "neutral" },
] as const;

export type EtapaCrmId = (typeof ETAPAS_CRM)[number]["id"];

/** Estados de validación de una venta. */
export const ESTADOS_VENTA = [
  "pendiente",
  "en_revision",
  "aprobada",
  "rechazada",
  "cancelada",
  "reembolsada",
] as const;

export type EstadoVenta = (typeof ESTADOS_VENTA)[number];

/** Versión vigente de términos y condiciones (se registra al aceptar). */
export const VERSION_TERMINOS = "2026.08";
