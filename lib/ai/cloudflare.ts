import "server-only";

import {
  DEFAULT_WORKERS_AI_EMBEDDING_MODEL,
  DEFAULT_WORKERS_AI_MODEL,
  type AIProvider,
  type GenerateEmbeddingOptions,
  type GenerateEmbeddingResult,
  type GenerateTextOptions,
  type GenerateTextResult,
} from "@/lib/ai/provider";

const CLOUDFLARE_AI_URL = "https://api.cloudflare.com/client/v4/accounts";

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: "CONFIG" | "HTTP" | "EMPTY_RESPONSE" | "BAD_RESPONSE",
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

export const cloudflareWorkersAIProvider: AIProvider = {
  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const model = options.model || process.env.CLOUDFLARE_WORKERS_AI_MODEL || DEFAULT_WORKERS_AI_MODEL;

    if (!accountId || !apiToken) {
      throw new AIProviderError("Cloudflare Workers AI no esta configurado.", "CONFIG");
    }

    const response = await fetch(
      `${CLOUDFLARE_AI_URL}/${encodeURIComponent(accountId)}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: options.messages,
          max_tokens: options.maxTokens,
          temperature: options.temperature,
          top_p: options.topP,
          response_format: options.responseFormat,
        }),
        cache: "no-store",
      },
    );

    const payload = await response.json().catch(() => null) as unknown;
    if (!response.ok) {
      throw new AIProviderError(`Cloudflare Workers AI respondio con estado ${response.status}.`, "HTTP");
    }

    const text = extractText(payload);
    if (!text) {
      throw new AIProviderError("Cloudflare Workers AI devolvio una respuesta vacia.", "EMPTY_RESPONSE");
    }

    return {
      text,
      model,
      usage: extractUsage(payload),
    };
  },

  async generateEmbedding(options: GenerateEmbeddingOptions): Promise<GenerateEmbeddingResult> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const model = options.model || process.env.CLOUDFLARE_WORKERS_AI_EMBEDDING_MODEL || DEFAULT_WORKERS_AI_EMBEDDING_MODEL;
    const texts = options.texts.map((text) => text.trim()).filter(Boolean);

    if (!accountId || !apiToken) {
      throw new AIProviderError("Cloudflare Workers AI no esta configurado.", "CONFIG");
    }
    if (texts.length === 0) {
      throw new AIProviderError("No hay texto para generar embeddings.", "BAD_RESPONSE");
    }

    const response = await fetch(
      `${CLOUDFLARE_AI_URL}/${encodeURIComponent(accountId)}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: texts }),
        cache: "no-store",
      },
    );

    const payload = await response.json().catch(() => null) as unknown;
    if (!response.ok) {
      throw new AIProviderError(`Cloudflare Workers AI embeddings respondio con estado ${response.status}.`, "HTTP");
    }

    const embeddings = extractEmbeddings(payload);
    if (embeddings.length !== texts.length || embeddings.some((embedding) => embedding.length === 0)) {
      throw new AIProviderError("Cloudflare Workers AI devolvio embeddings invalidos.", "BAD_RESPONSE");
    }

    return {
      embeddings,
      model,
      usage: extractUsage(payload),
    };
  },
};

function extractText(payload: unknown): string {
  if (!isRecord(payload)) return "";

  const result = payload.result;
  if (isRecord(result)) {
    const response = result.response;
    if (typeof response === "string") return response.trim();
    if (isRecord(response) || Array.isArray(response)) return JSON.stringify(response);

    const text = result.text;
    if (typeof text === "string") return text.trim();
    if (isRecord(text) || Array.isArray(text)) return JSON.stringify(text);

    const generated = stripKnownMetadata(result);
    if (Object.keys(generated).length > 0) return JSON.stringify(generated);
  }

  const response = payload.response;
  if (typeof response === "string") return response.trim();
  if (isRecord(response) || Array.isArray(response)) return JSON.stringify(response);

  return "";
}

function extractUsage(payload: unknown): Record<string, unknown> | undefined {
  if (!isRecord(payload)) return undefined;
  const result = payload.result;
  if (isRecord(result) && isRecord(result.usage)) return result.usage;
  if (isRecord(payload.usage)) return payload.usage;
  return undefined;
}

function extractEmbeddings(payload: unknown): number[][] {
  const candidates: unknown[] = [];
  if (isRecord(payload)) {
    candidates.push(payload.data);
    if (isRecord(payload.result)) {
      candidates.push(payload.result.data);
      if (isRecord(payload.result.response)) candidates.push(payload.result.response.data);
    }
  }

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.every(isNumberArray)) return candidate;
  }
  return [];
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isFinite(item));
}

function stripKnownMetadata(value: Record<string, unknown>): Record<string, unknown> {
  const { usage, tool_calls: toolCalls, ...generated } = value;
  void usage;
  void toolCalls;
  return generated;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
