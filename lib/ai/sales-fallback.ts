import "server-only";

import type {
  SalesConversationMessage,
  SalesEvaluation,
  SalesEvaluationCategories,
} from "@/lib/ai/sales-types";
import type { PromptSecurityIssue } from "@/lib/ai/security-guard";
import type { SalesSimulatorScenario } from "@/lib/content/sales-scenarios";

export function fallbackClientReply(
  scenario: SalesSimulatorScenario,
  messages: SalesConversationMessage[],
): string {
  const lastSellerMessage = [...messages].reverse().find((message) => message.role === "seller")?.content || "";
  const text = normalize(lastSellerMessage);
  const profile = scenario.aiProfile;

  if (hasAny(text, ["precio", "cuesta", "costo", "mensualidad", "pago"])) {
    return profile.priceSensitivity === "alta"
      ? "Justo eso me preocupa. Si es otra mensualidad mas, necesito ver muy claro que me ahorra dinero."
      : "El precio me importa, pero primero tendria que entender si realmente me resuelve algo concreto.";
  }

  if (hasAny(text, ["inventario", "stock", "mercaderia", "producto"])) {
    return `Ese tema si me pega. Hoy ${profile.currentSystem.toLowerCase()} y a veces no me cuadra lo que deberia tener.`;
  }

  if (hasAny(text, ["demo", "reunion", "agendar", "mostrar", "verlo"])) {
    return profile.difficulty === "ADVANCED"
      ? "Podria verlo, pero solo si la demo va directo a mi problema y no a una presentacion generica."
      : "Si es breve y va directo a mi caso, podria darle un espacio.";
  }

  if (hasAny(text, ["empleados", "equipo", "personas", "sucursal"])) {
    return `Somos ${profile.employees} personas. El problema es que cada quien registra las cosas un poco distinto.`;
  }

  const objection = profile.objections[0] || "necesito pensarlo";
  return `Entiendo, pero ${objection}. Antes de avanzar necesito ver por que esto seria distinto para mi negocio.`;
}

export function guardedClientReply(
  scenario: SalesSimulatorScenario,
  issue?: PromptSecurityIssue,
): string {
  const profile = scenario.aiProfile;
  if (issue?.type === "secret_request" || issue?.type === "system_prompt_request") {
    return "No entiendo que tiene que ver eso con mi negocio. Si quiere seguir, expliqueme como esto me ayuda con ventas, inventario o caja.";
  }
  if (issue?.type === "role_escape" || issue?.type === "instruction_override" || issue?.type === "off_topic") {
    return `Eso no me dice mucho sobre mi ${profile.businessType.toLowerCase()}. Necesito saber si esto resuelve mis problemas con ${profile.problems[0].toLowerCase()}.`;
  }
  return `Me perdi un poco. Si seguimos, enfoquemonos en mi negocio y en si ${profile.currentSystem.toLowerCase()} realmente puede mejorar.`;
}

export function fallbackEvaluation(
  scenario: SalesSimulatorScenario,
  messages: SalesConversationMessage[],
): SalesEvaluation {
  const sellerText = messages
    .filter((message) => message.role === "seller")
    .map((message) => normalize(message.content))
    .join(" ");

  const questionCount = (sellerText.match(/\?/g) || []).length;
  const asksNeeds = hasAny(sellerText, ["inventario", "stock", "ventas", "caja", "problema", "tiempo", "errores", "necesita"]);
  const handlesObjections = hasAny(sellerText, ["entiendo", "tiene razon", "comparar", "valor", "inversion", "sin presion"]);
  const mentionsProduct = hasAny(sellerText, ["atria", "inventario", "reportes", "soporte", "demo", "implementacion"]);
  const asksClose = hasAny(sellerText, ["agend", "demo", "proximo", "siguiente", "avanzar", "le parece"]);
  const pressure = hasAny(sellerText, ["compre ya", "tiene que", "hoy o", "descuento por mi cuenta"]);

  const categories: SalesEvaluationCategories = {
    discovery: clampScore((questionCount >= 2 ? 14 : 8) + (asksNeeds ? 4 : 0) - (pressure ? 3 : 0)),
    communication: clampScore((handlesObjections ? 15 : 10) + (pressure ? -5 : 2)),
    objections: clampScore((handlesObjections ? 15 : 7) + (scenario.difficultyLevel === "ADVANCED" ? -1 : 1)),
    productKnowledge: clampScore((mentionsProduct ? 15 : 8) + (pressure ? -2 : 0)),
    closing: clampScore((asksClose ? 15 : 7) + (pressure ? -4 : 0)),
  };
  const score = Object.values(categories).reduce((sum, value) => sum + value, 0);

  return {
    score,
    categories,
    strengths: handlesObjections
      ? ["Mostro escucha ante la resistencia del cliente."]
      : ["Mantuvo la conversacion activa."],
    mistakes: pressure
      ? ["Uso presion o promesas poco cuidadosas."]
      : ["Pudo profundizar mas antes de presentar la solucion."],
    improvementOpportunities: [
      "Hacer mas preguntas de diagnostico antes de hablar de funcionalidades.",
      "Conectar cada beneficio con un problema especifico del cliente.",
    ],
    mainMistake: asksNeeds
      ? "Falto convertir el diagnostico en un siguiente paso mas claro."
      : "Falto descubrir necesidades concretas antes de vender.",
    recommendation: "Abre con una pregunta sobre el proceso actual, valida la respuesta y propone una demo enfocada en el dolor principal.",
    betterResponseExample: "Entiendo. Antes de hablar de planes, ¿donde pierde mas tiempo hoy: inventario, caja o reportes?",
    summary: "Evaluacion generada en modo de respaldo por indisponibilidad temporal de IA.",
  };
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hasAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(20, Math.round(value)));
}
