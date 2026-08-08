alter table public."Usuarios" add column if not exists "OnboardingCompletado" text default 'true';
update public."Usuarios" set "OnboardingCompletado" = 'true' where "OnboardingCompletado" is null;
