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
  Aprobado: string | boolean;
};

export type EstadoAcademia = {
  progreso: ProgresoRow[];
  intentos: IntentoRow[];
};

const FINAL_ACADEMY_MODULE_ID = "mod15";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const actualizar = () => { void recargar(); };
    window.addEventListener("atria:progreso-actualizado", actualizar);
    return () => window.removeEventListener("atria:progreso-actualizado", actualizar);
  }, [recargar]);

  const esAprobado = (value: unknown) =>
    value === true || ["true", "1", "si", "sí"].includes(String(value).toLowerCase());

  const examenIdParaModulo = (moduleId: string) => moduleId === FINAL_ACADEMY_MODULE_ID ? "final" : moduleId;

  const examenAprobado = useCallback(
    (moduleId: string) =>
      data.intentos.some((a) => a.ModuleId === examenIdParaModulo(moduleId) && esAprobado(a.Aprobado)),
    [data.intentos],
  );

  const moduloCompletado = useCallback(
    (moduleId: string) =>
      data.progreso.some((p) => p.ModuleId === moduleId && p.Estado === "completado") ||
      data.intentos.some((a) => a.ModuleId === moduleId && moduleId !== "final" && esAprobado(a.Aprobado)),
    [data.progreso, data.intentos],
  );

  return { ...data, cargando, error, recargar, moduloCompletado, examenAprobado };
}
