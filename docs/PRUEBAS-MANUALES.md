# Pruebas manuales

Checklist para validar la plataforma end-to-end. Marca cada caso.

## Registro
- [ ] Registro válido crea candidato + usuario y entra a la academia.
- [ ] Correo duplicado muestra error "ya está registrado".
- [ ] WhatsApp duplicado muestra error.
- [ ] Correo con formato inválido se rechaza.
- [ ] Teléfono sin código de país se rechaza.
- [ ] Menor de edad (según fecha de nacimiento) se rechaza.
- [ ] Sin aceptar consentimientos no avanza.
- [ ] Contraseña < 8 caracteres se rechaza.

## Autenticación
- [ ] Login correcto redirige según rol.
- [ ] Contraseña incorrecta muestra error genérico.
- [ ] Tras 5 intentos fallidos, la cuenta se bloquea temporalmente.
- [ ] Recuperación de contraseña responde igual exista o no el correo.
- [ ] Restablecer con código válido cambia la contraseña.
- [ ] Código de recuperación expirado se rechaza.
- [ ] Primer ingreso de vendedor fuerza cambio de contraseña.

## Academia y exámenes
- [ ] El módulo siguiente está bloqueado hasta completar el anterior.
- [ ] "Marcar como completado" actualiza el progreso.
- [ ] El examen no expone la respuesta correcta en el frontend (revisa la red).
- [ ] La calificación la devuelve el backend con retroalimentación.
- [ ] Al agotar intentos, no permite reintentar.
- [ ] El examen final tiene temporizador.

## Simulaciones
- [ ] Cada escenario avanza por el árbol de decisión.
- [ ] El puntaje y los criterios se muestran al terminar.
- [ ] La simulación se registra (cuenta para certificación).

## Certificación
- [ ] Sin cumplir requisitos, el botón de certificar está deshabilitado.
- [ ] Aceptar términos registra versión y fecha.
- [ ] Al certificar, muestra credenciales UNA sola vez.
- [ ] Se crea vendedor, código y código de referido.
- [ ] El candidato pasa a rol vendedor.

## Panel del vendedor
- [ ] Resumen muestra KPIs correctos.
- [ ] Crear prospecto funciona; duplicado (mismo email/WhatsApp) se marca para revisión.
- [ ] Cambiar etapa y registrar actividad funciona.
- [ ] Registrar venta la deja en estado "pendiente".
- [ ] No puede editar prospectos de otro vendedor.

## Panel administrativo
- [ ] Solo un admin accede; otros roles son redirigidos.
- [ ] Aprobar una venta genera su comisión (15% / 5%).
- [ ] Reembolsar/cancelar anula la comisión.
- [ ] Marcar comisión como pagada actualiza estado y fecha.
- [ ] Cambiar configuración (p. ej. puntaje mínimo) afecta el cálculo.
- [ ] Resolver una pregunta del chatbot la marca como revisada.

## Chatbot
- [ ] Saludo, agradecimiento y despedida se reconocen.
- [ ] Preguntas sobre comisiones, academia, certificación y acceso responden bien.
- [ ] Errores de tipeo leves aún se reconocen (fuzzy).
- [ ] Pregunta desconocida pide aclaración y se registra en PreguntasNoResueltas.
- [ ] "Contactar soporte" abre WhatsApp.

## Robustez / errores
- [ ] Con `NEXT_PUBLIC_APPS_SCRIPT_URL` vacío, la UI muestra "Backend no configurado".
- [ ] Campos vacíos muestran validación.
- [ ] Sesión expirada redirige a login.
- [ ] Manipular el rol en el cliente no da acceso (el backend valida).
- [ ] Responsive: probar en móvil (sidebar colapsable, tablas con scroll).
