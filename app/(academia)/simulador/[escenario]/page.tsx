"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { SimuladorRunner } from "@/components/academia/SimuladorRunner";
import { getSalesSimulatorScenario } from "@/lib/content/sales-scenarios";

export default function EscenarioPage({
  params,
}: {
  params: Promise<{ escenario: string }>;
}) {
  const { escenario } = use(params);
  const e = getSalesSimulatorScenario(escenario);

  if (!e) {
    return (
      <div className="arca-card p-5 text-center sm:p-8">
        <p>Escenario no encontrado.</p>
        <Link href="/simulador" className="arca-btn arca-btn-secondary mt-4 w-full sm:w-auto">Volver al simulador</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        titulo={e.titulo}
        descripcion={`${e.perfil} · ${e.descripcion}`}
        breadcrumb={[
          { label: "Academia", href: "/academia" },
          { label: "Simulador", href: "/simulador" },
          { label: e.titulo },
        ]}
      />
      <SimuladorRunner escenario={e} />
    </>
  );
}
