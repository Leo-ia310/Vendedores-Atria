import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canManageKnowledge,
} from "@/lib/assistant/auth";
import { reindexKnowledgeDocument } from "@/lib/assistant/indexing";
import {
  deleteKnowledgeDocument,
  getKnowledgeDocument,
  updateKnowledgeDocument,
} from "@/lib/assistant/store";
import { parseKnowledgeDocumentBody, ValidationError } from "@/lib/assistant/validation";

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
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }

  const user = await authenticateAssistantRequest(request, body);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para administrar conocimiento." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const input = parseKnowledgeDocumentBody(body);
    const document = await updateKnowledgeDocument(id, input);
    const chunksIndexed = await reindexKnowledgeDocument(document);
    return NextResponse.json({ document, chunksIndexed });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("[assistant-knowledge-update]", safeError(error), { userId: user.UserId });
    return NextResponse.json({ error: "No se pudo actualizar el documento." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para administrar conocimiento." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await getKnowledgeDocument(id);
  if (!existing) {
    return NextResponse.json({ error: "Documento no encontrado." }, { status: 404 });
  }

  await deleteKnowledgeDocument(id);
  return NextResponse.json({ deleted: true });
}

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { message: "error desconocido" };
}
