import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const DEFAULT_EMBEDDING_MODEL = "@cf/baai/bge-m3";
const CLOUDFLARE_AI_URL = "https://api.cloudflare.com/client/v4/accounts";
const CHUNK_MAX_CHARS = numberFromEnv("AI_ASSISTANT_CHUNK_MAX_CHARS", 1200);
const CHUNK_OVERLAP_CHARS = numberFromEnv("AI_ASSISTANT_CHUNK_OVERLAP_CHARS", 160);

const root = process.cwd();
loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const connectionString = process.env.DATABASE_URL;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const embeddingModel = process.env.CLOUDFLARE_WORKERS_AI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;

if (!connectionString) {
  console.error("DATABASE_URL no esta definido. Agregalo a .env.local.");
  process.exit(1);
}

if (!accountId || !apiToken) {
  console.error("Cloudflare Workers AI no esta configurado. Define CLOUDFLARE_ACCOUNT_ID y CLOUDFLARE_API_TOKEN.");
  process.exit(1);
}

const DOCUMENTS = [
  {
    id: "kdoc_seed_producto_modulos",
    title: "Producto Arca y modulos principales",
    category: "product",
    tags: ["producto", "modulos", "pos", "inventario", "reportes", "restaurantes"],
    priority: 90,
    content: `
# Que es Arca
Arca es un sistema integral de gestion comercial para PYMEs de Latinoamerica. Integra punto de venta, inventario, reportes, contabilidad y operacion comercial en una sola plataforma.

# Modulos principales
Los modulos que pueden presentarse comercialmente son Punto de venta (POS), pedidos y menu para restaurantes, inventario con lotes, vencimientos y multi-almacen, facturacion, contabilidad automatica, multi-sucursal y reportes.

# Como explicarlo
El asesor no debe recitar todos los botones. Debe conectar cada funcion con un problema real del cliente: ventas desordenadas, diferencias de inventario, falta de reportes, caja sin control o procesos manuales.

# Restaurantes
Para restaurantes, Arca puede presentarse alrededor del flujo diario: menu, pedido, cobro, caja, inventario de insumos y reportes para decidir.
`.trim(),
  },
  {
    id: "kdoc_seed_planes_precios",
    title: "Planes y precios",
    category: "pricing",
    tags: ["planes", "precios", "demo", "pro", "enterprise"],
    priority: 100,
    content: `
# Planes vigentes
Arca tiene 3 planes de referencia para la academia comercial:

- Demo: gratis.
- Pro: 39 USD al mes.
- Enterprise: 149 USD al mes.

# Uso comercial del precio
El plan Pro es la base mas comun para calcular comisiones y para presentar una propuesta inicial a PYMEs.

# Restricciones
No inventes precios, promociones, usuarios incluidos, descuentos, garantias o condiciones si no estan documentados como informacion oficial. Si el cliente pide una condicion no confirmada, el vendedor debe escalarla a administracion.
`.trim(),
  },
  {
    id: "kdoc_seed_comisiones",
    title: "Comisiones de vendedores",
    category: "sellers",
    tags: ["comisiones", "renovaciones", "ventas", "aprobacion"],
    priority: 95,
    content: `
# Comisiones
El vendedor gana 15% sobre la primera venta aprobada de cada cliente y 5% sobre cada renovacion aprobada.

# Condiciones
Solo se reconocen ventas aprobadas y verificadas por administracion. Una venta rechazada o reembolsada no debe generar comision vigente.

# Ejemplo
Para un plan Pro de 39 USD, la primera venta genera aproximadamente 5.85 USD de comision y cada renovacion genera aproximadamente 1.95 USD.

# Atribucion
La atribucion corresponde al primer asesor que registro correctamente el prospecto con evidencia. Los duplicados pasan a revision administrativa.
`.trim(),
  },
  {
    id: "kdoc_seed_objeciones_precio",
    title: "Manejo de objeciones de precio",
    category: "sales",
    tags: ["objeciones", "precio", "valor", "descuentos"],
    priority: 90,
    content: `
# Principio
Cuando un cliente dice "esta caro", muchas veces significa que aun no ve suficiente valor. El vendedor debe preguntar antes de responder.

# Secuencia recomendada
Primero entiende que compara el cliente y que problema quiere resolver. Luego recupera el impacto del problema y conecta Arca con ese impacto. Finalmente propone un siguiente paso concreto.

# Respuesta sugerida
"Entiendo. Para compararlo bien, ayudeme con algo: cuanto tiempo o dinero le cuesta hoy controlar ventas e inventario de forma manual? Si ese problema se repite cada semana, podemos revisar si Pro se paga con el ahorro operativo."

# Restriccion
El vendedor no debe bajar el precio por su cuenta, inventar promociones ni prometer descuentos sin autorizacion.
`.trim(),
  },
  {
    id: "kdoc_seed_excel",
    title: "Excel vs Arca",
    category: "competition",
    tags: ["excel", "competencia", "inventario", "procesos manuales"],
    priority: 85,
    content: `
# Cuando el cliente usa Excel
Excel puede funcionar como registro basico, pero suele depender de disciplina manual. En negocios con inventario, caja, empleados, sucursales o pedidos, los errores de captura y la falta de reportes pueden afectar decisiones.

# Enfoque comercial
No ataques Excel. Pregunta que controles hacen hoy, quien actualiza los archivos, que ocurre cuando hay errores y cuanto tardan en saber ventas, existencias o margen.

# Respuesta sugerida
"Si Excel le funciona para registrar, perfecto. La pregunta es si tambien le ayuda a controlar inventario, caja y reportes en tiempo real sin depender de capturas manuales. Podemos revisar un flujo diario y usted decide si el cambio tiene sentido."
`.trim(),
  },
  {
    id: "kdoc_seed_odoo",
    title: "Comparacion con Odoo y otros sistemas",
    category: "competition",
    tags: ["odoo", "competencia", "comparacion", "valor"],
    priority: 80,
    content: `
# Como competir
No hables mal de competidores. Compara por ajuste al problema, facilidad de adopcion, proceso comercial, soporte y valor para la operacion del cliente.

# Si preguntan por Odoo
El vendedor puede reconocer que Odoo es una alternativa conocida, pero debe volver al diagnostico: que necesita el negocio, que tan rapido quiere implementarlo, que procesos son prioritarios y que soporte espera.

# Respuesta sugerida
"Odoo puede ser una opcion para algunos negocios. Para no comparar solo por nombre o precio, revisemos que necesita resolver primero: inventario, caja, reportes, sucursales o restaurante. Con eso vemos si Arca encaja mejor para su operacion."

# Restriccion
No inventes precios, limitaciones tecnicas o debilidades de Odoo si no estan confirmadas oficialmente.
`.trim(),
  },
  {
    id: "kdoc_seed_proceso_comercial",
    title: "Proceso comercial y demos",
    category: "sales",
    tags: ["ventas", "diagnostico", "demo", "seguimiento", "cierre"],
    priority: 88,
    content: `
# Venta consultiva
Vender Arca significa conectar una necesidad real con una solucion. El asesor debe preguntar, escuchar y recomendar segun el caso.

# Diagnostico
Preguntas utiles: "Como controla sus ventas e inventario hoy?", "Que pasa cuando hay diferencias?", "Quien toma decisiones?", "Que presupuesto tiene?", "Que tan urgente es resolverlo?"

# Demo
La demo debe prepararse con lo descubierto. Muestra dos o tres modulos relevantes, no todo el sistema. En una demo para restaurante conviene mostrar menu, pedido, cobro, inventario y reporte.

# Seguimiento
Despues de una demo, envia resumen, propuesta y proximo paso. Cada seguimiento debe aportar valor y registrarse en el CRM.

# Cierre
Cerrar no es presionar. Es facilitar una decision con valor claro y un siguiente paso concreto.
`.trim(),
  },
  {
    id: "kdoc_seed_reglas_eticas",
    title: "Reglas eticas y promesas permitidas",
    category: "policies",
    tags: ["etica", "promesas", "descuentos", "politicas"],
    priority: 95,
    content: `
# Reglas
El vendedor no debe prometer funciones inexistentes, modificar precios sin autorizacion, ofrecer descuentos no aprobados, registrar prospectos ajenos ni ocultar condiciones.

# Informacion no confirmada
Si una pregunta no aparece en la informacion oficial, el vendedor debe decir que no tiene confirmacion y escalar a administracion.

# Politicas sensibles
No hay informacion oficial cargada en esta base inicial sobre garantias, cancelaciones, reembolsos, metodos de pago especificos, usuarios incluidos por plan, funcionamiento offline o sincronizacion. Esos temas deben confirmarse con administracion antes de prometerse a un cliente.
`.trim(),
  },
  {
    id: "kdoc_seed_academia_certificacion",
    title: "Academia y certificacion",
    category: "faq",
    tags: ["academia", "certificacion", "examenes", "simulaciones"],
    priority: 70,
    content: `
# Academia
La academia tiene 15 modulos que cubren producto, prospeccion, diagnostico, objeciones, cierre, CRM, etica y comisiones.

# Examenes
Cada modulo tiene un examen con calificacion automatica. El puntaje minimo por defecto es 85%. El examen final integra producto, venta consultiva, CRM, etica y comisiones.

# Certificacion
Para certificarse, el candidato debe completar los modulos, aprobar examenes y examen final, realizar al menos 3 simulaciones y aceptar terminos. Al cumplirlo, el sistema crea sus credenciales de vendedor.
`.trim(),
  },
  {
    id: "kdoc_seed_crm",
    title: "CRM, prospectos y ventas",
    category: "sellers",
    tags: ["crm", "prospectos", "ventas", "actividades"],
    priority: 75,
    content: `
# Prospectos
En el panel del vendedor, el asesor registra prospectos con empresa, contacto y datos verificables. Debe evitar duplicados y registrar evidencia.

# Actividades
Las actividades de seguimiento deben incluir notas utiles y proxima accion concreta. Lo que no esta registrado en el CRM no cuenta para seguimiento ni atribucion.

# Ventas
Cuando cierra una venta, el asesor la registra con cliente, plan, monto y comprobante. La venta queda pendiente hasta que administracion la aprueba.
`.trim(),
  },
];

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  let indexedDocuments = 0;
  let indexedChunks = 0;

  for (const document of DOCUMENTS) {
    const inserted = await insertDocumentIfMissing(document);
    const chunkCount = await countChunks(document.id);
    if (!inserted && chunkCount > 0) continue;

    await client.query("delete from public.knowledge_chunks where document_id = $1", [document.id]);
    const chunks = chunkText(document.content);
    const embeddings = await generateEmbeddings(chunks.map((chunk) => chunk.content));

    for (const [index, chunk] of chunks.entries()) {
      await client.query(
        `
          insert into public.knowledge_chunks (
            id, document_id, content, embedding, chunk_index, metadata, created_at, updated_at
          ) values ($1, $2, $3, $4::vector, $5, $6::jsonb, $7, $8)
        `,
        [
          `kchn_seed_${document.id.replace(/^kdoc_seed_/, "")}_${index}`,
          document.id,
          chunk.content,
          vectorToSql(embeddings[index]),
          index,
          JSON.stringify({
            document_id: document.id,
            title: document.title,
            category: document.category,
            section: chunk.section,
            tags: document.tags,
            chunk_index: index,
          }),
          now(),
          now(),
        ],
      );
    }

    indexedDocuments += 1;
    indexedChunks += chunks.length;
  }

  console.log(`Base de conocimiento inicial lista: ${indexedDocuments} documentos indexados, ${indexedChunks} chunks.`);
} finally {
  await client.end();
}

async function insertDocumentIfMissing(document) {
  const result = await client.query(
    `
      insert into public.knowledge_documents (
        id, title, content, category, tags, status, priority, official,
        created_by, version, created_at, updated_at
      ) values ($1, $2, $3, $4, $5, 'active', $6, true, 'seed', 1, $7, $8)
      on conflict (id) do nothing
    `,
    [
      document.id,
      document.title,
      document.content,
      document.category,
      document.tags,
      document.priority,
      now(),
      now(),
    ],
  );
  return result.rowCount > 0;
}

async function countChunks(documentId) {
  const result = await client.query("select count(*)::int as count from public.knowledge_chunks where document_id = $1", [documentId]);
  return Number(result.rows[0]?.count || 0);
}

async function generateEmbeddings(texts) {
  const response = await fetch(
    `${CLOUDFLARE_AI_URL}/${encodeURIComponent(accountId)}/ai/run/${embeddingModel}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: texts }),
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Cloudflare Workers AI embeddings respondio con estado ${response.status}.`);
  }

  const embeddings = extractEmbeddings(payload);
  if (embeddings.length !== texts.length) {
    throw new Error("Cloudflare Workers AI devolvio embeddings invalidos.");
  }
  return embeddings;
}

function chunkText(content) {
  const sections = splitSections(content);
  const chunks = [];
  for (const section of sections) {
    const paragraphs = section.content.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
    let buffer = "";
    for (const paragraph of paragraphs) {
      if (buffer && `${buffer}\n\n${paragraph}`.length > CHUNK_MAX_CHARS) {
        chunks.push({ content: buffer, section: section.title });
        buffer = overlap(buffer);
      }
      buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    }
    if (buffer.trim()) chunks.push({ content: buffer.trim(), section: section.title });
  }
  return chunks.length > 0 ? chunks : [{ content: content.slice(0, CHUNK_MAX_CHARS), section: "General" }];
}

function splitSections(content) {
  const lines = content.split(/\r?\n/);
  const sections = [];
  let currentTitle = "General";
  let current = [];
  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line)) {
      if (current.join("\n").trim()) {
        sections.push({ title: currentTitle, content: current.join("\n").trim() });
      }
      currentTitle = line.replace(/^#{1,3}\s+/, "").trim() || "General";
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.join("\n").trim()) {
    sections.push({ title: currentTitle, content: current.join("\n").trim() });
  }
  return sections;
}

function overlap(text) {
  if (CHUNK_OVERLAP_CHARS <= 0) return "";
  return text.slice(Math.max(0, text.length - CHUNK_OVERLAP_CHARS)).trim();
}

function extractEmbeddings(payload) {
  const candidates = [];
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    candidates.push(payload.data);
    if (payload.result && typeof payload.result === "object" && !Array.isArray(payload.result)) {
      candidates.push(payload.result.data);
      if (payload.result.response && typeof payload.result.response === "object" && !Array.isArray(payload.result.response)) {
        candidates.push(payload.result.response.data);
      }
    }
  }
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.every(isNumberArray)) return candidate;
  }
  return [];
}

function isNumberArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isFinite(item));
}

function vectorToSql(embedding) {
  return `[${embedding.map((value) => Number(value).toFixed(8)).join(",")}]`;
}

function now() {
  return new Date().toISOString();
}

function numberFromEnv(key, fallback) {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
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
