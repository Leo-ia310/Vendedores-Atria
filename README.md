# Academia Comercial ATRIA

Plataforma web para reclutar, capacitar, certificar y administrar vendedores por comisión de ATRIA. Incluye registro, academia, exámenes, simulaciones, certificación, CRM, ventas, comisiones y panel administrativo.

## Stack

- Next.js 15 (App Router), React 19 y TypeScript.
- Tailwind v4 con design system propio.
- Supabase/PostgreSQL como backend.
- Chatbot logico local (reglas + scoring), cargado de forma diferida.

## Puesta En Marcha

```bash
npm install
cp .env.example .env.local
npm run db:setup
npm run dev
```

Scripts principales:

- `npm run dev`: servidor local.
- `npm run build`: build de produccion.
- `npm run start`: servir build.
- `npm run typecheck`: TypeScript.
- `npm run db:setup`: crea/verifica tablas, indices, RLS y configuracion base en Supabase usando `DATABASE_URL`.

## Variables

`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` pueden existir en cliente. `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` y `AUTH_PEPPER` son solo de servidor.

## Estructura

```text
app/
  api/backend/        API interna Next + Supabase
  (marketing)/        landing y paginas legales
  (auth)/             login, recuperar, restablecer, cambiar-password
  registro/           wizard de registro
  (academia)/         academia, exámenes, simulador y certificación
  (dashboard)/        panel del vendedor
  (admin)/            panel administrativo
components/
  app/ ui/ marketing/ academia/ chatbot/
lib/
  api.ts              cliente unico hacia /api/backend
  backend/            router de acciones y datos fallback
  supabase/           cliente server-only
  auth/ hooks/ content/ chatbot/
scripts/
  supabase-schema.sql
  setup-supabase.mjs
```

## Seguridad

La app no expone la `service_role` en el navegador. Las llamadas del cliente entran por `/api/backend`; el servidor valida sesión/rol y usa Supabase con RLS activado. Las contraseñas se guardan con PBKDF2 + salt + `AUTH_PEPPER`; los tokens de sesión y recuperación se guardan hasheados.
