"use client";

import { PageHeader } from "@/components/app/PageHeader";
import { InternalAssistant } from "@/components/assistant/InternalAssistant";

export default function AsistenteAcademiaPage() {
  return (
    <>
      <PageHeader
        titulo="Asistente interno"
        descripcion="Consulta informacion oficial de Arca para responder mejor a clientes y reforzar tu proceso comercial."
        breadcrumb={[{ label: "Academia", href: "/academia" }, { label: "Asistente" }]}
      />
      <InternalAssistant />
    </>
  );
}
