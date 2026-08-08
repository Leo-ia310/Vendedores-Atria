# Guiones y videos — Academia Comercial ATRIA

Material listo para producir los videos de los 3 módulos que tienen video en la academia.

## Contenido de esta carpeta

| Módulo | Diapositivas (PowerPoint) | Guion (Word) | Duración objetivo |
|--------|---------------------------|--------------|-------------------|
| 01 · Bienvenida a ATRIA | `Modulo-01-Bienvenida-a-ATRIA.pptx` | `Guion-Modulo-01-Bienvenida-a-ATRIA.docx` | ~15 min |
| 02 · Dominio del producto | `Modulo-02-Dominio-del-producto.pptx` | `Guion-Modulo-02-Dominio-del-producto.docx` | ~35 min |
| 07 · Presentación y demostración | `Modulo-07-Presentacion-y-demostracion.pptx` | `Guion-Modulo-07-Presentacion-y-demostracion.docx` | ~35 min |

## Cómo está armado

- **Cada diapositiva del PowerPoint ya trae su guion hablado en las NOTAS DEL ORADOR.**
  Ábrelo en PowerPoint y ve a **Vista → Notas** (o el panel inferior) para verlo.
- **El documento Word es el mismo guion**, escena por escena, con el número de diapositiva,
  lo que se ve en pantalla y el tiempo estimado. Sirve para leer al grabar o para un locutor.
- Diseño con la marca **ATRIA** (morado profundo, lavanda y gradiente morado→azul), tipografía
  legible y un estilo consistente entre las 3 presentaciones.

## Cómo convertir el PowerPoint en video

**Opción A — PowerPoint (más simple):**
1. Abre el `.pptx`.
2. Pestaña **Presentación con diapositivas → Grabar** (graba tu voz leyendo las notas de cada slide),
   o usa **Insertar → Audio** si ya tienes la locución.
3. **Archivo → Exportar → Crear un video** → elige calidad (Full HD 1080p) → **Crear video** (.mp4).

**Opción B — Solo diapositivas como video sin voz:**
- **Archivo → Exportar → Crear un video**, define los segundos por diapositiva y exporta.

**Opción C — Locución con IA:**
- Copia el guion del `.docx` en tu herramienta de voz (texto a voz), genera el audio por escena
  e insértalo en cada diapositiva antes de exportar.

## Notas de duración

Los guiones están calculados a ~130 palabras por minuto (ritmo pausado y claro).
Si el locutor habla más rápido (140–150 ppm), la duración baja unos minutos.

## Regenerar los archivos

Los generadores están en el scratchpad de la sesión:
`contenido.js` (todo el texto y guiones), `gen-pptx.js` (presentaciones) y `gen-docx.js` (guiones Word).
Editando `contenido.js` y volviendo a correr los scripts se regeneran todos los archivos.
