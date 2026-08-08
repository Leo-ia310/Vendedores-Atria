import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAssistantRequest,
  canManageKnowledge,
} from "@/lib/assistant/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await authenticateAssistantRequest(request);
  if (!user || !canManageKnowledge(user)) {
    return NextResponse.json({ error: "No tienes permiso para ver estas preguntas." }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin()
    .from("unanswered_questions")
    .select("*")
    .eq("resolved", false as never)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    return NextResponse.json({ error: "No se pudieron cargar las preguntas." }, { status: 500 });
  }

  return NextResponse.json({ questions: data || [] });
}
