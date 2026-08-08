"use client";

import { PageHeader } from "@/components/app/PageHeader";
import { InternalAssistant } from "@/components/assistant/InternalAssistant";

export default function AsistenteVendedorPage() {
  return (
    <>
      <PageHeader
        titulo="Asistente interno"
        descripcion="Consulta producto, precios, comisiones, scripts, politicas y objeciones con fuentes internas."
        breadcrumb={[{ label: "Panel", href: "/panel" }, { label: "Asistente" }]}
      />
      <InternalAssistant />
    </>
  );
}
