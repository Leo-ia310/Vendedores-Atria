import "server-only";

import {
  DEFAULT_MAX_HISTORY_MESSAGES,
  DEFAULT_MAX_SELLER_MESSAGE_CHARS,
} from "@/lib/ai/sales-types";

export const SALES_AI_LIMITS = {
  maxHistoryMessages: numberEnv("AI_SIMULATOR_MAX_HISTORY_MESSAGES", DEFAULT_MAX_HISTORY_MESSAGES, 4, 20),
  maxRequestMessages: numberEnv("AI_SIMULATOR_MAX_REQUEST_MESSAGES", 40, 4, 80),
  maxEvaluationMessages: numberEnv("AI_SIMULATOR_MAX_EVALUATION_MESSAGES", 50, 4, 100),
  maxMessageChars: numberEnv("AI_SIMULATOR_MAX_MESSAGE_CHARS", DEFAULT_MAX_SELLER_MESSAGE_CHARS, 120, 2000),
  chatMaxTokens: numberEnv("AI_SIMULATOR_CHAT_MAX_TOKENS", 140, 80, 180),
  evaluationMaxTokens: numberEnv("AI_SIMULATOR_EVALUATION_MAX_TOKENS", 700, 300, 1200),
  messagesPerMinute: numberEnv("AI_SIMULATOR_MESSAGES_PER_MINUTE", 12, 4, 60),
  evaluationsPerMinute: numberEnv("AI_SIMULATOR_EVALUATIONS_PER_MINUTE", 4, 1, 20),
  rateLimitWindowMs: numberEnv("AI_SIMULATOR_RATE_LIMIT_WINDOW_MS", 60_000, 10_000, 300_000),
};

function numberEnv(key: string, fallback: number, min: number, max: number): number {
  const parsed = Number(process.env[key]);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}
