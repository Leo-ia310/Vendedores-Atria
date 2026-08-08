import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canManageKnowledge,
} from "@/lib/assistant/auth";
import { reindexKnowledgeDocument } from "@/lib/assistant/indexing";
import { getKnowledgeDocument } from "@/lib/assistant/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para administrar conocimiento." }, { status: 403 });
  }

  const { id } = await params;
  const document = await getKnowledgeDocument(id);
  if (!document) {
    return NextResponse.json({ error: "Documento no encontrado." }, { status: 404 });
  }

  try {
    const chunksIndexed = await reindexKnowledgeDocument(document);
    return NextResponse.json({ chunksIndexed });
  } catch (error) {
    console.error("[assistant-knowledge-reindex]", safeError(error), { userId: user.UserId, documentId: id });
    return NextResponse.json({ error: "No se pudo reindexar el documento." }, { status: 500 });
  }
}

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { message: "error desconocido" };
}
