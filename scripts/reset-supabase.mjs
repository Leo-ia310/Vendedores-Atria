import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import { seedDefaultQuestions } from "./seed-default-questions.mjs";

const APP_TABLES = [
  "Configuracion",
  "Candidatos",
  "Usuarios",
  "Sesiones",
  "Modulos",
  "Progreso",
  "Preguntas",
  "IntentosExamen",
  "Simulaciones",
  "TerminosAceptados",
  "Certificados",
  "Vendedores",
  "Prospectos",
  "ActividadesCRM",
  "Ventas",
  "Comisiones",
  "Renovaciones",
  "ChatbotLogs",
  "PreguntasNoResueltas",
  "Auditoria",
  "RecuperacionPassword",
];

const root = process.cwd();
loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está definido. Agrégalo a .env.local.");
  process.exit(1);
}

const schemaSql = fs.readFileSync(path.join(root, "scripts", "supabase-schema.sql"), "utf8");
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query("begin");

  for (const table of APP_TABLES) {
    await client.query(`drop table if exists public.${quoteIdent(table)} cascade`);
  }

  await client.query(schemaSql);
  await client.query("commit");
  const questionCount = await seedDefaultQuestions({ log: false });
  console.log(`Reset completo: ${APP_TABLES.length} tablas de la app fueron recreadas y ${questionCount} preguntas fueron sembradas.`);
} catch (error) {
  await client.query("rollback").catch(() => {});
  throw error;
} finally {
  await client.end();
}

function quoteIdent(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
