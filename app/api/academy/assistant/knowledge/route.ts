import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canManageKnowledge,
} from "@/lib/assistant/auth";
import { reindexKnowledgeDocument } from "@/lib/assistant/indexing";
import {
  createKnowledgeDocument,
  listKnowledgeDocuments,
} from "@/lib/assistant/store";
import { parseKnowledgeDocumentBody, ValidationError } from "@/lib/assistant/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para administrar conocimiento." }, { status: 403 });
  }

  const documents = await listKnowledgeDocuments();
  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
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
    const input = parseKnowledgeDocumentBody(body);
    const document = await createKnowledgeDocument(input, user.UserId);
    const chunksIndexed = await reindexKnowledgeDocument(document);
    return NextResponse.json({ document, chunksIndexed });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("[assistant-knowledge-create]", safeError(error), { userId: user.UserId });
    return NextResponse.json({ error: "No se pudo guardar el documento." }, { status: 500 });
  }
}

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { message: "error desconocido" };
}
