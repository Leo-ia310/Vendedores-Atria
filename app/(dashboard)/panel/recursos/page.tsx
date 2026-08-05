"use client";

import { FileText, FileDown, Presentation, MessageSquareText, Images, BookMarked, Video } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

const RECURSOS = [
  {
    icon: Video,
    titulo: "Video 1: Bienvenida a ATRIA",
    desc: "Primer video del módulo 1.",
    href: "/recursos/modulo-1/Modulo-1.mp4",
    formato: "MP4",
  },
  {
    icon: FileText,
    titulo: "PDF: Bienvenida a ATRIA",
    desc: "Material de apoyo del módulo 1.",
    href: "/recursos/modulo-1/Modulo-01-Bienvenida-a-ATRIA.pdf",
    formato: "PDF",
  },
  {
    icon: FileText,
    titulo: "PDF: Dominio del producto",
    desc: "Material de apoyo del módulo 2.",
    href: "/recursos/modulo-2/Modulo-02-Dominio-del-producto.pdf",
    formato: "PDF",
  },
  {
    icon: Presentation,
    titulo: "Presentación: Dominio del producto",
    desc: "Deck editable del módulo 2.",
    href: "/recursos/modulo-2/Modulo-02-Dominio-del-producto.pptx",
    formato: "PPTX",
  },
  {
    icon: BookMarked,
    titulo: "Guion: Dominio del producto",
    desc: "Guion editable del módulo 2.",
    href: "/recursos/modulo-2/Guion-Modulo-02-Dominio-del-producto.docx",
    formato: "DOCX",
  },
  {
    icon: FileText,
    titulo: "PDF: Guion de demostración",
    desc: "Material de apoyo del módulo 7.",
    href: "/recursos/modulo-7/Guion-Modulo-07-Presentacion-y-demostracion.pdf",
    formato: "PDF",
  },
  {
    icon: Presentation,
    titulo: "Presentación: Demostración",
    desc: "Deck editable del módulo 7.",
    href: "/recursos/modulo-7/Modulo-07-Presentacion-y-demostracion.pptx",
    formato: "PPTX",
  },
  {
    icon: BookMarked,
    titulo: "Guion: Demostración",
    desc: "Guion editable del módulo 7.",
    href: "/recursos/modulo-7/Guion-Modulo-07-Presentacion-y-demostracion.docx",
    formato: "DOCX",
  },
  { icon: BookMarked, titulo: "Manual del vendedor", desc: "Guía completa del programa y el rol." },
  { icon: Presentation, titulo: "Presentación comercial", desc: "Deck para presentar ATRIA a prospectos." },
  { icon: MessageSquareText, titulo: "Guiones de contacto", desc: "WhatsApp, correo y llamada." },
  { icon: FileText, titulo: "Fichas de producto", desc: "Una ficha por módulo de ATRIA." },
  { icon: FileDown, titulo: "Plantillas", desc: "Lista de prospectos y seguimiento." },
  { icon: MessageSquareText, titulo: "Guía de objeciones", desc: "Respuestas recomendadas." },
  { icon: Images, titulo: "Material de redes", desc: "Piezas para publicar (próximamente)." },
  { icon: FileText, titulo: "Comparativas", desc: "Excel vs ATRIA y competidores." },
];

export default function RecursosPage() {
  return (
    <>
      <PageHeader
        titulo="Recursos"
        descripcion="Material comercial para apoyar tu trabajo. Los recursos publicados ya están listos para descargar."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RECURSOS.map(({ icon: Icon, titulo, desc, href, formato }) => (
          <div key={titulo} className="arca-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--color-surface-2)] text-[color:var(--color-secondary)]">
              <Icon size={18} />
            </span>
            <h3 className="mt-3 text-[15px] font-semibold">{titulo}</h3>
            <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">{desc}</p>
            {href ? (
              <a href={href} download className="arca-btn arca-btn-secondary mt-3 w-full">
                <FileDown size={14} /> Descargar {formato}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="arca-btn arca-btn-secondary mt-3 w-full opacity-60"
                title="Disponible próximamente"
              >
                <FileDown size={14} /> Descargar · pendiente
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
