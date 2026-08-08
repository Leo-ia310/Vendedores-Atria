import { NextResponse, type NextRequest } from "next/server";
import { AIProviderError, cloudflareWorkersAIProvider } from "@/lib/ai/cloudflare";
import { emptyEvaluationFields, parseSalesEvaluationJson } from "@/lib/ai/sales-evaluation";
import { fallbackEvaluation } from "@/lib/ai/sales-fallback";
import { SALES_AI_LIMITS } from "@/lib/ai/sales-limits";
import {
  RequestValidationError,
  parseEvaluationPayload,
} from "@/lib/ai/sales-requests";
import { saveSalesSimulation } from "@/lib/ai/sales-simulation-store";
import { buildSalesEvaluatorMessages } from "@/lib/ai/prompts/sales-evaluator";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import type { SalesEvaluation } from "@/lib/ai/sales-types";
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
    payload = parseEvaluationPayload(body);
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
    `${user.UserId}:evaluate`,
    SALES_AI_LIMITS.evaluationsPerMinute,
    SALES_AI_LIMITS.rateLimitWindowMs,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Estas finalizando simulaciones muy rapido. Intenta de nuevo en unos segundos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const evaluationResult = await evaluateConversation(scenario, payload.messages, user.UserId);

  try {
    const simulationId = await saveSalesSimulation({
      user,
      scenario,
      messages: payload.messages,
      evaluation: evaluationResult.evaluation,
      startedAt: payload.startedAt,
    });

    return NextResponse.json({
      simulationId,
      evaluation: evaluationResult.evaluation,
      fallback: evaluationResult.fallback,
      warning: evaluationResult.warning,
    });
  } catch (error) {
    console.error("[sales-simulator-save]", safeError(error), {
      userId: user.UserId,
      scenarioId: scenario.id,
    });
    return NextResponse.json(
      { error: "La evaluacion se genero, pero no se pudo registrar la simulacion." },
      { status: 500 },
    );
  }
}

async function evaluateConversation(
  scenario: ReturnType<typeof getSalesSimulatorScenario> extends infer T ? NonNullable<T> : never,
  messages: ReturnType<typeof parseEvaluationPayload>["messages"],
  userId: string,
): Promise<{ evaluation: SalesEvaluation; fallback: boolean; warning?: string }> {
  const prompt = buildSalesEvaluatorMessages(scenario, messages);

  try {
    const result = await cloudflareWorkersAIProvider.generateText({
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      maxTokens: SALES_AI_LIMITS.evaluationMaxTokens,
      temperature: 0.2,
      topP: 0.8,
    });

    const evaluation = parseSalesEvaluationJson(result.text);
    if (!evaluation || emptyEvaluationFields(evaluation)) {
      throw new AIProviderError("La evaluacion de IA no devolvio JSON valido.", "BAD_RESPONSE");
    }

    return { evaluation, fallback: false };
  } catch (error) {
    console.error("[sales-simulator-evaluate]", safeError(error), {
      userId,
      scenarioId: scenario.id,
    });
    return {
      evaluation: fallbackEvaluation(scenario, messages),
      fallback: true,
      warning: error instanceof AIProviderError && error.code === "CONFIG"
        ? "La IA no esta configurada; se uso evaluacion de respaldo."
        : "La IA no devolvio una evaluacion valida; se uso evaluacion de respaldo.",
    };
  }
}

function readToken(request: NextRequest, body: unknown): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice("Bearer ".length).trim();
  if (isRecord(body) && typeof body.token === "string") return body.token;
  return null;
}

function safeError(error: unknown) {
  if (error instanceof AIProviderError) return { name: error.name, code: error.code, message: error.message };
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { message: "error desconocido" };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
