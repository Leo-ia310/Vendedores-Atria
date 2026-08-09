"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  History,
  MessageCircle,
  RotateCcw,
  SendHorizontal,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { getToken } from "@/lib/api";
import { POPULAR_ASSISTANT_QUESTIONS } from "@/lib/assistant/suggestions";
import type {
  AssistantChatResponse,
  AssistantConfidence,
  AssistantConversation,
  AssistantMessage,
  AssistantRole,
  KnowledgeCategory,
  KnowledgeSource,
} from "@/lib/assistant/types";
import { cn, formatearFecha } from "@/lib/utils";

const MAX_CLIENT_QUESTION_CHARS = 1200;

type UIMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  sources: KnowledgeSource[];
  confidence?: AssistantConfidence;
  createdAt: string;
};

type ConversationListResponse = {
  conversations: AssistantConversation[];
};

type ConversationResponse = {
  conversation: AssistantConversation;
  messages: AssistantMessage[];
};

type ApiError = {
  error?: string;
};

export function InternalAssistant() {
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<AssistantConversation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function loadConversations() {
    setLoadingHistory(true);
    const response = await assistantFetch<ConversationListResponse>("/api/academy/assistant/conversations");
    setLoadingHistory(false);
    if (!response.ok) {
      setError(response.error);
      return;
    }
    setConversations(response.data.conversations);
  }

  async function loadConversation(id: string) {
    if (sending) return;
    const response = await assistantFetch<ConversationResponse>(`/api/academy/assistant/conversations/${id}`);
    if (!response.ok) {
      toast(response.error, "error");
      return;
    }
    setConversationId(response.data.conversation.id);
    setMessages(response.data.messages.map(toUIMessage));
    setError(null);
  }

  async function sendQuestion() {
    const question = input.trim();
    if (!question || sending) return;
    if (question.length > MAX_CLIENT_QUESTION_CHARS) {
      toast(`La pregunta supera ${MAX_CLIENT_QUESTION_CHARS} caracteres.`, "error");
      return;
    }

    const userMessage: UIMessage = {
      id: `local_${Date.now()}`,
      role: "user",
      content: question,
      sources: [],
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSending(true);
    setError(null);

    const response = await assistantFetch<AssistantChatResponse>("/api/academy/assistant/chat", {
      method: "POST",
      body: JSON.stringify({
        question,
        conversationId: conversationId || undefined,
      }),
    });

    setSending(false);

    if (!response.ok) {
      setError(response.error);
      toast(response.error, "error");
      return;
    }

    const assistantMessage: UIMessage = {
      id: response.data.message.id,
      role: "assistant",
      content: response.data.message.content,
      sources: response.data.sources,
      confidence: response.data.confidence,
      createdAt: new Date().toISOString(),
    };

    setConversationId(response.data.conversationId);
    setMessages((current) => [...current, assistantMessage]);
    void loadConversations();
  }

  function newChat() {
    if (sending) return;
    setConversationId(null);
    setMessages([]);
    setInput("");
    setError(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendQuestion();
    }
  }

  const canSend = Boolean(input.trim()) && !sending;

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="arca-card p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[color:var(--color-secondary)]" />
            <p className="text-[14px] font-semibold text-[color:var(--color-text-primary)]">Historial</p>
          </div>
          <Button variant="ghost" size="sm" onClick={newChat} disabled={sending}>
            <RotateCcw size={14} /> Nuevo
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {loadingHistory ? (
            [0, 1, 2].map((item) => <Skeleton key={item} className="h-11 w-full" />)
          ) : conversations.length === 0 ? (
            <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-3 text-[12px] text-[color:var(--color-text-muted)]">
              Aun no hay conversaciones guardadas.
            </p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => void loadConversation(conversation.id)}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-left transition",
                  conversationId === conversation.id
                    ? "border-[color:var(--color-tertiary)] bg-[color:var(--color-tertiary-light)]"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-tertiary)]",
                )}
              >
                <span className="block truncate text-[13px] font-medium text-[color:var(--color-text-primary)]">
                  {conversation.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-[color:var(--color-text-muted)]">
                  {formatearFecha(conversation.updatedAt)}
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="arca-card flex min-h-[680px] flex-col overflow-hidden">
        <div className="border-b border-[color:var(--color-border)] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold text-[color:var(--color-text-primary)]">Asistente Arca</p>
              <p className="mt-0.5 text-[13px] text-[color:var(--color-text-muted)]">
                Pregunta sobre producto, precios, ventas, objeciones, politicas o comisiones.
              </p>
            </div>
            <Badge tono="info">Base oficial</Badge>
          </div>

          {messages.length === 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_ASSISTANT_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => setInput(question)}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-2 text-left text-[12px] text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-tertiary)]"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              titulo="Haz tu primera pregunta"
              descripcion="El asistente responde solo con informacion recuperada de la base oficial."
            />
          ) : (
            messages.map((message) => <AssistantBubble key={message.id} message={message} />)
          )}

          {sending && (
            <div className="flex items-center gap-2 text-[13px] text-[color:var(--color-text-muted)]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--color-tertiary)] border-t-transparent" />
              Buscando en la base oficial...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="mx-4 mb-3 rounded-md border border-[color:var(--color-error)] bg-[color:var(--color-error-bg)] px-3 py-2 text-[13px] text-[color:var(--color-error)] sm:mx-5">
            {error}
          </div>
        )}

        <div className="border-t border-[color:var(--color-border)] px-4 py-4 sm:px-5">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            className="min-h-[90px]"
            maxLength={MAX_CLIENT_QUESTION_CHARS}
            disabled={sending}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-[color:var(--color-text-muted)]">
              Enter envia. Shift+Enter agrega una linea.
            </span>
            <Button onClick={() => void sendQuestion()} loading={sending} disabled={!canSend}>
              <SendHorizontal size={16} /> Enviar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function AssistantBubble({ message }: { message: UIMessage }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={cn("flex items-start gap-2", isAssistant ? "" : "flex-row-reverse")}>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant
            ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-secondary)]"
            : "bg-[color:var(--color-tertiary-light)] text-[color:var(--color-primary)]",
        )}
      >
        {isAssistant ? <Bot size={15} /> : <User size={15} />}
      </span>
      <div
        className={cn(
          "max-w-[min(88%,760px)] whitespace-pre-wrap break-words rounded-[12px] px-4 py-2.5 text-[14px] leading-6",
          isAssistant
            ? "rounded-tl-none bg-[color:var(--color-surface-2)] text-[color:var(--color-text-primary)]"
            : "rounded-tr-none bg-[color:var(--color-primary)] text-white",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function toUIMessage(message: AssistantMessage): UIMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    sources: message.sources,
    confidence: message.confidence,
    createdAt: message.createdAt,
  };
}

async function assistantFetch<T>(
  url: string,
  init: RequestInit = {},
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const token = getToken();
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });

    const json = await response.json().catch(() => null) as (T & ApiError) | null;
    if (!response.ok) {
      return { ok: false, error: json?.error || "No se pudo completar la solicitud." };
    }
    return { ok: true, data: json as T };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? `No se pudo conectar: ${error.message}` : "Error de red.",
    };
  }
}

export const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  product: "Producto",
  pricing: "Precios",
  sales: "Ventas",
  competition: "Competencia",
  policies: "Politicas",
  sellers: "Vendedores",
  faq: "FAQ",
  general: "General",
};
