import "server-only";

import type {
  SalesEvaluation,
  SalesEvaluationCategories,
} from "@/lib/ai/sales-types";

const CATEGORY_KEYS: (keyof SalesEvaluationCategories)[] = [
  "discovery",
  "communication",
  "objections",
  "productKnowledge",
  "closing",
];

export function parseSalesEvaluationJson(text: string): SalesEvaluation | null {
  const jsonText = extractJsonObject(text);
  if (!jsonText) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return null;
  }

  if (!isRecord(parsed) || !isRecord(parsed.categories)) return null;

  const categories = readCategories(parsed.categories);
  const score = Object.values(categories).reduce((sum, value) => sum + value, 0);

  return {
    score,
    categories,
    strengths: readStringArray(parsed.strengths),
    mistakes: readStringArray(parsed.mistakes),
    improvementOpportunities: readStringArray(parsed.improvementOpportunities),
    mainMistake: readString(parsed.mainMistake),
    recommendation: readString(parsed.recommendation),
    betterResponseExample: readString(parsed.betterResponseExample),
    summary: readString(parsed.summary),
  };
}

function readCategories(value: Record<string, unknown>): SalesEvaluationCategories {
  return {
    discovery: readCategory(value.discovery),
    communication: readCategory(value.communication),
    objections: readCategory(value.objections),
    productKnowledge: readCategory(value.productKnowledge),
    closing: readCategory(value.closing),
  };
}

function readCategory(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(20, Math.round(parsed)));
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 700) : "";
}

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return trimmed.slice(start, end + 1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function emptyEvaluationFields(evaluation: SalesEvaluation): boolean {
  return CATEGORY_KEYS.every((key) => evaluation.categories[key] === 0)
    && evaluation.strengths.length === 0
    && evaluation.mistakes.length === 0
    && !evaluation.summary;
}
