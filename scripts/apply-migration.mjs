import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const root = process.cwd();
loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const migration = process.argv[2];
if (!migration) {
  console.error("Uso: node scripts/apply-migration.mjs scripts/migrations/NOMBRE.sql");
  process.exit(1);
}

const migrationPath = path.isAbsolute(migration) ? migration : path.join(root, migration);
if (!fs.existsSync(migrationPath)) {
  console.error(`No existe la migracion: ${migration}`);
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL no esta definido. Agregalo a .env.local.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(fs.readFileSync(migrationPath, "utf8"));
  console.log(`Migracion aplicada: ${path.relative(root, migrationPath)}`);
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
