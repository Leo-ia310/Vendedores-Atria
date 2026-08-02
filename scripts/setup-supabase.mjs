import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import { seedDefaultQuestions } from "./seed-default-questions.mjs";

const root = process.cwd();
loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está definido. Agrégalo a .env.local.");
  process.exit(1);
}

const sql = fs.readFileSync(path.join(root, "scripts", "supabase-schema.sql"), "utf8");
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  await seedDefaultQuestions({ log: false });
  console.log("Supabase listo: tablas, índices, config y RLS verificados.");
} finally {
  await client.end();
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
