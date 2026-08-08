create extension if not exists vector;

create table if not exists public.knowledge_documents (
  id text primary key,
  title text not null,
  content text not null,
  category text not null default 'general',
  tags text[] not null default '{}',
  status text not null default 'draft',
  priority integer not null default 0,
  official boolean not null default true,
  created_by text,
  version integer not null default 1,
  valid_from text,
  valid_until text,
  created_at text not null,
  updated_at text not null
);

create table if not exists public.knowledge_chunks (
  id text primary key,
  document_id text not null references public.knowledge_documents(id) on delete cascade,
  content text not null,
  embedding vector(1024) not null,
  chunk_index integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at text not null,
  updated_at text not null
);

create table if not exists public.assistant_conversations (
  id text primary key,
  user_id text not null,
  title text not null,
  created_at text not null,
  updated_at text not null
);

create table if not exists public.assistant_messages (
  id text primary key,
  conversation_id text not null references public.assistant_conversations(id) on delete cascade,
  user_id text not null,
  role text not null,
  content text not null,
  sources jsonb not null default '[]'::jsonb,
  confidence text,
  created_at text not null
);

create table if not exists public.assistant_question_logs (
  id text primary key,
  user_id text not null,
  question text not null,
  normalized_question text not null,
  chunks_found integer not null default 0,
  confidence text,
  model text,
  embedding_model text,
  duration_ms integer not null default 0,
  status text not null,
  error_code text,
  created_at text not null
);

create table if not exists public.unanswered_questions (
  id text primary key,
  user_id text not null,
  question text not null,
  category text,
  notes text,
  created_at text not null,
  resolved boolean not null default false,
  resolution_document_id text
);

create table if not exists public.assistant_conflicts (
  id text primary key,
  user_id text not null,
  question text not null,
  source_titles text[] not null default '{}',
  notes text,
  created_at text not null,
  resolved boolean not null default false
);

create index if not exists idx_knowledge_documents_status on public.knowledge_documents (status);
create index if not exists idx_knowledge_documents_category on public.knowledge_documents (category);
create index if not exists idx_knowledge_documents_priority on public.knowledge_documents (priority desc);
create index if not exists idx_knowledge_chunks_document_id on public.knowledge_chunks (document_id);
create index if not exists idx_knowledge_chunks_embedding on public.knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists idx_assistant_conversations_user_id on public.assistant_conversations (user_id, updated_at);
create index if not exists idx_assistant_messages_conversation_id on public.assistant_messages (conversation_id, created_at);
create index if not exists idx_assistant_logs_normalized_question on public.assistant_question_logs (normalized_question);
create index if not exists idx_unanswered_questions_resolved on public.unanswered_questions (resolved, created_at);

create or replace function public.match_knowledge_chunks(
  query_embedding text,
  match_count integer default 5,
  min_similarity double precision default 0.18
)
returns table (
  chunk_id text,
  document_id text,
  title text,
  category text,
  tags text[],
  content text,
  chunk_index integer,
  similarity double precision
)
language sql
stable
as $$
  select
    kc.id as chunk_id,
    kd.id as document_id,
    kd.title,
    kd.category,
    kd.tags,
    kc.content,
    kc.chunk_index,
    1 - (kc.embedding <=> query_embedding::vector) as similarity
  from public.knowledge_chunks kc
  join public.knowledge_documents kd on kd.id = kc.document_id
  where kd.status = 'active'
    and (kd.valid_from is null or kd.valid_from = '' or kd.valid_from <= now()::text)
    and (kd.valid_until is null or kd.valid_until = '' or kd.valid_until >= now()::text)
    and 1 - (kc.embedding <=> query_embedding::vector) >= min_similarity
  order by kc.embedding <=> query_embedding::vector asc, kd.priority desc, kd.updated_at desc
  limit match_count;
$$;

alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;
alter table public.assistant_conversations enable row level security;
alter table public.assistant_messages enable row level security;
alter table public.assistant_question_logs enable row level security;
alter table public.unanswered_questions enable row level security;
alter table public.assistant_conflicts enable row level security;
