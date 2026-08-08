import "server-only";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type MemoryBucket = {
  count: number;
  resetAt: number;
};

const memoryStore = globalThis as typeof globalThis & {
  __atriaAiRateLimit?: Map<string, MemoryBucket>;
};

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const redisResult = await checkUpstashRateLimit(key, limit, windowMs);
  if (redisResult) return redisResult;
  return checkMemoryRateLimit(key, limit, windowMs);
}

async function checkUpstashRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const bucket = Math.floor(Date.now() / windowMs);
  const redisKey = `ratelimit:ai-simulator:${bucket}:${key}`;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, Math.ceil(windowMs / 1000)],
      ]),
      cache: "no-store",
    });

    if (!response.ok) return null;
    const payload = await response.json().catch(() => null) as unknown;
    const count = readPipelineNumber(payload);
    if (!count) return null;

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  } catch (error) {
    console.error("[ai-rate-limit] Upstash no disponible, usando memoria local.", safeError(error));
    return null;
  }
}

function checkMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const store = memoryStore.__atriaAiRateLimit ?? new Map<string, MemoryBucket>();
  memoryStore.__atriaAiRateLimit = store;

  const current = store.get(key);
  const bucket = current && current.resetAt > now
    ? { count: current.count + 1, resetAt: current.resetAt }
    : { count: 1, resetAt: now + windowMs };

  store.set(key, bucket);

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

function readPipelineNumber(payload: unknown): number | null {
  if (!Array.isArray(payload)) return null;
  const first = payload[0] as unknown;
  if (!isRecord(first)) return null;
  const result = first.result;
  return typeof result === "number" ? result : null;
}

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { message: "error desconocido" };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
