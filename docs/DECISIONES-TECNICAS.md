# Decisiones técnicas

## Marca

La academia usa **ATRIA** como producto y **Academia Comercial ATRIA** como nombre del programa. Las clases CSS históricas `.arca-*` se conservan como detalle interno del diseño para evitar una refactorización visual innecesaria.

## Arquitectura

La app es una aplicación **Next.js** con una API interna en `/api/backend`. El navegador nunca llama a Supabase con permisos administrativos: el cliente llama a la API interna y el servidor valida sesión, rol y reglas de negocio.

## Backend en Supabase

La persistencia vive en Supabase/PostgreSQL. Las tablas de la app se definen en `scripts/supabase-schema.sql`, y los scripts de operación son:

- `npm run db:setup`: crea/verifica tablas, índices, RLS y configuración base.
- `npm run db:reset`: recrea solo las tablas de esta app y vuelve a sembrar preguntas.
- `npm run db:seed`: siembra el banco de preguntas por defecto en `Preguntas`.

## Seguridad

- **Contraseñas:** PBKDF2 + salt + `AUTH_PEPPER`/service key como pepper de servidor.
- **Sesiones:** el token real se entrega al cliente, pero en Supabase solo se guarda su hash. Expira a las 12 horas.
- **Service role:** `SUPABASE_SERVICE_ROLE_KEY` solo se usa en servidor, nunca en componentes cliente.
- **Roles:** se validan siempre en el backend (`conSesion`/`conRol`).
- **Rate limiting básico:** bloqueo temporal tras 5 intentos fallidos de login.
- **Auditoría:** acciones críticas quedan registradas en `Auditoria`.

## Exámenes

`obtenerExamen` devuelve preguntas sin respuesta correcta. `enviarExamen` recalcula el puntaje en backend y registra cada intento. Los exámenes por módulo mantienen intentos configurables; el examen final no tiene límite de intentos.

## Comisiones

El backend calcula la comisión a partir de la venta aprobada y los porcentajes en `Configuracion`. El frontend solo muestra montos, nunca decide comisiones.

## Contenido

El contenido académico, simulaciones, textos legales y base del asistente viven en TypeScript versionado. El progreso, exámenes, simulaciones, certificados, CRM, ventas y comisiones viven en Supabase.

## Asistente Comercial

El asistente usa un motor lógico de scoring, sin IA de pago: normalización de texto, coincidencias por intención, keywords, fuzzy matching y registro de preguntas no resueltas.
