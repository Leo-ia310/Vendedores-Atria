"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Copy, ExternalLink, ShoppingBag, Wallet } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Venta = {
  SaleId: string;
  Cliente: string;
  ClienteEmail?: string;
  EmpresaCliente?: string;
  Plan: string;
  Monto: number;
  TipoVenta: string;
  FechaVenta: string;
  Estado: string;
  Origen?: string;
  ReferenciaExterna?: string;
};

type Dashboard = {
  vendedor: {
    codigoReferido: string;
    linkReferido: string;
  };
};

const ESTADO_TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  aprobada: "success",
  pagada: "success",
  completada: "success",
  pendiente: "warning",
  en_revision: "info",
  rechazada: "error",
  cancelada: "neutral",
  reembolsada: "error",
};

export default function VentasPage() {
  const { toast } = useToast();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const [ventasRes, dashboardRes] = await Promise.all([
        api<Venta[]>("listarVentas"),
        api<Dashboard>("dashboardVendedor"),
      ]);
      if (ventasRes.ok) setVentas(ventasRes.data);
      if (dashboardRes.ok) setDashboard(dashboardRes.data);
      setCargando(false);
    })();
  }, []);

  const totalVendido = useMemo(
    () => ventas.reduce((sum, venta) => sum + Number(venta.Monto || 0), 0),
    [ventas],
  );
  const primerasVentas = ventas.filter((v) => v.TipoVenta !== "renovacion").length;
  const renovaciones = ventas.filter((v) => v.TipoVenta === "renovacion").length;
  const vendedor = dashboard?.vendedor;

  return (
    <>
      <PageHeader
        titulo="Ventas"
        descripcion="Solo aparecen compras confirmadas desde Atria y atribuidas a tu link de referido."
      />

      {vendedor && (
        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-label">Tu link de referido</p>
              <p className="mt-1 break-all text-[13px] font-medium text-[color:var(--color-text-primary)]">
                {vendedor.linkReferido}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="arca-btn arca-btn-secondary flex-1 sm:flex-none"
                onClick={() => {
                  navigator.clipboard?.writeText(vendedor.linkReferido);
                  toast("Link de referido copiado.", "success");
                }}
              >
                <Copy size={14} /> Copiar link
              </button>
              <button
                type="button"
                className="arca-btn arca-btn-ghost flex-1 sm:flex-none"
                onClick={() => {
                  navigator.clipboard?.writeText(vendedor.codigoReferido);
                  toast("Código de referido copiado.", "success");
                }}
              >
                <Copy size={14} /> {vendedor.codigoReferido}
              </button>
              <Link href={vendedor.linkReferido} target="_blank" className="arca-btn arca-btn-ghost flex-1 sm:flex-none">
                <ExternalLink size={14} /> Abrir
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Ventas pagadas" value={ventas.length} icon={ShoppingBag} tono="success" />
        <KpiCard label="Monto vendido" value={formatearUSD(totalVendido)} icon={Wallet} tono="info" />
        <KpiCard label="Primera / renovación" value={`${primerasVentas} / ${renovaciones}`} icon={BadgeCheck} />
      </div>

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : ventas.length === 0 ? (
        <div className="arca-card">
          <EmptyState
            icon={ShoppingBag}
            titulo="Aún no tienes ventas pagadas"
            descripcion="Cuando un cliente compre desde tu link de referido, aparecerá aquí junto con su comisión."
          />
        </div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.SaleId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[color:var(--color-text-primary)]">
                      {v.EmpresaCliente || v.Cliente}
                    </p>
                    {v.ClienteEmail && (
                      <p className="text-[12px] text-[color:var(--color-text-muted)]">{v.ClienteEmail}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.Plan}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                    {v.TipoVenta === "renovacion" ? "Renovación" : "Primera"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(v.Monto || 0))}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(v.FechaVenta)}</td>
                  <td className="px-4 py-3">
                    <Badge tono={ESTADO_TONO[v.Estado] || "neutral"}>{v.Estado.replace("_", " ")}</Badge>
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
