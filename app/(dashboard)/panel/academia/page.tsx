"use client";

import Link from "next/link";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Feedback";
import { MODULOS } from "@/lib/content/modulos";
import { useProgreso } from "@/lib/hooks/useProgreso";

export default function PanelAcademia() {
  const { cargando, moduloCompletado, examenAprobado } = useProgreso();

  return (
    <>
      <PageHeader
        titulo="Academia"
        descripcion="Repasa cualquier módulo cuando quieras. Aquí también verás cursos y actualizaciones nuevas."
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : (
        <div className="space-y-2">
          {MODULOS.map((m) => {
            const completo = moduloCompletado(m.id);
            return (
              <Link
                key={m.id}
                href={`/academia/${m.id}`}
                className="arca-card flex items-center gap-3 p-3.5 transition hover:border-[color:var(--color-tertiary)]"
              >
                {completo ? (
                  <CheckCircle2 size={18} className="text-[color:var(--color-success)]" />
                ) : (
                  <Circle size={18} className="text-[color:var(--color-text-muted)]" />
                )}
                <BookOpen size={16} className="text-[color:var(--color-text-muted)]" />
                <span className="flex-1 text-[14px] font-medium">{m.titulo}</span>
                {examenAprobado(m.id) && <Badge tono="info">Examen aprobado</Badge>}
                <span className="text-[12px] text-[color:var(--color-text-muted)]">{m.tiempo}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
