# Pendientes y limitaciones

## Limitaciones conocidas (por diseño inicial)

- **Escala.** Google Sheets + Apps Script tiene **cuotas** (ejecuciones, tiempo, lecturas/escrituras) y latencia. Sirve para arrancar y para decenas de vendedores activos, **no** para miles concurrentes. Migrar a **PostgreSQL/Supabase** (como el SaaS ARCA) al escalar.
- **Hash de contraseñas.** SHA-256 iterado + salt + pepper (no `bcrypt`/`argon2`, no disponibles en Apps Script). Es razonable pero inferior a un KDF dedicado. Al migrar a una DB, usar `bcrypt`/`argon2`.
- **IP del cliente.** Apps Script no expone de forma fiable la IP real; el registro de IP en aceptación de términos/sesiones es *best-effort* (puede ir vacío).
- **Correos.** El envío de credenciales y recuperación usa `MailApp`, sujeto a cuota diaria de Gmail. Si falla, la contraseña temporal se muestra en pantalla al certificar (una vez) y el admin puede resetear.
- **Concurrencia.** `LockService` serializa escrituras; bajo alta concurrencia puede haber esperas o `BUSY`.

## Trabajo futuro (marcado como pendiente en la UI)

- **Recursos descargables** reales (manual, presentaciones, guiones, plantillas): hoy son *placeholders*.
- **Videos**: los contenedores están listos ("AQUÍ VA UN VIDEO…"); falta insertar los `<iframe>`/fuentes.
- **Reset de contraseña de vendedor desde el panel admin**: el backend ya expone `adminResetPassword`; falta el botón en la tabla de vendedores (requiere mapear vendedor→email).
- **Ranking de vendedores**: definido en el alcance; no implementado en UI.
- **Editor de módulos/preguntas desde el admin**: el backend expone `adminGuardarModulo`/`adminGuardarPregunta`; falta la UI de edición.
- **Renovaciones desde el admin**: backend `adminRegistrarRenovacion` listo; falta el botón/flujo en la UI.
- **Notificaciones y sesiones activas** en el perfil: pendientes.
- **Verificación pública de certificados**: `doGet?action=verificarCertificado&codigo=...` existe; falta una página pública que lo consuma.
- **Exportaciones (CSV)** desde el admin: pendientes.
- **Modo mantenimiento**: la bandera `mantenimiento` bloquea escrituras de vendedores en el backend; falta el interruptor visual y un aviso global.

## Recordatorios

- Cambia las contraseñas de prueba antes de cualquier uso real.
- Los documentos legales son **borradores** y deben revisarse con un abogado por jurisdicción.
- Crea una **nueva versión** de la implementación de Apps Script cada vez que edites `script.txt`.
