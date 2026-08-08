# Estructura de Supabase

Las tablas de la app están en `public` y se crean con `scripts/supabase-schema.sql`. El script `npm run db:reset` borra y recrea solo estas tablas de la app.

| Tabla | Propósito |
|---|---|
| **Configuracion** | Parámetros del sistema: comisiones, puntaje mínimo, intentos por módulo, versión de términos y mantenimiento. |
| **Candidatos** | Registro de aspirantes y progreso general. |
| **Usuarios** | Credenciales hasheadas, rol, estado, bloqueo y cambio de contraseña. |
| **Sesiones** | Tokens de sesión hasheados, expiración, IP y user-agent. |
| **Modulos** | Metadatos de módulos: orden, obligatorio, puntaje mínimo y estado. |
| **Progreso** | Estado y porcentaje por módulo y candidato. |
| **Preguntas** | Banco de preguntas por módulo y examen final. |
| **IntentosExamen** | Cada intento con puntaje, aprobado, respuestas y duración. |
| **Simulaciones** | Intentos del simulador con mensajes, puntaje, evaluacion JSON y retroalimentacion legacy. |
| **TerminosAceptados** | Documento, versión, fecha, IP y user-agent de cada aceptación. |
| **Certificados** | Certificados emitidos con código y puntaje final. |
| **Vendedores** | Vendedores certificados, código, referido, nivel y estado. |
| **Prospectos** | CRM: prospectos por vendedor con etapa y seguimiento. |
| **ActividadesCRM** | Actividades/interacciones sobre prospectos. |
| **Ventas** | Ventas registradas con estado de validación. |
| **Comisiones** | Comisiones calculadas: tipo, porcentaje, monto, estado y fechas. |
| **Renovaciones** | Renovaciones de clientes y su comisión. |
| **ChatbotLogs** | Historial de conversaciones del asistente. |
| **PreguntasNoResueltas** | Preguntas que el asistente no reconoció. |
| **Auditoria** | Registro de acciones críticas. |
| **RecuperacionPassword** | Tokens de recuperación hasheados, expiración y uso. |

## Configuración base

Claves por defecto:

- `comision_primera_venta=0.15`
- `comision_renovacion=0.05`
- `puntaje_minimo=85`
- `intentos_por_examen=3`
- `intentos_examen_final=0` (sin límite)
- `version_terminos=2026.08`
- `moneda=USD`
- `whatsapp_soporte`
- `mantenimiento=0`

## Preguntas

`npm run db:seed` carga 57 preguntas:

- 3 preguntas por cada módulo `mod1` a `mod15`.
- 12 preguntas para el examen final (`ModuleId = final`).

Columnas principales: `QuestionId, ModuleId, Tipo, Pregunta, Opciones, RespuestaCorrecta, Explicacion, Puntaje, Estado`.

## Ventas y comisiones

Al aprobar una venta, el backend crea la comisión con:

`Monto = Venta.Monto * porcentaje`

El porcentaje viene de `Configuracion` según `TipoVenta`:

- `primera`: `comision_primera_venta`
- `renovacion`: `comision_renovacion`
