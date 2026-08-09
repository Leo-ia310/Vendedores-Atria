"use client";

import { useEffect, useState } from "react";
import { Users2, ShieldCheck, ShoppingBag, Wallet, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Skeleton } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { formatearUSD } from "@/lib/utils";

async function contar(hoja: string): Promise<Record<string, unknown>[]> {
  const r = await api<Record<string, unknown>[]>("adminListar", { hoja });
  return r.ok ? r.data : [];
}

export default function AdminResumen() {
  const [cargando, setCargando] = useState(true);
  const [d, setD] = useState({
    candidatos: 0,
    vendedores: 0,
    ventasPendientes: 0,
    comisionesPendientes: 0,
    noResueltas: 0,
    montoPendiente: 0,
  });

  useEffect(() => {
    (async () => {
      const [cand, vend, ventas, comis, preguntasIa] = await Promise.all([
        contar("Candidatos"),
        contar("Vendedores"),
        contar("Ventas"),
        contar("Comisiones"),
        contar("unanswered_questions"),
      ]);
      const comisionesPorPagar = comis.filter((c) => ["pendiente", "aprobada"].includes(String(c.Estado)));
      setD({
        candidatos: cand.length,
        vendedores: vend.length,
        ventasPendientes: ventas.filter((v) => ["pendiente", "en_revision"].includes(String(v.Estado))).length,
        comisionesPendientes: comisionesPorPagar.length,
        montoPendiente: comisionesPorPagar.reduce((s, c) => s + Number(c.Monto || 0), 0),
        noResueltas: preguntasIa.filter((q) => String(q.resolved) !== "true").length,
      });
      setCargando(false);
    })();
  }, []);

  if (cargando) {
    return (
      <>
        <PageHeader titulo="Panel administrativo" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader titulo="Panel administrativo" descripcion="Vista general del programa de vendedores." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Candidatos" value={d.candidatos} icon={Users2} />
        <KpiCard label="Vendedores" value={d.vendedores} icon={ShieldCheck} tono="success" />
        <KpiCard label="Ventas por revisar" value={d.ventasPendientes} icon={ShoppingBag} tono="warning" />
        <KpiCard label="Comisiones pendientes" value={d.comisionesPendientes} icon={Wallet} tono="warning" hint={formatearUSD(d.montoPendiente)} />
        <KpiCard label="Preguntas IA pendientes" value={d.noResueltas} icon={MessageCircle} tono="info" />
        <KpiCard label="Monto por pagar" value={formatearUSD(d.montoPendiente)} icon={Wallet} />
      </div>
    </>
  );
}
