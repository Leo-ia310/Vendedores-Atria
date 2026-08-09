"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Comision = {
  CommissionId: string; Tipo: string; Porcentaje: number; Monto: number; Estado: string;
  FechaCreacion: string; FechaProgramada: string; FechaPago: string; MetodoPago: string;
};

const TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  pendiente: "warning", aprobada: "info", pagada: "success", anulada: "error",
};

export default function ComisionesPage() {
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await api<Comision[]>("listarComisiones");
      if (r.ok) setComisiones(r.data);
      setCargando(false);
    })();
  }, []);

  const suma = (estados: string[]) =>
    comisiones.filter((c) => estados.includes(c.Estado)).reduce((s, c) => s + Number(c.Monto || 0), 0);

  return (
    <>
      <PageHeader titulo="Comisiones" descripcion="Detalle transparente de tus comisiones y su estado." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Pendientes" value={formatearUSD(suma(["pendiente", "aprobada"]))} icon={Wallet} tono="warning" />
        <KpiCard label="Pagadas" value={formatearUSD(suma(["pagada"]))} icon={Wallet} tono="success" />
        <KpiCard label="Total generado" value={formatearUSD(suma(["pendiente", "aprobada", "pagada"]))} icon={Wallet} />
      </div>

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : comisiones.length === 0 ? (
        <div className="arca-card">
          <EmptyState icon={Wallet} titulo="Aún no tienes comisiones" descripcion="Tus comisiones aparecerán aquí cuando tus ventas sean aprobadas." />
        </div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">%</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Programada</th>
                <th className="px-4 py-3 font-semibold">Pagada</th>
              </tr>
            </thead>
            <tbody>
              {comisiones.map((c) => (
                <tr key={c.CommissionId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{c.Tipo === "renovacion" ? "Pago recurrente" : "Primer pago"}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{Math.round(Number(c.Porcentaje) * 100)}%</td>
                  <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(c.Monto || 0))}</td>
                  <td className="px-4 py-3"><Badge tono={TONO[c.Estado] || "neutral"}>{c.Estado}</Badge></td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(c.FechaProgramada)}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{c.FechaPago ? formatearFecha(c.FechaPago) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
