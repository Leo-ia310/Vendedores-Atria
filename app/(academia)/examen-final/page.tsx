"use client";

import { PageHeader } from "@/components/app/PageHeader";
import { ExamenRunner } from "@/components/academia/ExamenRunner";

export default function ExamenFinalPage() {
  return (
    <>
      <PageHeader
        titulo="Examen final"
        descripcion="Integra todo el programa. Puedes repetirlo sin límite hasta demostrar el dominio necesario para certificarte."
        breadcrumb={[{ label: "Academia", href: "/academia" }, { label: "Examen final" }]}
      />
      <ExamenRunner
        moduleId="final"
        titulo="Examen final de certificación"
        volverHref="/academia"
        siguienteHref="/certificacion"
        siguienteLabel="Ir a certificación"
      />
    </>
  );
}
