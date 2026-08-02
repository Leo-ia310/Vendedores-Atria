"use client";

import { FileText, FileDown, Presentation, MessageSquareText, Images, BookMarked } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

const RECURSOS = [
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
        descripcion="Material comercial para apoyar tu trabajo. Las descargas se habilitarán conforme se publiquen."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RECURSOS.map(({ icon: Icon, titulo, desc }) => (
          <div key={titulo} className="arca-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--color-surface-2)] text-[color:var(--color-secondary)]">
              <Icon size={18} />
            </span>
            <h3 className="mt-3 text-[15px] font-semibold">{titulo}</h3>
            <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">{desc}</p>
            <button
              type="button"
              disabled
              className="arca-btn arca-btn-secondary mt-3 w-full opacity-60"
              title="Disponible próximamente"
            >
              <FileDown size={14} /> Descargar · pendiente
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
