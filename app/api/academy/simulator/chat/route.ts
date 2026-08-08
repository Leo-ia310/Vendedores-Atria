import { NextResponse, type NextRequest } from "next/server";
import { AIProviderError, cloudflareWorkersAIProvider } from "@/lib/ai/cloudflare";
import { fallbackClientReply, guardedClientReply } from "@/lib/ai/sales-fallback";
import { SALES_AI_LIMITS } from "@/lib/ai/sales-limits";
import {
  RequestValidationError,
  parseChatPayload,
  recentMessages,
  toProviderHistory,
} from "@/lib/ai/sales-requests";
import { buildSalesSimulatorSystemPrompt } from "@/lib/ai/prompts/sales-simulator";
import {
  detectPromptSecurityIssue,
  isUnsafeSalesSimulatorOutput,
} from "@/lib/ai/security-guard";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getSalesSimulatorScenario } from "@/lib/content/sales-scenarios";
import { verificarSesion } from "@/lib/backend/router";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }

  const token = readToken(request, body);
  const user = await verificarSesion(token);
  if (!user) {
    return NextResponse.json({ error: "Sesion invalida o expirada." }, { status: 401 });
  }

  let payload;
  try {
    payload = parseChatPayload(body);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    throw error;
  }

  const scenario = getSalesSimulatorScenario(payload.scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: "Escenario no encontrado." }, { status: 404 });
  }

  const rateLimit = await checkRateLimit(
    `${user.UserId}:chat`,
    SALES_AI_LIMITS.messagesPerMinute,
    SALES_AI_LIMITS.rateLimitWindowMs,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Estas enviando mensajes muy rapido. Intenta de nuevo en unos segundos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const limitedHistory = recentMessages(payload.messages);
  const lastSellerMessage = [...payload.messages].reverse().find((message) => message.role === "seller");
  const securityIssue = lastSellerMessage
    ? detectPromptSecurityIssue(lastSellerMessage.content, { blockOffTopic: true })
    : null;
  if (securityIssue) {
    console.warn("[sales-simulator-guard]", {
      userId: user.UserId,
      scenarioId: scenario.id,
      type: securityIssue.type,
    });
    return NextResponse.json({ reply: guardedClientReply(scenario, securityIssue), guarded: true });
  }

  try {
    const result = await cloudflareWorkersAIProvider.generateText({
      messages: [
        { role: "system", content: buildSalesSimulatorSystemPrompt(scenario) },
        ...toProviderHistory(limitedHistory),
      ],
      maxTokens: SALES_AI_LIMITS.chatMaxTokens,
      temperature: 0.7,
      topP: 0.9,
    });

    if (isUnsafeSalesSimulatorOutput(result.text)) {
      console.warn("[sales-simulator-output-guard]", {
        userId: user.UserId,
        scenarioId: scenario.id,
      });
      return NextResponse.json({ reply: guardedClientReply(scenario), guarded: true });
    }

    return NextResponse.json({ reply: result.text });
  } catch (error) {
    console.error("[sales-simulator-chat]", safeAiError(error), {
      userId: user.UserId,
      scenarioId: scenario.id,
    });

    return NextResponse.json({
      reply: fallbackClientReply(scenario, payload.messages),
      fallback: true,
      warning: error instanceof AIProviderError && error.code === "CONFIG"
        ? "La IA no esta configurada; se uso el modo de respaldo."
        : "La IA no respondio a tiempo; se uso el modo de respaldo.",
    });
  }
}

function readToken(request: NextRequest, body: unknown): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice("Bearer ".length).trim();
  if (isRecord(body) && typeof body.token === "string") return body.token;
  return null;
}

function safeAiError(error: unknown) {
  if (error instanceof AIProviderError) return { name: error.name, code: error.code, message: error.message };
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { message: "error desconocido" };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
