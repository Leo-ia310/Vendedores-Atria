/**
 * Motor lógico del Asistente Comercial ATRIA (sin IA de pago).
 *
 * Selecciona la mejor intención por puntaje combinando:
 *  - coincidencia exacta del mensaje con una keyword (puntaje alto)
 *  - inclusión de frase/keyword/sinónimo (puntaje medio, ponderado por longitud)
 *  - coincidencia aproximada por palabra (fuzzy, tolera errores de tipeo)
 *  - coincidencia por patrón (regex)
 *  - bonificación por contexto (intención previa)
 *  - penalización por negación
 *  - prioridad de la intención como desempate
 */

import { KNOWLEDGE, type Intencion } from "./chatbotKnowledge";
import { normalizar } from "@/lib/utils";

const NEGACIONES = ["no", "nunca", "tampoco", "jamas", "sin"];

export type Resultado = {
  intencion: Intencion | null;
  confianza: number; // 0..1
  respuesta: string;
  quickReplies: string[];
};

/** Distancia de Levenshtein entre dos palabras. */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const fila = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = fila[0];
    fila[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = fila[j];
      fila[j] = Math.min(
        fila[j] + 1,
        fila[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return fila[n];
}

/** ¿Dos palabras son "casi iguales"? Tolera 1 error para palabras >=4, 2 para >=8. */
function similar(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  const min = Math.min(a.length, b.length);
  if (min < 4) return false;
  const d = levenshtein(a, b);
  return d <= (min >= 8 ? 2 : 1);
}

function tokens(texto: string): string[] {
  return normalizar(texto).split(" ").filter(Boolean);
}

/** Puntúa una intención contra el mensaje normalizado. */
function puntuar(
  intencion: Intencion,
  msgNorm: string,
  msgTokens: string[],
  contextoPrevio: string | null,
): number {
  let score = 0;
  const frases = [...intencion.keywords, ...(intencion.sinonimos || [])].map(normalizar);

  for (const frase of frases) {
    if (!frase) continue;
    if (msgNorm === frase) {
      score += 100; // coincidencia exacta total
      continue;
    }
    const palabrasFrase = frase.split(" ").filter(Boolean);
    if (palabrasFrase.length > 1 && msgNorm.includes(frase)) {
      score += 40 + palabrasFrase.length * 6; // frase contenida
      continue;
    }
    // Coincidencia palabra por palabra (exacta o aproximada).
    let exactas = 0;
    let aprox = 0;
    for (const pf of palabrasFrase) {
      if (pf.length < 3) continue;
      if (msgTokens.includes(pf)) exactas++;
      else if (msgTokens.some((t) => similar(t, pf))) aprox++;
    }
    if (palabrasFrase.length) {
      const cobertura = (exactas + aprox * 0.6) / palabrasFrase.length;
      if (cobertura >= 0.5) score += cobertura * (18 + palabrasFrase.length * 4);
    }
  }

  // Patrones (regex).
  for (const patron of intencion.patrones || []) {
    try {
      if (new RegExp(patron, "i").test(msgNorm)) score += 50;
    } catch {
      /* patrón inválido: ignorar */
    }
  }

  // Bonificación por contexto.
  if (contextoPrevio && intencion.contexto?.includes(contextoPrevio)) {
    score += 15;
  }

  // Penalización por negación cercana a una keyword de una sola palabra.
  if (score > 0) {
    const hayNegacion = msgTokens.some((t) => NEGACIONES.includes(t));
    if (hayNegacion && intencion.categoria === "producto") score -= 6;
  }

  // Desempate por prioridad (peso pequeño para no dominar el puntaje).
  if (score > 0) score += intencion.prioridad * 0.05;

  return score;
}

/**
 * Analiza el mensaje y devuelve la mejor intención.
 * @param mensaje texto del usuario
 * @param contextoPrevio id de la última intención (para bonificación)
 */
export function analizar(mensaje: string, contextoPrevio: string | null = null): Resultado {
  const msgNorm = normalizar(mensaje);
  const msgTokens = tokens(mensaje);

  if (!msgNorm) {
    return {
      intencion: null,
      confianza: 0,
      respuesta: "¿En qué puedo ayudarte? Puedes preguntarme por el producto, la academia, las comisiones o tu cuenta.",
      quickReplies: ["¿Qué es ATRIA?", "¿Cómo son las comisiones?", "¿Cómo me certifico?"],
    };
  }

  let mejor: Intencion | null = null;
  let mejorScore = 0;
  let segundoScore = 0;

  for (const intencion of KNOWLEDGE) {
    const s = puntuar(intencion, msgNorm, msgTokens, contextoPrevio);
    if (s > mejorScore) {
      segundoScore = mejorScore;
      mejorScore = s;
      mejor = intencion;
    } else if (s > segundoScore) {
      segundoScore = s;
    }
  }

  // Umbral: por debajo de esto, pedimos aclaración.
  const UMBRAL = 12;
  if (!mejor || mejorScore < UMBRAL) {
    return {
      intencion: null,
      confianza: mejorScore > 0 ? Math.min(mejorScore / UMBRAL, 0.5) : 0,
      respuesta:
        "No encontré una respuesta exacta. ¿Podrías reformular tu pregunta o elegir una categoría? También puedo pasarte con soporte.",
      quickReplies: ["Producto ATRIA", "Academia", "Comisiones", "Contactar soporte"],
    };
  }

  // Confianza: relación entre el mejor y el segundo, saturada.
  const margen = segundoScore > 0 ? (mejorScore - segundoScore) / mejorScore : 1;
  const confianza = Math.max(0.5, Math.min(1, 0.6 + margen * 0.4));

  return {
    intencion: mejor,
    confianza,
    respuesta: mejor.respuesta,
    quickReplies: mejor.quickReplies || [],
  };
}
