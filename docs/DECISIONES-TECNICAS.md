# Decisiones técnicas

## Marca
El SaaS real se muestra como **ARCA** en toda su UI (aunque el repositorio se llame "Atria"). Se decidió usar **ARCA** como producto y **"Academia Comercial ARCA"** como submarca del programa, para coherencia total con lo que ya ven los clientes.

## App independiente, no integrada
La academia es una **app Next.js separada** del SaaS ARCA (que usa PostgreSQL/NextAuth). Razón: el requerimiento exige backend en **Google Sheets + Apps Script**, incompatible con fusionar directamente el motor Postgres del SaaS. Se reutiliza la **identidad visual** (tokens `@theme`, tipografía, componentes `.arca-*`) para que se vea oficial.

## Backend en Google Apps Script
Un solo endpoint (`doPost`) enruta por `action`. Ventajas: gratis, sin infraestructura, fácil de operar por el dueño. Límites conocidos (ver PENDIENTES).

- **CORS:** los POST usan `text/plain` para evitar el *preflight* que Apps Script no maneja; el cuerpo viaja como JSON string.
- **Concurrencia:** `LockService` serializa escrituras para evitar condiciones de carrera en las hojas.
- **Capa de datos genérica:** helpers `leerTabla/buscarFila/insertarFila/actualizarFila` operan por nombre de columna, lo que hace el código legible y menos frágil ante cambios.

## Seguridad
- **Contraseñas:** SHA-256 iterado (5000×) sobre `pepper + salt + password`. `bcrypt` no está disponible de forma nativa en Apps Script; SHA-256 iterado con salt+pepper es el mejor compromiso dentro de la plataforma. El `pepper` vive en `PropertiesService`, no en las hojas.
- **Sesiones:** token aleatorio; en la hoja solo se guarda su **hash**. Expiran a las 12 h.
- **Roles:** se validan **siempre** en el backend (`conRol`), nunca se confía en el cliente.
- **Anti-inyección de fórmulas:** `sanitizar` neutraliza valores que empiezan con `= + - @` y elimina caracteres de control.
- **Rate limiting básico:** bloqueo temporal tras 5 intentos fallidos de login.
- **Auditoría:** acciones críticas (login, certificación, cambios de venta/comisión/config) quedan registradas.

## Anti-trampa en exámenes
`obtenerExamen` devuelve las preguntas **sin** la respuesta correcta. La calificación ocurre en `enviarExamen` (backend). El frontend nunca conoce ni decide el resultado.

## Comisiones desde el backend
El monto se calcula en Apps Script a partir del monto de la venta y el porcentaje de `Configuracion`. El frontend solo muestra; nunca envía montos de comisión.

## Contenido en código vs datos en Sheets
El **contenido** (15 módulos, simulaciones, textos legales, base del chatbot) vive en TypeScript versionado: es rápido, fácil de revisar y no consume cuota de Sheets. El **progreso y los resultados** sí se guardan en Sheets. Los `ModuleId` del frontend (`mod1..mod15`, `final`) deben coincidir con la hoja `Modulos`.

## Chatbot lógico
Motor de **scoring** (no IA de pago): normalización (minúsculas, sin tildes), coincidencia exacta/frase/keyword, **fuzzy** (Levenshtein) para errores de tipeo, patrones regex opcionales, bonificación por contexto y penalización por negación. Bajo el umbral, pide aclaración y registra la pregunta en `PreguntasNoResueltas`. La base de conocimiento (`chatbotKnowledge.ts`) es **editable** sin tocar el motor.

## Estado de autenticación en el cliente
`AuthProvider` guarda el token en `localStorage` y valida la sesión con `sesionActual`. `AppShell` actúa como *guard* por rol y fuerza el cambio de contraseña cuando corresponde.
