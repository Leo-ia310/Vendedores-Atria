"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlayCircle, Check, Lightbulb, AlertTriangle, ListChecks, FileText, ClipboardCheck, ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Feedback";
import { getModulo } from "@/lib/content/modulos";
import { api } from "@/lib/api";
import { useProgreso } from "@/lib/hooks/useProgreso";

export default function ModuloPage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = use(params);
  const m = getModulo(modulo);
  const router = useRouter();
  const { toast } = useToast();
  const { moduloCompletado, recargar } = useProgreso();
  const [guardando, setGuardando] = useState(false);

  if (!m) {
    return (
      <div className="arca-card p-8 text-center">
        <p>Módulo no encontrado.</p>
        <Link href="/academia" className="arca-btn arca-btn-secondary mt-4">Volver a la academia</Link>
      </div>
    );
  }

  const completo = moduloCompletado(m.id);
  const esFinal = m.id === "mod15";

  async function marcarCompletado() {
    setGuardando(true);
    const r = await api("guardarProgreso", { moduleId: m!.id, porcentaje: 100, estado: "completado" });
    setGuardando(false);
    if (!r.ok) return toast(r.error, "error");
    await recargar();
    toast("Módulo marcado como completado.", "success");
  }

  return (
    <>
      <PageHeader
        titulo={m.titulo}
        descripcion={m.objetivo}
        breadcrumb={[{ label: "Academia", href: "/academia" }, { label: `Módulo ${m.orden}` }]}
        accion={
          <div className="flex items-center gap-2">
            <Badge tono="neutral">{m.nivel}</Badge>
            <Badge tono="neutral">{m.tiempo}</Badge>
            {completo && <Badge tono="success">Completado</Badge>}
          </div>
        }
      />

      <article className="space-y-6">
        <p className="text-[15px] leading-7 text-[color:var(--color-text-secondary)]">{m.intro}</p>

        {m.video && (
          <div className="relative aspect-video w-full overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-primary)]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <PlayCircle size={44} className="text-white/85" />
              <p className="px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {m.video}
              </p>
            </div>
          </div>
        )}

        {m.secciones.map((s) => (
          <section key={s.h} className="arca-card p-5">
            <h2 className="text-[17px] font-semibold text-[color:var(--color-text-primary)]">{s.h}</h2>
            <div className="mt-2 space-y-2">
              {s.p.map((p, i) => (
                <p key={i} className="text-[14px] leading-7 text-[color:var(--color-text-secondary)]">{p}</p>
              ))}
            </div>
            {s.lista && (
              <ul className="mt-3 space-y-2">
                {s.lista.map((li, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[color:var(--color-text-secondary)]">
                    <Check size={16} className="mt-0.5 shrink-0 text-[color:var(--color-tertiary)]" />
                    {li}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {m.ejemplos && (
          <Bloque icon={Lightbulb} tono="info" titulo="Ejemplos prácticos" items={m.ejemplos} />
        )}
        {m.erroresComunes && (
          <Bloque icon={AlertTriangle} tono="warning" titulo="Errores comunes" items={m.erroresComunes} />
        )}

        <section className="arca-card p-5">
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-[color:var(--color-secondary)]" />
            <h2 className="text-[17px] font-semibold">Resumen</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {m.resumen.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-[color:var(--color-text-secondary)]">
                <Check size={16} className="mt-0.5 shrink-0 text-[color:var(--color-success)]" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="arca-card p-5">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-[color:var(--color-secondary)]" />
            <h2 className="text-[17px] font-semibold">Lista de verificación</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {m.checklist.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-[color:var(--color-text-secondary)]">
                <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-[3px] border border-[color:var(--color-border-strong)]" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        {m.recursos && (
          <section className="arca-card p-5">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[color:var(--color-secondary)]" />
              <h2 className="text-[17px] font-semibold">Recursos descargables</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.recursos.map((r) => (
                <span key={r} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
                  {r} <span className="text-[color:var(--color-text-muted)]">· pendiente</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button variant={completo ? "secondary" : "primary"} onClick={marcarCompletado} loading={guardando}>
            <Check size={16} /> {completo ? "Módulo completado" : "Marcar como completado"}
          </Button>

          {m.tieneExamen && (
            esFinal ? (
              <Link href="/examen-final" className="arca-btn arca-btn-brand">
                Ir al examen final <ArrowRight size={16} />
              </Link>
            ) : (
              <Link href={`/academia/${m.id}/examen`} className="arca-btn arca-btn-brand">
                Presentar examen del módulo <ArrowRight size={16} />
              </Link>
            )
          )}
        </div>
      </article>
    </>
  );
}

function Bloque({
  icon: Icon,
  tono,
  titulo,
  items,
}: {
  icon: typeof Lightbulb;
  tono: "info" | "warning";
  titulo: string;
  items: string[];
}) {
  const clase =
    tono === "info"
      ? "border-[color:var(--color-info)]/30 bg-[color:var(--color-info-bg)]"
      : "border-[color:var(--color-warning)]/30 bg-[color:var(--color-warning-bg)]";
  const color = tono === "info" ? "var(--color-info)" : "var(--color-warning)";
  return (
    <section className={`rounded-[12px] border p-5 ${clase}`}>
      <div className="flex items-center gap-2">
        <Icon size={18} style={{ color }} />
        <h2 className="text-[16px] font-semibold" style={{ color }}>{titulo}</h2>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-[14px] leading-6 text-[color:var(--color-text-secondary)]">• {it}</li>
        ))}
      </ul>
    </section>
  );
}
