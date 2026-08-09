"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Lock, PlayCircle, Award, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ProgressBar, Skeleton } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Badge";
import { MODULOS } from "@/lib/content/modulos";
import { useProgreso } from "@/lib/hooks/useProgreso";
import { cn } from "@/lib/utils";

export default function AcademiaIndex() {
  const { cargando, moduloCompletado, examenAprobado } = useProgreso();

  const total = MODULOS.length;
  const completados = MODULOS.filter((m) => moduloCompletado(m.id)).length;
  const pct = total ? Math.round((completados / total) * 100) : 0;

  // Desbloqueo secuencial: un módulo se abre si el anterior está completado.
  function desbloqueado(indice: number): boolean {
    if (indice === 0) return true;
    const previo = MODULOS[indice - 1];
    return moduloCompletado(previo.id);
  }

  return (
    <>
      <PageHeader
        titulo="Academia de ventas"
        descripcion="Avanza módulo por módulo. Completa el contenido y aprueba el examen para desbloquear el siguiente."
      />

      <div className="arca-card mb-6 p-4 sm:p-5">
        <div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
          <div className="min-w-0">
            <p className="text-label">Progreso general</p>
            <p className="mt-1 text-2xl">{pct}%</p>
          </div>
          <div className="flex min-w-0 items-center gap-2 text-[13px] text-[color:var(--color-text-muted)]">
            <GraduationCap size={16} />
            {completados} de {total} módulos completados
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar valor={pct} />
        </div>
        {pct === 100 && (
          <Link href="/certificacion" className="arca-btn arca-btn-brand mt-4 w-full sm:w-auto">
            <Award size={16} /> Ir a certificación
          </Link>
        )}
      </div>

      {cargando ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {MODULOS.map((m, i) => {
            const completo = moduloCompletado(m.id);
            const aprobado = examenAprobado(m.id);
            const abierto = desbloqueado(i);
            const Icono = completo ? CheckCircle2 : abierto ? Circle : Lock;

            const cuerpo = (
              <div
                className={cn(
                  "arca-card flex items-start gap-3 p-4 transition sm:gap-4",
                  abierto ? "hover:border-[color:var(--color-tertiary)]" : "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    completo
                      ? "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]"
                      : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]",
                  )}
                >
                  <Icono size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-[color:var(--color-text-muted)]">
                      Módulo {m.orden}
                    </span>
                    <Badge tono="neutral">{m.nivel}</Badge>
                    <span className="text-[11px] text-[color:var(--color-text-muted)]">{m.tiempo}</span>
                    {completo && <Badge tono="success">Completado</Badge>}
                    {m.tieneExamen && aprobado && <Badge tono="info">Examen aprobado</Badge>}
                  </div>
                  <h3 className="mt-1 break-words text-[15px] font-semibold text-[color:var(--color-text-primary)]">
                    {m.titulo}
                  </h3>
                  <p className="break-words text-[13px] leading-5 text-[color:var(--color-text-muted)]">{m.objetivo}</p>
                </div>
                {abierto && (
                  <PlayCircle size={22} className="mt-1 shrink-0 text-[color:var(--color-secondary)]" />
                )}
              </div>
            );

            return abierto ? (
              <Link key={m.id} href={`/academia/${m.id}`}>
                {cuerpo}
              </Link>
            ) : (
              <div key={m.id} title="Completa el módulo anterior para desbloquear">
                {cuerpo}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
