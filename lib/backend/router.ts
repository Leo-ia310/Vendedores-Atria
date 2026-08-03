import "server-only";

import { createHash, pbkdf2Sync, randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CONFIG_DEFAULTS, DEFAULT_QUESTIONS, defaultModuleRows, type QuestionRow } from "@/lib/backend/defaultData";

const SESSION_MS = 1000 * 60 * 60 * 12;
const RECOVERY_MS = 1000 * 60 * 30;
const LOCK_MS = 1000 * 60 * 15;
const MAX_LOGIN_ATTEMPTS = 5;
const HASH_ITERATIONS = 100_000;

type AnyRow = Record<string, any>;
type Payload = Record<string, any>;
type BackendResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export type BackendContext = {
  ip: string;
  userAgent: string;
};

type UserRow = AnyRow & {
  UserId: string;
  CandidateId: string;
  Email: string;
  PasswordHash: string;
  Salt: string;
  Rol: string;
  Estado: string;
  DebeCambiarPassword: string;
  IntentosFallidos?: number;
  BloqueadoHasta?: string;
  __sessionId?: string;
};

const ADMIN_TABLES = [
  "Candidatos",
  "Usuarios",
  "Vendedores",
  "Ventas",
  "Comisiones",
  "Prospectos",
  "Renovaciones",
  "IntentosExamen",
  "Simulaciones",
  "TerminosAceptados",
  "Certificados",
  "ChatbotLogs",
  "PreguntasNoResueltas",
  "Auditoria",
  "Modulos",
  "Preguntas",
  "Configuracion",
  "Progreso",
];

export async function runBackendAction<T = unknown>(
  action: string,
  payload: Payload = {},
  token: string | null = null,
  ctx: BackendContext,
): Promise<BackendResult<T>> {
  try {
    switch (action) {
      case "ping":
        return ok({ estado: "ok", backend: "supabase" } as T);
      case "configPublica":
        return ok(await configPublica() as T);
      case "registrarCandidato":
        return ok(await registrarCandidato(payload, ctx) as T);
      case "login":
        return ok(await login(payload, ctx) as T);
      case "solicitarRecuperacion":
        return ok(await solicitarRecuperacion(payload, ctx) as T);
      case "restablecerPassword":
        return ok(await restablecerPassword(payload, ctx) as T);
      case "verificarCertificado":
        return ok(await verificarCertificado(String(payload.codigo || "")) as T);
      case "logout":
        return ok(await logout(token) as T);
      case "sesionActual":
        return await conSesion(token, async (u) => ({ usuario: usuarioPublico(u), extra: await extraUsuario(u) }) as T);
      case "cambiarPassword":
        return await conSesion(token, async (u) => cambiarPassword(u, payload) as T);
      case "obtenerModulos":
        return await conSesion(token, async () => getModuleRows() as T);
      case "obtenerProgreso":
        return await conSesion(token, async (u) => obtenerProgreso(u) as T);
      case "guardarProgreso":
        return await conSesion(token, async (u) => guardarProgreso(u, payload) as T);
      case "obtenerExamen":
        return await conSesion(token, async (u) => obtenerExamen(u, payload) as T);
      case "enviarExamen":
        return await conSesion(token, async (u) => enviarExamen(u, payload) as T);
      case "enviarSimulacion":
        return await conSesion(token, async (u) => enviarSimulacion(u, payload) as T);
      case "aceptarTerminos":
        return await conSesion(token, async (u) => aceptarTerminos(u, payload, ctx) as T);
      case "estadoCertificacion":
        return await conSesion(token, async (u) => evaluarRequisitos(u.CandidateId) as T);
      case "certificar":
        return await conSesion(token, async (u) => certificar(u, ctx) as T);
      case "dashboardVendedor":
        return await conRol(token, "vendedor", async (u) => dashboardVendedor(u) as T);
      case "listarProspectos":
        return await conRol(token, "vendedor", async (u) => listarProspectos(u) as T);
      case "crearProspecto":
        return await conRol(token, "vendedor", async (u) => crearProspecto(u, payload) as T);
      case "actualizarProspecto":
        return await conRol(token, "vendedor", async (u) => actualizarProspecto(u, payload) as T);
      case "registrarActividad":
        return await conRol(token, "vendedor", async (u) => registrarActividad(u, payload) as T);
      case "listarVentas":
        return await conRol(token, "vendedor", async (u) => listarVentas(u) as T);
      case "registrarVenta":
        return await conRol(token, "vendedor", async (u) => registrarVenta(u, payload) as T);
      case "listarComisiones":
        return await conRol(token, "vendedor", async (u) => listarComisiones(u) as T);
      case "actualizarPerfil":
        return await conSesion(token, async (u) => actualizarPerfil(u, payload) as T);
      case "registrarChat":
        return ok(await registrarChat(payload, token) as T);
      case "registrarPreguntaNoResuelta":
        return ok(await registrarPreguntaNoResuelta(payload, token) as T);
      case "adminListar":
        return await conRol(token, "admin", async () => adminListar(payload) as T);
      case "adminCandidato":
        return await conRol(token, "admin", async (u) => adminCandidato(u, payload) as T);
      case "adminActualizarVenta":
        return await conRol(token, "admin", async (u) => adminActualizarVenta(u, payload) as T);
      case "adminCalcularComision":
        return await conRol(token, "admin", async (u) => adminCalcularComision(u, payload) as T);
      case "adminMarcarComisionPagada":
        return await conRol(token, "admin", async (u) => adminMarcarComisionPagada(u, payload) as T);
      case "adminRegistrarRenovacion":
        return await conRol(token, "admin", async (u) => adminRegistrarRenovacion(u, payload) as T);
      case "adminGestionarVendedor":
        return await conRol(token, "admin", async (u) => adminGestionarVendedor(u, payload) as T);
      case "adminResetPassword":
        return await conRol(token, "admin", async (u) => adminResetPassword(u, payload) as T);
      case "adminConfigSet":
        return await conRol(token, "admin", async (u) => adminConfigSet(u, payload) as T);
      case "adminGuardarModulo":
        return await conRol(token, "admin", async (u) => adminGuardarModulo(u, payload) as T);
      case "adminGuardarPregunta":
        return await conRol(token, "admin", async () => adminGuardarPregunta(payload) as T);
      case "adminResolverPregunta":
        return await conRol(token, "admin", async () => adminResolverPregunta(payload) as T);
      default:
        return fail("ACCION", "Acción no reconocida.");
    }
  } catch (error) {
    if (error instanceof PublicError) {
      return fail(error.code, error.message);
    }
    console.error("[backend]", action, error);
    return fail(
      "SERVER",
      error instanceof Error ? error.message : "Error interno del servidor.",
    );
  }
}

function ok<T>(data: T): BackendResult<T> {
  return { ok: true, data };
}

function fail<T = never>(code: string, error: string): BackendResult<T> {
  return { ok: false, code, error };
}

async function conSesion<T>(
  token: string | null,
  fn: (user: UserRow) => Promise<T>,
): Promise<BackendResult<T>> {
  const user = await verificarSesion(token);
  if (!user) return fail("NO_AUTORIZADO", "Sesión inválida o expirada.");
  return ok(await fn(user));
}

async function conRol<T>(
  token: string | null,
  rol: string,
  fn: (user: UserRow) => Promise<T>,
): Promise<BackendResult<T>> {
  const user = await verificarSesion(token);
  if (!user) return fail("NO_AUTORIZADO", "Sesión inválida o expirada.");
  if (user.Rol !== rol && user.Rol !== "admin") {
    return fail("PROHIBIDO", "No tienes permiso para esta acción.");
  }
  return ok(await fn(user));
}

function now() {
  return new Date().toISOString();
}

function future(ms: number) {
  return new Date(Date.now() + ms).toISOString();
}

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

function token(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function pepper() {
  return process.env.AUTH_PEPPER || process.env.SUPABASE_SERVICE_ROLE_KEY || "atria-dev-pepper";
}

function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, `${salt}:${pepper()}`, HASH_ITERATIONS, 32, "sha256").toString("hex");
}

function hashToken(value: string) {
  return sha256(`${value}:${pepper()}`);
}

function randomPassword() {
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const symbols = "!@#$%";
  const all = lower + upper + digits + symbols;
  const required = [
    lower[randomInt(lower.length)],
    upper[randomInt(upper.length)],
    digits[randomInt(digits.length)],
    symbols[randomInt(symbols.length)],
  ];
  while (required.length < 12) required.push(all[randomInt(all.length)]);
  return required.sort(() => Math.random() - 0.5).join("");
}

function randomInt(max: number) {
  return randomBytes(1)[0] % max;
}

async function rows<T = AnyRow>(table: string, orderBy?: string): Promise<T[]> {
  let query = supabaseAdmin().from(table).select("*");
  if (orderBy) query = query.order(orderBy, { ascending: true });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []) as T[];
}

async function rowsWhere<T = AnyRow>(table: string, column: string, value: unknown, orderBy?: string): Promise<T[]> {
  let query = supabaseAdmin().from(table).select("*").eq(column, value as never);
  if (orderBy) query = query.order(orderBy, { ascending: true });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []) as T[];
}

async function rowBy<T = AnyRow>(table: string, column: string, value: unknown): Promise<T | null> {
  const { data, error } = await supabaseAdmin()
    .from(table)
    .select("*")
    .eq(column, value as never)
    .limit(1);
  if (error) throw new Error(error.message);
  return ((data || [])[0] as T) || null;
}

async function insertRow(table: string, row: AnyRow) {
  const { error } = await supabaseAdmin().from(table).insert(row as never);
  if (error) throw new Error(error.message);
}

async function upsertRow(table: string, row: AnyRow, onConflict: string) {
  const { error } = await supabaseAdmin().from(table).upsert(row as never, { onConflict });
  if (error) throw new Error(error.message);
}

async function updateRows(table: string, column: string, value: unknown, changes: AnyRow) {
  const { error } = await supabaseAdmin().from(table).update(changes as never).eq(column, value as never);
  if (error) throw new Error(error.message);
}

async function configGet(key: string): Promise<string | undefined> {
  const row = await rowBy<AnyRow>("Configuracion", "Clave", key);
  return row?.Valor ?? CONFIG_DEFAULTS[key]?.[0];
}

async function configNum(key: string, fallback: number) {
  const value = Number(await configGet(key));
  return Number.isFinite(value) ? value : fallback;
}

async function configSet(key: string, value: string, description?: string) {
  await upsertRow("Configuracion", {
    Clave: key,
    Valor: value,
    Descripcion: description || CONFIG_DEFAULTS[key]?.[1] || "",
    FechaActualizacion: now(),
  }, "Clave");
}

async function configPublica() {
  return {
    comisionPrimeraVenta: await configNum("comision_primera_venta", 0.15),
    comisionRenovacion: await configNum("comision_renovacion", 0.05),
    puntajeMinimo: await configNum("puntaje_minimo", 85),
    moneda: await configGet("moneda"),
    whatsappSoporte: await configGet("whatsapp_soporte"),
  };
}

function usuarioPublico(user: UserRow) {
  return {
    userId: user.UserId,
    candidateId: user.CandidateId,
    email: user.Email,
    rol: user.Rol,
    debeCambiarPassword: String(user.DebeCambiarPassword) === "true",
  };
}

async function extraUsuario(user: UserRow) {
  if (user.Rol !== "vendedor") return {};
  const seller = await rowBy<AnyRow>("Vendedores", "CandidateId", user.CandidateId);
  return seller
    ? {
        vendedor: {
          codigoVendedor: seller.CodigoVendedor,
          codigoReferido: seller.CodigoReferido,
          nivel: seller.Nivel,
        },
      }
    : {};
}

async function verificarSesion(rawToken: string | null): Promise<UserRow | null> {
  if (!rawToken) return null;
  const session = await rowBy<AnyRow>("Sesiones", "TokenHash", hashToken(rawToken));
  if (!session || session.Estado !== "activa") return null;
  if (new Date(session.FechaExpiracion).getTime() < Date.now()) {
    await updateRows("Sesiones", "SessionId", session.SessionId, { Estado: "expirada" });
    return null;
  }
  const user = await rowBy<UserRow>("Usuarios", "UserId", session.UserId);
  if (!user || user.Estado !== "activo") return null;
  user.__sessionId = session.SessionId;
  return user;
}

async function crearSesion(userId: string, ctx: BackendContext) {
  const raw = token();
  await insertRow("Sesiones", {
    SessionId: id("ses"),
    UserId: userId,
    TokenHash: hashToken(raw),
    FechaCreacion: now(),
    FechaExpiracion: future(SESSION_MS),
    Estado: "activa",
    IP: ctx.ip,
    UserAgent: ctx.userAgent,
  });
  return raw;
}

async function crearUsuario(email: string, password: string, rol: string, candidateId: string, debeCambiar: boolean) {
  const normalized = email.toLowerCase().trim();
  const existing = await rowBy("Usuarios", "Email", normalized);
  if (existing) throw new Error("El correo ya está registrado.");
  const salt = token(16);
  const user: UserRow = {
    UserId: id("usr"),
    CandidateId: candidateId || "",
    Email: normalized,
    PasswordHash: hashPassword(password, salt),
    Salt: salt,
    Rol: rol || "candidato",
    Estado: "activo",
    DebeCambiarPassword: debeCambiar ? "true" : "false",
    UltimoAcceso: "",
    IntentosFallidos: 0,
    BloqueadoHasta: "",
    FechaCreacion: now(),
  };
  await insertRow("Usuarios", user);
  return user;
}

async function login(payload: Payload, ctx: BackendContext) {
  const email = String(payload.email || "").toLowerCase().trim();
  const password = String(payload.password || "");
  if (!email || !password) throw new PublicError("DATOS", "Correo y contraseña son obligatorios.");

  const user = await rowBy<UserRow>("Usuarios", "Email", email);
  if (!user) throw new PublicError("CREDENCIALES", "Correo o contraseña incorrectos.");
  if (user.BloqueadoHasta && new Date(user.BloqueadoHasta).getTime() > Date.now()) {
    throw new PublicError("BLOQUEADO", "Cuenta bloqueada temporalmente. Intenta más tarde.");
  }
  if (user.Estado !== "activo") throw new PublicError("INACTIVO", "Tu cuenta no está activa. Contacta a soporte.");

  if (hashPassword(password, user.Salt) !== user.PasswordHash) {
    const attempts = Number(user.IntentosFallidos || 0) + 1;
    const changes: AnyRow = { IntentosFallidos: attempts };
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      changes.BloqueadoHasta = future(LOCK_MS);
      changes.IntentosFallidos = 0;
    }
    await updateRows("Usuarios", "UserId", user.UserId, changes);
    await auditar(user.UserId, "login_fallido", "usuario", user.UserId, null, null, ctx.ip);
    throw new PublicError("CREDENCIALES", "Correo o contraseña incorrectos.");
  }

  await updateRows("Usuarios", "UserId", user.UserId, {
    IntentosFallidos: 0,
    BloqueadoHasta: "",
    UltimoAcceso: now(),
  });
  const sessionToken = await crearSesion(user.UserId, ctx);
  await auditar(user.UserId, "login", "usuario", user.UserId, null, null, ctx.ip);
  return {
    token: sessionToken,
    usuario: usuarioPublico(user),
    debeCambiarPassword: String(user.DebeCambiarPassword) === "true",
  };
}

async function logout(rawToken: string | null) {
  const user = await verificarSesion(rawToken);
  if (user?.__sessionId) {
    await updateRows("Sesiones", "SessionId", user.__sessionId, { Estado: "cerrada" });
  }
  return { cerrada: true };
}

async function cambiarPassword(user: UserRow, payload: Payload) {
  const actual = String(payload.actual || "");
  const nueva = String(payload.nueva || "");
  if (nueva.length < 8) throw new PublicError("DEBIL", "La nueva contraseña debe tener al menos 8 caracteres.");
  if (String(user.DebeCambiarPassword) !== "true" && hashPassword(actual, user.Salt) !== user.PasswordHash) {
    throw new PublicError("CREDENCIALES", "La contraseña actual es incorrecta.");
  }
  const salt = token(16);
  await updateRows("Usuarios", "UserId", user.UserId, {
    PasswordHash: hashPassword(nueva, salt),
    Salt: salt,
    DebeCambiarPassword: "false",
  });
  await auditar(user.UserId, "cambio_password", "usuario", user.UserId, null, null, "");
  return { actualizada: true };
}

async function solicitarRecuperacion(payload: Payload, ctx: BackendContext) {
  const email = String(payload.email || "").toLowerCase().trim();
  const user = await rowBy<UserRow>("Usuarios", "Email", email);
  if (user) {
    const recoveryToken = token(20);
    await insertRow("RecuperacionPassword", {
      RecoveryId: id("rec"),
      UserId: user.UserId,
      TokenHash: hashToken(recoveryToken),
      FechaCreacion: now(),
      FechaExpiracion: future(RECOVERY_MS),
      Utilizado: "false",
    });
    await auditar(user.UserId, "solicitud_recuperacion", "usuario", user.UserId, null, null, ctx.ip);
    console.info(`Código de recuperación generado para ${email}. Configura un proveedor de email para enviarlo.`);
  }
  return { enviado: true };
}

async function restablecerPassword(payload: Payload, ctx: BackendContext) {
  const rawToken = String(payload.token || "");
  const nueva = String(payload.nueva || "");
  if (nueva.length < 8) throw new PublicError("DEBIL", "La contraseña debe tener al menos 8 caracteres.");
  const recovery = await rowBy<AnyRow>("RecuperacionPassword", "TokenHash", hashToken(rawToken));
  if (!recovery || recovery.Utilizado === "true" || new Date(recovery.FechaExpiracion).getTime() < Date.now()) {
    throw new PublicError("TOKEN_INVALIDO", "El enlace es inválido o expiró.");
  }
  const user = await rowBy<UserRow>("Usuarios", "UserId", recovery.UserId);
  if (!user) throw new PublicError("TOKEN_INVALIDO", "Usuario no encontrado.");
  const salt = token(16);
  await updateRows("Usuarios", "UserId", user.UserId, {
    PasswordHash: hashPassword(nueva, salt),
    Salt: salt,
    DebeCambiarPassword: "false",
    IntentosFallidos: 0,
    BloqueadoHasta: "",
  });
  await updateRows("RecuperacionPassword", "RecoveryId", recovery.RecoveryId, { Utilizado: "true" });
  await auditar(user.UserId, "reset_password", "usuario", user.UserId, null, null, ctx.ip);
  return { restablecida: true };
}

async function registrarCandidato(payload: Payload, ctx: BackendContext) {
  const email = String(payload.email || "").toLowerCase().trim();
  const whatsapp = String(payload.whatsapp || "").replace(/[^\d+]/g, "");
  if (!payload.nombreCompleto || !email || !whatsapp) {
    throw new PublicError("DATOS", "Nombre, correo y WhatsApp son obligatorios.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new PublicError("EMAIL", "El formato del correo no es válido.");
  if (await rowBy("Candidatos", "Email", email) || await rowBy("Usuarios", "Email", email)) {
    throw new PublicError("DUPLICADO", "Este correo ya esta registrado.");
  }
  if (await rowBy("Candidatos", "WhatsApp", whatsapp)) {
    throw new PublicError("DUPLICADO", "Este WhatsApp ya esta registrado.");
  }
  if (!payload.consentimientoDatos || !payload.confirmaVeracidad) {
    throw new PublicError("CONSENTIMIENTO", "Debes aceptar los consentimientos iniciales.");
  }
  if (payload.fechaNacimiento && age(payload.fechaNacimiento) < 18) {
    throw new PublicError("EDAD", "Debes ser mayor de edad para participar.");
  }
  if (!payload.password || String(payload.password).length < 8) {
    throw new PublicError("DEBIL", "La contraseña debe tener al menos 8 caracteres.");
  }

  const candidateId = id("cand");
  await insertRow("Candidatos", {
    CandidateId: candidateId,
    NombreCompleto: payload.nombreCompleto,
    Pais: payload.pais || "",
    Ciudad: payload.ciudad || "",
    FechaNacimiento: payload.fechaNacimiento || "",
    Email: email,
    WhatsApp: whatsapp,
    Documento: payload.documento || "",
    ZonaHoraria: payload.zonaHoraria || "",
    Idioma: payload.idioma || "es",
    FuenteConocio: payload.fuenteConocio || "",
    Experiencia: payload.experiencia || "",
    ExperienciaSoftware: payload.experienciaSoftware || "",
    Sectores: payload.sectores || "",
    Disponibilidad: payload.disponibilidad || "",
    MedioContacto: payload.medioContacto || "",
    Motivacion: payload.motivacion || "",
    Estado: "en_capacitacion",
    FechaRegistro: now(),
    UltimaActividad: now(),
    Progreso: 0,
    Certificado: "false",
  });
  const user = await crearUsuario(email, payload.password, "candidato", candidateId, false);
  const sessionToken = await crearSesion(user.UserId, ctx);
  await auditar("", "registro_candidato", "candidato", candidateId, null, { email }, ctx.ip);
  return { candidateId, token: sessionToken, email };
}

function age(dateValue: string) {
  const born = new Date(dateValue);
  if (Number.isNaN(born.getTime())) return 99;
  const today = new Date();
  let years = today.getFullYear() - born.getFullYear();
  const month = today.getMonth() - born.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < born.getDate())) years--;
  return years;
}

async function getModuleRows() {
  const fromDb = await rows<AnyRow>("Modulos", "Orden");
  return fromDb.length ? fromDb : defaultModuleRows();
}

async function getQuestions(moduleId: string): Promise<QuestionRow[]> {
  const fromDb = await rowsWhere<QuestionRow>("Preguntas", "ModuleId", moduleId);
  const source = fromDb.length ? fromDb : DEFAULT_QUESTIONS.filter((q) => q.ModuleId === moduleId);
  return source.filter((q) => String(q.Estado || "activo") === "activo" || String(q.Estado || "") === "");
}

async function obtenerProgreso(user: UserRow) {
  let [progreso, intentos] = await Promise.all([
    rowsWhere("Progreso", "CandidateId", user.CandidateId),
    rowsWhere("IntentosExamen", "CandidateId", user.CandidateId),
  ]);
  const repaired = await repararProgresoDesdeIntentos(user.CandidateId, progreso, intentos);
  if (repaired) {
    [progreso, intentos] = await Promise.all([
      rowsWhere("Progreso", "CandidateId", user.CandidateId),
      rowsWhere("IntentosExamen", "CandidateId", user.CandidateId),
    ]);
  }
  return { progreso, intentos };
}

async function repararProgresoDesdeIntentos(candidateId: string, progreso: AnyRow[], intentos: AnyRow[]) {
  if (!candidateId) return false;
  const aprobados = new Set(
    intentos
      .filter((a) => String(a.ModuleId) !== "final" && esVerdadero(a.Aprobado))
      .map((a) => String(a.ModuleId)),
  );
  const completos = new Set(
    progreso
      .filter((p) => String(p.Estado) === "completado")
      .map((p) => String(p.ModuleId)),
  );
  const faltantes = Array.from(aprobados).filter((moduleId) => !completos.has(moduleId));
  for (const moduleId of faltantes) {
    const existing = progreso.find((p) => String(p.ModuleId) === moduleId);
    if (existing) {
      await updateRows("Progreso", "ProgressId", existing.ProgressId, {
        Estado: "completado",
        Porcentaje: 100,
        UltimaActividad: now(),
        FechaFinalizacion: existing.FechaFinalizacion || now(),
      });
    } else {
      await insertRow("Progreso", {
        ProgressId: id("prg"),
        CandidateId: candidateId,
        ModuleId: moduleId,
        Estado: "completado",
        Porcentaje: 100,
        FechaInicio: now(),
        FechaFinalizacion: now(),
        UltimaActividad: now(),
      });
    }
  }
  if (faltantes.length) await actualizarProgresoGlobal(candidateId);
  return faltantes.length > 0;
}

async function guardarProgreso(user: UserRow, payload: Payload) {
  const moduleId = String(payload.moduleId || "");
  if (!moduleId) throw new PublicError("DATOS", "moduleId es obligatorio.");
  const porcentaje = Math.max(0, Math.min(100, Number(payload.porcentaje || 0)));
  const estado = payload.estado || (porcentaje >= 100 ? "completado" : "en_progreso");
  const existing = (await rowsWhere<AnyRow>("Progreso", "CandidateId", user.CandidateId))
    .find((p) => String(p.ModuleId) === moduleId);
  if (existing) {
    await updateRows("Progreso", "ProgressId", existing.ProgressId, {
      Estado: estado,
      Porcentaje: porcentaje,
      UltimaActividad: now(),
      FechaFinalizacion: estado === "completado" ? now() : existing.FechaFinalizacion,
    });
  } else {
    await insertRow("Progreso", {
      ProgressId: id("prg"),
      CandidateId: user.CandidateId,
      ModuleId: moduleId,
      Estado: estado,
      Porcentaje: porcentaje,
      FechaInicio: now(),
      FechaFinalizacion: estado === "completado" ? now() : "",
      UltimaActividad: now(),
    });
  }
  await actualizarProgresoGlobal(user.CandidateId);
  return { guardado: true };
}

async function actualizarProgresoGlobal(candidateId: string) {
  const [modules, progress] = await Promise.all([
    getModuleRows(),
    rowsWhere<AnyRow>("Progreso", "CandidateId", candidateId),
  ]);
  const required = modules.filter((m) => String(m.Obligatorio) === "true");
  const completed = required.filter((m) =>
    progress.some((p) => String(p.ModuleId) === String(m.ModuleId) && String(p.Estado) === "completado"),
  ).length;
  const pct = required.length ? Math.round((completed / required.length) * 100) : 0;
  await updateRows("Candidatos", "CandidateId", candidateId, { Progreso: pct, UltimaActividad: now() });
}

async function obtenerExamen(user: UserRow, payload: Payload) {
  const moduleId = String(payload.moduleId || "");
  const attempts = (await rowsWhere<AnyRow>("IntentosExamen", "CandidateId", user.CandidateId))
    .filter((a) => String(a.ModuleId) === moduleId);
  const previousAttempts = attempts.length;
  const alreadyApproved = attempts.some((a) => esVerdadero(a.Aprobado));
  const hasAttemptLimit = moduleId !== "final";
  const maxAttempts = hasAttemptLimit ? await configNum("intentos_por_examen", 3) : null;
  if (hasAttemptLimit && previousAttempts >= maxAttempts! && !alreadyApproved) {
    throw new PublicError("SIN_INTENTOS", "Alcanzaste el máximo de intentos para este examen.");
  }
  let questions = shuffle(await getQuestions(moduleId)).map((q) => ({
    QuestionId: q.QuestionId,
    Tipo: q.Tipo,
    Pregunta: q.Pregunta,
    Opciones: q.Opciones,
    Puntaje: q.Puntaje,
  }));
  if (payload.cantidad) questions = questions.slice(0, Number(payload.cantidad));
  return {
    preguntas: questions,
    intentosRestantes: hasAttemptLimit ? Math.max(0, maxAttempts! - previousAttempts) : null,
    aprobado: alreadyApproved,
  };
}

async function enviarExamen(user: UserRow, payload: Payload) {
  const moduleId = String(payload.moduleId || "");
  const answers = payload.respuestas || {};
  const hasAttemptLimit = moduleId !== "final";
  const maxAttempts = hasAttemptLimit ? await configNum("intentos_por_examen", 3) : null;
  const attempts = (await rowsWhere<AnyRow>("IntentosExamen", "CandidateId", user.CandidateId))
    .filter((a) => String(a.ModuleId) === moduleId);
  const previousAttempts = attempts.length;
  const alreadyApproved = attempts.some((a) => esVerdadero(a.Aprobado));
  if (hasAttemptLimit && previousAttempts >= maxAttempts! && !alreadyApproved) throw new PublicError("SIN_INTENTOS", "Sin intentos disponibles.");

  const bank = await getQuestions(moduleId);
  let total = 0;
  let got = 0;
  const detail: Array<{ QuestionId: string; correcta: boolean; explicacion: string }> = [];
  for (const question of bank) {
    if (answers[question.QuestionId] === undefined) continue;
    const points = Number(question.Puntaje || 1);
    total += points;
    const correcta = grade(question, answers[question.QuestionId]);
    if (correcta) got += points;
    detail.push({ QuestionId: question.QuestionId, correcta, explicacion: question.Explicacion });
  }
  const score = total ? Math.round((got / total) * 100) : 0;
  const module = (await getModuleRows()).find((m) => String(m.ModuleId) === moduleId);
  const minimum = moduleId === "final"
    ? await configNum("puntaje_minimo", 85)
    : Number(module?.PuntajeMinimo || await configNum("puntaje_minimo", 85));
  const approved = score >= minimum;

  await insertRow("IntentosExamen", {
    AttemptId: id("att"),
    CandidateId: user.CandidateId,
    ModuleId: moduleId,
    Puntaje: score,
    Aprobado: approved ? "true" : "false",
    Respuestas: JSON.stringify(answers),
    FechaInicio: payload.fechaInicio || "",
    FechaFinalizacion: now(),
    Duracion: Number(payload.duracion || 0),
  });
  if (approved && moduleId !== "final") {
    await guardarProgreso(user, { moduleId, porcentaje: 100, estado: "completado" });
  }
  return {
    puntaje: score,
    aprobado: approved,
    minimo: minimum,
    detalle: detail,
    guardado: true,
    intentosRestantes: hasAttemptLimit ? Math.max(0, maxAttempts! - (previousAttempts + 1)) : null,
  };
}

function esVerdadero(value: unknown) {
  return value === true || ["true", "1", "si", "sí"].includes(String(value).toLowerCase());
}

function grade(question: QuestionRow, answer: unknown) {
  const correct = String(question.RespuestaCorrecta || "").trim();
  if (String(question.Tipo || "opcion") === "abierta") {
    const keys = correct.toLowerCase().split(";").map((s) => s.trim()).filter(Boolean);
    const text = String(answer || "").toLowerCase();
    const hits = keys.filter((key) => text.includes(key)).length;
    return keys.length > 0 && hits >= Math.ceil(keys.length / 2);
  }
  return String(answer).trim().toLowerCase() === correct.toLowerCase();
}

function shuffle<T>(input: T[]) {
  const copy = input.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function enviarSimulacion(user: UserRow, payload: Payload) {
  await insertRow("Simulaciones", {
    SimulationAttemptId: id("sim"),
    CandidateId: user.CandidateId,
    Escenario: String(payload.escenario || ""),
    Respuestas: JSON.stringify(payload.respuestas || []),
    Puntaje: Math.max(0, Math.min(100, Number(payload.puntaje || 0))),
    Retroalimentacion: payload.retroalimentacion || "",
    Fecha: now(),
  });
  return { guardado: true };
}

async function aceptarTerminos(user: UserRow, payload: Payload, ctx: BackendContext) {
  const docs = Array.isArray(payload.documentos) ? payload.documentos : [];
  const version = await configGet("version_terminos") || "2026.08";
  await Promise.all(docs.map((doc) => insertRow("TerminosAceptados", {
    AcceptanceId: id("term"),
    CandidateId: user.CandidateId,
    TipoDocumento: String(doc),
    Version: version,
    FechaAceptacion: now(),
    IP: ctx.ip,
    UserAgent: ctx.userAgent,
  })));
  await auditar(user.UserId, "aceptar_terminos", "candidato", user.CandidateId, null, { documentos: docs, version }, ctx.ip);
  return { aceptados: docs, version };
}

async function evaluarRequisitos(candidateId: string) {
  const [modules, progress, attempts, terms, simulations] = await Promise.all([
    getModuleRows(),
    rowsWhere<AnyRow>("Progreso", "CandidateId", candidateId),
    rowsWhere<AnyRow>("IntentosExamen", "CandidateId", candidateId),
    rowsWhere<AnyRow>("TerminosAceptados", "CandidateId", candidateId),
    rowsWhere<AnyRow>("Simulaciones", "CandidateId", candidateId),
  ]);
  const required = modules.filter((m) => String(m.Obligatorio) === "true");
  const moduloCompleto = (moduleId: string) =>
    progress.some((p) => String(p.ModuleId) === moduleId && String(p.Estado) === "completado");
  const examenAprobado = (moduleId: string) =>
    attempts.some((a) => String(a.ModuleId) === moduleId && String(a.Aprobado) === "true");
  const requiredDocs = ["terminos", "comisiones", "privacidad", "conducta"];
  const bestFinal = attempts
    .filter((a) => String(a.ModuleId) === "final")
    .reduce((max, attempt) => Math.max(max, Number(attempt.Puntaje || 0)), 0);
  const minimum = await configNum("puntaje_minimo", 85);
  const requisitos: AnyRow = {
    modulosCompletos: required.length > 0 && required.every((m) => moduloCompleto(String(m.ModuleId))),
    examenesAprobados: required.length > 0 && required.every((m) => examenAprobado(String(m.ModuleId))),
    examenFinalAprobado: examenAprobado("final"),
    terminosAceptados: requiredDocs.every((doc) => terms.some((t) => String(t.TipoDocumento) === doc)),
    simulacionesCompletas: simulations.length >= 3,
    puntajeFinal: bestFinal,
    puntajeMinimo: minimum,
    puntajeSuficiente: bestFinal >= minimum,
  };
  requisitos.cumpleTodo = requisitos.modulosCompletos && requisitos.examenesAprobados &&
    requisitos.examenFinalAprobado && requisitos.terminosAceptados &&
    requisitos.simulacionesCompletas && requisitos.puntajeSuficiente;
  return requisitos;
}

async function certificar(user: UserRow, ctx: BackendContext) {
  const req = await evaluarRequisitos(user.CandidateId);
  if (!req.cumpleTodo) throw new PublicError("REQUISITOS", "Aún no cumples todos los requisitos de certificación.");
  if (await rowBy("Vendedores", "CandidateId", user.CandidateId)) {
    throw new PublicError("YA_CERTIFICADO", "Ya estas certificado.");
  }
  const sellerCode = await generarCodigoVendedor();
  const referralCode = `${sellerCode}-REF`;
  const certificateCode = `ATRIA-${new Date().getFullYear()}-${sellerCode}`;
  await insertRow("Certificados", {
    CertificateId: id("cert"),
    CandidateId: user.CandidateId,
    CodigoCertificado: certificateCode,
    FechaEmision: now(),
    PuntajeFinal: req.puntajeFinal,
    Estado: "vigente",
    UrlVerificacion: `?action=verificarCertificado&codigo=${encodeURIComponent(certificateCode)}`,
  });
  await insertRow("Vendedores", {
    SellerId: id("sell"),
    CandidateId: user.CandidateId,
    CodigoVendedor: sellerCode,
    CodigoReferido: referralCode,
    Nivel: "inicial",
    Estado: "activo",
    FechaCertificacion: now(),
    ClientesActivos: 0,
    VentasTotales: 0,
  });
  const temporaryPassword = randomPassword();
  const salt = token(16);
  await updateRows("Usuarios", "UserId", user.UserId, {
    Rol: "vendedor",
    PasswordHash: hashPassword(temporaryPassword, salt),
    Salt: salt,
    DebeCambiarPassword: "true",
  });
  await updateRows("Candidatos", "CandidateId", user.CandidateId, {
    Estado: "certificado",
    Certificado: "true",
  });
  await auditar(user.UserId, "certificacion", "vendedor", sellerCode, null, { codigoCertificado: certificateCode, puntaje: req.puntajeFinal }, ctx.ip);
  return {
    codigoVendedor: sellerCode,
    codigoReferido: referralCode,
    codigoCertificado: certificateCode,
    email: user.Email,
    passwordTemporal: temporaryPassword,
  };
}

async function generarCodigoVendedor() {
  let n = (await rows("Vendedores")).length + 1;
  let code = `V${String(n).padStart(4, "0")}`;
  while (await rowBy("Vendedores", "CodigoVendedor", code)) {
    n++;
    code = `V${String(n).padStart(4, "0")}`;
  }
  return code;
}

async function verificarCertificado(code: string) {
  const certificate = await rowBy<AnyRow>("Certificados", "CodigoCertificado", code);
  if (!certificate) return { valido: false };
  const candidate = await rowBy<AnyRow>("Candidatos", "CandidateId", certificate.CandidateId);
  return {
    valido: String(certificate.Estado) === "vigente",
    codigo: certificate.CodigoCertificado,
    nombre: candidate?.NombreCompleto || "",
    fechaEmision: certificate.FechaEmision,
    puntaje: certificate.PuntajeFinal,
  };
}

async function sellerDeUsuario(user: UserRow) {
  const seller = await rowBy<AnyRow>("Vendedores", "CandidateId", user.CandidateId);
  if (!seller) throw new PublicError("NO_VENDEDOR", "No se encontró tu perfil de vendedor.");
  return seller;
}

async function dashboardVendedor(user: UserRow) {
  const seller = await sellerDeUsuario(user);
  const [prospects, sales, commissions] = await Promise.all([
    rowsWhere<AnyRow>("Prospectos", "SellerId", seller.SellerId),
    rowsWhere<AnyRow>("Ventas", "SellerId", seller.SellerId),
    rowsWhere<AnyRow>("Comisiones", "SellerId", seller.SellerId),
  ]);
  const won = prospects.filter((p) => String(p.Etapa) === "ganado").length;
  const approvedSales = sales.filter((s) => String(s.Estado) === "aprobada");
  const pendingCommissions = commissions.filter((c) => ["pendiente", "aprobada"].includes(String(c.Estado)));
  const paidCommissions = commissions.filter((c) => String(c.Estado) === "pagada");
  const sum = (items: AnyRow[]) => items.reduce((total, item) => total + Number(item.Monto || 0), 0);
  return {
    vendedor: {
      codigoVendedor: seller.CodigoVendedor,
      codigoReferido: seller.CodigoReferido,
      nivel: seller.Nivel,
      estado: seller.Estado,
      fechaCertificacion: seller.FechaCertificacion,
    },
    kpis: {
      prospectos: prospects.length,
      clientesActivos: won,
      ventasCerradas: approvedSales.length,
      comisionesPendientes: sum(pendingCommissions),
      comisionesPagadas: sum(paidCommissions),
      tasaConversion: prospects.length ? Math.round((won / prospects.length) * 100) : 0,
    },
  };
}

async function listarProspectos(user: UserRow) {
  const seller = await sellerDeUsuario(user);
  return rowsWhere("Prospectos", "SellerId", seller.SellerId, "FechaCreacion");
}

async function crearProspecto(user: UserRow, payload: Payload) {
  if (String(await configGet("mantenimiento")) === "1") throw new PublicError("MANTENIMIENTO", "Sistema en mantenimiento. Intenta más tarde.");
  const seller = await sellerDeUsuario(user);
  if (!payload.empresa && !payload.contacto) throw new PublicError("DATOS", "Indica al menos empresa o contacto.");
  const email = String(payload.email || "").toLowerCase().trim();
  const whatsapp = String(payload.whatsapp || "").replace(/[^\d+]/g, "");
  const all = await rows<AnyRow>("Prospectos");
  const duplicate = all.some((p) =>
    (email && String(p.Email).toLowerCase() === email) ||
    (whatsapp && String(p.WhatsApp).replace(/[^\d+]/g, "") === whatsapp),
  );
  if (duplicate) throw new PublicError("DUPLICADO", "Ya existe un prospecto con ese contacto. Un administrador revisará la atribución.");
  const prospectId = id("pros");
  await insertRow("Prospectos", {
    ProspectId: prospectId,
    SellerId: seller.SellerId,
    Empresa: payload.empresa || "",
    Contacto: payload.contacto || "",
    Email: email,
    WhatsApp: whatsapp,
    Pais: payload.pais || "",
    Sector: payload.sector || "",
    Fuente: payload.fuente || "",
    Etapa: payload.etapa || "nuevo",
    ValorEstimado: Number(payload.valorEstimado || 0),
    ProximaAccion: payload.proximaAccion || "",
    FechaSeguimiento: payload.fechaSeguimiento || "",
    Notas: payload.notas || "",
    FechaCreacion: now(),
    FechaActualizacion: now(),
  });
  return { prospectId };
}

async function actualizarProspecto(user: UserRow, payload: Payload) {
  const seller = await sellerDeUsuario(user);
  const prospect = await rowBy<AnyRow>("Prospectos", "ProspectId", String(payload.prospectId || ""));
  if (!prospect) throw new PublicError("NO_ENCONTRADO", "Prospecto no encontrado.");
  if (String(prospect.SellerId) !== String(seller.SellerId)) throw new PublicError("PROHIBIDO", "Este prospecto no te pertenece.");
  const allowed = ["Empresa", "Contacto", "Email", "WhatsApp", "Pais", "Sector", "Fuente", "Etapa", "ValorEstimado", "ProximaAccion", "FechaSeguimiento", "Notas"];
  const changes: AnyRow = { FechaActualizacion: now() };
  for (const column of allowed) {
    const key = column.charAt(0).toLowerCase() + column.slice(1);
    if (payload[key] !== undefined) changes[column] = payload[key];
  }
  await updateRows("Prospectos", "ProspectId", prospect.ProspectId, changes);
  return { actualizado: true };
}

async function registrarActividad(user: UserRow, payload: Payload) {
  const seller = await sellerDeUsuario(user);
  const prospect = await rowBy<AnyRow>("Prospectos", "ProspectId", String(payload.prospectId || ""));
  if (!prospect || String(prospect.SellerId) !== String(seller.SellerId)) {
    throw new PublicError("PROHIBIDO", "Prospecto inválido.");
  }
  await insertRow("ActividadesCRM", {
    ActivityId: id("act"),
    ProspectId: prospect.ProspectId,
    SellerId: seller.SellerId,
    Tipo: payload.tipo || "nota",
    Descripcion: payload.descripcion || "",
    Fecha: now(),
    ProximaAccion: payload.proximaAccion || "",
  });
  if (payload.proximaAccion || payload.fechaSeguimiento) {
    await updateRows("Prospectos", "ProspectId", prospect.ProspectId, {
      ProximaAccion: payload.proximaAccion || prospect.ProximaAccion,
      FechaSeguimiento: payload.fechaSeguimiento || prospect.FechaSeguimiento,
      FechaActualizacion: now(),
    });
  }
  return { registrada: true };
}

async function listarVentas(user: UserRow) {
  const seller = await sellerDeUsuario(user);
  return rowsWhere("Ventas", "SellerId", seller.SellerId, "FechaVenta");
}

async function registrarVenta(user: UserRow, payload: Payload) {
  if (String(await configGet("mantenimiento")) === "1") throw new PublicError("MANTENIMIENTO", "Sistema en mantenimiento.");
  const seller = await sellerDeUsuario(user);
  const amount = Number(payload.monto || 0);
  if (!payload.cliente || !payload.plan || amount <= 0) throw new PublicError("DATOS", "Cliente, plan y monto (>0) son obligatorios.");
  const saleId = id("sale");
  await insertRow("Ventas", {
    SaleId: saleId,
    SellerId: seller.SellerId,
    ProspectId: payload.prospectId || "",
    Cliente: payload.cliente,
    Plan: payload.plan,
    Monto: amount,
    TipoVenta: payload.tipoVenta || "primera",
    FechaVenta: payload.fechaVenta || now(),
    Estado: "pendiente",
    Comprobante: payload.comprobante || "",
    FechaValidacion: "",
    ValidadoPor: "",
  });
  return { saleId, estado: "pendiente" };
}

async function listarComisiones(user: UserRow) {
  const seller = await sellerDeUsuario(user);
  return rowsWhere("Comisiones", "SellerId", seller.SellerId, "FechaCreacion");
}

async function calcularComisionDeVenta(sale: AnyRow) {
  const isRenewal = String(sale.TipoVenta) === "renovacion";
  const pct = isRenewal ? await configNum("comision_renovacion", 0.05) : await configNum("comision_primera_venta", 0.15);
  const amount = Number((Number(sale.Monto || 0) * pct).toFixed(2));
  const commissionId = id("com");
  await insertRow("Comisiones", {
    CommissionId: commissionId,
    SaleId: sale.SaleId,
    SellerId: sale.SellerId,
    Tipo: isRenewal ? "renovacion" : "primera",
    Porcentaje: pct,
    Monto: amount,
    Estado: "pendiente",
    FechaCreacion: now(),
    FechaProgramada: future(1000 * 60 * 60 * 24 * 30),
    FechaPago: "",
    MetodoPago: "",
  });
  return { commissionId, monto: amount, porcentaje: pct };
}

async function registrarChat(payload: Payload, rawToken: string | null) {
  const user = await verificarSesion(rawToken);
  await insertRow("ChatbotLogs", {
    ChatId: id("chat"),
    UserId: user ? user.UserId : (payload.anonId || "anon"),
    Mensaje: payload.mensaje || "",
    Intencion: payload.intencion || "",
    Confianza: Number(payload.confianza || 0),
    Respuesta: payload.respuesta || "",
    Fecha: now(),
    Resuelto: payload.resuelto ? "true" : "false",
  });
  return { registrado: true };
}

async function registrarPreguntaNoResuelta(payload: Payload, rawToken: string | null) {
  const user = await verificarSesion(rawToken);
  await insertRow("PreguntasNoResueltas", {
    UnresolvedId: id("unr"),
    UserId: user ? user.UserId : (payload.anonId || "anon"),
    Pregunta: payload.pregunta || "",
    Contexto: payload.contexto || "",
    Fecha: now(),
    Revisado: "false",
    RespuestaAgregada: "",
  });
  return { registrada: true };
}

async function actualizarPerfil(user: UserRow, payload: Payload) {
  const allowed = ["Ciudad", "ZonaHoraria", "Idioma", "WhatsApp", "MedioContacto"];
  const changes: AnyRow = {};
  for (const column of allowed) {
    const key = column.charAt(0).toLowerCase() + column.slice(1);
    if (payload[key] !== undefined) changes[column] = payload[key];
  }
  if (Object.keys(changes).length) await updateRows("Candidatos", "CandidateId", user.CandidateId, changes);
  return { actualizado: true };
}

async function adminListar(payload: Payload) {
  const table = String(payload.hoja || "");
  if (!ADMIN_TABLES.includes(table)) throw new PublicError("HOJA_INVALIDA", "Hoja no permitida.");
  let data: AnyRow[] = table === "Modulos"
    ? await getModuleRows()
    : table === "Preguntas"
      ? await rows("Preguntas")
      : await rows(table);
  if (table === "Preguntas" && data.length === 0) data = DEFAULT_QUESTIONS;
  if (table === "Usuarios") {
    data = data.map((row) => {
      const { PasswordHash, Salt, ...safe } = row;
      return safe;
    });
  }
  if (payload.filtroColumna && payload.filtroValor !== undefined) {
    data = data.filter((row) => String(row[payload.filtroColumna]) === String(payload.filtroValor));
  }
  return data;
}

async function adminCandidato(user: UserRow, payload: Payload) {
  const candidateId = String(payload.candidateId || "");
  const map: Record<string, string> = { aprobar: "aprobado", rechazar: "rechazado", suspender: "suspendido" };
  if (!map[String(payload.accion || "")]) throw new PublicError("DATOS", "Acción inválida.");
  await updateRows("Candidatos", "CandidateId", candidateId, { Estado: map[payload.accion] });
  await auditar(user.UserId, `admin_candidato_${payload.accion}`, "candidato", candidateId, null, null, "");
  return { estado: map[payload.accion] };
}

async function adminActualizarVenta(user: UserRow, payload: Payload) {
  const saleId = String(payload.saleId || "");
  const estado = String(payload.estado || "");
  if (!["pendiente", "en_revision", "aprobada", "rechazada", "cancelada", "reembolsada"].includes(estado)) {
    throw new PublicError("DATOS", "Estado inválido.");
  }
  const sale = await rowBy<AnyRow>("Ventas", "SaleId", saleId);
  if (!sale) throw new PublicError("NO_ENCONTRADO", "Venta no encontrada.");
  await updateRows("Ventas", "SaleId", saleId, {
    Estado: estado,
    FechaValidacion: now(),
    ValidadoPor: user.Email,
    Comprobante: payload.observacion ? `${sale.Comprobante || ""} | ${payload.observacion}` : sale.Comprobante,
  });
  let commissionInfo = null;
  if (estado === "aprobada") {
    const exists = (await rowsWhere("Comisiones", "SaleId", saleId)).length > 0;
    if (!exists) commissionInfo = await calcularComisionDeVenta({ ...sale, Estado: "aprobada" });
    const approvedSales = (await rowsWhere<AnyRow>("Ventas", "SellerId", sale.SellerId))
      .filter((s) => String(s.Estado) === "aprobada").length;
    await updateRows("Vendedores", "SellerId", sale.SellerId, { VentasTotales: approvedSales, ClientesActivos: approvedSales });
  }
  if (estado === "reembolsada" || estado === "cancelada") {
    await Promise.all((await rowsWhere<AnyRow>("Comisiones", "SaleId", saleId))
      .map((c) => updateRows("Comisiones", "CommissionId", c.CommissionId, { Estado: "anulada" })));
  }
  await auditar(user.UserId, `admin_venta_${estado}`, "venta", saleId, { estado: sale.Estado }, { estado }, "");
  return { estado, comision: commissionInfo };
}

async function adminCalcularComision(user: UserRow, payload: Payload) {
  const sale = await rowBy<AnyRow>("Ventas", "SaleId", String(payload.saleId || ""));
  if (!sale) throw new PublicError("NO_ENCONTRADO", "Venta no encontrada.");
  if (String(sale.Estado) !== "aprobada") throw new PublicError("ESTADO", "La venta debe estar aprobada.");
  if ((await rowsWhere("Comisiones", "SaleId", sale.SaleId)).length) throw new PublicError("YA_EXISTE", "La comisión ya fue calculada.");
  const info = await calcularComisionDeVenta(sale);
  await auditar(user.UserId, "admin_calcular_comision", "venta", sale.SaleId, null, info, "");
  return info;
}

async function adminMarcarComisionPagada(user: UserRow, payload: Payload) {
  const commission = await rowBy<AnyRow>("Comisiones", "CommissionId", String(payload.commissionId || ""));
  if (!commission) throw new PublicError("NO_ENCONTRADO", "Comision no encontrada.");
  await updateRows("Comisiones", "CommissionId", commission.CommissionId, {
    Estado: "pagada",
    FechaPago: now(),
    MetodoPago: payload.metodoPago || "",
  });
  await auditar(user.UserId, "admin_comision_pagada", "comision", commission.CommissionId, { estado: commission.Estado }, { estado: "pagada" }, "");
  return { pagada: true };
}

async function adminRegistrarRenovacion(user: UserRow, payload: Payload) {
  const sale = await rowBy<AnyRow>("Ventas", "SaleId", String(payload.saleId || ""));
  if (!sale) throw new PublicError("NO_ENCONTRADO", "Venta original no encontrada.");
  const amount = Number(payload.monto || sale.Monto || 0);
  const renewalId = id("ren");
  const renewalSaleId = id("sale");
  await insertRow("Ventas", {
    SaleId: renewalSaleId,
    SellerId: sale.SellerId,
    ProspectId: sale.ProspectId,
    Cliente: sale.Cliente,
    Plan: sale.Plan,
    Monto: amount,
    TipoVenta: "renovacion",
    FechaVenta: now(),
    Estado: "aprobada",
    Comprobante: `renovacion de ${sale.SaleId}`,
    FechaValidacion: now(),
    ValidadoPor: user.Email,
  });
  const commission = await calcularComisionDeVenta({ SaleId: renewalSaleId, SellerId: sale.SellerId, Monto: amount, TipoVenta: "renovacion" });
  await insertRow("Renovaciones", {
    RenewalId: renewalId,
    SaleId: sale.SaleId,
    Cliente: sale.Cliente,
    Periodo: payload.periodo || "",
    Monto: amount,
    Estado: "pagada",
    FechaPago: now(),
    CommissionId: commission.commissionId,
  });
  await auditar(user.UserId, "admin_renovacion", "venta", sale.SaleId, null, { monto: amount, comision: commission }, "");
  return { renewalId, comision: commission };
}

async function adminGestionarVendedor(user: UserRow, payload: Payload) {
  const sellerId = String(payload.sellerId || "");
  const changes: AnyRow = {};
  if (["activo", "inactivo", "suspendido"].includes(String(payload.estado || ""))) changes.Estado = payload.estado;
  if (payload.nivel) changes.Nivel = payload.nivel;
  if (!Object.keys(changes).length) throw new PublicError("DATOS", "Nada para actualizar.");
  await updateRows("Vendedores", "SellerId", sellerId, changes);
  await auditar(user.UserId, "admin_gestion_vendedor", "vendedor", sellerId, null, changes, "");
  return changes;
}

async function adminResetPassword(user: UserRow, payload: Payload) {
  const target = await rowBy<UserRow>("Usuarios", "Email", String(payload.email || "").toLowerCase());
  if (!target) throw new PublicError("NO_ENCONTRADO", "Usuario no encontrado.");
  const temporary = randomPassword();
  const salt = token(16);
  await updateRows("Usuarios", "UserId", target.UserId, {
    PasswordHash: hashPassword(temporary, salt),
    Salt: salt,
    DebeCambiarPassword: "true",
    IntentosFallidos: 0,
    BloqueadoHasta: "",
  });
  await Promise.all((await rowsWhere<AnyRow>("Sesiones", "UserId", target.UserId))
    .filter((s) => String(s.Estado) === "activa")
    .map((s) => updateRows("Sesiones", "SessionId", s.SessionId, { Estado: "revocada" })));
  await auditar(user.UserId, "admin_reset_password", "usuario", target.UserId, null, null, "");
  return { passwordTemporal: temporary };
}

async function adminConfigSet(user: UserRow, payload: Payload) {
  if (!payload.clave) throw new PublicError("DATOS", "clave es obligatoria.");
  const previous = await configGet(payload.clave);
  await configSet(String(payload.clave), String(payload.valor), payload.descripcion);
  await auditar(user.UserId, "admin_config", "configuracion", payload.clave, { valor: previous }, { valor: payload.valor }, "");
  return { clave: payload.clave, valor: payload.valor };
}

async function adminGuardarModulo(user: UserRow, payload: Payload) {
  const moduleId = payload.moduleId || id("mod");
  const data = {
    ModuleId: moduleId,
    Titulo: payload.titulo || "",
    Descripcion: payload.descripcion || "",
    Orden: Number(payload.orden || 0),
    Obligatorio: payload.obligatorio ? "true" : "false",
    Estado: payload.estado || "activo",
    TiempoEstimado: payload.tiempoEstimado || "",
    PuntajeMinimo: Number(payload.puntajeMinimo || await configNum("puntaje_minimo", 85)),
  };
  await upsertRow("Modulos", data, "ModuleId");
  await auditar(user.UserId, "admin_guardar_modulo", "modulo", moduleId, null, data, "");
  return { moduleId };
}

async function adminGuardarPregunta(payload: Payload) {
  const questionId = payload.questionId || id("q");
  const data = {
    QuestionId: questionId,
    ModuleId: payload.moduleId || "",
    Tipo: payload.tipo || "opcion",
    Pregunta: payload.pregunta || "",
    Opciones: typeof payload.opciones === "string" ? payload.opciones : JSON.stringify(payload.opciones || []),
    RespuestaCorrecta: payload.respuestaCorrecta || "",
    Explicacion: payload.explicacion || "",
    Puntaje: Number(payload.puntaje || 1),
    Estado: payload.estado || "activo",
  };
  await upsertRow("Preguntas", data, "QuestionId");
  return { questionId };
}

async function adminResolverPregunta(payload: Payload) {
  const unresolvedId = String(payload.unresolvedId || "");
  await updateRows("PreguntasNoResueltas", "UnresolvedId", unresolvedId, {
    Revisado: "true",
    RespuestaAgregada: payload.respuesta || "",
  });
  return { resuelta: true };
}

async function auditar(userId: string, accion: string, entidad: string, entityId: string, before: unknown, after: unknown, ip: string) {
  try {
    await insertRow("Auditoria", {
      AuditId: id("aud"),
      UserId: userId,
      Accion: accion,
      Entidad: entidad,
      EntityId: entityId,
      DatosAnteriores: before ? JSON.stringify(before) : "",
      DatosNuevos: after ? JSON.stringify(after) : "",
      Fecha: now(),
      IP: ip,
    });
  } catch (error) {
    console.warn("[audit]", error);
  }
}

class PublicError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}
