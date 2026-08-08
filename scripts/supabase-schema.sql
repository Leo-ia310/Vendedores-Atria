create table if not exists public."Configuracion" (
  "Clave" text primary key,
  "Valor" text,
  "Descripcion" text,
  "FechaActualizacion" text
);

create extension if not exists vector;

create table if not exists public."Candidatos" (
  "CandidateId" text primary key,
  "NombreCompleto" text,
  "Pais" text,
  "Ciudad" text,
  "FechaNacimiento" text,
  "Email" text unique,
  "WhatsApp" text unique,
  "Documento" text,
  "ZonaHoraria" text,
  "Idioma" text,
  "FuenteConocio" text,
  "Experiencia" text,
  "ExperienciaSoftware" text,
  "Sectores" text,
  "Disponibilidad" text,
  "MedioContacto" text,
  "Motivacion" text,
  "Estado" text,
  "FechaRegistro" text,
  "UltimaActividad" text,
  "Progreso" double precision default 0,
  "Certificado" text
);

create table if not exists public."Usuarios" (
  "UserId" text primary key,
  "CandidateId" text,
  "Email" text unique,
  "PasswordHash" text,
  "Salt" text,
  "Rol" text,
  "Estado" text,
  "DebeCambiarPassword" text,
  "UltimoAcceso" text,
  "IntentosFallidos" integer default 0,
  "BloqueadoHasta" text,
  "FechaCreacion" text
);

create table if not exists public."Sesiones" (
  "SessionId" text primary key,
  "UserId" text,
  "TokenHash" text unique,
  "FechaCreacion" text,
  "FechaExpiracion" text,
  "Estado" text,
  "IP" text,
  "UserAgent" text
);

create table if not exists public."Modulos" (
  "ModuleId" text primary key,
  "Titulo" text,
  "Descripcion" text,
  "Orden" integer,
  "Obligatorio" text,
  "Estado" text,
  "TiempoEstimado" text,
  "PuntajeMinimo" double precision default 85
);

create table if not exists public."Progreso" (
  "ProgressId" text primary key,
  "CandidateId" text,
  "ModuleId" text,
  "Estado" text,
  "Porcentaje" double precision default 0,
  "FechaInicio" text,
  "FechaFinalizacion" text,
  "UltimaActividad" text
);

create table if not exists public."Preguntas" (
  "QuestionId" text primary key,
  "ModuleId" text,
  "Tipo" text,
  "Pregunta" text,
  "Opciones" text,
  "RespuestaCorrecta" text,
  "Explicacion" text,
  "Puntaje" double precision default 1,
  "Estado" text
);

create table if not exists public."IntentosExamen" (
  "AttemptId" text primary key,
  "CandidateId" text,
  "ModuleId" text,
  "Puntaje" double precision default 0,
  "Aprobado" text,
  "Respuestas" text,
  "FechaInicio" text,
  "FechaFinalizacion" text,
  "Duracion" double precision default 0
);

create table if not exists public."Simulaciones" (
  "SimulationAttemptId" text primary key,
  "CandidateId" text,
  "UserId" text,
  "Escenario" text,
  "ScenarioId" text,
  "Difficulty" text,
  "Status" text default 'finished',
  "StartedAt" text,
  "FinishedAt" text,
  "Score" double precision default 0,
  "Messages" jsonb default '[]'::jsonb,
  "Evaluation" jsonb default '{}'::jsonb,
  "Respuestas" text,
  "Puntaje" double precision default 0,
  "Retroalimentacion" text,
  "Fecha" text,
  "CreatedAt" text,
  "UpdatedAt" text
);

alter table public."Simulaciones" add column if not exists "UserId" text;
alter table public."Simulaciones" add column if not exists "ScenarioId" text;
alter table public."Simulaciones" add column if not exists "Difficulty" text;
alter table public."Simulaciones" add column if not exists "Status" text default 'finished';
alter table public."Simulaciones" add column if not exists "StartedAt" text;
alter table public."Simulaciones" add column if not exists "FinishedAt" text;
alter table public."Simulaciones" add column if not exists "Score" double precision default 0;
alter table public."Simulaciones" add column if not exists "Messages" jsonb default '[]'::jsonb;
alter table public."Simulaciones" add column if not exists "Evaluation" jsonb default '{}'::jsonb;
alter table public."Simulaciones" add column if not exists "CreatedAt" text;
alter table public."Simulaciones" add column if not exists "UpdatedAt" text;

update public."Simulaciones"
set
  "ScenarioId" = coalesce("ScenarioId", "Escenario"),
  "Score" = coalesce("Score", "Puntaje", 0),
  "Status" = coalesce("Status", 'finished'),
  "StartedAt" = coalesce("StartedAt", "Fecha"),
  "FinishedAt" = coalesce("FinishedAt", "Fecha"),
  "CreatedAt" = coalesce("CreatedAt", "Fecha"),
  "UpdatedAt" = coalesce("UpdatedAt", "Fecha")
where
  "ScenarioId" is null
  or "Score" is null
  or "Status" is null
  or "StartedAt" is null
  or "FinishedAt" is null
  or "CreatedAt" is null
  or "UpdatedAt" is null;

create table if not exists public."TerminosAceptados" (
  "AcceptanceId" text primary key,
  "CandidateId" text,
  "TipoDocumento" text,
  "Version" text,
  "FechaAceptacion" text,
  "IP" text,
  "UserAgent" text
);

create table if not exists public."Certificados" (
  "CertificateId" text primary key,
  "CandidateId" text,
  "CodigoCertificado" text unique,
  "FechaEmision" text,
  "PuntajeFinal" double precision default 0,
  "Estado" text,
  "UrlVerificacion" text
);

create table if not exists public."Vendedores" (
  "SellerId" text primary key,
  "CandidateId" text unique,
  "CodigoVendedor" text unique,
  "CodigoReferido" text unique,
  "Nivel" text,
  "Estado" text,
  "FechaCertificacion" text,
  "ClientesActivos" integer default 0,
  "VentasTotales" integer default 0
);

create table if not exists public."Prospectos" (
  "ProspectId" text primary key,
  "SellerId" text,
  "Empresa" text,
  "Contacto" text,
  "Email" text,
  "WhatsApp" text,
  "Pais" text,
  "Sector" text,
  "Fuente" text,
  "Etapa" text,
  "ValorEstimado" double precision default 0,
  "ProximaAccion" text,
  "FechaSeguimiento" text,
  "Notas" text,
  "FechaCreacion" text,
  "FechaActualizacion" text
);

create table if not exists public."ActividadesCRM" (
  "ActivityId" text primary key,
  "ProspectId" text,
  "SellerId" text,
  "Tipo" text,
  "Descripcion" text,
  "Fecha" text,
  "ProximaAccion" text
);

create table if not exists public."Ventas" (
  "SaleId" text primary key,
  "SellerId" text,
  "ProspectId" text,
  "Cliente" text,
  "ClienteEmail" text,
  "EmpresaCliente" text,
  "Plan" text,
  "Monto" double precision default 0,
  "TipoVenta" text,
  "FechaVenta" text,
  "Estado" text,
  "Comprobante" text,
  "FechaValidacion" text,
  "ValidadoPor" text,
  "ReferenciaExterna" text,
  "Origen" text,
  "CodigoReferido" text
);

alter table public."Ventas" add column if not exists "ClienteEmail" text;
alter table public."Ventas" add column if not exists "EmpresaCliente" text;
alter table public."Ventas" add column if not exists "ReferenciaExterna" text;
alter table public."Ventas" add column if not exists "Origen" text;
alter table public."Ventas" add column if not exists "CodigoReferido" text;

create table if not exists public."Comisiones" (
  "CommissionId" text primary key,
  "SaleId" text,
  "SellerId" text,
  "Tipo" text,
  "Porcentaje" double precision default 0,
  "Monto" double precision default 0,
  "Estado" text,
  "FechaCreacion" text,
  "FechaProgramada" text,
  "FechaPago" text,
  "MetodoPago" text
);

create table if not exists public."Renovaciones" (
  "RenewalId" text primary key,
  "SaleId" text,
  "Cliente" text,
  "Periodo" text,
  "Monto" double precision default 0,
  "Estado" text,
  "FechaPago" text,
  "CommissionId" text
);

create table if not exists public."ChatbotLogs" (
  "ChatId" text primary key,
  "UserId" text,
  "Mensaje" text,
  "Intencion" text,
  "Confianza" double precision default 0,
  "Respuesta" text,
  "Fecha" text,
  "Resuelto" text
);

create table if not exists public."PreguntasNoResueltas" (
  "UnresolvedId" text primary key,
  "UserId" text,
  "Pregunta" text,
  "Contexto" text,
  "Fecha" text,
  "Revisado" text,
  "RespuestaAgregada" text
);

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

create table if not exists public."Auditoria" (
  "AuditId" text primary key,
  "UserId" text,
  "Accion" text,
  "Entidad" text,
  "EntityId" text,
  "DatosAnteriores" text,
  "DatosNuevos" text,
  "Fecha" text,
  "IP" text
);

create table if not exists public."RecuperacionPassword" (
  "RecoveryId" text primary key,
  "UserId" text,
  "TokenHash" text unique,
  "FechaCreacion" text,
  "FechaExpiracion" text,
  "Utilizado" text
);

create index if not exists "idx_Usuarios_Email" on public."Usuarios" ("Email");
create index if not exists "idx_Sesiones_TokenHash" on public."Sesiones" ("TokenHash");
create index if not exists "idx_Progreso_CandidateId" on public."Progreso" ("CandidateId");
create index if not exists "idx_Vendedores_CodigoReferido" on public."Vendedores" ("CodigoReferido");
create index if not exists "idx_Vendedores_CodigoVendedor" on public."Vendedores" ("CodigoVendedor");
create unique index if not exists "idx_Ventas_ReferenciaExterna" on public."Ventas" ("ReferenciaExterna") where "ReferenciaExterna" is not null and "ReferenciaExterna" <> '';
create index if not exists "idx_Ventas_SellerId_Estado" on public."Ventas" ("SellerId", "Estado");
create index if not exists "idx_IntentosExamen_CandidateId" on public."IntentosExamen" ("CandidateId");
create index if not exists "idx_Simulaciones_CandidateId" on public."Simulaciones" ("CandidateId");
create index if not exists "idx_Simulaciones_UserId" on public."Simulaciones" ("UserId");
create index if not exists "idx_Simulaciones_ScenarioId" on public."Simulaciones" ("ScenarioId");
create index if not exists "idx_Simulaciones_Difficulty" on public."Simulaciones" ("Difficulty");
create index if not exists "idx_Simulaciones_Status" on public."Simulaciones" ("Status");
create index if not exists "idx_Preguntas_ModuleId" on public."Preguntas" ("ModuleId");
create index if not exists "idx_Vendedores_CandidateId" on public."Vendedores" ("CandidateId");
create index if not exists "idx_Prospectos_SellerId" on public."Prospectos" ("SellerId");
create index if not exists "idx_Ventas_SellerId" on public."Ventas" ("SellerId");
create index if not exists "idx_Comisiones_SellerId" on public."Comisiones" ("SellerId");
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

insert into public."Configuracion" ("Clave", "Valor", "Descripcion", "FechaActualizacion") values
  ('comision_primera_venta', '0.15', 'Porcentaje de comisión sobre la primera venta', now()::text),
  ('comision_renovacion', '0.05', 'Porcentaje de comisión sobre renovaciones', now()::text),
  ('puntaje_minimo', '85', 'Puntaje mínimo para aprobar y certificar', now()::text),
  ('intentos_por_examen', '3', 'Intentos permitidos por examen de módulo', now()::text),
  ('intentos_examen_final', '0', 'El examen final no tiene límite de intentos', now()::text),
  ('version_terminos', '2026.08', 'Versión vigente de términos y condiciones', now()::text),
  ('moneda', 'USD', 'Moneda base de comisiones', now()::text),
  ('whatsapp_soporte', '50500000000', 'WhatsApp de soporte', now()::text),
  ('mantenimiento', '0', '1 = modo mantenimiento activo', now()::text)
on conflict ("Clave") do nothing;

do $$
declare
  t text;
begin
  foreach t in array array[
    'Configuracion','Candidatos','Usuarios','Sesiones','Modulos','Progreso','Preguntas',
    'IntentosExamen','Simulaciones','TerminosAceptados','Certificados','Vendedores',
    'Prospectos','ActividadesCRM','Ventas','Comisiones','Renovaciones','ChatbotLogs',
    'PreguntasNoResueltas','Auditoria','RecuperacionPassword',
    'knowledge_documents','knowledge_chunks','assistant_conversations','assistant_messages',
    'assistant_question_logs','unanswered_questions','assistant_conflicts'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
