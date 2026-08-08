# Asistente interno IA con RAG

## Variables de entorno

Local: `.env.local`

Produccion: Vercel -> Project -> Settings -> Environment Variables

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

No uses prefijo `NEXT_PUBLIC_`. Estas credenciales solo se leen desde endpoints server-side.

Opcionales:

```env
CLOUDFLARE_WORKERS_AI_MODEL=@cf/meta/llama-3.2-3b-instruct
CLOUDFLARE_WORKERS_AI_EMBEDDING_MODEL=@cf/baai/bge-m3
AI_ASSISTANT_MAX_QUESTION_CHARS=1200
AI_ASSISTANT_MAX_HISTORY_MESSAGES=8
AI_ASSISTANT_TOP_K=5
AI_ASSISTANT_MIN_SIMILARITY=0.18
AI_ASSISTANT_MAX_CONTEXT_CHARS=5200
AI_ASSISTANT_MAX_TOKENS=360
AI_ASSISTANT_MESSAGES_PER_MINUTE=12
AI_ASSISTANT_RATE_LIMIT_WINDOW_MS=60000
AI_ASSISTANT_CHUNK_MAX_CHARS=1200
AI_ASSISTANT_CHUNK_OVERLAP_CHARS=160
```

## Modelos

- Generacion: `@cf/meta/llama-3.2-3b-instruct`.
- Embeddings: `@cf/baai/bge-m3`.

La integracion usa la REST API de Workers AI:

`https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/{model}`

Para cambiar modelos, modifica `CLOUDFLARE_WORKERS_AI_MODEL` o `CLOUDFLARE_WORKERS_AI_EMBEDDING_MODEL`.

## Arquitectura

1. Vendedor o candidato escribe en la UI.
2. El frontend llama `POST /api/academy/assistant/chat` con el token de sesion.
3. El backend valida autenticacion, body, longitud y rate limit.
4. El backend genera embedding de la pregunta.
5. Supabase/pgvector recupera hasta `AI_ASSISTANT_TOP_K` chunks activos.
6. El backend construye prompt con historial corto y contexto oficial.
7. Workers AI genera una respuesta.
8. La respuesta, fuentes y confianza se guardan y se devuelven a la UI.

El navegador nunca llama a Cloudflare.

## Endpoints

- `POST /api/academy/assistant/chat`
- `GET /api/academy/assistant/conversations`
- `GET /api/academy/assistant/conversations/[id]`
- `GET /api/academy/assistant/knowledge`
- `POST /api/academy/assistant/knowledge`
- `PATCH /api/academy/assistant/knowledge/[id]`
- `DELETE /api/academy/assistant/knowledge/[id]`
- `POST /api/academy/assistant/knowledge/[id]/reindex`
- `POST /api/academy/assistant/knowledge/reindex-all`
- `GET /api/academy/assistant/unanswered`
- `PATCH /api/academy/assistant/unanswered/[id]`

Las rutas de conocimiento y preguntas sin respuesta requieren rol `admin`.

## Tablas

- `knowledge_documents`: documentos oficiales editables.
- `knowledge_chunks`: chunks con `embedding vector(1024)` y metadata.
- `assistant_conversations`: historial por usuario.
- `assistant_messages`: mensajes guardados con fuentes/confianza.
- `assistant_question_logs`: metricas de uso, latencia y estado.
- `unanswered_questions`: preguntas que no tienen informacion suficiente.
- `assistant_conflicts`: contradicciones detectadas.

La migracion es `scripts/migrations/20260808_internal_assistant_rag.sql`.

## Chunking y busqueda

El chunking divide por encabezados, parrafos y cortes razonables. Cada chunk guarda `document_id`, `title`, `category`, `section`, `tags` y `chunk_index`.

La busqueda usa `public.match_knowledge_chunks(query_embedding, match_count, min_similarity)` con similitud coseno.

## Administracion

En `/admin/chatbot`, un admin puede crear, editar, activar/desactivar, eliminar y reindexar documentos. Tambien puede revisar preguntas sin respuesta.

Cuando un documento activo cambia, sus embeddings se regeneran. Si queda en borrador, inactivo o archivado, sus chunks se eliminan.

## Agregar conocimiento

1. Ir a `/admin/chatbot`.
2. Crear documento.
3. Escribir solo informacion oficial aprobada.
4. Seleccionar categoria y etiquetas.
5. Usar estado `Activo`.
6. Guardar e indexar.

Para desactivar informacion vieja, cambiar estado a `Inactivo` o `Archivado`.

## Seguridad

- Credenciales Cloudflare solo server-side.
- Autenticacion por token existente.
- Vendedores/candidatos pueden consultar, pero no administrar documentos.
- El prompt trata el contexto recuperado como datos, no instrucciones.
- Si falta informacion oficial, el asistente debe decirlo sin inventar.
- Logs no incluyen tokens ni secrets.

## Costos y limites

- Modelo generativo pequeno.
- Modelo dedicado de embeddings.
- Historial corto configurable.
- `TOP_K` limitado.
- Contexto maximo configurable.
- Respuestas acotadas por `AI_ASSISTANT_MAX_TOKENS`.
- Rate limit por usuario con Upstash si existen `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`; si no, memoria local por instancia.

## Errores

Revisar logs server-side buscando:

- `[assistant-chat-route]`
- `[assistant-chat]`
- `[assistant-knowledge-create]`
- `[assistant-knowledge-update]`
- `[assistant-knowledge-reindex]`
- `[assistant-log]`
- `[assistant-unanswered]`
- `[assistant-conflict]`

Los errores devueltos al frontend son genericos y no revelan credenciales.
