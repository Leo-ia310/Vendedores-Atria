"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare, User, CheckCircle2, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Feedback";
import {
  type Escenario, type Opcion, type Criterio, CRITERIO_LABEL,
} from "@/lib/content/simulaciones";
import { cn } from "@/lib/utils";

type Turno = {
  cliente: string;
  eleccion: string;
  puntos: number;
  feedback?: string;
  respuestaCliente?: string;
};

export function SimuladorRunner({ escenario }: { escenario: Escenario }) {
  const { toast } = useToast();
  const [nodoId, setNodoId] = useState(escenario.inicio);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [obtenido, setObtenido] = useState(0);
  const [maxPosible, setMaxPosible] = useState(0);
  const [criterios, setCriterios] = useState<Set<Criterio>>(new Set());
  const [terminado, setTerminado] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const nodo = escenario.nodos[nodoId];

  const puntaje = useMemo(
    () => (maxPosible > 0 ? Math.round((obtenido / maxPosible) * 100) : 0),
    [obtenido, maxPosible],
  );

  async function elegir(op: Opcion) {
    if (!nodo) return;
    const maxDelNodo = Math.max(...nodo.opciones.map((o) => o.puntos));
    const nuevoObtenido = obtenido + op.puntos;
    const nuevoMax = maxPosible + maxDelNodo;
    const nuevosCriterios = new Set(criterios);
    op.criterios.forEach((c) => nuevosCriterios.add(c));

    setObtenido(nuevoObtenido);
    setMaxPosible(nuevoMax);
    setCriterios(nuevosCriterios);
    const turno: Turno = {
      cliente: nodo.cliente,
      eleccion: op.texto,
      puntos: op.puntos,
      feedback: op.feedback,
      respuestaCliente: op.respuestaCliente,
    };
    setTurnos((t) => [...t, turno]);

    if (op.siguiente === "fin" || !escenario.nodos[op.siguiente]) {
      const puntajeFinal = nuevoMax > 0 ? Math.round((nuevoObtenido / nuevoMax) * 100) : 0;
      setTerminado(true);
      const r = await api("enviarSimulacion", {
        escenario: escenario.id,
        puntaje: puntajeFinal,
        respuestas: [...turnos, turno],
        retroalimentacion: Array.from(nuevosCriterios).map((c) => CRITERIO_LABEL[c]).join(", "),
      });
      if (r.ok) {
        setGuardado(true);
        toast("Simulación registrada.", "success");
      } else {
        toast(r.error, "error");
      }
    } else {
      setNodoId(op.siguiente);
    }
  }

  function reiniciar() {
    setNodoId(escenario.inicio);
    setTurnos([]);
    setObtenido(0);
    setMaxPosible(0);
    setCriterios(new Set());
    setTerminado(false);
    setGuardado(false);
  }

  return (
    <div className="space-y-4">
      {/* Transcripción */}
      <div className="space-y-3">
        {turnos.map((t, i) => (
          <div key={i} className="space-y-2">
            <Burbuja lado="cliente" texto={t.cliente} />
            <Burbuja lado="tu" texto={t.eleccion} puntos={t.puntos} />
            {t.respuestaCliente && <Burbuja lado="cliente" texto={t.respuestaCliente} />}
            {t.feedback && (
              <p className={cn(
                "ml-10 text-[12px]",
                t.puntos >= 2 ? "text-[color:var(--color-success)]" : t.puntos === 0 ? "text-[color:var(--color-error)]" : "text-[color:var(--color-warning)]",
              )}>
                {t.feedback}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Nodo actual */}
      {!terminado && nodo && (
        <div className="arca-card p-5">
          <Burbuja lado="cliente" texto={nodo.cliente} />
          <p className="mt-4 text-label">Tu respuesta</p>
          <div className="mt-2 space-y-2">
            {nodo.opciones.map((op, i) => (
              <button
                key={i}
                type="button"
                onClick={() => elegir(op)}
                className="w-full rounded-md border border-[color:var(--color-border)] px-4 py-3 text-left text-[14px] text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-tertiary)] hover:bg-[color:var(--color-surface-2)]"
              >
                {op.texto}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultado */}
      {terminado && (
        <div className="arca-card border-[color:var(--color-tertiary)] p-6 text-center">
          <Trophy size={40} className="mx-auto text-[color:var(--color-secondary)]" />
          <p className="mt-3 text-2xl">{puntaje}%</p>
          <p className="mt-1 text-[14px] text-[color:var(--color-text-muted)]">
            {puntaje >= 80 ? "¡Excelente manejo de la conversación!" : puntaje >= 60 ? "Buen trabajo, hay detalles por pulir." : "Repasa los módulos y vuelve a intentarlo."}
          </p>

          <div className="mt-5">
            <p className="text-label">Criterios demostrados</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {(Object.keys(CRITERIO_LABEL) as Criterio[]).map((c) => (
                <Badge key={c} tono={criterios.has(c) ? "success" : "neutral"}>
                  {criterios.has(c) && <CheckCircle2 size={11} />} {CRITERIO_LABEL[c]}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" onClick={reiniciar}>
              <RotateCcw size={16} /> Repetir escenario
            </Button>
            <Link href="/simulador" className="arca-btn arca-btn-brand">
              Otros escenarios
            </Link>
          </div>
          {guardado && (
            <p className="mt-3 text-[12px] text-[color:var(--color-success)]">
              Esta simulación cuenta para tu certificación.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Burbuja({ lado, texto, puntos }: { lado: "cliente" | "tu"; texto: string; puntos?: number }) {
  const esCliente = lado === "cliente";
  return (
    <div className={cn("flex items-start gap-2", esCliente ? "" : "flex-row-reverse")}>
      <span className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        esCliente ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]" : "bg-[color:var(--color-tertiary-light)] text-[color:var(--color-primary)]",
      )}>
        {esCliente ? <User size={15} /> : <MessageSquare size={15} />}
      </span>
      <div className={cn(
        "max-w-[80%] rounded-[12px] px-4 py-2.5 text-[14px] leading-6",
        esCliente
          ? "rounded-tl-none bg-[color:var(--color-surface-2)] text-[color:var(--color-text-primary)]"
          : "rounded-tr-none bg-[color:var(--color-primary)] text-white",
      )}>
        {texto}
        {typeof puntos === "number" && (
          <span className="ml-2 text-[11px] opacity-70">+{puntos}</span>
        )}
      </div>
    </div>
  );
}
