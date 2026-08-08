"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Check,
  FileText,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { Modal } from "@/components/ui/Modal";
import { getToken } from "@/lib/api";
import type {
  KnowledgeCategory,
  KnowledgeDocument,
  KnowledgeStatus,
} from "@/lib/assistant/types";
import { formatearFecha } from "@/lib/utils";

const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  product: "Producto",
  pricing: "Precios",
  sales: "Ventas",
  competition: "Competencia",
  policies: "Politicas",
  sellers: "Vendedores",
  faq: "FAQ",
  general: "General",
};

const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  draft: "Borrador",
  active: "Activo",
  inactive: "Inactivo",
  archived: "Archivado",
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as KnowledgeCategory[];
const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as KnowledgeStatus[];

type KnowledgeListResponse = {
  documents: KnowledgeDocument[];
};

type KnowledgeSaveResponse = {
  document: KnowledgeDocument;
  chunksIndexed?: number;
};

type ReindexResponse = {
  chunksIndexed: number;
};

type ReindexAllResponse = {
  documentsIndexed: number;
  chunksIndexed: number;
};

type UnansweredQuestion = {
  id: string;
  user_id: string;
  question: string;
  category?: string;
  notes?: string;
  created_at: string;
  resolved: boolean;
  resolution_document_id?: string;
};

type UnansweredResponse = {
  questions: UnansweredQuestion[];
};

type KnowledgeForm = {
  id?: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string;
  status: KnowledgeStatus;
  priority: number;
  official: boolean;
  validFrom: string;
  validUntil: string;
};

type ApiError = {
  error?: string;
};

const EMPTY_FORM: KnowledgeForm = {
  title: "",
  content: "",
  category: "general",
  tags: "",
  status: "draft",
  priority: 50,
  official: true,
  validFrom: "",
  validUntil: "",
};

export function KnowledgeAdmin() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<KnowledgeForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [reindexingAll, setReindexingAll] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  const activeCount = useMemo(
    () => documents.filter((document) => document.status === "active").length,
    [documents],
  );

  async function loadData() {
    setLoading(true);
    const [docsResponse, unansweredResponse] = await Promise.all([
      adminFetch<KnowledgeListResponse>("/api/academy/assistant/knowledge"),
      adminFetch<UnansweredResponse>("/api/academy/assistant/unanswered"),
    ]);
    setLoading(false);

    if (!docsResponse.ok) {
      toast(docsResponse.error, "error");
    } else {
      setDocuments(docsResponse.data.documents);
    }

    if (!unansweredResponse.ok) {
      toast(unansweredResponse.error, "error");
    } else {
      setUnanswered(unansweredResponse.data.questions);
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(document: KnowledgeDocument) {
    setForm({
      id: document.id,
      title: document.title,
      content: document.content,
      category: document.category,
      tags: document.tags.join(", "),
      status: document.status,
      priority: document.priority,
      official: document.official,
      validFrom: toDateInput(document.validFrom),
      validUntil: toDateInput(document.validUntil),
    });
    setModalOpen(true);
  }

  async function saveDocument() {
    if (!form.title.trim() || !form.content.trim()) {
      toast("Titulo y contenido son obligatorios.", "error");
      return;
    }

    setSaving(true);
    const method = form.id ? "PATCH" : "POST";
    const url = form.id
      ? `/api/academy/assistant/knowledge/${form.id}`
      : "/api/academy/assistant/knowledge";

    const response = await adminFetch<KnowledgeSaveResponse>(url, {
      method,
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        category: form.category,
        tags: form.tags,
        status: form.status,
        priority: form.priority,
        official: form.official,
        validFrom: form.validFrom || undefined,
        validUntil: form.validUntil || undefined,
      }),
    });
    setSaving(false);

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    toast(`Documento guardado. Chunks indexados: ${response.data.chunksIndexed ?? 0}.`, "success");
    setModalOpen(false);
    await loadData();
  }

  async function reindexDocument(document: KnowledgeDocument) {
    setBusyId(document.id);
    const response = await adminFetch<ReindexResponse>(`/api/academy/assistant/knowledge/${document.id}/reindex`, {
      method: "POST",
    });
    setBusyId("");

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    toast(`Documento reindexado: ${response.data.chunksIndexed} chunks.`, "success");
  }

  async function reindexAll() {
    setReindexingAll(true);
    const response = await adminFetch<ReindexAllResponse>("/api/academy/assistant/knowledge/reindex-all", {
      method: "POST",
    });
    setReindexingAll(false);

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    toast(`Reindexados ${response.data.documentsIndexed} documentos y ${response.data.chunksIndexed} chunks.`, "success");
  }

  async function deleteDocument(document: KnowledgeDocument) {
    const confirmed = window.confirm(`Eliminar "${document.title}"? Esta accion tambien elimina sus chunks.`);
    if (!confirmed) return;

    setBusyId(document.id);
    const response = await adminFetch<{ deleted: boolean }>(`/api/academy/assistant/knowledge/${document.id}`, {
      method: "DELETE",
    });
    setBusyId("");

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    toast("Documento eliminado.", "success");
    await loadData();
  }

  async function resolveQuestion(question: UnansweredQuestion) {
    setBusyId(question.id);
    const response = await adminFetch<{ resolved: boolean }>(`/api/academy/assistant/unanswered/${question.id}`, {
      method: "PATCH",
      body: JSON.stringify({ resolutionDocumentId: "" }),
    });
    setBusyId("");

    if (!response.ok) {
      toast(response.error, "error");
      return;
    }

    toast("Pregunta marcada como resuelta.", "success");
    await loadData();
  }

  return (
    <div className="space-y-5">
      <section className="arca-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[color:var(--color-text-primary)]">
              Base de conocimiento RAG
            </h2>
            <p className="mt-0.5 text-[13px] text-[color:var(--color-text-muted)]">
              Contenido oficial que el asistente puede recuperar antes de responder.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={reindexAll} loading={reindexingAll} disabled={documents.length === 0}>
              <RefreshCcw size={15} /> Reindexar activos
            </Button>
            <Button onClick={openCreate}>
              <Plus size={15} /> Nuevo documento
            </Button>
          </div>
        </div>

        <div className="grid gap-3 border-b border-[color:var(--color-border)] px-5 py-4 sm:grid-cols-3">
          <Metric label="Documentos" value={documents.length} />
          <Metric label="Activos" value={activeCount} />
          <Metric label="Sin respuesta" value={unanswered.length} />
        </div>

        <div className="divide-y divide-[color:var(--color-border)]">
          {loading ? (
            [0, 1, 2].map((item) => <Skeleton key={item} className="m-5 h-20" />)
          ) : documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              titulo="No hay documentos"
              descripcion="Crea el primer documento para que el asistente pueda responder con informacion oficial."
              accion={<Button onClick={openCreate}><Plus size={15} /> Crear documento</Button>}
            />
          ) : (
            documents.map((document) => (
              <div key={document.id} className="px-5 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[14px] font-semibold text-[color:var(--color-text-primary)]">
                        {document.title}
                      </h3>
                      <Badge tono={statusTone(document.status)}>{STATUS_LABELS[document.status]}</Badge>
                      <Badge tono="neutral">{CATEGORY_LABELS[document.category]}</Badge>
                      {document.official && <Badge tono="success">Oficial</Badge>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[color:var(--color-text-secondary)]">
                      {document.content}
                    </p>
                    <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">
                      Prioridad {document.priority} · v{document.version} · Actualizado {formatearFecha(document.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(document)}>
                      <Pencil size={14} /> Editar
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={busyId === document.id}
                      onClick={() => void reindexDocument(document)}
                    >
                      <RefreshCcw size={14} /> Reindexar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={busyId === document.id}
                      onClick={() => void deleteDocument(document)}
                    >
                      <Trash2 size={14} /> Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="arca-card">
        <div className="border-b border-[color:var(--color-border)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[color:var(--color-text-primary)]">
            Preguntas sin respuesta del asistente IA
          </h2>
          <p className="mt-0.5 text-[13px] text-[color:var(--color-text-muted)]">
            Senales para ampliar o corregir la base de conocimiento.
          </p>
        </div>

        <div className="divide-y divide-[color:var(--color-border)]">
          {loading ? (
            [0, 1].map((item) => <Skeleton key={item} className="m-5 h-16" />)
          ) : unanswered.length === 0 ? (
            <EmptyState icon={Bot} titulo="No hay preguntas pendientes" descripcion="Cuando falte informacion oficial, aparecera aqui." />
          ) : (
            unanswered.map((question) => (
              <div key={question.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[color:var(--color-text-primary)]">"{question.question}"</p>
                  <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">
                    {question.category ? `${question.category} · ` : ""}{question.notes ? `${question.notes} · ` : ""}{formatearFecha(question.created_at)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  loading={busyId === question.id}
                  onClick={() => void resolveQuestion(question)}
                >
                  <Check size={14} /> Marcar resuelta
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      <Modal
        abierto={modalOpen}
        onCerrar={() => setModalOpen(false)}
        titulo={form.id ? "Editar documento" : "Nuevo documento"}
        ancho="max-w-3xl"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={() => void saveDocument()} loading={saving}>
              <Check size={15} /> Guardar e indexar
            </Button>
          </>
        )}
      >
        <div className="grid gap-4">
          <div>
            <Label htmlFor="knowledge-title" required>Titulo</Label>
            <Input
              id="knowledge-title"
              value={form.title}
              maxLength={160}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="knowledge-content" required>Contenido oficial</Label>
            <Textarea
              id="knowledge-content"
              rows={12}
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="knowledge-category">Categoria</Label>
              <Select
                id="knowledge-category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as KnowledgeCategory }))}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="knowledge-status">Estado</Label>
              <Select
                id="knowledge-status"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as KnowledgeStatus }))}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="knowledge-priority">Prioridad</Label>
              <Input
                id="knowledge-priority"
                type="number"
                min={0}
                max={100}
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: Number(event.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="knowledge-valid-from">Vigente desde</Label>
              <Input
                id="knowledge-valid-from"
                type="date"
                value={form.validFrom}
                onChange={(event) => setForm((current) => ({ ...current, validFrom: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="knowledge-valid-until">Vigente hasta</Label>
              <Input
                id="knowledge-valid-until"
                type="date"
                value={form.validUntil}
                onChange={(event) => setForm((current) => ({ ...current, validUntil: event.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="knowledge-tags">Etiquetas</Label>
            <Input
              id="knowledge-tags"
              placeholder="producto, objeciones, precios"
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-[13px] text-[color:var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={form.official}
              onChange={(event) => setForm((current) => ({ ...current, official: event.target.checked }))}
            />
            Marcar como informacion oficial
          </label>
        </div>
      </Modal>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase text-[color:var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-[20px] font-semibold text-[color:var(--color-text-primary)]">{value}</p>
    </div>
  );
}

function statusTone(status: KnowledgeStatus): "success" | "warning" | "neutral" {
  return status === "active" ? "success" : status === "draft" ? "warning" : "neutral";
}

function toDateInput(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function adminFetch<T>(
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
