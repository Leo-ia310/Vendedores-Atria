import "server-only";

import type { NextRequest } from "next/server";
import { verificarSesion, type AuthenticatedBackendUser } from "@/lib/backend/router";

export async function authenticateAssistantRequest(
  request: NextRequest,
  body?: unknown,
): Promise<AuthenticatedBackendUser | null> {
  return verificarSesion(readToken(request, body));
}

export function canUseAssistant(user: AuthenticatedBackendUser): boolean {
  return ["candidato", "vendedor", "admin"].includes(user.Rol);
}

export function canManageKnowledge(user: AuthenticatedBackendUser): boolean {
  return user.Rol === "admin";
}

function readToken(request: NextRequest, body: unknown): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice("Bearer ".length).trim();
  if (isRecord(body) && typeof body.token === "string") return body.token;
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
