import { NextResponse, type NextRequest } from "next/server";
import { runBackendAction } from "@/lib/backend/router";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    token?: string | null;
    payload?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "BAD_JSON", error: "Solicitud invalida." },
      { status: 400 },
    );
  }

  const result = await runBackendAction(
    String(body.action || ""),
    body.payload || {},
    body.token || null,
    {
      ip: forwardedIp(request),
      userAgent: request.headers.get("user-agent") || "",
    },
  );

  return NextResponse.json(result, {
    status: result.ok ? 200 : result.code === "NO_AUTORIZADO" ? 401 : 200,
  });
}

function forwardedIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
}
