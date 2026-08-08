import "server-only";

import { cloudflareWorkersAIProvider } from "@/lib/ai/cloudflare";
import { buildAssistantSystemPrompt, buildAssistantUserPrompt } from "@/lib/ai/prompts/assistant";
import { ASSISTANT_LIMITS, ASSISTANT_MODELS } from "@/lib/assistant/config";
import type {
  AssistantChatHistoryMessage,
  AssistantChatResponse,
  RetrievedKnowledgeChunk,
} from "@/lib/assistant/types";
import {
  confidenceFromChunks,
  createOrGetConversation,
  listConversationMessages,
  logAssistantQuestion,
  recordAssistantConflict,
  recordUnansweredQuestion,
  saveAssistantMessage,
  searchKnowledgeChunks,
  sourcesFromChunks,
} from "@/lib/assistant/store";

export class AssistantPublicError extends Error {
  constructor(
    public readonly code: "BAD_BODY" | "EMPTY_QUESTION" | "QUESTION_TOO_LONG" | "NO_CONTEXT",
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "AssistantPublicError";
  }
}

export type AssistantChatInput = {
  userId: string;
  question: string;
  conversationId?: string;
};

export async function answerAssistantQuestion(input: AssistantChatInput): Promise<AssistantChatResponse> {
  const startedAt = Date.now();
  const question = sanitizeQuestion(input.question);
  if (!question) throw new AssistantPublicError("EMPTY_QUESTION", "Escribe una pregunta para el asistente.");
  if (question.length > ASSISTANT_LIMITS.maxQuestionChars) {
    throw new AssistantPublicError(
      "QUESTION_TOO_LONG",
      `La pregunta supera el limite de ${ASSISTANT_LIMITS.maxQuestionChars} caracteres.`,
      413,
    );
  }

  const conversation = await createOrGetConversation(input.userId, input.conversationId, question);
  const existingMessages = await listConversationMessages(input.userId, conversation.id);
  const history: AssistantChatHistoryMessage[] = existingMessages
    .slice(-ASSISTANT_LIMITS.maxHistoryMessages)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  await saveAssistantMessage({
    conversationId: conversation.id,
    userId: input.userId,
    role: "user",
    content: question,
  });

  try {
    const embeddingResult = await cloudflareWorkersAIProvider.generateEmbedding({ texts: [question] });
    const chunks = await searchKnowledgeChunks(
      embeddingResult.embeddings[0],
      ASSISTANT_LIMITS.topK,
      ASSISTANT_LIMITS.minSimilarity,
    );
    const limitedChunks = limitContext(chunks);
    const confidence = confidenceFromChunks(limitedChunks);
    const sources = sourcesFromChunks(limitedChunks);

    if (limitedChunks.length === 0) {
      const content = "No encuentro informacion oficial suficiente para responder eso con seguridad. Consulta con administracion o agrega esa informacion a la base de conocimiento.";
      const saved = await saveAssistantMessage({
        conversationId: conversation.id,
        userId: input.userId,
        role: "assistant",
        content,
        sources: [],
        confidence: "low",
      });
      await recordUnansweredQuestion(input.userId, question, "", "Sin chunks relevantes");
      await logAssistantQuestion({
        userId: input.userId,
        question,
        chunksFound: 0,
        confidence: "low",
        model: ASSISTANT_MODELS.chat,
        embeddingModel: embeddingResult.model,
        durationMs: Date.now() - startedAt,
        status: "no_answer",
      });
      return {
        conversationId: conversation.id,
        message: { id: saved.id, content },
        sources: [],
        confidence: "low",
      };
    }

    const conflict = detectPotentialConflict(question, limitedChunks);
    if (conflict) {
      const content = `Encontre informacion contradictoria sobre ${conflict.subject} en las fuentes consultadas. Confirma con administracion antes de responderle eso a un cliente.`;
      const saved = await saveAssistantMessage({
        conversationId: conversation.id,
        userId: input.userId,
        role: "assistant",
        content,
        sources,
        confidence: "low",
      });
      await recordAssistantConflict(input.userId, question, conflict.sourceTitles, conflict.notes);
      await logAssistantQuestion({
        userId: input.userId,
        question,
        chunksFound: limitedChunks.length,
        confidence: "low",
        model: ASSISTANT_MODELS.chat,
        embeddingModel: embeddingResult.model,
        durationMs: Date.now() - startedAt,
        status: "no_answer",
        errorCode: "CONFLICT",
      });
      return {
        conversationId: conversation.id,
        message: { id: saved.id, content },
        sources,
        confidence: "low",
      };
    }

    const generation = await cloudflareWorkersAIProvider.generateText({
      messages: [
        { role: "system", content: buildAssistantSystemPrompt() },
        {
          role: "user",
          content: buildAssistantUserPrompt({
            question,
            contextChunks: limitedChunks,
            history,
          }),
        },
      ],
      maxTokens: ASSISTANT_LIMITS.maxTokens,
      temperature: 0.2,
      topP: 0.8,
    });

    const answer = sanitizeAnswer(generation.text);
    const saved = await saveAssistantMessage({
      conversationId: conversation.id,
      userId: input.userId,
      role: "assistant",
      content: answer,
      sources,
      confidence,
    });

    if (looksUnanswered(answer) || confidence === "low") {
      await recordUnansweredQuestion(input.userId, question, sources[0]?.category || "", confidence === "low" ? "Confianza baja" : "Respuesta indica falta de informacion");
    }

    await logAssistantQuestion({
      userId: input.userId,
      question,
      chunksFound: limitedChunks.length,
      confidence,
      model: generation.model,
      embeddingModel: embeddingResult.model,
      durationMs: Date.now() - startedAt,
      status: looksUnanswered(answer) ? "no_answer" : "success",
    });

    return {
      conversationId: conversation.id,
      message: {
        id: saved.id,
        content: answer,
      },
      sources,
      confidence,
    };
  } catch (error) {
    await logAssistantQuestion({
      userId: input.userId,
      question,
      chunksFound: 0,
      confidence: "low",
      model: ASSISTANT_MODELS.chat,
      embeddingModel: ASSISTANT_MODELS.embeddings,
      durationMs: Date.now() - startedAt,
      status: "error",
      errorCode: error instanceof Error ? error.name : "UNKNOWN",
    });
    console.error("[assistant-chat]", safeError(error), { userId: input.userId });
    throw error;
  }
}

function sanitizeQuestion(question: string): string {
  return question
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function sanitizeAnswer(answer: string): string {
  const cleaned = answer.trim();
  if (!cleaned) {
    return "No pude generar una respuesta segura con la informacion oficial disponible.";
  }
  return cleaned.slice(0, 3000);
}

function limitContext(chunks: RetrievedKnowledgeChunk[]): RetrievedKnowledgeChunk[] {
  const selected: RetrievedKnowledgeChunk[] = [];
  let size = 0;
  for (const chunk of chunks) {
    if (size + chunk.content.length > ASSISTANT_LIMITS.maxContextChars && selected.length > 0) break;
    selected.push(chunk);
    size += chunk.content.length;
  }
  return selected;
}

function looksUnanswered(answer: string): boolean {
  const normalized = answer
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return normalized.includes("no encuentro informacion")
    || normalized.includes("no tengo informacion")
    || normalized.includes("no aparece en el contexto")
    || normalized.includes("no me permite responder")
    || normalized.includes("confirma con administracion");
}

type ConflictResult = {
  subject: string;
  sourceTitles: string[];
  notes: string;
};

function detectPotentialConflict(question: string, chunks: RetrievedKnowledgeChunk[]): ConflictResult | null {
  const normalizedQuestion = normalizeText(question);
  if (!/(precio|cuesta|costo|plan|pro|enterprise|demo|tarifa|descuento)/.test(normalizedQuestion)) {
    return null;
  }

  const pricesByPlan = new Map<string, Map<string, Set<string>>>();
  for (const chunk of chunks) {
    for (const match of extractPlanPrices(chunk.content)) {
      const planPrices = pricesByPlan.get(match.plan) ?? new Map<string, Set<string>>();
      const sources = planPrices.get(match.amount) ?? new Set<string>();
      sources.add(chunk.title);
      planPrices.set(match.amount, sources);
      pricesByPlan.set(match.plan, planPrices);
    }
  }

  for (const [plan, amounts] of pricesByPlan) {
    if (amounts.size <= 1) continue;
    const questionMentionsPlan = normalizedQuestion.includes(plan) || /(precio|cuesta|costo|tarifa|planes)/.test(normalizedQuestion);
    if (!questionMentionsPlan) continue;

    const sourceTitles = Array.from(amounts.values()).flatMap((sources) => Array.from(sources));
    return {
      subject: `el plan ${labelPlan(plan)}`,
      sourceTitles: Array.from(new Set(sourceTitles)),
      notes: Array.from(amounts.keys()).map((amount) => `${labelPlan(plan)}: ${amount} USD`).join("; "),
    };
  }

  return null;
}

function extractPlanPrices(content: string): Array<{ plan: string; amount: string }> {
  const matches: Array<{ plan: string; amount: string }> = [];
  const patterns = [
    /\b(demo|pro|enterprise)\b[^\n.]{0,120}?\$?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:usd|dolares|\/mes|al mes)?/gi,
    /\$?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:usd|dolares|\/mes|al mes)?[^\n.]{0,120}?\b(demo|pro|enterprise)\b/gi,
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const first = normalizeText(match[1] || "");
      const second = normalizeText(match[2] || "");
      const plan = isPlan(first) ? first : second;
      const amount = isPlan(first) ? match[2] : match[1];
      if (!isPlan(plan) || !amount) continue;
      matches.push({ plan, amount: amount.replace(",", ".") });
    }
  }

  return matches;
}

function isPlan(value: string): value is "demo" | "pro" | "enterprise" {
  return value === "demo" || value === "pro" || value === "enterprise";
}

function labelPlan(plan: string): string {
  if (plan === "pro") return "Pro";
  if (plan === "enterprise") return "Enterprise";
  return "Demo";
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { message: "error desconocido" };
}
