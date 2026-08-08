"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import {
  SALES_DIFFICULTY_LABELS,
  SALES_SIMULATOR_SCENARIOS,
} from "@/lib/content/sales-scenarios";

export default function SimuladorIndex() {
  return (
    <>
      <PageHeader
        titulo="Simulador comercial"
        descripcion="Practica conversaciones reales de venta con clientes simulados. Escribe libremente, maneja objeciones y finaliza para recibir evaluacion. Necesitas al menos 3 para certificarte."
        breadcrumb={[{ label: "Academia", href: "/academia" }, { label: "Simulador" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {SALES_SIMULATOR_SCENARIOS.map((e) => (
          <Link
            key={e.id}
            href={`/simulador/${e.id}`}
            className="arca-card group p-5 transition hover:border-[color:var(--color-tertiary)]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[color:var(--color-surface-2)] text-[color:var(--color-secondary)]">
                <MessageSquare size={18} />
              </span>
              <Badge tono={e.difficultyLevel === "ADVANCED" ? "error" : e.difficultyLevel === "INTERMEDIATE" ? "warning" : "success"}>
                {SALES_DIFFICULTY_LABELS[e.difficultyLevel]}
              </Badge>
            </div>
            <h3 className="mt-4 text-[16px] font-semibold text-[color:var(--color-text-primary)]">{e.titulo}</h3>
            <p className="text-[12px] font-medium text-[color:var(--color-text-muted)]">{e.perfil}</p>
            <p className="mt-2 text-[13px] leading-6 text-[color:var(--color-text-secondary)]">{e.descripcion}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[color:var(--color-secondary)]">
              Practicar <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
