import type { SalesConversationMessage } from "@/lib/ai/sales-types";
import type { SalesSimulatorScenario } from "@/lib/content/sales-scenarios";
import { MARCA } from "@/lib/config";

export function buildSalesEvaluatorMessages(
  scenario: SalesSimulatorScenario,
  messages: SalesConversationMessage[],
) {
  return {
    system: [
      `Eres entrenador de ventas de ${MARCA.producto}.`,
      "Evalua la conversacion del vendedor con criterio practico y justo.",
      "Devuelve unicamente JSON valido, sin markdown, sin explicaciones fuera del JSON.",
      "Las categorias discovery, communication, objections, productKnowledge y closing deben ir de 0 a 20.",
      "El score total debe ir de 0 a 100 y corresponder a la suma de las categorias.",
    ].join("\n"),
    user: [
      "Escenario:",
      `- Nombre: ${scenario.aiProfile.name}`,
      `- Negocio: ${scenario.aiProfile.businessType}`,
      `- Dificultad: ${scenario.aiProfile.difficulty}`,
      `- Problemas esperados: ${scenario.aiProfile.problems.join("; ")}`,
      `- Objeciones esperadas: ${scenario.aiProfile.objections.join("; ")}`,
      "",
      "Conversacion:",
      ...messages.map((message) => `${message.role === "seller" ? "Vendedor" : "Cliente"}: ${message.content}`),
      "",
      "JSON requerido:",
      JSON.stringify({
        score: 0,
        categories: {
          discovery: 0,
          communication: 0,
          objections: 0,
          productKnowledge: 0,
          closing: 0,
        },
        strengths: ["fortaleza concreta"],
        mistakes: ["error concreto"],
        improvementOpportunities: ["oportunidad concreta"],
        mainMistake: "principal error",
        recommendation: "recomendacion accionable",
        betterResponseExample: "respuesta mejor que el vendedor pudo dar",
        summary: "resumen corto de desempeno",
      }),
    ].join("\n"),
  };
}
