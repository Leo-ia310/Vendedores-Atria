/**
 * Generador de guiones en Word (.docx), uno por módulo.
 * Cada guion tiene: portada, ficha del módulo, guía de uso, y el MEGA GUION
 * hablado dividido por diapositiva, con número de escena, título y tiempo.
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, PageBreak,
} = require("docx");
const { BRAND, MODULOS } = require("./contenido.js");

const OUT_DIR = "C:/Users/Maykel/Documents/Vendedores-ATRIA/Guiones-y-Videos";
const FH = "Cambria";
const FB = "Calibri";

function slug(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// aprox. palabras y tiempo hablado (~130 ppm)
function wc(t) { return (t.trim().match(/\S+/g) || []).length; }
function mmss(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const TIPO_ROTULO = {
  portada: "Portada / Apertura",
  agenda: "Agenda del módulo",
  definicion: "Concepto clave",
  "idea-clave": "Idea central",
  "tres-valores": "Misión, visión y valores",
  "lista-check": "Responsabilidades",
  aplicacion: "Aplicación práctica",
  resumen: "Resumen",
  cierre: "Cierre / Llamado a la acción",
  "modulo-producto": "Módulo del producto",
  formula: "Fórmula de venta",
  ejemplos: "Casos de ejemplo",
  errores: "Errores a evitar",
  estructura: "Estructura",
  "paso-detalle": "Paso en detalle",
  duraciones: "Formatos de duración",
  "caso-restaurante": "Caso restaurante",
};

function shadedBox(text, color) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    shading: { type: ShadingType.CLEAR, fill: color },
    border: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
    },
    children: [new TextRun({ text, font: FB, size: 20, color: "3A3348" })],
  });
}

function buildDoc(mod) {
  const children = [];

  // ---------- PORTADA ----------
  children.push(
    new Paragraph({
      spacing: { before: 2200, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "ACADEMIA COMERCIAL ATRIA", font: FB, size: 22, bold: true, color: "A18BCF", characterSpacing: 60 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 0 },
      children: [new TextRun({ text: `GUION DE VIDEO · MÓDULO ${mod.numero}`, font: FB, size: 18, bold: true, color: "8B8397", characterSpacing: 40 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 320, after: 0 },
      children: [new TextRun({ text: mod.titulo, font: FH, size: 56, bold: true, color: "2B1F3A" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 0 },
      children: [new TextRun({ text: mod.subtitulo, font: FH, size: 26, italics: true, color: "5C4B75" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 900, after: 0 },
      children: [new TextRun({ text: `Nivel ${mod.nivel}   ·   Duración aprox. ${mod.tiempo}`, font: FB, size: 24, color: "3A3348" })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  );

  // ---------- FICHA ----------
  children.push(sectionTitle("Ficha del módulo"));
  children.push(fichaTable(mod));

  children.push(sectionTitle("Cómo usar este guion"));
  [
    "Cada bloque corresponde a UNA diapositiva del PowerPoint del mismo módulo (mismo orden y número de escena).",
    "El texto en «GUION» es lo que narras. Está escrito para leerse en voz alta con ritmo natural (~130 palabras por minuto).",
    "Los tiempos son estimados; ajústalos a tu velocidad. La suma total se acerca a la duración del módulo.",
    "Puedes grabar tu voz sobre las diapositivas (PowerPoint permite narrar y exportar a video MP4).",
  ].forEach((t) => children.push(bullet(t)));

  // resumen de tiempos
  let totalSec = 0;
  mod.slides.forEach((s) => { totalSec += Math.round((wc(s.notas) / 130) * 60); });
  children.push(new Paragraph({
    spacing: { before: 160, after: 200 },
    children: [
      new TextRun({ text: "Duración hablada estimada del guion: ", font: FB, size: 22, bold: true, color: "2B1F3A" }),
      new TextRun({ text: `${mmss(totalSec)} min  ·  ${mod.slides.length} diapositivas`, font: FB, size: 22, color: "3A3348" }),
    ],
  }));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ---------- GUION POR ESCENA ----------
  children.push(sectionTitle("Guion completo, escena por escena"));

  mod.slides.forEach((s, idx) => {
    const sec = Math.round((wc(s.notas) / 130) * 60);
    const escena = `Escena ${String(idx + 1).padStart(2, "0")} de ${String(mod.slides.length).padStart(2, "0")}`;
    const rotulo = TIPO_ROTULO[s.tipo] || "";
    const titEscena = s.titulo || s.kicker || rotulo;

    // encabezado de escena (tabla de 1 fila con fondo morado)
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders(),
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: 72, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: "2B1F3A" },
            margins: { top: 80, bottom: 80, left: 140, right: 100 },
            children: [
              new Paragraph({ children: [new TextRun({ text: `${escena}  ·  ${rotulo}`, font: FB, size: 16, bold: true, color: "C9B8F0", characterSpacing: 20 })] }),
              new Paragraph({ spacing: { before: 30 }, children: [new TextRun({ text: titEscena, font: FH, size: 26, bold: true, color: "FFFFFF" })] }),
            ],
          }),
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: "5C4B75" },
            margins: { top: 80, bottom: 80, left: 100, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "⏱ EN PANTALLA", font: FB, size: 13, color: "E7DEF7" })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 20 }, children: [new TextRun({ text: `~ ${mmss(sec)} min`, font: FB, size: 24, bold: true, color: "FFFFFF" })] }),
            ],
          }),
        ],
      })],
    }));

    // qué se ve en pantalla (resumen del contenido visual de la diapositiva)
    const enPantalla = describeVisual(s);
    if (enPantalla) {
      children.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: "EN PANTALLA:  ", font: FB, size: 18, bold: true, color: "5C4B75", characterSpacing: 10 }),
          new TextRun({ text: enPantalla, font: FB, size: 20, italics: true, color: "8B8397" }),
        ],
      }));
    }

    // guion hablado
    children.push(new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: "GUION (voz en off):", font: FB, size: 18, bold: true, color: "2563EB", characterSpacing: 10 })],
    }));
    children.push(new Paragraph({
      spacing: { before: 0, after: 240, line: 300 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 120 },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: "A18BCF", space: 14 } },
      children: [new TextRun({ text: s.notas, font: FB, size: 23, color: "1B1526" })],
    }));
  });

  // pie final
  children.push(new Paragraph({
    spacing: { before: 200 },
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E7E1F0", space: 10 } },
    children: [new TextRun({ text: `ATRIA · Academia Comercial · Guion de video del Módulo ${mod.numero} — ${mod.titulo}`, font: FB, size: 16, italics: true, color: "8B8397" })],
  }));

  return new Document({
    creator: "Academia Comercial ATRIA",
    title: `Guion de video · Módulo ${mod.numero} · ${mod.titulo}`,
    styles: { default: { document: { run: { font: FB, size: 22 } } } },
    sections: [{
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } },
      children,
    }],
  });
}

// ------- helpers docx -------
function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 200, after: 140 },
    children: [new TextRun({ text, font: FH, size: 30, bold: true, color: "2B1F3A" })],
  });
}
function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40, line: 276 },
    children: [new TextRun({ text, font: FB, size: 22, color: "3A3348" })],
  });
}
function noBorders() {
  const n = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: n, bottom: n, left: n, right: n, insideHorizontal: n, insideVertical: n };
}
function fichaTable(mod) {
  const rows = [
    ["Objetivo", mod.objetivo],
    ["Nivel", mod.nivel],
    ["Duración", mod.tiempo],
    ["Diapositivas", String(mod.slides.length)],
    ["Marca", "ATRIA — Academia Comercial"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "E7E1F0" },
    },
    rows: rows.map(([k, v]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 24, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: "F5F2FA" },
            margins: { top: 60, bottom: 60, left: 120, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: k, font: FB, size: 20, bold: true, color: "5C4B75" })] })],
          }),
          new TableCell({
            width: { size: 76, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: v, font: FB, size: 20, color: "1B1526" })] })],
          }),
        ],
      })
    ),
  });
}

// descripción breve de lo que muestra la diapositiva (para el guionista)
function describeVisual(s) {
  switch (s.tipo) {
    case "portada": return `Título "${s.titulo}", subtítulo y pastilla "${s.pie}". Fondo oscuro con gradiente morado-azul y numeral gigante.`;
    case "agenda": return `Rejilla de ${s.items.length} tarjetas numeradas con la ruta del módulo.`;
    case "definicion": return `Título a la izquierda y tarjeta morada de cita a la derecha con la frase clave.`;
    case "idea-clave": return `Frase destacada y ${s.pasos.length} pasos con flechas.`;
    case "tres-valores": return `Tres tarjetas: Misión, Visión y Valores.`;
    case "lista-check": return `${s.items.length} filas con check verde, título y descripción.`;
    case "aplicacion": return `Dos columnas comparativas: Comercio vs Restaurante.`;
    case "resumen": return `Fondo oscuro con ${s.items.length} ideas numeradas para recordar.`;
    case "cierre": return `Fondo oscuro, check grande, título y pastilla con el próximo paso.`;
    case "modulo-producto": return `Panel "Qué hace" y dos tarjetas: Problema y Cliente típico.`;
    case "formula": return `Tres tarjetas con flechas: Función → Problema → Beneficio, con ejemplo.`;
    case "ejemplos": return `${s.casos.length} tarjetas de caso: negocio, problema y solución ATRIA.`;
    case "errores": return `${s.items.length} filas con ✕ rojo: errores a evitar.`;
    case "estructura": return `${s.pasos.length} pasos numerados con pastilla de tiempo.`;
    case "paso-detalle": return `Cita destacada y ${s.puntos.length} puntos de apoyo.`;
    case "duraciones": return `Tres círculos: 15, 30 y 45 minutos, con lo que incluye cada demo.`;
    case "caso-restaurante": return `Flujo de 4 pasos: ${s.flujo.join(" → ")}.`;
    default: return "";
  }
}

const { PageBreak: _PB } = require("docx");

(async () => {
  for (const mod of MODULOS) {
    const doc = buildDoc(mod);
    const buf = await Packer.toBuffer(doc);
    const fname = `Guion-Modulo-${mod.numero}-${slug(mod.titulo)}.docx`;
    const out = path.join(OUT_DIR, fname);
    fs.writeFileSync(out, buf);
    console.log("OK →", out);
  }
})();
