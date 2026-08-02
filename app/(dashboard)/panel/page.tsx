"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users2, ShoppingBag, Wallet, TrendingUp, BadgeCheck, Copy, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Skeleton, useToast } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Dashboard = {
  vendedor: { codigoVendedor: string; codigoReferido: string; nivel: string; estado: string; fechaCertificacion: string };
  kpis: {
    prospectos: number; clientesActivos: number; ventasCerradas: number;
    comisionesPendientes: number; comisionesPagadas: number; tasaConversion: number;
  };
};

export default function PanelResumen() {
  const { toast } = useToast();
  const [data, setData] = useState<Dashboard | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await api<Dashboard>("dashboardVendedor");
      if (r.ok) setData(r.data);
      setCargando(false);
    })();
  }, []);

  if (cargando) {
    return (
      <>
        <PageHeader titulo="Resumen" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      </>
    );
  }

  const k = data?.kpis;
  const v = data?.vendedor;

  return (
    <>
      <PageHeader
        titulo="Resumen"
        descripcion="Tu actividad como asesor comercial certificado de ATRIA."
      />

      {v && (
        <Card className="mb-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]">
                <BadgeCheck size={22} />
              </span>
              <div>
                <p className="text-[15px] font-semibold">Vendedor {v.codigoVendedor}</p>
                <p className="text-[12px] text-[color:var(--color-text-muted)]">
                  Nivel {v.nivel} · Certificado el {formatearFecha(v.fechaCertificacion)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(v.codigoReferido); toast("Código de referido copiado.", "success"); }}
              className="arca-btn arca-btn-secondary"
            >
              <Copy size={14} /> Referido: {v.codigoReferido}
            </button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Prospectos" value={k?.prospectos ?? 0} icon={Users2} />
        <KpiCard label="Clientes activos" value={k?.clientesActivos ?? 0} icon={BadgeCheck} tono="success" />
        <KpiCard label="Ventas cerradas" value={k?.ventasCerradas ?? 0} icon={ShoppingBag} tono="info" />
        <KpiCard label="Comisiones pendientes" value={formatearUSD(k?.comisionesPendientes ?? 0)} icon={Wallet} tono="warning" />
        <KpiCard label="Comisiones pagadas" value={formatearUSD(k?.comisionesPagadas ?? 0)} icon={Wallet} tono="success" />
        <KpiCard label="Tasa de conversión" value={`${k?.tasaConversion ?? 0}%`} icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AccesoRapido href="/panel/crm" titulo="Registrar prospecto" texto="Agrega y da seguimiento a tus oportunidades." icon={Users2} />
        <AccesoRapido href="/panel/ventas" titulo="Registrar venta" texto="Envía una venta a validación." icon={ShoppingBag} />
        <AccesoRapido href="/panel/comisiones" titulo="Ver comisiones" texto="Revisa tus comisiones y su estado." icon={Wallet} />
      </div>
    </>
  );
}

function AccesoRapido({ href, titulo, texto, icon: Icon }: { href: string; titulo: string; texto: string; icon: typeof Users2 }) {
  return (
    <Link href={href} className="arca-card group flex items-start gap-3 p-4 transition hover:border-[color:var(--color-tertiary)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--color-surface-2)] text-[color:var(--color-secondary)]">
        <Icon size={17} />
      </span>
      <div className="flex-1">
        <p className="text-[14px] font-semibold">{titulo}</p>
        <p className="text-[12px] text-[color:var(--color-text-muted)]">{texto}</p>
      </div>
      <ArrowRight size={16} className="text-[color:var(--color-text-muted)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
