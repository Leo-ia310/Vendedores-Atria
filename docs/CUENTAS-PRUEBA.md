# Cuentas y roles de prueba

Usa estos datos como referencia cuando cargues cuentas demo en Supabase o desde el panel admin. No uses datos personales reales.

> Cambia estas contraseñas antes de cualquier uso real. Son solo para pruebas locales.

| Rol | Correo | Contraseña | Notas |
|---|---|---|---|
| **Administrador** | *(el que definiste)* | *(la que definiste)* | Se crea desde Supabase o desde un flujo administrativo interno. |
| **Vendedor** | `vendedor.demo@atria.app` | `vendedor123!` | Certificado y listo para entrar al panel de vendedor. |
| **Candidato** | `candidato.demo@atria.app` | `Candidato123!` | En capacitación (40% de progreso). |

## Roles del sistema

- **candidato**: puede acceder a la academia, exámenes, simulador y certificación. Al certificarse pasa a **vendedor**.
- **vendedor**: accede al panel: CRM, prospectos, ventas, comisiones, academia y recursos.
- **admin**: accede al panel administrativo: candidatos, vendedores, validación de ventas, comisiones, chatbot y configuración. Un admin también puede entrar a las vistas de otros roles.

## Datos demo incluidos

- 2 candidatos (1 certificado como vendedor, 1 en capacitación).
- 1 vendedor certificado con código y referido.
- 5 prospectos en distintas etapas.
- 3 ventas (2 aprobadas -> generan comisión, 1 pendiente).
- Comisiones calculadas automáticamente (15% / 5%).
- 3 logs de chatbot y 2 preguntas no resueltas.
- 15 módulos, banco de preguntas por módulo y examen final.

## Probar el flujo completo desde cero

1. Regístrate como **candidato nuevo** en `/registro`.
2. Completa los 15 módulos (botón *Marcar como completado*) y aprueba cada examen.
3. Haz al menos **3 simulaciones** en `/simulador`.
4. En `/certificacion`, acepta los términos y pulsa *Obtener mi certificación*.
5. Guarda la **contraseña temporal** que aparece una sola vez.
6. Inicia sesión: te forzará a **cambiar la contraseña**.
7. Entra al **panel del vendedor** y registra prospectos y ventas.
8. Como **admin**, aprueba una venta y verifica que se genera la comisión.
