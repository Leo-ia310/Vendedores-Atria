"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, setToken, cerrarSesion as apiCerrarSesion } from "@/lib/api";

export type Rol = "candidato" | "vendedor" | "admin";

export type Usuario = {
  userId: string;
  candidateId: string;
  email: string;
  rol: Rol;
  debeCambiarPassword: boolean;
  onboardingCompletado: boolean;
};

type SesionCtx = {
  usuario: Usuario | null;
  cargando: boolean;
  refrescar: () => Promise<void>;
  entrar: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  salir: () => Promise<void>;
  setUsuario: (u: Usuario | null) => void;
};

const Ctx = createContext<SesionCtx | null>(null);

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return c;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const refrescar = useCallback(async () => {
    const r = await api<{ usuario: Usuario }>("sesionActual");
    if (r.ok) setUsuario(r.data.usuario);
    else setUsuario(null);
    setCargando(false);
  }, []);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  const entrar = useCallback(
    async (email: string, password: string) => {
      const r = await api<{ token: string; usuario: Usuario; debeCambiarPassword: boolean }>(
        "login",
        { email, password },
      );
      if (!r.ok) return { ok: false, error: r.error };
      setToken(r.data.token);
      setUsuario(r.data.usuario);
      return { ok: true };
    },
    [],
  );

  const salir = useCallback(async () => {
    await apiCerrarSesion();
    setUsuario(null);
    router.push("/login");
  }, [router]);

  return (
    <Ctx.Provider value={{ usuario, cargando, refrescar, entrar, salir, setUsuario }}>
      {children}
    </Ctx.Provider>
  );
}

/** Devuelve la ruta del panel según el rol. */
export function rutaPorRol(u: Usuario | null): string {
  if (!u) return "/login";
  if (u.debeCambiarPassword) return "/cambiar-password";
  if (u.rol === "candidato" && !u.onboardingCompletado) return "/onboarding";
  if (u.rol === "admin") return "/admin";
  if (u.rol === "vendedor") return "/panel";
  return "/academia";
}
