# Despliegue y conexión con Supabase

## Backend

1. Crea un proyecto en Supabase.
2. Copia las variables a `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   DATABASE_URL=...
   AUTH_PEPPER=...
   ```

3. Ejecuta:

   ```bash
   npm install
   npm run db:setup
   npm run db:seed
   ```

`db:setup` crea/verifica tablas, índices, configuración base y RLS. `db:seed` carga las preguntas por defecto para todos los módulos y el examen final.

## Frontend local

1. `npm install`
2. `cp .env.example .env.local`
3. Edita `.env.local` con tus credenciales de Supabase.
4. `npm run dev`
5. Abre `http://localhost:3000`

## Producción

1. Sube el repo a GitHub.
2. Importa el proyecto en Vercel o tu plataforma Next.js.
3. Define las variables de entorno de Supabase y `AUTH_PEPPER`.
4. Ejecuta `npm run db:setup` y `npm run db:seed` contra la base de producción.
5. Despliega.

## Verificación rápida

- `/api/backend` debe responder a la acción `ping` con backend `supabase`.
- El registro, login, academia, exámenes, simulador, certificación, CRM y comisiones deben operar mediante `/api/backend`.
- La `service_role` no debe aparecer en el navegador ni en bundles cliente.
