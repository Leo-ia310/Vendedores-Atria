# Cloudflare Workers AI en el simulador

## Variables de entorno

Local: `.env.local`

Produccion: Vercel -> Project -> Settings -> Environment Variables

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

No uses prefijo `NEXT_PUBLIC_`. Estas variables solo se leen desde endpoints server-side.

Opcional:

```env
CLOUDFLARE_WORKERS_AI_MODEL=@cf/meta/llama-3.2-3b-instruct
AI_SIMULATOR_MAX_HISTORY_MESSAGES=12
AI_SIMULATOR_CHAT_MAX_TOKENS=140
AI_SIMULATOR_MESSAGES_PER_MINUTE=12
AI_SIMULATOR_EVALUATIONS_PER_MINUTE=4
```

Si existen `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`, el rate limit usa Upstash Redis mediante REST. Si no existen, usa un limitador en memoria por instancia serverless.

## Modelo utilizado

Modelo por defecto: `@cf/meta/llama-3.2-3b-instruct`.

La integracion usa la REST API de Workers AI:

`https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/{model}`

Para cambiar de modelo, configura `CLOUDFLARE_WORKERS_AI_MODEL` sin tocar la UI ni los endpoints.

## Endpoints

- `POST /api/academy/simulator/chat`
- `POST /api/academy/simulator/evaluate`

Ambos requieren la sesion existente de la app en `Authorization: Bearer <token>`. El frontend nunca llama a Cloudflare directamente.

## Estructura

- `lib/ai/provider.ts`: contrato generico del proveedor IA.
- `lib/ai/cloudflare.ts`: proveedor REST de Cloudflare Workers AI.
- `lib/ai/prompts/sales-simulator.ts`: prompt del cliente simulado.
- `lib/ai/prompts/sales-evaluator.ts`: prompt del entrenador de ventas.
- `lib/content/sales-scenarios.ts`: configuracion de escenarios, perfiles, objeciones y sugerencias.
- `components/academia/SimuladorRunner.tsx`: chat libre, sugerencias, finalizacion y resultado.

## Agregar escenarios

1. Agrega el escenario base en `lib/content/simulaciones.ts` si necesitas conservar fallback logico.
2. Agrega su perfil en `SCENARIO_PROFILES` dentro de `lib/content/sales-scenarios.ts`.
3. Agrega sugerencias opcionales en `SUGGESTED_RESPONSES`.

Cada perfil define negocio, empleados, sistema actual, problemas, presupuesto, personalidad, objeciones, dificultad y condiciones de interes/rechazo.

## Evaluacion

Al finalizar, `/api/academy/simulator/evaluate` llama a IA como entrenador de ventas y valida JSON estructurado:

- discovery: 0-20
- communication: 0-20
- objections: 0-20
- productKnowledge: 0-20
- closing: 0-20
- score total: 0-100

Tambien guarda fortalezas, errores, oportunidades, principal error, recomendacion, respuesta mejor sugerida y resumen.

## Persistencia

Se reutiliza la tabla existente `public."Simulaciones"` para no duplicar intentos. La migracion `scripts/migrations/20260808_sales_simulator_ai.sql` agrega campos estructurados:

- `UserId`
- `ScenarioId`
- `Difficulty`
- `Status`
- `StartedAt`
- `FinishedAt`
- `Score`
- `Messages` JSONB
- `Evaluation` JSONB
- `CreatedAt`
- `UpdatedAt`

Los campos legacy (`Escenario`, `Respuestas`, `Puntaje`, `Retroalimentacion`, `Fecha`) se mantienen para compatibilidad con certificacion y admin.

## Limites y costos

- Historial enviado al modelo: por defecto ultimos 12 mensajes.
- Tokens de salida de chat: por defecto 140.
- Modelo pequeno por defecto.
- Respuestas del cliente instruidas a 2-3 oraciones.
- Rate limit configurable por usuario.

## Errores

Los errores de Cloudflare se registran server-side con codigo y escenario, sin credenciales. Si falla IA o falta configuracion, el simulador usa respuesta/evaluacion de respaldo y muestra un aviso amigable.
