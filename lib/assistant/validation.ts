import "server-only";

import type {
  KnowledgeCategory,
  KnowledgeStatus,
} from "@/lib/assistant/types";
import type { KnowledgeDocumentInput } from "@/lib/assistant/store";

export class ValidationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export function parseAssistantChatBody(body: unknown): { question: string; conversationId?: string } {
  const record = requireRecord(body);
  const question = readString(record.question).trim();
  if (!question) throw new ValidationError("EMPTY_QUESTION", "Escribe una pregunta para el asistente.");
  const conversationId = readString(record.conversationId).trim() || undefined;
  return { question, conversationId };
}

export function parseKnowledgeDocumentBody(body: unknown): KnowledgeDocumentInput {
  const record = requireRecord(body);
  const title = readString(record.title).trim();
  const content = readString(record.content).trim();
  if (!title) throw new ValidationError("TITLE", "El titulo es obligatorio.");
  if (title.length > 160) throw new ValidationError("TITLE_LONG", "El titulo es demasiado largo.", 413);
  if (!content) throw new ValidationError("CONTENT", "El contenido es obligatorio.");
  if (content.length > 30_000) throw new ValidationError("CONTENT_LONG", "El contenido es demasiado largo.", 413);

  return {
    title,
    content,
    category: readCategory(record.category),
    tags: readTags(record.tags),
    status: readStatus(record.status),
    priority: clampInteger(record.priority, 0, 100),
    official: record.official !== false,
    validFrom: readOptionalDate(record.validFrom),
    validUntil: readOptionalDate(record.validUntil),
  };
}

function readCategory(value: unknown): KnowledgeCategory {
  const allowed: KnowledgeCategory[] = ["product", "pricing", "sales", "competition", "policies", "sellers", "faq", "general"];
  return allowed.includes(value as KnowledgeCategory) ? value as KnowledgeCategory : "general";
}

function readStatus(value: unknown): KnowledgeStatus {
  const allowed: KnowledgeStatus[] = ["draft", "active", "inactive", "archived"];
  return allowed.includes(value as KnowledgeStatus) ? value as KnowledgeStatus : "draft";
}

function readTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 20);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean).slice(0, 20);
  }
  return [];
}

function readOptionalDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return undefined;
  return new Date(timestamp).toISOString();
}

function clampInteger(value: unknown, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function requireRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  throw new ValidationError("BAD_BODY", "Solicitud invalida.");
}
