/**
 * Utilidades compartidas de la Academia Comercial ATRIA.
 */

/** Une clases condicionales sin dependencias externas (equivalente a clsx). */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

/** Formatea un monto en USD (moneda base de comisiones del programa). */
export function formatearUSD(monto: number): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(monto) ? monto : 0);
}

/** Formatea una fecha ISO/Date a DD/MM/YYYY. */
export function formatearFecha(valor: string | number | Date | null | undefined): string {
  if (!valor) return "—";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Fecha + hora legible. */
export function formatearFechaHora(valor: string | number | Date | null | undefined): string {
  if (!valor) return "—";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Iniciales para avatares. */
export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Normaliza texto: minúsculas, sin tildes, sin signos. Base para el chatbot y búsquedas. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Valida formato de correo. */
export function esEmailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Valida teléfono internacional (7 a 15 dígitos, opcional +). */
export function esTelefonoValido(tel: string): boolean {
  return /^\+?\d{7,15}$/.test(tel.replace(/[\s()-]/g, ""));
}

/** Calcula edad en años a partir de una fecha de nacimiento. */
export function calcularEdad(fechaNacimiento: string): number {
  const nac = new Date(fechaNacimiento);
  if (Number.isNaN(nac.getTime())) return 0;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

/** Enlace a WhatsApp con mensaje pre-cargado. */
export function enlaceWhatsApp(numero: string, mensaje = ""): string {
  const limpio = numero.replace(/[^\d]/g, "");
  return `https://wa.me/${limpio}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}`;
}
