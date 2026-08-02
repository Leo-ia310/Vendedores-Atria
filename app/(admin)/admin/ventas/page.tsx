"use client";

import { useState } from "react";
import { ShoppingBag, Check, X } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Venta = {
  SaleId: string; SellerId: string; Cliente: string; Plan: string; Monto: number;
  TipoVenta: string; FechaVenta: string; Estado: string;
};

const TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  pendiente: "warning", en_revision: "info", aprobada: "success",
  rechazada: "error", cancelada: "neutral", reembolsada: "error",
};

export default function AdminVentas() {
  const { filas, cargando, recargar } = useAdminData<Venta>("Ventas");
  const { toast } = useToast();
  const [ocupado, setOcupado] = useState("");
  const [filtro, setFiltro] = useState("todas");

  async function actualizar(saleId: string, estado: string) {
    setOcupado(saleId + estado);
    const r = await api<{ comision?: { monto: number } }>("adminActualizarVenta", { saleId, estado });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    if (estado === "aprobada" && r.data?.comision) {
      toast(`Venta aprobada. Comisión generada: ${formatearUSD(r.data.comision.monto)}.`, "success");
    } else {
      toast("Venta actualizada.", "success");
    }
    recargar();
  }

  const lista = filas.filter((v) => filtro === "todas" || v.Estado === filtro);

  return (
    <>
      <PageHeader
        titulo="Ventas"
        descripcion="Valida las ventas. Al aprobar una venta se genera automáticamente su comisión."
        accion={
          <Select className="max-w-[200px]" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_revision">En revisión</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
            <option value="reembolsada">Reembolsadas</option>
          </Select>
        }
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : lista.length === 0 ? (
        <div className="arca-card"><EmptyState icon={ShoppingBag} titulo="Sin ventas" /></div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((v) => (
                <tr key={v.SaleId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[color:var(--color-text-primary)]">{v.Cliente}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.Plan}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.TipoVenta === "renovacion" ? "Renov." : "Primera"}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(v.Monto || 0))}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(v.FechaVenta)}</td>
                  <td className="px-4 py-3"><Badge tono={TONO[v.Estado] || "neutral"}>{String(v.Estado).replace("_", " ")}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button size="sm" variant="secondary" disabled={v.Estado === "aprobada"} loading={ocupado === v.SaleId + "aprobada"} onClick={() => actualizar(v.SaleId, "aprobada")}>
                        <Check size={13} /> Aprobar
                      </Button>
                      <Button size="sm" variant="danger" loading={ocupado === v.SaleId + "rechazada"} onClick={() => actualizar(v.SaleId, "rechazada")}>
                        <X size={13} />
                      </Button>
                    </div>
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
