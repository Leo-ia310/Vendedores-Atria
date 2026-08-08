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

create index if not exists "idx_Simulaciones_CandidateId" on public."Simulaciones" ("CandidateId");
create index if not exists "idx_Simulaciones_UserId" on public."Simulaciones" ("UserId");
create index if not exists "idx_Simulaciones_ScenarioId" on public."Simulaciones" ("ScenarioId");
create index if not exists "idx_Simulaciones_Difficulty" on public."Simulaciones" ("Difficulty");
create index if not exists "idx_Simulaciones_Status" on public."Simulaciones" ("Status");

alter table public."Simulaciones" enable row level security;
