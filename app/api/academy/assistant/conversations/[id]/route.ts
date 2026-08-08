import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canUseAssistant,
} from "@/lib/assistant/auth";
import { getConversation, listConversationMessages } from "@/lib/assistant/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canUseAssistant(user)) {
    return NextResponse.json({ error: "Sesion invalida o expirada." }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await getConversation(user.UserId, id);
  if (!conversation) {
    return NextResponse.json({ error: "Conversacion no encontrada." }, { status: 404 });
  }

  const messages = await listConversationMessages(user.UserId, id);
  return NextResponse.json({ conversation, messages });
}
