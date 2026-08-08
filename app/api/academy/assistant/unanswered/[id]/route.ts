import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canManageKnowledge,
} from "@/lib/assistant/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const user = await authenticateAssistantRequest(request, body);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para modificar estas preguntas." }, { status: 403 });
  }

  const { id } = await params;
  const resolutionDocumentId = isRecord(body) && typeof body.resolutionDocumentId === "string"
    ? body.resolutionDocumentId
    : "";

  const { error } = await supabaseAdmin()
    .from("unanswered_questions")
    .update({
      resolved: true,
      resolution_document_id: resolutionDocumentId,
    } as never)
    .eq("id", id as never);

  if (error) {
    return NextResponse.json({ error: "No se pudo marcar la pregunta." }, { status: 500 });
  }

  return NextResponse.json({ resolved: true });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
