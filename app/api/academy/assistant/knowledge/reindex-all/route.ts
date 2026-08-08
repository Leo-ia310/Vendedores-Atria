import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canManageKnowledge,
} from "@/lib/assistant/auth";
import { reindexKnowledgeDocument } from "@/lib/assistant/indexing";
import { listKnowledgeDocuments } from "@/lib/assistant/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para administrar conocimiento." }, { status: 403 });
  }

  const documents = await listKnowledgeDocuments();
  let chunksIndexed = 0;
  let documentsIndexed = 0;

  for (const document of documents) {
    if (document.status !== "active") continue;
    chunksIndexed += await reindexKnowledgeDocument(document);
    documentsIndexed += 1;
  }

  return NextResponse.json({ documentsIndexed, chunksIndexed });
}
