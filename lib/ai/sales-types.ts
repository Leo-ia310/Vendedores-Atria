export type SalesDifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type SalesConversationRole = "seller" | "client";

export type SalesConversationMessage = {
  role: SalesConversationRole;
  content: string;
  createdAt?: string;
};

export type SalesScenarioProfile = {
  name: string;
  businessType: string;
  employees: number;
  currentSystem: string;
  problems: string[];
  budget: string;
  techKnowledge: "bajo" | "medio" | "alto";
  personality: string;
  priceSensitivity: "baja" | "media" | "alta";
  objections: string[];
  difficulty: SalesDifficultyLevel;
  interestConditions: string[];
  rejectionConditions: string[];
  additionalContext: string;
};

export type SalesEvaluationCategories = {
  discovery: number;
  communication: number;
  objections: number;
  productKnowledge: number;
  closing: number;
};

export type SalesEvaluation = {
  score: number;
  categories: SalesEvaluationCategories;
  strengths: string[];
  mistakes: string[];
  improvementOpportunities: string[];
  mainMistake: string;
  recommendation: string;
  betterResponseExample: string;
  summary: string;
};

export const SALES_EVALUATION_CATEGORY_LABELS: Record<keyof SalesEvaluationCategories, string> = {
  discovery: "Descubrimiento",
  communication: "Comunicación",
  objections: "Objeciones",
  productKnowledge: "Producto",
  closing: "Cierre",
};

export const DEFAULT_MAX_HISTORY_MESSAGES = 12;
export const DEFAULT_MAX_SELLER_MESSAGE_CHARS = 800;
