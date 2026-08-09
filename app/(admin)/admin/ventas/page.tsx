"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Venta = {
  SaleId: string;
  SellerId: string;
  Cliente: string;
  ClienteEmail?: string;
  EmpresaCliente?: string;
  Plan: string;
  Monto: number;
  TipoVenta: string;
  FechaVenta: string;
  Estado: string;
  CodigoReferido?: string;
  ReferenciaExterna?: string;
  Origen?: string;
};

const TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  pendiente: "warning",
  en_revision: "info",
  aprobada: "success",
  rechazada: "error",
  cancelada: "neutral",
  reembolsada: "error",
};

export default function AdminVentas() {
  const { filas, cargando } = useAdminData<Venta>("Ventas");
  const [filtro, setFiltro] = useState("todas");

  const lista = filas.filter((v) => filtro === "todas" || v.Estado === filtro);

  return (
    <>
      <PageHeader
        titulo="Ventas"
        descripcion="Ventas confirmadas por Atria con trazabilidad hacia el vendedor referido."
        accion={
          <Select className="max-w-[200px]" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_revision">En revision</option>
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
          <table className="w-full min-w-[1040px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Codigo referido</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((v) => {
                const codigo = v.CodigoReferido || v.SellerId;
                return (
                  <tr key={v.SaleId} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[color:var(--color-text-primary)]">{v.EmpresaCliente || v.Cliente}</p>
                      {(v.ClienteEmail || v.Cliente) && (
                        <p className="text-[12px] text-[color:var(--color-text-muted)]">
                          {[v.Cliente, v.ClienteEmail].filter(Boolean).join(" / ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.Plan}</td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                      {v.TipoVenta === "renovacion" ? "Recurrente" : "Primer pago"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(v.Monto || 0))}</td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(v.FechaVenta)}</td>
                    <td className="px-4 py-3">
                      <Badge tono={TONO[v.Estado] || "neutral"}>{String(v.Estado).replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/vendedores?q=${encodeURIComponent(codigo)}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2 py-1 font-mono text-[12px] text-[color:var(--color-secondary)] transition hover:border-[color:var(--color-tertiary)]"
                      >
                        {codigo}
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
