const BASE_URL = "/api/backend";
const TOKEN_KEY = "aca_atria_token";

export type ApiResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function api<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<ApiResult<T>> {
  const token = getToken();

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, token, payload }),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    const result = json as { ok?: boolean; data?: T; error?: string; code?: string } | null;

    if (result?.ok) return { ok: true, data: result.data as T };
    return {
      ok: false,
      error: result?.error || "Error desconocido del servidor.",
      code: result?.code || (res.status === 401 ? "NO_AUTORIZADO" : "ERROR"),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `No se pudo conectar con el servidor: ${error.message}`
          : "Error de red.",
      code: "NETWORK",
    };
  }
}

export async function cerrarSesion(): Promise<void> {
  try {
    await api("logout");
  } finally {
    setToken(null);
  }
}
