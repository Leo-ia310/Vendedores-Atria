import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import {
  authenticateAssistantRequest,
  canUseAssistant,
} from "@/lib/assistant/auth";
import { ASSISTANT_LIMITS } from "@/lib/assistant/config";
import { answerAssistantQuestion, AssistantPublicError } from "@/lib/assistant/service";
import { parseAssistantChatBody, ValidationError } from "@/lib/assistant/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }

  const user = await authenticateAssistantRequest(request, body);
  if (!user || !canUseAssistant(user)) {
    return NextResponse.json({ error: "Sesion invalida o expirada." }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(
    `${user.UserId}:assistant`,
    ASSISTANT_LIMITS.requestsPerMinute,
    ASSISTANT_LIMITS.rateLimitWindowMs,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Estas enviando preguntas muy rapido. Intenta de nuevo en unos segundos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  try {
    const payload = parseAssistantChatBody(body);
    const response = await answerAssistantQuestion({
      userId: user.UserId,
      question: payload.question,
      conversationId: payload.conversationId,
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AssistantPublicError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("[assistant-chat-route]", safeError(error), { userId: user.UserId });
    return NextResponse.json(
      { error: "No se pudo responder con la base de conocimiento en este momento." },
      { status: 500 },
    );
  }
}

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { message: "error desconocido" };
}
