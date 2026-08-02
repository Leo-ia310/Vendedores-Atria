import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import vm from "node:vm";
import pg from "pg";

const root = process.cwd();

export async function seedDefaultQuestions({ log = true } = {}) {
  loadEnv(path.join(root, ".env.local"));
  loadEnv(path.join(root, ".env"));

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL no está definido. Agrégalo a .env.local.");
    process.exit(1);
  }

  const questions = parseDefaultQuestions();
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query("begin");

    for (const question of questions) {
      await client.query(
        `insert into public."Preguntas"
          ("QuestionId", "ModuleId", "Tipo", "Pregunta", "Opciones", "RespuestaCorrecta", "Explicacion", "Puntaje", "Estado")
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         on conflict ("QuestionId") do update set
          "ModuleId" = excluded."ModuleId",
          "Tipo" = excluded."Tipo",
          "Pregunta" = excluded."Pregunta",
          "Opciones" = excluded."Opciones",
          "RespuestaCorrecta" = excluded."RespuestaCorrecta",
          "Explicacion" = excluded."Explicacion",
          "Puntaje" = excluded."Puntaje",
          "Estado" = excluded."Estado"`,
        [
          question.QuestionId,
          question.ModuleId,
          question.Tipo,
          question.Pregunta,
          question.Opciones,
          question.RespuestaCorrecta,
          question.Explicacion,
          question.Puntaje,
          question.Estado,
        ],
      );
    }

    await client.query("commit");
    if (log) console.log(`Preguntas sembradas en Supabase: ${questions.length}.`);
    return questions.length;
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

function parseDefaultQuestions() {
  const source = fs.readFileSync(path.join(root, "lib", "backend", "defaultData.ts"), "utf8");
  const rows = [];
  const counters = {};

  function q(moduleId, tipo, pregunta, opciones, respuestaCorrecta, explicacion) {
    const index = counters[moduleId] = (counters[moduleId] || 0) + 1;
    const row = {
      QuestionId: `q_${moduleId}_${index}`,
      ModuleId: moduleId,
      Tipo: tipo,
      Pregunta: pregunta,
      Opciones: JSON.stringify(opciones),
      RespuestaCorrecta: respuestaCorrecta,
      Explicacion: explicacion,
      Puntaje: 1,
      Estado: "activo",
    };
    rows.push(row);
    return row;
  }

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("q(")) continue;
    const expression = trimmed.replace(/,$/, "");
    vm.runInNewContext(expression, { q });
  }

  return rows;
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await seedDefaultQuestions();
}
