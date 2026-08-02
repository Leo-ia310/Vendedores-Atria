"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Lee una tabla completa desde el backend (solo admin). */
export function useAdminData<T = Record<string, unknown>>(hoja: string) {
  const [filas, setFilas] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    const r = await api<T[]>("adminListar", { hoja });
    if (r.ok) { setFilas(r.data); setError(""); }
    else setError(r.error);
    setCargando(false);
  }, [hoja]);

  useEffect(() => { recargar(); }, [recargar]);

  return { filas, cargando, error, recargar };
}
