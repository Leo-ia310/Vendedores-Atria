import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canUseAssistant,
} from "@/lib/assistant/auth";
import { listConversations } from "@/lib/assistant/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canUseAssistant(user)) {
    return NextResponse.json({ error: "Sesion invalida o expirada." }, { status: 401 });
  }

  const conversations = await listConversations(user.UserId);
  return NextResponse.json({ conversations });
}
