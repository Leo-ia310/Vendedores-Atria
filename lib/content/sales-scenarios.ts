import {
  ESCENARIOS,
  getEscenario,
  type Escenario,
} from "@/lib/content/simulaciones";
import type {
  SalesDifficultyLevel,
  SalesScenarioProfile,
} from "@/lib/ai/sales-types";

export type SalesSimulatorScenario = Escenario & {
  aiProfile: SalesScenarioProfile;
  difficultyLevel: SalesDifficultyLevel;
  suggestedResponses: string[];
};

export const SALES_DIFFICULTY_LABELS: Record<SalesDifficultyLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

const SCENARIO_PROFILES: Record<string, SalesScenarioProfile> = {
  "sim-apurado": {
    name: "Ferreteria con poco tiempo",
    businessType: "Ferreteria",
    employees: 8,
    currentSystem: "Cuaderno y hojas de Excel",
    problems: [
      "diferencias de inventario",
      "errores al registrar ventas cuando hay muchos clientes",
      "poco tiempo para revisar reportes",
    ],
    budget: "limitado, pero puede invertir si ve ahorro claro",
    techKnowledge: "medio",
    personality: "directo, impaciente y practico",
    priceSensitivity: "media",
    objections: [
      "no tengo tiempo",
      "eso suena complicado",
      "mandeme informacion y lo veo despues",
    ],
    difficulty: "INTERMEDIATE",
    interestConditions: [
      "el vendedor respeta su tiempo",
      "la propuesta se conecta con inventario o caja",
      "hay un siguiente paso breve y concreto",
    ],
    rejectionConditions: [
      "el vendedor habla demasiado",
      "presiona por comprar sin diagnosticar",
      "promete resultados absolutos",
    ],
    additionalContext: "Esta entre atencion a clientes y compras de inventario, por eso responde corto.",
  },
  "sim-desconfiado": {
    name: "Administradora quemada por otro software",
    businessType: "Farmacia y mini retail",
    employees: 14,
    currentSystem: "Sistema viejo instalado localmente",
    problems: [
      "soporte lento",
      "capacitacion insuficiente",
      "miedo a migrar datos y quedar sin operar",
    ],
    budget: "hay presupuesto, pero solo si reduce el riesgo",
    techKnowledge: "medio",
    personality: "desconfiada, analitica y defensiva",
    priceSensitivity: "media",
    objections: [
      "ya me fallaron antes",
      "todos prometen soporte",
      "no quiero amarrarme",
      "necesito pruebas antes de decidir",
    ],
    difficulty: "ADVANCED",
    interestConditions: [
      "el vendedor valida la mala experiencia previa",
      "propone una demo acotada",
      "habla con honestidad de implementacion y soporte",
    ],
    rejectionConditions: [
      "el vendedor minimiza su mala experiencia",
      "culpa a otros proveedores",
      "usa urgencia falsa o presion",
    ],
    additionalContext: "Puede terminar la conversacion si siente manipulacion o promesas vacias.",
  },
  "sim-excel": {
    name: "Contador comodo con Excel",
    businessType: "Distribuidora",
    employees: 18,
    currentSystem: "Excel avanzado con varias hojas compartidas",
    problems: [
      "errores de formulas",
      "recaptura de ventas",
      "varios dias al mes conciliando inventario",
    ],
    budget: "moderado si el ahorro de tiempo es evidente",
    techKnowledge: "alto",
    personality: "tecnico, orgulloso de su metodo y cuidadoso",
    priceSensitivity: "media",
    objections: [
      "Excel me funciona",
      "migrar datos toma tiempo",
      "no quiero perder control",
    ],
    difficulty: "INTERMEDIATE",
    interestConditions: [
      "el vendedor respeta Excel",
      "hace preguntas sobre tiempo y errores",
      "presenta migracion como proceso acompanado",
    ],
    rejectionConditions: [
      "el vendedor ataca Excel",
      "promete cero errores",
      "salta directo al pago",
    ],
    additionalContext: "Valora respuestas especificas y no tolera frases exageradas.",
  },
  "sim-precio": {
    name: "Tienda sensible al precio",
    businessType: "Tienda de barrio",
    employees: 4,
    currentSystem: "Caja manual y notas en cuaderno",
    problems: [
      "perdida de mercaderia",
      "no sabe cuanto gana por categoria",
      "ventas registradas tarde",
    ],
    budget: "bajo; necesita justificar cada mensualidad",
    techKnowledge: "bajo",
    personality: "pragmatico y cauteloso con gastos",
    priceSensitivity: "alta",
    objections: [
      "si es caro no sigo",
      "no quiero otra mensualidad",
      "lo veo cuando venda mas",
    ],
    difficulty: "BEGINNER",
    interestConditions: [
      "el vendedor compara costo contra perdidas",
      "explica valor en palabras simples",
      "propone revisar numeros en una demo corta",
    ],
    rejectionConditions: [
      "el vendedor ofrece descuentos no autorizados",
      "lo hace sentir pequeno",
      "presiona sin mostrar retorno",
    ],
    additionalContext: "Puede cooperar si siente que el vendedor entiende su tamano de negocio.",
  },
  "sim-restaurante": {
    name: "Restaurante familiar con pedidos desordenados",
    businessType: "Restaurante familiar",
    employees: 11,
    currentSystem: "Papel, WhatsApp interno y caja basica",
    problems: [
      "pedidos se confunden",
      "caja cobra precios desactualizados",
      "menu cambia segun insumos disponibles",
    ],
    budget: "moderado, depende de no complicar la operacion",
    techKnowledge: "medio",
    personality: "ocupada, practica y protectora de su equipo",
    priceSensitivity: "media",
    objections: [
      "no tengo tiempo para capacitar a todos",
      "la cocina cambia mucho",
      "no quiero algo pesado",
    ],
    difficulty: "INTERMEDIATE",
    interestConditions: [
      "el vendedor diagnostica pedidos, menu y caja",
      "aterriza la demo al flujo del restaurante",
      "no culpa al personal",
    ],
    rejectionConditions: [
      "el vendedor promete que nunca habra errores",
      "culpa a meseros o cocina",
      "habla de modulos irrelevantes primero",
    ],
    additionalContext: "Interrumpe si el vendedor se aleja del problema de pedidos y menu.",
  },
  "sim-listo": {
    name: "Gerente listo para comprar",
    businessType: "Retail pequeno en crecimiento",
    employees: 9,
    currentSystem: "Sistema basico que ya le quedo corto",
    problems: [
      "necesita ordenar la implementacion",
      "quiere claridad de plan, pago y soporte",
      "busca empezar rapido",
    ],
    budget: "aprobado si el proceso es claro",
    techKnowledge: "medio",
    personality: "decidido, directo y colaborador",
    priceSensitivity: "baja",
    objections: [
      "quien me ayuda a arrancar",
      "que sigue despues del pago",
      "cuanto tarda la implementacion",
    ],
    difficulty: "BEGINNER",
    interestConditions: [
      "el vendedor confirma el plan",
      "explica pasos de registro e implementacion",
      "mantiene claridad sin sobreexplicar",
    ],
    rejectionConditions: [
      "el vendedor complica la compra",
      "pide pagar sin explicar el proceso",
      "abandona el acompanamiento",
    ],
    additionalContext: "Ya hay intencion de compra, pero puede enfriarse si el proceso se vuelve confuso.",
  },
  "sim-descuento": {
    name: "Comprador que exige descuento",
    businessType: "Cadena pequena de tiendas",
    employees: 22,
    currentSystem: "Competidor economico y hojas de control",
    problems: [
      "soporte del competidor es limitado",
      "reportes no consolidan bien",
      "quiere negociar antes de revelar dolores",
    ],
    budget: "existe presupuesto, pero intenta bajar precio",
    techKnowledge: "alto",
    personality: "negociador, retador y comparativo",
    priceSensitivity: "alta",
    objections: [
      "otro sistema es mas barato",
      "deme descuento",
      "demuestreme por que vale mas",
      "si no mejora el precio compro el otro",
    ],
    difficulty: "ADVANCED",
    interestConditions: [
      "el vendedor sostiene valor con comparacion objetiva",
      "no inventa descuentos",
      "pide criterios de decision y agenda demo comparativa",
    ],
    rejectionConditions: [
      "el vendedor habla mal de la competencia",
      "ofrece descuentos no autorizados",
      "se retira sin explorar valor",
    ],
    additionalContext: "Puede cambiar de tema para probar si el vendedor mantiene control profesional.",
  },
};

const SUGGESTED_RESPONSES: Record<string, string[]> = {
  "sim-apurado": [
    "Entiendo que tiene poco tiempo. En una frase, ATRIA le ayuda a controlar ventas e inventario sin duplicar trabajo. ¿Qué le descuadra más hoy?",
    "¿Cómo controla actualmente inventario y caja?",
    "Si detectamos un problema claro, ¿le parece agendar una demo breve?",
  ],
  "sim-desconfiado": [
    "Tiene razón en desconfiar. ¿Qué salió mal con el sistema anterior?",
    "No quiero prometer magia; prefiero mostrarle solo el flujo que más le preocupa.",
    "¿Qué tendría que pasar en una demo para que usted diga que vale la pena avanzar?",
  ],
  "sim-excel": [
    "Excel es potente. ¿Cuánto tiempo le toma cuadrar ventas e inventario cada mes?",
    "¿Dónde aparecen más errores: fórmulas, recaptura o control de stock?",
    "Podemos comparar su proceso actual contra un flujo automatizado.",
  ],
  "sim-precio": [
    "Con gusto hablamos de precio. Antes, ¿cuánto calcula que pierde al mes por descuadres?",
    "¿Qué mensualidad tendría sentido si reduce pérdidas y horas manuales?",
    "Podemos revisar números en una demo corta y usted decide sin presión.",
  ],
  "sim-restaurante": [
    "¿Cómo toman pedidos hoy y quién actualiza el menú cuando cambia un precio?",
    "Me enfoco en pedido, menú, caja e inventario para no hacerlo pesado.",
    "¿Le serviría ver una demo con un ejemplo de su propio menú?",
  ],
  "sim-listo": [
    "Confirmemos el plan, registramos su empresa y coordinamos implementación.",
    "Después del pago lo acompaña soporte y yo dejo el proceso registrado.",
    "¿Quiere que avancemos paso a paso ahora?",
  ],
  "sim-descuento": [
    "No manejo descuentos por mi cuenta, pero sí podemos comparar el valor incluido.",
    "¿Qué criterios usará para comparar ATRIA contra el otro sistema?",
    "Le propongo una demo comparativa con pedidos, inventario, reportes y soporte.",
  ],
};

export const SALES_SIMULATOR_SCENARIOS: SalesSimulatorScenario[] = ESCENARIOS.map((scenario) =>
  toSalesSimulatorScenario(scenario),
);

export function getSalesSimulatorScenario(id: string): SalesSimulatorScenario | undefined {
  const scenario = getEscenario(id);
  return scenario ? toSalesSimulatorScenario(scenario) : undefined;
}

function toSalesSimulatorScenario(scenario: Escenario): SalesSimulatorScenario {
  const aiProfile = SCENARIO_PROFILES[scenario.id] || fallbackProfile(scenario);
  return {
    ...scenario,
    aiProfile,
    difficultyLevel: aiProfile.difficulty,
    suggestedResponses: SUGGESTED_RESPONSES[scenario.id] || [],
  };
}

function fallbackProfile(scenario: Escenario): SalesScenarioProfile {
  return {
    name: scenario.titulo,
    businessType: scenario.perfil,
    employees: 6,
    currentSystem: "proceso manual",
    problems: [scenario.descripcion],
    budget: "por definir",
    techKnowledge: "medio",
    personality: "prudente",
    priceSensitivity: "media",
    objections: ["necesito pensarlo", "quiero entender mejor el valor"],
    difficulty: scenario.dificultad === "Difícil"
      ? "ADVANCED"
      : scenario.dificultad === "Fácil"
        ? "BEGINNER"
        : "INTERMEDIATE",
    interestConditions: ["el vendedor diagnostica antes de vender"],
    rejectionConditions: ["el vendedor presiona o promete demasiado"],
    additionalContext: scenario.descripcion,
  };
}
