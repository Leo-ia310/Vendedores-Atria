"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";
import { formatearFecha } from "@/lib/utils";

type Vendedor = {
  SellerId: string; CodigoVendedor: string; CodigoReferido: string; Nivel: string;
  Estado: string; FechaCertificacion: string; VentasTotales: number; ClientesActivos: number;
  CandidateId: string;
};

const TONO: Record<string, "success" | "neutral" | "warning"> = {
  activo: "success", inactivo: "neutral", suspendido: "warning",
};

export default function AdminVendedores() {
  const { filas, cargando, recargar } = useAdminData<Vendedor>("Vendedores");
  const { toast } = useToast();
  const [ocupado, setOcupado] = useState("");

  async function gestionar(sellerId: string, estado: string) {
    setOcupado(sellerId);
    const r = await api("adminGestionarVendedor", { sellerId, estado });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    toast("Vendedor actualizado.", "success");
    recargar();
  }

  return (
    <>
      <PageHeader titulo="Vendedores" descripcion="Gestiona el estado, nivel y accesos de los vendedores certificados." />

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filas.length === 0 ? (
        <div className="arca-card"><EmptyState icon={ShieldCheck} titulo="Sin vendedores certificados aún" /></div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Nivel</th>
                <th className="px-4 py-3 font-semibold">Ventas</th>
                <th className="px-4 py-3 font-semibold">Certificación</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((v) => (
                <tr key={v.SellerId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{v.CodigoVendedor}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.Nivel}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.VentasTotales || 0}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(v.FechaCertificacion)}</td>
                  <td className="px-4 py-3"><Badge tono={TONO[v.Estado] || "neutral"}>{v.Estado}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        className="max-w-[130px] py-1 text-[12px]"
                        value={v.Estado}
                        disabled={ocupado === v.SellerId}
                        onChange={(e) => gestionar(v.SellerId, e.target.value)}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="suspendido">Suspendido</option>
                      </Select>
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
