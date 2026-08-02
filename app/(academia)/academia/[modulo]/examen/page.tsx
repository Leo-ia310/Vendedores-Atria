"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { ExamenRunner } from "@/components/academia/ExamenRunner";
import { getModulo } from "@/lib/content/modulos";

export default function ExamenModuloPage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = use(params);
  const m = getModulo(modulo);

  if (!m) {
    return (
      <div className="arca-card p-8 text-center">
        <p>Módulo no encontrado.</p>
        <Link href="/academia" className="arca-btn arca-btn-secondary mt-4">Volver</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        titulo={`Examen · ${m.titulo}`}
        descripcion="Responde todas las preguntas. La calificación es automática y se guarda en tu progreso."
        breadcrumb={[
          { label: "Academia", href: "/academia" },
          { label: m.titulo, href: `/academia/${m.id}` },
          { label: "Examen" },
        ]}
      />
      <ExamenRunner
        moduleId={m.id}
        titulo={m.titulo}
        volverHref={`/academia/${m.id}`}
        siguienteHref="/academia"
        siguienteLabel="Volver a la academia"
      />
    </>
  );
}
