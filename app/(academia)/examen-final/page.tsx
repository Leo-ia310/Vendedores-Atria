"use client";

import { PageHeader } from "@/components/app/PageHeader";
import { ExamenRunner } from "@/components/academia/ExamenRunner";

export default function ExamenFinalPage() {
  return (
    <>
      <PageHeader
        titulo="Examen final"
        descripcion="Integra todo el programa. Necesitas el puntaje mínimo para certificarte. Tienes intentos limitados."
        breadcrumb={[{ label: "Academia", href: "/academia" }, { label: "Examen final" }]}
      />
      <ExamenRunner
        moduleId="final"
        titulo="Examen final de certificación"
        minutos={40}
        volverHref="/academia"
        siguienteHref="/certificacion"
        siguienteLabel="Ir a certificación"
      />
    </>
  );
}
