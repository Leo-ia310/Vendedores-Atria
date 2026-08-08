import "server-only";

import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  AssistantConfidence,
  AssistantConversation,
  AssistantMessage,
  KnowledgeCategory,
  KnowledgeDocument,
  KnowledgeSource,
  KnowledgeStatus,
  RetrievedKnowledgeChunk,
} from "@/lib/assistant/types";

export type KnowledgeDocumentInput = {
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  status: KnowledgeStatus;
  priority: number;
  official: boolean;
  validFrom?: string;
  validUntil?: string;
};

export type KnowledgeChunkForIndex = {
  content: string;
  chunkIndex: number;
  section: string;
  embedding: number[];
};

export type AssistantLogInput = {
  userId: string;
  question: string;
  chunksFound: number;
  confidence: AssistantConfidence;
  model: string;
  embeddingModel: string;
  durationMs: number;
  status: "success" | "no_answer" | "error" | "blocked";
  errorCode?: string;
};

type DbRecord = Record<string, unknown>;

export async function listKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const { data, error } = await supabaseAdmin()
    .from("knowledge_documents")
    .select("*")
    .order("priority", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(toKnowledgeDocument);
}

export async function getKnowledgeDocument(documentId: string): Promise<KnowledgeDocument | null> {
  const { data, error } = await supabaseAdmin()
    .from("knowledge_documents")
    .select("*")
    .eq("id", documentId as never)
    .limit(1);
  if (error) throw new Error(error.message);
  return data?.[0] ? toKnowledgeDocument(data[0] as DbRecord) : null;
}

export async function createKnowledgeDocument(
  input: KnowledgeDocumentInput,
  createdBy: string,
): Promise<KnowledgeDocument> {
  const timestamp = now();
  const row = {
    id: id("kdoc"),
    title: input.title,
    content: input.content,
    category: input.category,
    tags: input.tags,
    status: input.status,
    priority: input.priority,
    official: input.official,
    created_by: createdBy,
    version: 1,
    valid_from: input.validFrom || null,
    valid_until: input.validUntil || null,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await supabaseAdmin()
    .from("knowledge_documents")
    .insert(row as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toKnowledgeDocument(data as DbRecord);
}

export async function updateKnowledgeDocument(
  documentId: string,
  input: KnowledgeDocumentInput,
): Promise<KnowledgeDocument> {
  const current = await getKnowledgeDocument(documentId);
  const { data, error } = await supabaseAdmin()
    .from("knowledge_documents")
    .update({
      title: input.title,
      content: input.content,
      category: input.category,
      tags: input.tags,
      status: input.status,
      priority: input.priority,
      official: input.official,
      valid_from: input.validFrom || null,
      valid_until: input.validUntil || null,
      version: (current?.version || 1) + 1,
      updated_at: now(),
    } as never)
    .eq("id", documentId as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toKnowledgeDocument(data as DbRecord);
}

export async function deleteKnowledgeDocument(documentId: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("knowledge_documents")
    .delete()
    .eq("id", documentId as never);
  if (error) throw new Error(error.message);
}

export async function replaceKnowledgeChunks(
  document: KnowledgeDocument,
  chunks: KnowledgeChunkForIndex[],
): Promise<number> {
  const timestamp = now();
  const { error: deleteError } = await supabaseAdmin()
    .from("knowledge_chunks")
    .delete()
    .eq("document_id", document.id as never);
  if (deleteError) throw new Error(deleteError.message);

  if (chunks.length === 0) return 0;

  const rows = chunks.map((chunk) => ({
    id: id("kchn"),
    document_id: document.id,
    content: chunk.content,
    embedding: vectorToSql(chunk.embedding),
    chunk_index: chunk.chunkIndex,
    metadata: {
      document_id: document.id,
      title: document.title,
      category: document.category,
      section: chunk.section,
      tags: document.tags,
      chunk_index: chunk.chunkIndex,
    },
    created_at: timestamp,
    updated_at: timestamp,
  }));

  const { error } = await supabaseAdmin().from("knowledge_chunks").insert(rows as never);
  if (error) throw new Error(error.message);
  return rows.length;
}

export async function searchKnowledgeChunks(
  embedding: number[],
  matchCount: number,
  minSimilarity: number,
): Promise<RetrievedKnowledgeChunk[]> {
  const { data, error } = await supabaseAdmin().rpc("match_knowledge_chunks", {
    query_embedding: vectorToSql(embedding),
    match_count: matchCount,
    min_similarity: minSimilarity,
  } as never);
  if (error) throw new Error(error.message);
  return ((data || []) as DbRecord[]).map(toRetrievedChunk);
}

export async function createOrGetConversation(
  userId: string,
  conversationId: string | undefined,
  firstQuestion: string,
): Promise<AssistantConversation> {
  if (conversationId) {
    const existing = await getConversation(userId, conversationId);
    if (existing) return existing;
  }

  const timestamp = now();
  const row = {
    id: id("aconv"),
    user_id: userId,
    title: titleFromQuestion(firstQuestion),
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await supabaseAdmin()
    .from("assistant_conversations")
    .insert(row as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toConversation(data as DbRecord);
}

export async function listConversations(userId: string): Promise<AssistantConversation[]> {
  const { data, error } = await supabaseAdmin()
    .from("assistant_conversations")
    .select("*")
    .eq("user_id", userId as never)
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data || []).map(toConversation);
}

export async function getConversation(
  userId: string,
  conversationId: string,
): Promise<AssistantConversation | null> {
  const { data, error } = await supabaseAdmin()
    .from("assistant_conversations")
    .select("*")
    .eq("id", conversationId as never)
    .eq("user_id", userId as never)
    .limit(1);
  if (error) throw new Error(error.message);
  return data?.[0] ? toConversation(data[0] as DbRecord) : null;
}

export async function listConversationMessages(
  userId: string,
  conversationId: string,
): Promise<AssistantMessage[]> {
  const conversation = await getConversation(userId, conversationId);
  if (!conversation) return [];

  const { data, error } = await supabaseAdmin()
    .from("assistant_messages")
    .select("*")
    .eq("conversation_id", conversationId as never)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(toAssistantMessage);
}

export async function saveAssistantMessage({
  conversationId,
  userId,
  role,
  content,
  sources = [],
  confidence,
}: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  sources?: KnowledgeSource[];
  confidence?: AssistantConfidence;
}): Promise<AssistantMessage> {
  const timestamp = now();
  const { data, error } = await supabaseAdmin()
    .from("assistant_messages")
    .insert({
      id: id("amsg"),
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
      sources,
      confidence: confidence || null,
      created_at: timestamp,
    } as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  await supabaseAdmin()
    .from("assistant_conversations")
    .update({ updated_at: timestamp } as never)
    .eq("id", conversationId as never);

  return toAssistantMessage(data as DbRecord);
}

export async function logAssistantQuestion(input: AssistantLogInput): Promise<void> {
  const { error } = await supabaseAdmin().from("assistant_question_logs").insert({
    id: id("alog"),
    user_id: input.userId,
    question: input.question,
    normalized_question: normalizeQuestion(input.question),
    chunks_found: input.chunksFound,
    confidence: input.confidence,
    model: input.model,
    embedding_model: input.embeddingModel,
    duration_ms: input.durationMs,
    status: input.status,
    error_code: input.errorCode || "",
    created_at: now(),
  } as never);
  if (error) console.error("[assistant-log]", { message: error.message });
}

export async function recordUnansweredQuestion(
  userId: string,
  question: string,
  category = "",
  notes = "",
): Promise<void> {
  const { error } = await supabaseAdmin().from("unanswered_questions").insert({
    id: id("unans"),
    user_id: userId,
    question,
    category,
    notes,
    created_at: now(),
    resolved: false,
    resolution_document_id: "",
  } as never);
  if (error) console.error("[assistant-unanswered]", { message: error.message });
}

export async function recordAssistantConflict(
  userId: string,
  question: string,
  sourceTitles: string[],
  notes = "",
): Promise<void> {
  const { error } = await supabaseAdmin().from("assistant_conflicts").insert({
    id: id("aconf"),
    user_id: userId,
    question,
    source_titles: sourceTitles,
    notes,
    created_at: now(),
    resolved: false,
  } as never);
  if (error) console.error("[assistant-conflict]", { message: error.message });
}

export function confidenceFromChunks(chunks: RetrievedKnowledgeChunk[]): AssistantConfidence {
  const best = chunks[0]?.similarity || 0;
  if (chunks.length >= 2 && best >= 0.42) return "high";
  if (chunks.length >= 1 && best >= 0.26) return "medium";
  return "low";
}

export function sourcesFromChunks(chunks: RetrievedKnowledgeChunk[]): KnowledgeSource[] {
  const seen = new Set<string>();
  const sources: KnowledgeSource[] = [];
  for (const chunk of chunks) {
    const key = `${chunk.title}:${chunk.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({ title: chunk.title, category: chunk.category });
  }
  return sources;
}

export function vectorToSql(embedding: number[]): string {
  return `[${embedding.map((value) => Number(value).toFixed(8)).join(",")}]`;
}

function toKnowledgeDocument(row: DbRecord): KnowledgeDocument {
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    content: String(row.content || ""),
    category: toCategory(row.category),
    tags: toStringArray(row.tags),
    status: toStatus(row.status),
    priority: Number(row.priority || 0),
    official: row.official !== false,
    createdBy: String(row.created_by || ""),
    version: Number(row.version || 1),
    validFrom: typeof row.valid_from === "string" ? row.valid_from : undefined,
    validUntil: typeof row.valid_until === "string" ? row.valid_until : undefined,
    createdAt: String(row.created_at || ""),
    updatedAt: String(row.updated_at || ""),
  };
}

function toRetrievedChunk(row: DbRecord): RetrievedKnowledgeChunk {
  return {
    chunkId: String(row.chunk_id || ""),
    documentId: String(row.document_id || ""),
    title: String(row.title || ""),
    category: toCategory(row.category),
    tags: toStringArray(row.tags),
    content: String(row.content || ""),
    similarity: Number(row.similarity || 0),
    chunkIndex: Number(row.chunk_index || 0),
  };
}

function toConversation(row: DbRecord): AssistantConversation {
  return {
    id: String(row.id || ""),
    title: String(row.title || "Nuevo chat"),
    createdAt: String(row.created_at || ""),
    updatedAt: String(row.updated_at || ""),
  };
}

function toAssistantMessage(row: DbRecord): AssistantMessage {
  return {
    id: String(row.id || ""),
    conversationId: String(row.conversation_id || ""),
    role: row.role === "assistant" ? "assistant" : "user",
    content: String(row.content || ""),
    sources: Array.isArray(row.sources) ? (row.sources as KnowledgeSource[]) : [],
    confidence: row.confidence === "high" || row.confidence === "medium" || row.confidence === "low" ? row.confidence : undefined,
    createdAt: String(row.created_at || ""),
  };
}

function toCategory(value: unknown): KnowledgeCategory {
  const allowed: KnowledgeCategory[] = ["product", "pricing", "sales", "competition", "policies", "sellers", "faq", "general"];
  return allowed.includes(value as KnowledgeCategory) ? value as KnowledgeCategory : "general";
}

function toStatus(value: unknown): KnowledgeStatus {
  const allowed: KnowledgeStatus[] = ["draft", "active", "inactive", "archived"];
  return allowed.includes(value as KnowledgeStatus) ? value as KnowledgeStatus : "draft";
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function titleFromQuestion(question: string): string {
  const title = question.trim().replace(/\s+/g, " ");
  return title.length > 56 ? `${title.slice(0, 53)}...` : title || "Nuevo chat";
}

function normalizeQuestion(question: string): string {
  return question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

function now() {
  return new Date().toISOString();
}
