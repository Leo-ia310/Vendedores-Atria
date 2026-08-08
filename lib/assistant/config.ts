import "server-only";

import { DEFAULT_WORKERS_AI_EMBEDDING_MODEL, DEFAULT_WORKERS_AI_MODEL } from "@/lib/ai/provider";

export const ASSISTANT_LIMITS = {
  maxQuestionChars: numberEnv("AI_ASSISTANT_MAX_QUESTION_CHARS", 1200, 80, 2000),
  maxHistoryMessages: numberEnv(
    "AI_ASSISTANT_MAX_HISTORY_MESSAGES",
    numberEnv("AI_ASSISTANT_MAX_HISTORY", 8, 2, 16),
    2,
    16,
  ),
  topK: numberEnv("AI_ASSISTANT_TOP_K", 5, 1, 10),
  minSimilarity: numberEnv("AI_ASSISTANT_MIN_SIMILARITY", 0.18, 0, 0.95),
  maxContextChars: numberEnv("AI_ASSISTANT_MAX_CONTEXT_CHARS", 5200, 1200, 12000),
  maxTokens: numberEnv("AI_ASSISTANT_MAX_TOKENS", 360, 160, 900),
  requestsPerMinute: numberEnv(
    "AI_ASSISTANT_MESSAGES_PER_MINUTE",
    numberEnv("AI_ASSISTANT_REQUESTS_PER_MINUTE", 12, 4, 60),
    4,
    60,
  ),
  rateLimitWindowMs: numberEnv("AI_ASSISTANT_RATE_LIMIT_WINDOW_MS", 60_000, 10_000, 300_000),
  chunkMaxChars: numberEnv("AI_ASSISTANT_CHUNK_MAX_CHARS", 1200, 400, 2200),
  chunkOverlapChars: numberEnv("AI_ASSISTANT_CHUNK_OVERLAP_CHARS", 160, 0, 400),
};

export const ASSISTANT_MODELS = {
  chat: process.env.CLOUDFLARE_WORKERS_AI_MODEL || DEFAULT_WORKERS_AI_MODEL,
  embeddings: process.env.CLOUDFLARE_WORKERS_AI_EMBEDDING_MODEL || DEFAULT_WORKERS_AI_EMBEDDING_MODEL,
};

function numberEnv(key: string, fallback: number, min: number, max: number): number {
  const parsed = Number(process.env[key]);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}
