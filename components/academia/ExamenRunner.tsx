"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, XCircle, RotateCcw, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Skeleton, ProgressBar } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type Pregunta = {
  QuestionId: string;
  Tipo: string;
  Pregunta: string;
  Opciones: string;
  Puntaje: number;
};

type Detalle = { QuestionId: string; correcta: boolean; explicacion: string };
type Resultado = {
  puntaje: number;
  aprobado: boolean;
  minimo: number;
  detalle: Detalle[];
  guardado?: boolean;
  intentosRestantes: number | null;
};

function parseOpciones(raw: string, tipo: string): string[] {
  if (tipo === "vf") return ["Verdadero", "Falso"];
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p.map(String) : [];
  } catch {
    return raw.split("|").map((s) => s.trim()).filter(Boolean);
  }
}

export function ExamenRunner({
  moduleId,
  titulo,
  cantidad,
  minutos,
  volverHref,
  siguienteHref,
  siguienteLabel,
}: {
  moduleId: string;
  titulo: string;
  cantidad?: number;
  minutos?: number;
  volverHref: string;
  siguienteHref?: string;
  siguienteLabel?: string;
}) {
  const [preguntas, setPreguntas] = useState<Pregunta[] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [inicio, setInicio] = useState<number>(Date.now());
  const [restante, setRestante] = useState<number>((minutos || 0) * 60);
  const [intentosRestantes, setIntentosRestantes] = useState<number | null>(null);

  async function cargar() {
    setCargando(true);
    setError("");
    setResultado(null);
    setRespuestas({});
    const r = await api<{ preguntas: Pregunta[]; intentosRestantes: number | null; aprobado?: boolean }>("obtenerExamen", {
      moduleId,
      cantidad,
    });
    setCargando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setPreguntas(r.data.preguntas);
    setIntentosRestantes(r.data.intentosRestantes);
    setInicio(Date.now());
    setRestante((minutos || 0) * 60);
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  // Temporizador opcional.
  useEffect(() => {
    if (!minutos || resultado || !preguntas) return;
    if (restante <= 0) {
      enviar();
      return;
    }
    const t = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante, minutos, resultado, preguntas]);

  const totalRespondidas = useMemo(
    () => (preguntas ? preguntas.filter((p) => respuestas[p.QuestionId]).length : 0),
    [preguntas, respuestas],
  );

  async function enviar() {
    if (!preguntas) return;
    setEnviando(true);
    const duracion = Math.round((Date.now() - inicio) / 1000);
    const r = await api<Resultado>("enviarExamen", {
      moduleId,
      respuestas,
      duracion,
      fechaInicio: new Date(inicio).toISOString(),
    });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setResultado(r.data);
    setIntentosRestantes(r.data.intentosRestantes);
    if (r.data.aprobado && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("atria:progreso-actualizado", { detail: { moduleId } }));
    }
  }

  if (cargando) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="arca-card p-4 text-center sm:p-6">
        <AlertTriangle className="mx-auto text-[color:var(--color-warning)]" size={32} />
        <p className="mt-3 text-[14px] text-[color:var(--color-text-secondary)]">{error}</p>
        <Link href={volverHref} className="arca-btn arca-btn-secondary mt-4 w-full sm:w-auto">Volver</Link>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="space-y-5">
        <div
          className={cn(
            "arca-card p-4 text-center sm:p-6",
            resultado.aprobado ? "border-[color:var(--color-success)]" : "border-[color:var(--color-error)]",
          )}
        >
          {resultado.aprobado ? (
            <CheckCircle2 className="mx-auto text-[color:var(--color-success)]" size={44} />
          ) : (
            <XCircle className="mx-auto text-[color:var(--color-error)]" size={44} />
          )}
          <p className="mt-3 text-2xl">{resultado.puntaje}%</p>
          <p className="mt-1 text-[14px] text-[color:var(--color-text-muted)]">
            {resultado.aprobado
              ? "¡Aprobado! El examen quedó guardado en tu progreso."
              : `No alcanzaste el mínimo (${resultado.minimo}%).`}
          </p>
          {resultado.aprobado && (
            <p className="mt-2 text-[13px] font-medium text-[color:var(--color-success)]">
              Ya aparecerá como examen aprobado en Academia y Certificación.
            </p>
          )}
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
            {resultado.aprobado && siguienteHref ? (
              <Link href={siguienteHref} className="arca-btn arca-btn-brand w-full sm:w-auto">
                {siguienteLabel || "Continuar"} <ArrowRight size={16} />
              </Link>
            ) : null}
            {!resultado.aprobado && (resultado.intentosRestantes === null || resultado.intentosRestantes > 0) && (
              <Button className="w-full sm:w-auto" variant="secondary" onClick={cargar}>
                <RotateCcw size={16} />{" "}
                {resultado.intentosRestantes === null
                  ? "Reintentar"
                  : `Reintentar (${resultado.intentosRestantes} restantes)`}
              </Button>
            )}
            <Link href={volverHref} className="arca-btn arca-btn-ghost w-full sm:w-auto">Volver</Link>
          </div>
        </div>

        {/* Retroalimentación */}
        <div className="space-y-3">
          {preguntas!.map((p, i) => {
            const det = resultado.detalle.find((d) => d.QuestionId === p.QuestionId);
            return (
              <div key={p.QuestionId} className="arca-card p-4">
                <div className="flex items-start gap-2">
                  {det?.correcta ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[color:var(--color-success)]" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 shrink-0 text-[color:var(--color-error)]" />
                  )}
                  <div className="min-w-0">
                    <p className="break-words text-[14px] font-medium">{i + 1}. {p.Pregunta}</p>
                    <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
                      Tu respuesta: {respuestas[p.QuestionId] || "—"}
                    </p>
                    {det?.explicacion && (
                      <p className="mt-1 break-words text-[13px] text-[color:var(--color-text-secondary)]">
                        <span className="font-medium">Explicación:</span> {det.explicacion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!preguntas || preguntas.length === 0) {
    return (
      <div className="arca-card p-4 text-center sm:p-6">
        <p className="text-[14px] text-[color:var(--color-text-secondary)]">
          Este examen aún no tiene preguntas cargadas.
        </p>
        <Link href={volverHref} className="arca-btn arca-btn-secondary mt-4 w-full sm:w-auto">Volver</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="arca-card flex flex-col gap-3 p-4 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
        <div className="min-w-0">
          <p className="break-words text-[14px] font-semibold">{titulo}</p>
          <p className="break-words text-[12px] text-[color:var(--color-text-muted)]">
            {totalRespondidas} de {preguntas.length} respondidas
            {intentosRestantes === null ? " · sin límite de intentos" : ` · ${intentosRestantes} intentos`}
          </p>
        </div>
        {minutos ? (
          <div className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium",
            restante < 60 ? "bg-[color:var(--color-error-bg)] text-[color:var(--color-error)]" : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]",
          )}>
            <Clock size={14} />
            {String(Math.floor(restante / 60)).padStart(2, "0")}:{String(restante % 60).padStart(2, "0")}
          </div>
        ) : null}
      </div>

      <div className="px-1">
        <ProgressBar valor={(totalRespondidas / preguntas.length) * 100} />
      </div>

      {preguntas.map((p, i) => {
        const opciones = parseOpciones(p.Opciones, p.Tipo);
        return (
          <div key={p.QuestionId} className="arca-card p-4 sm:p-5">
            <p className="break-words text-[15px] font-medium text-[color:var(--color-text-primary)]">
              {i + 1}. {p.Pregunta}
            </p>
            {p.Tipo === "abierta" ? (
              <Textarea
                className="mt-3"
                rows={3}
                value={respuestas[p.QuestionId] || ""}
                onChange={(e) => setRespuestas((r) => ({ ...r, [p.QuestionId]: e.target.value }))}
                placeholder="Escribe tu respuesta…"
              />
            ) : (
              <div className="mt-3 space-y-2">
                {opciones.map((op) => {
                  const sel = respuestas[p.QuestionId] === op;
                  return (
                    <label
                      key={op}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 text-[14px] transition",
                        sel
                          ? "border-[color:var(--color-tertiary)] bg-[color:var(--color-surface-2)]"
                          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]",
                      )}
                    >
                      <input
                        type="radio"
                        name={p.QuestionId}
                        checked={sel}
                        onChange={() => setRespuestas((r) => ({ ...r, [p.QuestionId]: op }))}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-secondary)]"
                      />
                      <span className="min-w-0 break-words">{op}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href={volverHref} className="arca-btn arca-btn-ghost w-full sm:w-auto">Cancelar</Link>
        <Button
          className="w-full sm:w-auto"
          variant="brand"
          onClick={enviar}
          loading={enviando}
          disabled={totalRespondidas < preguntas.length}
        >
          Enviar examen
        </Button>
      </div>
    </div>
  );
}
