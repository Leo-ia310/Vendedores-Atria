"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export type ProgresoRow = {
  ModuleId: string;
  Estado: string;
  Porcentaje: number;
};
export type IntentoRow = {
  ModuleId: string;
  Puntaje: number;
  Aprobado: string;
};

export type EstadoAcademia = {
  progreso: ProgresoRow[];
  intentos: IntentoRow[];
};

export function useProgreso() {
  const [data, setData] = useState<EstadoAcademia>({ progreso: [], intentos: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    const r = await api<EstadoAcademia>("obtenerProgreso");
    if (r.ok) {
      setData({ progreso: r.data.progreso || [], intentos: r.data.intentos || [] });
      setError("");
    } else {
      setError(r.error);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const moduloCompletado = useCallback(
    (moduleId: string) =>
      data.progreso.some((p) => p.ModuleId === moduleId && p.Estado === "completado"),
    [data.progreso],
  );

  const examenAprobado = useCallback(
    (moduleId: string) =>
      data.intentos.some((a) => a.ModuleId === moduleId && String(a.Aprobado) === "true"),
    [data.intentos],
  );

  return { ...data, cargando, error, recargar, moduloCompletado, examenAprobado };
}
