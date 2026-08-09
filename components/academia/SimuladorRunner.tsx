"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ClipboardCheck,
  MessageSquare,
  RotateCcw,
  SendHorizontal,
  Trophy,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Feedback";
import { getToken } from "@/lib/api";
import {
  DEFAULT_MAX_SELLER_MESSAGE_CHARS,
  SALES_EVALUATION_CATEGORY_LABELS,
  type SalesConversationMessage,
  type SalesEvaluation,
  type SalesEvaluationCategories,
} from "@/lib/ai/sales-types";
import {
  SALES_DIFFICULTY_LABELS,
  type SalesSimulatorScenario,
} from "@/lib/content/sales-scenarios";
import { cn } from "@/lib/utils";

type ChatResponse = {
  reply?: string;
  error?: string;
  warning?: string;
  fallback?: boolean;
};

type EvaluationResponse = {
  simulationId?: string;
  evaluation?: SalesEvaluation;
  error?: string;
  warning?: string;
  fallback?: boolean;
};

export function SimuladorRunner({ escenario }: { escenario: SalesSimulatorScenario }) {
  const { toast } = useToast();
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [messages, setMessages] = useState<SalesConversationMessage[]>(() => [
    {
      role: "client",
      content: initialClientMessage(escenario),
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [responding, setResponding] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [evaluation, setEvaluation] = useState<SalesEvaluation | null>(null);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (escenario.suggestedResponses.length > 0) return escenario.suggestedResponses;
    return escenario.nodos[escenario.inicio]?.opciones.map((opcion) => opcion.texto).slice(0, 3) || [];
  }, [escenario]);

  const hasSellerMessages = messages.some((message) => message.role === "seller");
  const isFinished = Boolean(evaluation);
  const canSend = !responding && !finishing && !isFinished;
  const showSuggestions = canSend && escenario.difficultyLevel !== "ADVANCED" && suggestions.length > 0;

  async function sendMessage() {
    const content = input.trim();
    if (!content) {
      toast("Escribe una respuesta para el cliente.", "error");
      return;
    }
    if (content.length > DEFAULT_MAX_SELLER_MESSAGE_CHARS) {
      toast(`Tu mensaje supera ${DEFAULT_MAX_SELLER_MESSAGE_CHARS} caracteres. Hazlo mas concreto.`, "error");
      return;
    }
    if (!canSend) return;

    const sellerMessage: SalesConversationMessage = {
      role: "seller",
      content,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, sellerMessage];

    setMessages(nextMessages);
    setInput("");
    setResponding(true);
    setWarning(null);

    const response = await postSimulator<ChatResponse>("/api/academy/simulator/chat", {
      scenarioId: escenario.id,
      messages: nextMessages,
    });

    setResponding(false);

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    if (!response.data.reply) {
      toast("El cliente no devolvio respuesta. Intenta de nuevo.", "error");
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "client",
        content: response.data.reply || "",
        createdAt: new Date().toISOString(),
      },
    ]);

    if (response.data.warning) {
      setWarning(response.data.warning);
      toast(response.data.warning, response.data.fallback ? "info" : "error");
    }
  }

  async function finishSimulation() {
    if (!hasSellerMessages) {
      toast("Responde al cliente al menos una vez antes de finalizar.", "error");
      return;
    }
    if (finishing || responding || isFinished) return;

    setFinishing(true);
    setWarning(null);

    const response = await postSimulator<EvaluationResponse>("/api/academy/simulator/evaluate", {
      scenarioId: escenario.id,
      messages,
      startedAt,
    });

    setFinishing(false);

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    if (!response.data.evaluation) {
      toast("No se pudo generar la evaluacion.", "error");
      return;
    }

    setEvaluation(response.data.evaluation);
    setSimulationId(response.data.simulationId || null);
    toast("Simulacion registrada.", "success");

    if (response.data.warning) {
      setWarning(response.data.warning);
      toast(response.data.warning, "info");
    }
  }

  function restart() {
    setStartedAt(new Date().toISOString());
    setMessages([
      {
        role: "client",
        content: initialClientMessage(escenario),
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput("");
    setResponding(false);
    setFinishing(false);
    setEvaluation(null);
    setSimulationId(null);
    setWarning(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="space-y-4">
      <div className="arca-card flex flex-col gap-3 p-4 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
        <div className="min-w-0">
          <p className="text-label">Escenario activo</p>
          <p className="mt-1 break-words text-[14px] font-semibold text-[color:var(--color-text-primary)]">
            {escenario.aiProfile.businessType} · {escenario.aiProfile.currentSystem}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tono={escenario.difficultyLevel === "ADVANCED" ? "error" : escenario.difficultyLevel === "INTERMEDIATE" ? "warning" : "success"}>
            {SALES_DIFFICULTY_LABELS[escenario.difficultyLevel]}
          </Badge>
          <Badge tono="neutral">{escenario.aiProfile.employees} empleados</Badge>
        </div>
      </div>

      {warning && (
        <div className="flex items-start gap-2 rounded-md border border-[color:var(--color-warning)] bg-[color:var(--color-warning-bg)] px-3 py-2 text-[13px] text-[color:var(--color-warning)]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      <div className="arca-card p-4 sm:p-5">
        <div className="max-h-[55dvh] min-h-[260px] space-y-3 overflow-y-auto pr-1 sm:min-h-[320px]">
          {messages.map((message, index) => (
            <Burbuja
              key={`${message.role}-${index}-${message.createdAt || ""}`}
              lado={message.role === "client" ? "cliente" : "tu"}
              texto={message.content}
            />
          ))}
          {responding && (
            <div className="flex items-center gap-2 text-[13px] text-[color:var(--color-text-muted)]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--color-tertiary)] border-t-transparent" />
              El cliente esta respondiendo...
            </div>
          )}
        </div>

        {!isFinished && (
          <div className="mt-5 space-y-3 border-t border-[color:var(--color-border)] pt-4">
            {showSuggestions && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInput(suggestion)}
                    className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-2 text-left text-[12px] text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-tertiary)] min-[520px]:w-auto"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <label className="block">
              <span className="text-label">Tu respuesta</span>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                className="arca-textarea mt-2 min-h-[86px] resize-y"
                placeholder="Escribe como vendedor..."
                disabled={!canSend}
                maxLength={DEFAULT_MAX_SELLER_MESSAGE_CHARS}
              />
            </label>

            <div className="flex flex-col gap-2 min-[520px]:flex-row min-[520px]:justify-between">
              <div className="flex flex-col gap-2 min-[520px]:flex-row min-[520px]:flex-wrap">
                <Button className="w-full min-[520px]:w-auto" onClick={sendMessage} loading={responding} disabled={!input.trim() || !canSend}>
                  <SendHorizontal size={16} /> Enviar
                </Button>
                <Button className="w-full min-[520px]:w-auto" variant="secondary" onClick={finishSimulation} loading={finishing} disabled={!hasSellerMessages || responding || finishing}>
                  <ClipboardCheck size={16} /> Finalizar simulacion
                </Button>
              </div>
              <Button className="w-full min-[520px]:w-auto" variant="ghost" onClick={restart} disabled={responding || finishing}>
                <RotateCcw size={16} /> Reiniciar
              </Button>
            </div>
          </div>
        )}
      </div>

      {evaluation && (
        <EvaluationResult
          evaluation={evaluation}
          saved={Boolean(simulationId)}
          onRestart={restart}
        />
      )}
    </div>
  );
}

function EvaluationResult({
  evaluation,
  saved,
  onRestart,
}: {
  evaluation: SalesEvaluation;
  saved: boolean;
  onRestart: () => void;
}) {
  return (
    <div className="arca-card border-[color:var(--color-tertiary)] p-4 sm:p-6">
      <div className="text-center">
        <Trophy size={40} className="mx-auto text-[color:var(--color-secondary)]" />
        <p className="mt-3 text-2xl">{evaluation.score}%</p>
        <p className="mt-1 text-[14px] text-[color:var(--color-text-muted)]">
          {evaluation.summary || "Evaluacion completada."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {(Object.keys(SALES_EVALUATION_CATEGORY_LABELS) as (keyof SalesEvaluationCategories)[]).map((key) => (
          <div key={key} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-3">
            <p className="text-[11px] font-semibold uppercase text-[color:var(--color-text-muted)]">
              {SALES_EVALUATION_CATEGORY_LABELS[key]}
            </p>
            <p className="mt-1 text-[18px] font-semibold text-[color:var(--color-text-primary)]">
              {evaluation.categories[key]}/20
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <FeedbackList titulo="Fortalezas" items={evaluation.strengths} />
        <FeedbackList titulo="Errores" items={evaluation.mistakes} />
        <FeedbackList titulo="Oportunidades" items={evaluation.improvementOpportunities} />
        <div>
          <p className="text-label">Recomendacion</p>
          <p className="mt-2 text-[13px] leading-6 text-[color:var(--color-text-secondary)]">
            {evaluation.recommendation || "Refuerza diagnostico, manejo de objeciones y siguiente paso."}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4">
        <p className="text-label">Respuesta mejor sugerida</p>
        <p className="mt-2 text-[13px] leading-6 text-[color:var(--color-text-secondary)]">
          {evaluation.betterResponseExample || "Haz una pregunta concreta sobre el dolor principal antes de presentar el producto."}
        </p>
      </div>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
        <Button className="w-full sm:w-auto" variant="secondary" onClick={onRestart}>
          <RotateCcw size={16} /> Repetir escenario
        </Button>
        <Link href="/simulador" className="arca-btn arca-btn-brand w-full sm:w-auto">
          Otros escenarios
        </Link>
      </div>
      {saved && (
        <p className="mt-3 text-center text-[12px] text-[color:var(--color-success)]">
          Esta simulacion cuenta para tu certificacion.
        </p>
      )}
    </div>
  );
}

function FeedbackList({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="text-label">{titulo}</p>
      <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[color:var(--color-text-secondary)]">
        {(items.length ? items : ["Sin observaciones."]).map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function Burbuja({ lado, texto }: { lado: "cliente" | "tu"; texto: string }) {
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
        "max-w-[calc(100%_-_2.5rem)] whitespace-pre-wrap break-words rounded-[12px] px-3 py-2.5 text-[14px] leading-6 sm:max-w-[min(85%,680px)] sm:px-4",
        esCliente
          ? "rounded-tl-none bg-[color:var(--color-surface-2)] text-[color:var(--color-text-primary)]"
          : "rounded-tr-none bg-[color:var(--color-primary)] text-white",
      )}>
        {texto}
      </div>
    </div>
  );
}

function initialClientMessage(escenario: SalesSimulatorScenario): string {
  return escenario.nodos[escenario.inicio]?.cliente || "Hola, cuenteme que quiere mostrarme.";
}

async function postSimulator<T>(
  url: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const token = getToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const json = await response.json().catch(() => null) as T & { error?: string } | null;
    if (!response.ok) {
      return { ok: false, error: json?.error || "No se pudo completar la solicitud." };
    }
    return { ok: true, data: json as T };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error
        ? `No se pudo conectar con el servidor: ${error.message}`
        : "Error de red.",
    };
  }
}
