/**
 * Generador de presentaciones PPTX (una por módulo) para los videos de la
 * Academia Comercial ATRIA. Diseño de marca ATRIA, 16:9 wide.
 * El guion hablado va en las notas del orador de cada diapositiva.
 */
const pptxgen = require("pptxgenjs");
const path = require("path");
const { BRAND, MODULOS } = require("./contenido.js");

const OUT_DIR = "C:/Users/Maykel/Documents/Vendedores-ATRIA/Guiones-y-Videos";

// Lienzo 16:9 wide = 13.333 x 7.5
const W = 13.333;
const H = 7.5;
const MX = 0.7; // margen lateral

const FONT_H = "Century Schoolbook"; // serif con carácter (safe-list)
const FONT_B = "Calibri"; // sans para cuerpo (safe-list)

function slug(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ---------- helpers de diseño ----------
function newShadow(o = {}) {
  return { type: "outer", color: "1B1526", opacity: 0.18, blur: 8, offset: 3, angle: 90, ...o };
}

function bgLight(slide) {
  slide.background = { color: BRAND.paper };
}
function bgDark(slide) {
  slide.background = { color: BRAND.dark };
}

// círculo con número/ícono de motivo (motivo repetido = círculo lavanda)
function circleBadge(slide, x, y, d, text, opts = {}) {
  slide.addShape("ellipse", {
    x, y, w: d, h: d,
    fill: { color: opts.fill || BRAND.tertiary },
    line: { type: "none" },
    shadow: newShadow({ opacity: 0.22 }),
  });
  slide.addText(text, {
    x, y, w: d, h: d,
    align: "center", valign: "middle",
    fontFace: FONT_H, fontSize: opts.fs || 22, bold: true,
    color: opts.color || BRAND.primary, margin: 0,
  });
}

// kicker (etiqueta superior en mayúsculas)
function kicker(slide, text, x, y, color) {
  slide.addText(text.toUpperCase(), {
    x, y, w: W - x - MX, h: 0.32,
    fontFace: FONT_B, fontSize: 11.5, bold: true,
    color: color || BRAND.tertiary, charSpacing: 3, margin: 0,
    align: "left", valign: "middle",
  });
}

// pie de marca en tarjetas claras
function footer(slide, mod) {
  slide.addText(
    [
      { text: "ATRIA", options: { bold: true, color: BRAND.primary } },
      { text: `   ·   Academia Comercial · Módulo ${mod.numero}`, options: { color: BRAND.muted } },
    ],
    { x: MX, y: H - 0.5, w: 8, h: 0.3, fontFace: FONT_B, fontSize: 9, align: "left", valign: "middle", margin: 0 }
  );
  slide.addText(`${mod.tiempo}`, {
    x: W - MX - 2.5, y: H - 0.5, w: 2.5, h: 0.3,
    fontFace: FONT_B, fontSize: 9, color: BRAND.muted, align: "right", valign: "middle", margin: 0,
  });
}

// ============ TIPOS DE DIAPOSITIVA ============

function slidePortada(deck, mod, s) {
  const sl = deck.addSlide();
  bgDark(sl);
  // fondo con imagen de gradiente
  sl.addImage({ path: GRAD_PATH, x: 0, y: 0, w: W, h: H });
  // marca de agua grande del número (sangrado inferior-derecho, intencional)
  sl.addText(mod.numero, {
    x: W - 5.0, y: 2.7, w: 5.0, h: 5.0,
    fontFace: FONT_H, fontSize: 230, bold: true,
    color: "FFFFFF", transparency: 90, align: "right", valign: "bottom", margin: 0,
  });
  kicker(sl, s.kicker, MX, 1.5, "C9B8F0");
  sl.addText(s.titulo, {
    x: MX, y: 2.1, w: W - 2 * MX, h: 2.0,
    fontFace: FONT_H, fontSize: 58, bold: true, color: "FFFFFF",
    align: "left", valign: "top", margin: 0, lineSpacingMultiple: 0.95,
  });
  sl.addText(s.subtitulo, {
    x: MX, y: 4.25, w: W - 2 * MX - 1, h: 0.9,
    fontFace: FONT_B, fontSize: 22, color: "E7DEF7", italic: true,
    align: "left", valign: "top", margin: 0,
  });
  // pastilla de pie
  sl.addShape("roundRect", {
    x: MX, y: 6.2, w: 5.6, h: 0.62, rectRadius: 0.31,
    fill: { color: "FFFFFF", transparency: 86 }, line: { color: "FFFFFF", width: 0.75, transparency: 60 },
  });
  sl.addText(s.pie, {
    x: MX, y: 6.2, w: 5.6, h: 0.62,
    fontFace: FONT_B, fontSize: 12.5, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", margin: 0,
  });
  sl.addNotes(s.notas);
}

function slideAgenda(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.95,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const items = s.items;
  const n = items.length;
  const cols = 2;
  const rows = Math.ceil(n / cols);
  const gx = 0.35, gy = 0.3;
  const cardW = (W - 2 * MX - (cols - 1) * gx) / cols;
  const top = 2.05;
  const availH = H - top - 0.75;
  const cardH = (availH - (rows - 1) * gy) / rows;
  items.forEach((it, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cardW + gx);
    const y = top + r * (cardH + gy);
    sl.addShape("roundRect", {
      x, y, w: cardW, h: cardH, rectRadius: 0.1,
      fill: { color: BRAND.soft }, line: { color: BRAND.softLine, width: 1 },
      shadow: newShadow({ opacity: 0.1, blur: 6, offset: 2 }),
    });
    circleBadge(sl, x + 0.28, y + (cardH - 0.72) / 2, 0.72, String(i + 1), { fs: 24 });
    sl.addText(it[0], {
      x: x + 1.2, y: y + 0.22, w: cardW - 1.4, h: 0.5,
      fontFace: FONT_H, fontSize: 17, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0,
    });
    sl.addText(it[1], {
      x: x + 1.2, y: y + cardH - 0.7, w: cardW - 1.4, h: 0.5,
      fontFace: FONT_B, fontSize: 12.5, color: BRAND.body, align: "left", valign: "top", margin: 0,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideDefinicion(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  // panel izquierdo con acento
  kicker(sl, s.kicker, MX, 0.75);
  sl.addText(s.titulo, {
    x: MX, y: 1.15, w: 6.3, h: 1.8,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.0,
  });
  // panel derecho tipo tarjeta de cita
  const px = 7.35, pw = W - px - MX;
  sl.addShape("roundRect", {
    x: px, y: 1.0, w: pw, h: 5.1, rectRadius: 0.14,
    fill: { color: BRAND.primary }, line: { type: "none" },
    shadow: newShadow({ opacity: 0.25 }),
  });
  sl.addText("“", {
    x: px + 0.25, y: 1.0, w: 1.5, h: 1.4,
    fontFace: FONT_H, fontSize: 90, bold: true, color: BRAND.tertiary, align: "left", valign: "top", margin: 0,
  });
  sl.addText(s.frase, {
    x: px + 0.5, y: 2.15, w: pw - 1.0, h: 2.2,
    fontFace: FONT_H, fontSize: 21, bold: true, color: "FFFFFF", align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.08,
  });
  sl.addText(s.apoyo, {
    x: px + 0.5, y: 4.5, w: pw - 1.0, h: 1.4,
    fontFace: FONT_B, fontSize: 14, color: "D9CEEF", italic: true, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
  });
  // marca lateral bajo el título
  sl.addText(mod.objetivo, {
    x: MX, y: 4.7, w: 6.3, h: 1.4,
    fontFace: FONT_B, fontSize: 13, color: BRAND.muted, align: "left", valign: "top", margin: 0, italic: true,
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideIdeaClave(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 32, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  // frase destacada
  sl.addShape("roundRect", {
    x: MX, y: 1.9, w: W - 2 * MX, h: 1.15, rectRadius: 0.12,
    fill: { color: BRAND.soft }, line: { color: BRAND.tertiary, width: 1.25 },
  });
  sl.addText(s.frase, {
    x: MX + 0.35, y: 1.9, w: W - 2 * MX - 0.7, h: 1.15,
    fontFace: FONT_H, fontSize: 17, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.05,
  });
  // 3 pasos con flechas
  const pasos = s.pasos;
  const n = pasos.length;
  const gx = 0.55;
  const top = 3.55, boxH = 2.6;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  pasos.forEach((p, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.primary }, line: { type: "none" },
      shadow: newShadow({ opacity: 0.22 }),
    });
    circleBadge(sl, x + boxW / 2 - 0.42, top + 0.3, 0.84, String(i + 1), { fs: 26 });
    sl.addText(p[0], {
      x: x + 0.15, y: top + 1.25, w: boxW - 0.3, h: 0.55,
      fontFace: FONT_H, fontSize: 16.5, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    sl.addText(p[1], {
      x: x + 0.2, y: top + 1.8, w: boxW - 0.4, h: 0.7,
      fontFace: FONT_B, fontSize: 12, color: "D9CEEF", align: "center", valign: "top", margin: 0,
    });
    if (i < n - 1) {
      sl.addText("→", {
        x: x + boxW - 0.05, y: top, w: gx + 0.1, h: boxH,
        fontFace: FONT_B, fontSize: 26, bold: true, color: BRAND.tertiary, align: "center", valign: "middle", margin: 0,
      });
    }
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideTresValores(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 32, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const cards = s.cards;
  const n = cards.length;
  const gx = 0.4;
  const top = 2.05, boxH = 4.4;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  const accents = [BRAND.primary, BRAND.secondary, BRAND.grad2];
  cards.forEach((c, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.paper }, line: { color: BRAND.softLine, width: 1 },
      shadow: newShadow({ opacity: 0.14, blur: 8, offset: 3 }),
    });
    // encabezado de color
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: 1.1, rectRadius: 0.12,
      fill: { color: accents[i % accents.length] }, line: { type: "none" },
    });
    sl.addShape("rect", {
      x, y: top + 0.55, w: boxW, h: 0.55, fill: { color: accents[i % accents.length] }, line: { type: "none" },
    });
    sl.addText(c[0], {
      x, y: top, w: boxW, h: 1.1,
      fontFace: FONT_H, fontSize: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    sl.addText(c[1], {
      x: x + 0.3, y: top + 1.35, w: boxW - 0.6, h: 1.5,
      fontFace: FONT_H, fontSize: 15.5, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
    sl.addText(c[2], {
      x: x + 0.3, y: top + 2.75, w: boxW - 0.6, h: 1.55,
      fontFace: FONT_B, fontSize: 12.5, color: BRAND.body, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideListaCheck(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 32, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const items = s.items;
  const n = items.length;
  const top = 2.1, gy = 0.28;
  const rowH = (H - top - 0.75 - (n - 1) * gy) / n;
  items.forEach((it, i) => {
    const y = top + i * (rowH + gy);
    sl.addShape("roundRect", {
      x: MX, y, w: W - 2 * MX, h: rowH, rectRadius: 0.1,
      fill: { color: BRAND.soft }, line: { color: BRAND.softLine, width: 1 },
    });
    // check en círculo
    sl.addShape("ellipse", {
      x: MX + 0.3, y: y + (rowH - 0.6) / 2, w: 0.6, h: 0.6,
      fill: { color: BRAND.green }, line: { type: "none" },
    });
    sl.addText("✓", {
      x: MX + 0.3, y: y + (rowH - 0.6) / 2, w: 0.6, h: 0.6,
      fontFace: FONT_B, fontSize: 20, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    sl.addText(it[0], {
      x: MX + 1.15, y: y + 0.12, w: W - 2 * MX - 1.5, h: rowH / 2,
      fontFace: FONT_H, fontSize: 17, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0,
    });
    sl.addText(it[1], {
      x: MX + 1.15, y: y + rowH / 2 - 0.05, w: W - 2 * MX - 1.5, h: rowH / 2,
      fontFace: FONT_B, fontSize: 12.5, color: BRAND.body, italic: true, align: "left", valign: "middle", margin: 0,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideAplicacion(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 32, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const cols = [s.col1, s.col2];
  const colors = [BRAND.secondary, BRAND.grad2];
  const gx = 0.5;
  const top = 2.1, boxH = 4.35;
  const boxW = (W - 2 * MX - gx) / 2;
  cols.forEach((c, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.paper }, line: { color: BRAND.softLine, width: 1 },
      shadow: newShadow({ opacity: 0.14, blur: 8, offset: 3 }),
    });
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: 1.0, rectRadius: 0.12,
      fill: { color: colors[i] }, line: { type: "none" },
    });
    sl.addShape("rect", { x, y: top + 0.5, w: boxW, h: 0.5, fill: { color: colors[i] }, line: { type: "none" } });
    sl.addText(c[0], {
      x, y: top, w: boxW, h: 1.0,
      fontFace: FONT_H, fontSize: 21, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    sl.addText(c[1], {
      x: x + 0.35, y: top + 1.3, w: boxW - 0.7, h: 1.1,
      fontFace: FONT_H, fontSize: 15, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
    sl.addText(c[2], {
      x: x + 0.35, y: top + 2.5, w: boxW - 0.7, h: 1.7,
      fontFace: FONT_B, fontSize: 13.5, color: BRAND.body, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.1,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideResumen(deck, mod, s) {
  const sl = deck.addSlide();
  bgDark(sl);
  sl.addImage({ path: GRAD_PATH, x: 0, y: 0, w: W, h: H });
  kicker(sl, s.kicker, MX, 0.7, "C9B8F0");
  sl.addText(s.titulo, {
    x: MX, y: 1.1, w: W - 2 * MX, h: 1.0,
    fontFace: FONT_H, fontSize: 36, bold: true, color: "FFFFFF", align: "left", valign: "top", margin: 0,
  });
  const items = s.items;
  const n = items.length;
  const top = 2.55, gy = 0.3;
  const rowH = (H - top - 0.7 - (n - 1) * gy) / n;
  items.forEach((it, i) => {
    const y = top + i * (rowH + gy);
    sl.addShape("roundRect", {
      x: MX, y, w: W - 2 * MX, h: rowH, rectRadius: 0.1,
      fill: { color: "FFFFFF", transparency: 90 }, line: { color: "FFFFFF", width: 0.75, transparency: 65 },
    });
    circleBadge(sl, MX + 0.28, y + (rowH - 0.66) / 2, 0.66, String(i + 1), { fs: 22 });
    sl.addText(it, {
      x: MX + 1.15, y, w: W - 2 * MX - 1.5, h: rowH,
      fontFace: FONT_B, fontSize: 16, color: "F3EEFB", bold: true, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.02,
    });
  });
  sl.addNotes(s.notas);
}

function slideCierre(deck, mod, s) {
  const sl = deck.addSlide();
  bgDark(sl);
  sl.addImage({ path: GRAD_PATH, x: 0, y: 0, w: W, h: H });
  sl.addText("✓", {
    x: W / 2 - 0.75, y: 1.1, w: 1.5, h: 1.5,
    fontFace: FONT_B, fontSize: 60, bold: true, color: BRAND.tertiary, align: "center", valign: "middle", margin: 0,
  });
  kicker2center(sl, s.kicker, 2.55);
  sl.addText(s.titulo, {
    x: MX, y: 2.9, w: W - 2 * MX, h: 1.0,
    fontFace: FONT_H, fontSize: 42, bold: true, color: "FFFFFF", align: "center", valign: "top", margin: 0,
  });
  sl.addText(s.frase, {
    x: 1.8, y: 3.95, w: W - 3.6, h: 1.2,
    fontFace: FONT_B, fontSize: 18, color: "E7DEF7", italic: true, align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.1,
  });
  sl.addShape("roundRect", {
    x: 1.8, y: 5.35, w: W - 3.6, h: 1.1, rectRadius: 0.14,
    fill: { color: "FFFFFF", transparency: 88 }, line: { color: "FFFFFF", width: 0.75, transparency: 55 },
  });
  sl.addText(s.cta, {
    x: 2.2, y: 5.35, w: W - 4.4, h: 1.1,
    fontFace: FONT_B, fontSize: 14, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.05,
  });
  sl.addNotes(s.notas);
}

function kicker2center(sl, text, y) {
  sl.addText(text.toUpperCase(), {
    x: MX, y, w: W - 2 * MX, h: 0.32,
    fontFace: FONT_B, fontSize: 12, bold: true, color: "C9B8F0", charSpacing: 3, align: "center", valign: "middle", margin: 0,
  });
}

// ---- específicos de contenido de producto / demo ----

function slideModuloProducto(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  // Qué hace — panel ancho superior
  const top = 2.0;
  sl.addShape("roundRect", {
    x: MX, y: top, w: W - 2 * MX, h: 1.7, rectRadius: 0.12,
    fill: { color: BRAND.primary }, line: { type: "none" }, shadow: newShadow({ opacity: 0.22 }),
  });
  sl.addText("QUÉ HACE", {
    x: MX + 0.35, y: top + 0.22, w: 3, h: 0.32,
    fontFace: FONT_B, fontSize: 11, bold: true, color: BRAND.tertiary, charSpacing: 2.5, align: "left", valign: "middle", margin: 0,
  });
  sl.addText(s.queHace, {
    x: MX + 0.35, y: top + 0.55, w: W - 2 * MX - 0.7, h: 1.05,
    fontFace: FONT_H, fontSize: 17, bold: true, color: "FFFFFF", align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
  });
  // Dos tarjetas: problema / cliente
  const top2 = 3.95, gx = 0.4, boxH = 2.5;
  const boxW = (W - 2 * MX - gx) / 2;
  const twin = [
    ["PROBLEMA QUE RESUELVE", s.problema, BRAND.red, "!"],
    ["CLIENTE TÍPICO", s.cliente, BRAND.green, "◎"],
  ];
  twin.forEach((t, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top2, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.soft }, line: { color: BRAND.softLine, width: 1 },
    });
    sl.addShape("ellipse", { x: x + 0.3, y: top2 + 0.3, w: 0.7, h: 0.7, fill: { color: t[2] }, line: { type: "none" } });
    sl.addText(t[3], {
      x: x + 0.3, y: top2 + 0.3, w: 0.7, h: 0.7,
      fontFace: FONT_H, fontSize: 26, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    sl.addText(t[0], {
      x: x + 1.2, y: top2 + 0.32, w: boxW - 1.45, h: 0.7,
      fontFace: FONT_B, fontSize: 11.5, bold: true, color: BRAND.secondary, charSpacing: 1.5, align: "left", valign: "middle", margin: 0,
    });
    sl.addText(s === undefined ? "" : t[1], {
      x: x + 0.35, y: top2 + 1.15, w: boxW - 0.7, h: 1.2,
      fontFace: FONT_H, fontSize: 15, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideFormula(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const pasos = s.pasos; // [nombre, def, ejemplo]
  const n = pasos.length, gx = 0.6;
  const top = 2.2, boxH = 4.0;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  const cols = [BRAND.secondary, BRAND.grad1, BRAND.grad2];
  pasos.forEach((p, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.paper }, line: { color: BRAND.softLine, width: 1 }, shadow: newShadow({ opacity: 0.14 }),
    });
    sl.addShape("roundRect", { x, y: top, w: boxW, h: 0.95, rectRadius: 0.12, fill: { color: cols[i] }, line: { type: "none" } });
    sl.addShape("rect", { x, y: top + 0.48, w: boxW, h: 0.47, fill: { color: cols[i] }, line: { type: "none" } });
    sl.addText(p[0], { x, y: top, w: boxW, h: 0.95, fontFace: FONT_H, fontSize: 20, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    sl.addText(p[1], {
      x: x + 0.3, y: top + 1.2, w: boxW - 0.6, h: 1.0,
      fontFace: FONT_B, fontSize: 13.5, color: BRAND.body, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
    // ejemplo destacado
    sl.addShape("roundRect", {
      x: x + 0.25, y: top + 2.4, w: boxW - 0.5, h: 1.35, rectRadius: 0.1,
      fill: { color: BRAND.soft }, line: { type: "none" },
    });
    sl.addText([{ text: "Ej: ", options: { bold: true, color: BRAND.secondary } }, { text: p[2], options: { color: BRAND.ink } }], {
      x: x + 0.42, y: top + 2.5, w: boxW - 0.84, h: 1.15,
      fontFace: FONT_B, fontSize: 12.5, italic: true, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
    if (i < n - 1) {
      sl.addText("→", { x: x + boxW - 0.05, y: top, w: gx + 0.1, h: boxH, fontFace: FONT_B, fontSize: 30, bold: true, color: BRAND.tertiary, align: "center", valign: "middle", margin: 0 });
    }
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideEjemplos(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const casos = s.casos; // [negocio, problema, solucion]
  const n = casos.length, gx = 0.4;
  const top = 2.05, boxH = 4.4;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  casos.forEach((c, i) => {
    const x = MX + i * (boxW + gx);
    const y = top;
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.paper }, line: { color: BRAND.softLine, width: 1 }, shadow: newShadow({ opacity: 0.14 }),
    });
    circleBadge(sl, x + 0.3, y + 0.32, 0.7, String(i + 1), { fs: 22 });
    sl.addText(c[0], {
      x: x + 1.15, y: y + 0.3, w: boxW - 1.4, h: 0.75,
      fontFace: FONT_H, fontSize: 16, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 0.98,
    });
    // problema
    sl.addText("PROBLEMA", { x: x + 0.32, y: y + 1.35, w: boxW - 0.6, h: 0.3, fontFace: FONT_B, fontSize: 10.5, bold: true, color: BRAND.red, charSpacing: 1.5, align: "left", valign: "middle", margin: 0 });
    sl.addText(c[1], {
      x: x + 0.32, y: y + 1.65, w: boxW - 0.64, h: 1.15,
      fontFace: FONT_B, fontSize: 13, color: BRAND.body, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.03,
    });
    // solucion
    sl.addShape("roundRect", { x: x + 0.25, y: y + 2.85, w: boxW - 0.5, h: 1.4, rectRadius: 0.1, fill: { color: BRAND.soft }, line: { type: "none" } });
    sl.addText("SOLUCIÓN ATRIA", { x: x + 0.42, y: y + 2.98, w: boxW - 0.8, h: 0.3, fontFace: FONT_B, fontSize: 10.5, bold: true, color: BRAND.green, charSpacing: 1.2, align: "left", valign: "middle", margin: 0 });
    sl.addText(c[2], {
      x: x + 0.42, y: y + 3.28, w: boxW - 0.8, h: 0.9,
      fontFace: FONT_H, fontSize: 13, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.03,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideErrores(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55, BRAND.red);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const items = s.items;
  const n = items.length, gy = 0.4;
  const top = 2.2;
  const rowH = (H - top - 0.75 - (n - 1) * gy) / n;
  items.forEach((it, i) => {
    const y = top + i * (rowH + gy);
    sl.addShape("roundRect", {
      x: MX, y, w: W - 2 * MX, h: rowH, rectRadius: 0.12,
      fill: { color: BRAND.soft }, line: { color: BRAND.softLine, width: 1 },
    });
    sl.addShape("ellipse", { x: MX + 0.35, y: y + (rowH - 0.8) / 2, w: 0.8, h: 0.8, fill: { color: BRAND.red }, line: { type: "none" } });
    sl.addText("✕", { x: MX + 0.35, y: y + (rowH - 0.8) / 2, w: 0.8, h: 0.8, fontFace: FONT_B, fontSize: 26, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    sl.addText(it[0], {
      x: MX + 1.45, y: y + 0.25, w: W - 2 * MX - 1.8, h: 0.55,
      fontFace: FONT_H, fontSize: 18, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0,
    });
    sl.addText(it[1], {
      x: MX + 1.45, y: y + rowH / 2, w: W - 2 * MX - 1.8, h: rowH / 2 - 0.15,
      fontFace: FONT_B, fontSize: 13.5, color: BRAND.body, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.03,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideEstructura(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const pasos = s.pasos; // [num, titulo, desc, tiempo]
  const n = pasos.length, gy = 0.22;
  const top = 2.05;
  const rowH = (H - top - 0.75 - (n - 1) * gy) / n;
  pasos.forEach((p, i) => {
    const y = top + i * (rowH + gy);
    sl.addShape("roundRect", {
      x: MX, y, w: W - 2 * MX, h: rowH, rectRadius: 0.1,
      fill: { color: BRAND.soft }, line: { color: BRAND.softLine, width: 1 },
    });
    circleBadge(sl, MX + 0.25, y + (rowH - 0.7) / 2, 0.7, p[0], { fs: 24 });
    sl.addText(p[1], {
      x: MX + 1.15, y, w: 3.7, h: rowH,
      fontFace: FONT_H, fontSize: 16.5, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0,
    });
    sl.addText(p[2], {
      x: MX + 4.95, y, w: W - 2 * MX - 4.95 - 1.6, h: rowH,
      fontFace: FONT_B, fontSize: 13, color: BRAND.body, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.02,
    });
    // pastilla de tiempo
    sl.addShape("roundRect", {
      x: W - MX - 1.55, y: y + (rowH - 0.5) / 2, w: 1.3, h: 0.5, rectRadius: 0.25,
      fill: { color: BRAND.primary }, line: { type: "none" },
    });
    sl.addText(p[3], {
      x: W - MX - 1.55, y: y + (rowH - 0.5) / 2, w: 1.3, h: 0.5,
      fontFace: FONT_B, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slidePasoDetalle(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.6);
  sl.addText(s.titulo, {
    x: MX, y: 1.0, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  // cita destacada
  sl.addShape("roundRect", {
    x: MX, y: 2.0, w: W - 2 * MX, h: 1.55, rectRadius: 0.14,
    fill: { color: BRAND.primary }, line: { type: "none" }, shadow: newShadow({ opacity: 0.22 }),
  });
  sl.addText("“", { x: MX + 0.2, y: 1.85, w: 1.2, h: 1.0, fontFace: FONT_H, fontSize: 70, bold: true, color: BRAND.tertiary, align: "left", valign: "top", margin: 0 });
  sl.addText(s.frase, {
    x: MX + 1.15, y: 2.15, w: W - 2 * MX - 1.5, h: 1.25,
    fontFace: FONT_H, fontSize: 18.5, bold: true, italic: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.05,
  });
  // puntos
  const pts = s.puntos;
  const n = pts.length, gx = 0.4;
  const top = 3.95, boxH = 2.5;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  pts.forEach((p, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.soft }, line: { color: BRAND.softLine, width: 1 },
    });
    circleBadge(sl, x + boxW / 2 - 0.35, top + 0.3, 0.7, "✓", { fs: 22, fill: BRAND.green, color: "FFFFFF" });
    sl.addText(p, {
      x: x + 0.3, y: top + 1.2, w: boxW - 0.6, h: 1.15,
      fontFace: FONT_B, fontSize: 13.5, color: BRAND.body, align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideDuraciones(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.55);
  sl.addText(s.titulo, {
    x: MX, y: 0.9, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  const cols = s.cols; // [tiempo, titulo, desc]
  const n = cols.length, gx = 0.4;
  const top = 2.05, boxH = 4.4;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  const accents = [BRAND.tertiary, BRAND.secondary, BRAND.primary];
  cols.forEach((c, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.12,
      fill: { color: BRAND.paper }, line: { color: BRAND.softLine, width: 1 }, shadow: newShadow({ opacity: 0.14 }),
    });
    // círculo de tiempo grande
    sl.addShape("ellipse", { x: x + boxW / 2 - 0.85, y: top + 0.35, w: 1.7, h: 1.7, fill: { color: accents[i] }, line: { type: "none" }, shadow: newShadow({ opacity: 0.2 }) });
    sl.addText(c[0], {
      x: x + boxW / 2 - 0.85, y: top + 0.35, w: 1.7, h: 1.7,
      fontFace: FONT_H, fontSize: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    sl.addText(c[1], {
      x: x + 0.3, y: top + 2.25, w: boxW - 0.6, h: 0.75,
      fontFace: FONT_H, fontSize: 16, bold: true, color: BRAND.primary, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.0,
    });
    sl.addText(c[2], {
      x: x + 0.35, y: top + 3.0, w: boxW - 0.7, h: 1.25,
      fontFace: FONT_B, fontSize: 12.5, color: BRAND.body, align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.05,
    });
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

function slideCasoRestaurante(deck, mod, s) {
  const sl = deck.addSlide();
  bgLight(sl);
  kicker(sl, s.kicker, MX, 0.6);
  sl.addText(s.titulo, {
    x: MX, y: 1.0, w: W - 2 * MX, h: 0.9,
    fontFace: FONT_H, fontSize: 34, bold: true, color: BRAND.ink, align: "left", valign: "top", margin: 0,
  });
  // flujo de 4 pasos con flechas
  const flujo = s.flujo;
  const n = flujo.length, gx = 0.5;
  const top = 2.5, boxH = 1.7;
  const boxW = (W - 2 * MX - (n - 1) * gx) / n;
  const cols = [BRAND.secondary, BRAND.grad1, BRAND.grad2, BRAND.primary];
  flujo.forEach((f, i) => {
    const x = MX + i * (boxW + gx);
    sl.addShape("roundRect", {
      x, y: top, w: boxW, h: boxH, rectRadius: 0.14,
      fill: { color: cols[i % cols.length] }, line: { type: "none" }, shadow: newShadow({ opacity: 0.22 }),
    });
    sl.addText(String(i + 1), {
      x: x + 0.2, y: top + 0.15, w: 0.8, h: 0.5,
      fontFace: FONT_H, fontSize: 15, bold: true, color: "FFFFFF", transparency: 40, align: "left", valign: "top", margin: 0,
    });
    sl.addText(f, {
      x, y: top, w: boxW, h: boxH,
      fontFace: FONT_H, fontSize: 19, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    if (i < n - 1) {
      sl.addText("→", { x: x + boxW - 0.05, y: top, w: gx + 0.1, h: boxH, fontFace: FONT_B, fontSize: 26, bold: true, color: BRAND.tertiary, align: "center", valign: "middle", margin: 0 });
    }
  });
  // apoyo
  sl.addShape("roundRect", {
    x: MX, y: 4.75, w: W - 2 * MX, h: 1.55, rectRadius: 0.12,
    fill: { color: BRAND.soft }, line: { color: BRAND.tertiary, width: 1.25 },
  });
  sl.addText(s.apoyo, {
    x: MX + 0.45, y: 4.75, w: W - 2 * MX - 0.9, h: 1.55,
    fontFace: FONT_H, fontSize: 16, bold: true, color: BRAND.primary, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.08,
  });
  footer(sl, mod);
  sl.addNotes(s.notas);
}

// mapa de renderizadores
const RENDER = {
  portada: slidePortada,
  agenda: slideAgenda,
  definicion: slideDefinicion,
  "idea-clave": slideIdeaClave,
  "tres-valores": slideTresValores,
  "lista-check": slideListaCheck,
  aplicacion: slideAplicacion,
  resumen: slideResumen,
  cierre: slideCierre,
  "modulo-producto": slideModuloProducto,
  formula: slideFormula,
  ejemplos: slideEjemplos,
  errores: slideErrores,
  estructura: slideEstructura,
  "paso-detalle": slidePasoDetalle,
  duraciones: slideDuraciones,
  "caso-restaurante": slideCasoRestaurante,
};

let GRAD_PATH = path.join(__dirname, "gradiente.png");

async function buildDeck(mod) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Academia Comercial ATRIA";
  pres.company = "ATRIA";
  pres.subject = mod.titulo;
  pres.title = `ATRIA · Módulo ${mod.numero} · ${mod.titulo}`;

  mod.slides.forEach((s) => {
    const fn = RENDER[s.tipo];
    if (!fn) throw new Error("Tipo de slide desconocido: " + s.tipo);
    fn(pres, mod, s);
  });

  const fname = `Modulo-${mod.numero}-${slug(mod.titulo)}.pptx`;
  const out = path.join(OUT_DIR, fname);
  await pres.writeFile({ fileName: out });
  console.log("OK →", out, `(${mod.slides.length} diapositivas)`);
}

(async () => {
  for (const mod of MODULOS) {
    await buildDeck(mod);
  }
})();
