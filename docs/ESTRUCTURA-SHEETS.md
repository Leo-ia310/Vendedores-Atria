# Estructura de Google Sheets (26 hojas)

El script crea automáticamente estas hojas con sus encabezados (`ARCA → 1. Inicializar / reparar hojas`). Fila 1 = encabezados (bloqueada). No renombres columnas.

| Hoja | Propósito |
|---|---|
| **Configuracion** | Parámetros del sistema (comisiones, puntaje mínimo, intentos, versión de términos, mantenimiento). |
| **Candidatos** | Registro de aspirantes y su progreso. |
| **Usuarios** | Credenciales (hash+salt), rol, estado, bloqueo, cambio de contraseña. |
| **Sesiones** | Tokens de sesión (solo hash), expiración, IP, user-agent. |
| **Modulos** | Metadatos de módulos (orden, obligatorio, puntaje mínimo). |
| **Progreso** | Estado y porcentaje por módulo y candidato. |
| **Preguntas** | Banco de preguntas por módulo (tipo, opciones, respuesta correcta, explicación). |
| **IntentosExamen** | Cada intento con puntaje, aprobado, respuestas, duración. |
| **Simulaciones** | Intentos de simulador con puntaje y retroalimentación. |
| **TerminosAceptados** | Documento, versión, fecha, IP y user-agent de cada aceptación. |
| **Certificados** | Certificados emitidos con código y puntaje final. |
| **Vendedores** | Vendedores certificados (código, referido, nivel, estado). |
| **Prospectos** | CRM: prospectos por vendedor con etapa y seguimiento. |
| **ActividadesCRM** | Actividades/interacciones sobre prospectos. |
| **Ventas** | Ventas registradas con estado de validación. |
| **Comisiones** | Comisiones calculadas (tipo, %, monto, estado, fechas). |
| **Renovaciones** | Renovaciones de clientes y su comisión. |
| **ChatbotLogs** | Historial de conversaciones del asistente. |
| **PreguntasNoResueltas** | Preguntas que el chatbot no reconoció (para revisión). |
| **Auditoria** | Registro de acciones críticas (login, certificación, ventas, config…). |
| **RecuperacionPassword** | Tokens de recuperación (solo hash), expiración, uso. |

## Columnas por hoja (resumen de las principales)

**Configuracion:** `Clave, Valor, Descripcion, FechaActualizacion`
Claves por defecto: `comision_primera_venta=0.15`, `comision_renovacion=0.05`, `puntaje_minimo=85`, `intentos_por_examen=3`, `intentos_examen_final=2`, `version_terminos`, `moneda=USD`, `whatsapp_soporte`, `mantenimiento=0`.

**Candidatos:** `CandidateId, NombreCompleto, Pais, Ciudad, FechaNacimiento, Email, WhatsApp, Documento, ZonaHoraria, Idioma, FuenteConocio, Experiencia, ExperienciaSoftware, Sectores, Disponibilidad, MedioContacto, Motivacion, Estado, FechaRegistro, UltimaActividad, Progreso, Certificado`

**Usuarios:** `UserId, CandidateId, Email, PasswordHash, Salt, Rol, Estado, DebeCambiarPassword, UltimoAcceso, IntentosFallidos, BloqueadoHasta, FechaCreacion`

**Sesiones:** `SessionId, UserId, TokenHash, FechaCreacion, FechaExpiracion, Estado, IP, UserAgent`

**Modulos:** `ModuleId, Titulo, Descripcion, Orden, Obligatorio, Estado, TiempoEstimado, PuntajeMinimo`

**Progreso:** `ProgressId, CandidateId, ModuleId, Estado, Porcentaje, FechaInicio, FechaFinalizacion, UltimaActividad`

**Preguntas:** `QuestionId, ModuleId, Tipo, Pregunta, Opciones, RespuestaCorrecta, Explicacion, Puntaje, Estado`
- `Tipo`: `opcion` | `vf` | `abierta`. `Opciones`: JSON array (ej. `["A","B","C"]`). Para `abierta`, `RespuestaCorrecta` = palabras clave separadas por `;`.
- Los `ModuleId` deben coincidir con los del frontend (`mod1`..`mod15`; el examen final usa `final`).

**Preguntas (examen final):** usa `ModuleId = final`.

**IntentosExamen:** `AttemptId, CandidateId, ModuleId, Puntaje, Aprobado, Respuestas, FechaInicio, FechaFinalizacion, Duracion`

**Ventas:** `SaleId, SellerId, ProspectId, Cliente, Plan, Monto, TipoVenta, FechaVenta, Estado, Comprobante, FechaValidacion, ValidadoPor`
- `TipoVenta`: `primera` | `renovacion`. `Estado`: `pendiente | en_revision | aprobada | rechazada | cancelada | reembolsada`.

**Comisiones:** `CommissionId, SaleId, SellerId, Tipo, Porcentaje, Monto, Estado, FechaCreacion, FechaProgramada, FechaPago, MetodoPago`
- `Estado`: `pendiente | aprobada | pagada | anulada`.

*(El resto de columnas está declarado en `script.txt`, sección `SHEETS`.)*

## Cómo se calculan las comisiones
Al **aprobar** una venta (admin), el backend crea la comisión: `Monto = Venta.Monto × %` donde `%` viene de `Configuracion` (`comision_primera_venta` o `comision_renovacion`). El frontend nunca decide el monto.
