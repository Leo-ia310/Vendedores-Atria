import "server-only";

import type { AIMessage } from "@/lib/ai/provider";
import { SALES_AI_LIMITS } from "@/lib/ai/sales-limits";
import type {
  SalesConversationMessage,
  SalesConversationRole,
} from "@/lib/ai/sales-types";

export type ChatPayload = {
  scenarioId: string;
  messages: SalesConversationMessage[];
};

export type EvaluationPayload = ChatPayload & {
  startedAt?: string;
};

export class RequestValidationError extends Error {
  constructor(
    message: string,
    public readonly code: "BAD_BODY" | "EMPTY_MESSAGE" | "MESSAGE_TOO_LONG" | "TOO_MANY_MESSAGES",
    public readonly status = 400,
  ) {
    super(message);
    this.name = "RequestValidationError";
  }
}

export function parseChatPayload(body: unknown): ChatPayload {
  const record = requireRecord(body);
  const scenarioId = readRequiredString(record, "scenarioId", "Escenario invalido.");
  const messages = readMessages(record.messages);
  if (messages.length > SALES_AI_LIMITS.maxRequestMessages) {
    throw new RequestValidationError("La conversacion tiene demasiados mensajes.", "TOO_MANY_MESSAGES", 413);
  }
  const last = messages[messages.length - 1];
  if (!last || last.role !== "seller") {
    throw new RequestValidationError("Envia un mensaje del vendedor para continuar.", "EMPTY_MESSAGE");
  }
  return { scenarioId, messages };
}

export function parseEvaluationPayload(body: unknown): EvaluationPayload {
  const record = requireRecord(body);
  const scenarioId = readRequiredString(record, "scenarioId", "Escenario invalido.");
  const messages = readMessages(record.messages);
  if (messages.length > SALES_AI_LIMITS.maxEvaluationMessages) {
    throw new RequestValidationError("La conversacion es demasiado larga para evaluar.", "TOO_MANY_MESSAGES", 413);
  }
  if (!messages.some((message) => message.role === "seller")) {
    throw new RequestValidationError("No hay respuestas del vendedor para evaluar.", "EMPTY_MESSAGE");
  }
  const startedAt = typeof record.startedAt === "string" && isIsoDate(record.startedAt)
    ? record.startedAt
    : undefined;
  return { scenarioId, messages, startedAt };
}

export function recentMessages(messages: SalesConversationMessage[]): SalesConversationMessage[] {
  return messages.slice(-SALES_AI_LIMITS.maxHistoryMessages);
}

export function toProviderHistory(messages: SalesConversationMessage[]): AIMessage[] {
  return messages.map((message) => ({
    role: message.role === "seller" ? "user" : "assistant",
    content: message.content,
  }));
}

function readMessages(value: unknown): SalesConversationMessage[] {
  if (!Array.isArray(value)) {
    throw new RequestValidationError("Historial invalido.", "BAD_BODY");
  }

  return value.map((message) => {
    const record = requireRecord(message);
    const role = readRole(record.role);
    const content = sanitizeContent(readRequiredString(record, "content", "Mensaje invalido."));
    if (!content) {
      throw new RequestValidationError("El mensaje no puede estar vacio.", "EMPTY_MESSAGE");
    }
    if (content.length > SALES_AI_LIMITS.maxMessageChars) {
      throw new RequestValidationError(
        `El mensaje supera el limite de ${SALES_AI_LIMITS.maxMessageChars} caracteres.`,
        "MESSAGE_TOO_LONG",
        413,
      );
    }
    const createdAt = typeof record.createdAt === "string" && isIsoDate(record.createdAt)
      ? record.createdAt
      : undefined;
    return { role, content, createdAt };
  });
}

function sanitizeContent(content: string): string {
  return content
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function readRole(value: unknown): SalesConversationRole {
  if (value === "seller" || value === "client") return value;
  throw new RequestValidationError("Rol de mensaje invalido.", "BAD_BODY");
}

function readRequiredString(
  record: Record<string, unknown>,
  key: string,
  message: string,
): string {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new RequestValidationError(message, "BAD_BODY");
  }
  return value.trim();
}

function requireRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  throw new RequestValidationError("Solicitud invalida.", "BAD_BODY");
}

function isIsoDate(value: string): boolean {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
}
