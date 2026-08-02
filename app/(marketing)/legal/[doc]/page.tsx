import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { DOCS_LEGALES, getDocLegal, VERSION_LEGAL } from "@/lib/content/legal";

export function generateStaticParams() {
  return DOCS_LEGALES.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const d = getDocLegal(doc);
  return { title: d ? d.titulo : "Documento legal" };
}

export default async function PaginaLegal({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const d = getDocLegal(doc);
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white"
      >
        <ArrowLeft size={14} /> Volver al inicio
      </Link>

      <h1 className="mt-6 text-[32px] font-semibold leading-tight text-white">{d.titulo}</h1>
      <p className="mt-2 text-[15px] text-white/60">{d.resumen}</p>
      <p className="mt-1 text-[12px] text-white/40">Versión {VERSION_LEGAL}</p>

      <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-[#d97706]/40 bg-[#3a2408]/60 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#fbbf24]" />
        <p className="text-[13px] leading-6 text-[#fde68a]">
          Estos documentos deben ser revisados por un abogado autorizado en las jurisdicciones donde
          operará el programa. Son borradores orientativos y no constituyen asesoría legal definitiva.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {d.secciones.map((s) => (
          <section key={s.h}>
            <h2 className="text-[17px] font-semibold text-white">{s.h}</h2>
            <div className="mt-2 space-y-2">
              {s.p.map((parrafo, i) => (
                <p key={i} className="text-[14px] leading-7 text-white/70">
                  {parrafo}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-white/10 pt-6">
        <p className="text-label text-white/40">Otros documentos</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DOCS_LEGALES.filter((x) => x.slug !== d.slug).map((x) => (
            <Link
              key={x.slug}
              href={`/legal/${x.slug}`}
              className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/65 hover:border-[#a78bfa]/50 hover:text-white"
            >
              {x.titulo}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
