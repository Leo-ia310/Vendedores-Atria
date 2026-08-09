"use client";

import { useState } from "react";
import { Wallet, Check } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Comision = {
  CommissionId: string; SellerId: string; Tipo: string; Porcentaje: number; Monto: number;
  Estado: string; FechaCreacion: string; FechaProgramada: string; FechaPago: string;
};

const TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  pendiente: "warning", aprobada: "info", pagada: "success", anulada: "error",
};

export default function AdminComisiones() {
  const { filas, cargando, recargar } = useAdminData<Comision>("Comisiones");
  const { toast } = useToast();
  const [ocupado, setOcupado] = useState("");
  const [filtro, setFiltro] = useState("todas");

  async function pagar(commissionId: string) {
    setOcupado(commissionId);
    const r = await api("adminMarcarComisionPagada", { commissionId, metodoPago: "Transferencia" });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    toast("Comisión marcada como pagada.", "success");
    recargar();
  }

  const lista = filas.filter((c) => filtro === "todas" || c.Estado === filtro);
  const totalPendiente = filas.filter((c) => ["pendiente", "aprobada"].includes(c.Estado)).reduce((s, c) => s + Number(c.Monto || 0), 0);

  return (
    <>
      <PageHeader
        titulo="Comisiones"
        descripcion={`Por pagar: ${formatearUSD(totalPendiente)}`}
        accion={
          <Select className="max-w-[180px]" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagada">Pagadas</option>
            <option value="anulada">Anuladas</option>
          </Select>
        }
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : lista.length === 0 ? (
        <div className="arca-card"><EmptyState icon={Wallet} titulo="Sin comisiones" /></div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Vendedor</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Programada</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.CommissionId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{c.SellerId}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{c.Tipo === "renovacion" ? "Pago recurrente" : "Primer pago"} ({Math.round(Number(c.Porcentaje) * 100)}%)</td>
                  <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(c.Monto || 0))}</td>
                  <td className="px-4 py-3"><Badge tono={TONO[c.Estado] || "neutral"}>{c.Estado}</Badge></td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(c.FechaProgramada)}</td>
                  <td className="px-4 py-3 text-right">
                    {["pendiente", "aprobada"].includes(c.Estado) && (
                      <Button size="sm" variant="secondary" loading={ocupado === c.CommissionId} onClick={() => pagar(c.CommissionId)}>
                        <Check size={13} /> Marcar pagada
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
