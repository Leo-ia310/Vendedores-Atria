# Pruebas del asistente interno IA

- [ ] `/asistente` carga para candidato autenticado.
- [ ] `/panel/asistente` carga para vendedor autenticado.
- [ ] Pregunta "Cuanto cuesta Pro?" responde con fuentes.
- [ ] Follow-up "Y Enterprise?" usa historial corto.
- [ ] Pregunta de asesoria "Que le digo si usa Excel?" responde como sugerencia comercial.
- [ ] Pregunta inexistente no inventa y registra en `unanswered_questions`.
- [ ] Prompt injection no revela system prompt ni credenciales.
- [ ] Sin token, `/api/academy/assistant/chat` devuelve 401.
- [ ] Input vacio devuelve 400.
- [ ] Input demasiado largo devuelve 413.
- [ ] Candidato/vendedor no puede crear documentos de conocimiento.
- [ ] Admin puede crear, editar, reindexar, desactivar y eliminar documentos.
- [ ] Admin puede revisar preguntas sin respuesta.
- [ ] Fallo de Workers AI devuelve error generico y log server-side.
- [ ] Fallo de embeddings no revela detalles internos.
- [ ] No existe `NEXT_PUBLIC_CLOUDFLARE_*` en el frontend.
