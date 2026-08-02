create table if not exists public."Configuracion" (
  "Clave" text primary key,
  "Valor" text,
  "Descripcion" text,
  "FechaActualizacion" text
);

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
  "Escenario" text,
  "Respuestas" text,
  "Puntaje" double precision default 0,
  "Retroalimentacion" text,
  "Fecha" text
);

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
  "Plan" text,
  "Monto" double precision default 0,
  "TipoVenta" text,
  "FechaVenta" text,
  "Estado" text,
  "Comprobante" text,
  "FechaValidacion" text,
  "ValidadoPor" text
);

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
create index if not exists "idx_IntentosExamen_CandidateId" on public."IntentosExamen" ("CandidateId");
create index if not exists "idx_Preguntas_ModuleId" on public."Preguntas" ("ModuleId");
create index if not exists "idx_Vendedores_CandidateId" on public."Vendedores" ("CandidateId");
create index if not exists "idx_Prospectos_SellerId" on public."Prospectos" ("SellerId");
create index if not exists "idx_Ventas_SellerId" on public."Ventas" ("SellerId");
create index if not exists "idx_Comisiones_SellerId" on public."Comisiones" ("SellerId");

insert into public."Configuracion" ("Clave", "Valor", "Descripcion", "FechaActualizacion") values
  ('comision_primera_venta', '0.15', 'Porcentaje de comision sobre la primera venta', now()::text),
  ('comision_renovacion', '0.05', 'Porcentaje de comision sobre renovaciones', now()::text),
  ('puntaje_minimo', '85', 'Puntaje minimo para aprobar y certificar', now()::text),
  ('intentos_por_examen', '3', 'Intentos permitidos por examen de modulo', now()::text),
  ('intentos_examen_final', '2', 'Intentos permitidos en el examen final', now()::text),
  ('version_terminos', '2026.08', 'Version vigente de terminos y condiciones', now()::text),
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
    'PreguntasNoResueltas','Auditoria','RecuperacionPassword'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
