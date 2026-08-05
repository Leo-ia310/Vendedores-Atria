"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlayCircle, Check, Lightbulb, AlertTriangle, ListChecks, FileText, ClipboardCheck, ArrowRight, Download,
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
  const [checklistHecha, setChecklistHecha] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!m || typeof window === "undefined") return;
    try {
      const guardada = window.localStorage.getItem(`atria:checklist:${m.id}`);
      setChecklistHecha(guardada ? JSON.parse(guardada) : {});
    } catch {
      setChecklistHecha({});
    }
  }, [m?.id]);

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
  const checklistCompletada = m.checklist.filter((_, i) => checklistHecha[i]).length;

  function alternarChecklist(index: number) {
    const siguiente = { ...checklistHecha, [index]: !checklistHecha[index] };
    setChecklistHecha(siguiente);
    try {
      window.localStorage.setItem(`atria:checklist:${m!.id}`, JSON.stringify(siguiente));
    } catch {
      // El checklist sigue funcionando aunque el navegador bloquee localStorage.
    }
  }

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
          <section>
            <div className="overflow-hidden rounded-[8px] border border-[color:var(--color-border)] bg-black">
              {m.videoSrc ? (
                <video controls className="aspect-video w-full bg-black" preload="metadata" aria-label={m.video}>
                  <source src={m.videoSrc} type="video/mp4" />
                  Tu navegador no puede reproducir este video.
                </video>
              ) : (
                <div className="relative aspect-video w-full bg-[color:var(--color-primary)]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                    <PlayCircle size={44} className="text-white/85" />
                    <p className="px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
                      {m.video}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {m.videoSrc && (
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
                {m.video}
              </p>
            )}
          </section>
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-[color:var(--color-secondary)]" />
              <h2 className="text-[17px] font-semibold">Lista de verificación</h2>
            </div>
            <span className="text-[12px] font-medium text-[color:var(--color-text-muted)]">
              {checklistCompletada} de {m.checklist.length} verificados
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {m.checklist.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-pressed={Boolean(checklistHecha[i])}
                  onClick={() => alternarChecklist(i)}
                  className={`flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left text-[14px] transition ${
                    checklistHecha[i]
                      ? "bg-[color:var(--color-success-bg)] text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                    checklistHecha[i]
                      ? "border-[color:var(--color-success)] bg-[color:var(--color-success)] text-white"
                      : "border-[color:var(--color-border-strong)]"
                  }`}>
                    {checklistHecha[i] && <Check size={11} />}
                  </span>
                  <span className={checklistHecha[i] ? "line-through decoration-[color:var(--color-success)]/60" : ""}>
                    {c}
                  </span>
                </button>
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
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {m.recursos.map((r) => {
                if (typeof r === "string") {
                  return (
                    <span key={r} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-2 text-[13px] text-[color:var(--color-text-secondary)]">
                      {r} <span className="text-[color:var(--color-text-muted)]">· pendiente</span>
                    </span>
                  );
                }

                return (
                  <a
                    key={r.href}
                    href={r.href}
                    download
                    className="flex min-h-16 items-center justify-between gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-2 text-[13px] transition hover:border-[color:var(--color-secondary)] hover:bg-[color:var(--color-surface)]"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-[color:var(--color-text-primary)]">{r.titulo}</span>
                      {r.descripcion && (
                        <span className="mt-0.5 block text-[12px] text-[color:var(--color-text-muted)]">{r.descripcion}</span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[color:var(--color-secondary)]">
                      <Download size={14} /> {r.formato ?? "Descargar"}
                    </span>
                  </a>
                );
              })}
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
