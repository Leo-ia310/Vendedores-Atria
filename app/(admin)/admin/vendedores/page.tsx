"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";
import { formatearFecha } from "@/lib/utils";

type Vendedor = {
  SellerId: string;
  CodigoVendedor: string;
  CodigoReferido: string;
  Nivel: string;
  Estado: string;
  FechaCertificacion: string;
  VentasTotales: number;
  ClientesActivos: number;
  CandidateId: string;
};

type Candidato = {
  CandidateId: string;
  NombreCompleto?: string;
  Email?: string;
  WhatsApp?: string;
  Pais?: string;
  Ciudad?: string;
};

const TONO: Record<string, "success" | "neutral" | "warning"> = {
  activo: "success",
  inactivo: "neutral",
  suspendido: "warning",
};

export default function AdminVendedores() {
  const { filas, cargando, recargar } = useAdminData<Vendedor>("Vendedores");
  const { filas: candidatos, cargando: cargandoCandidatos } = useAdminData<Candidato>("Candidatos");
  const { toast } = useToast();
  const [ocupado, setOcupado] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setBusca(new URLSearchParams(window.location.search).get("q") || "");
  }, []);

  async function gestionar(sellerId: string, estado: string) {
    setOcupado(sellerId);
    const r = await api("adminGestionarVendedor", { sellerId, estado });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    toast("Vendedor actualizado.", "success");
    recargar();
  }

  const candidatosPorId = useMemo(() => {
    return new Map(candidatos.map((c) => [c.CandidateId, c]));
  }, [candidatos]);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return filas;
    return filas.filter((v) => {
      const candidato = candidatosPorId.get(v.CandidateId);
      return [
        v.SellerId,
        v.CodigoVendedor,
        v.CodigoReferido,
        v.Nivel,
        v.Estado,
        candidato?.NombreCompleto,
        candidato?.Email,
        candidato?.WhatsApp,
        candidato?.Pais,
        candidato?.Ciudad,
      ].join(" ").toLowerCase().includes(q);
    });
  }, [busca, candidatosPorId, filas]);

  const estaCargando = cargando || cargandoCandidatos;

  return (
    <>
      <PageHeader titulo="Vendedores" descripcion="Gestiona estado, nivel y trazabilidad de vendedores certificados." />

      <div className="mb-4 max-w-xl">
        <Input
          placeholder="Buscar por vendedor, correo, WhatsApp, codigo referido o estado..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      {estaCargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : lista.length === 0 ? (
        <div className="arca-card"><EmptyState icon={ShieldCheck} titulo="Sin vendedores certificados aun" /></div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Vendedor</th>
                <th className="px-4 py-3 font-semibold">Codigos</th>
                <th className="px-4 py-3 font-semibold">Nivel</th>
                <th className="px-4 py-3 font-semibold">Ventas</th>
                <th className="px-4 py-3 font-semibold">Clientes</th>
                <th className="px-4 py-3 font-semibold">Certificacion</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Gestion</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((v) => {
                const candidato = candidatosPorId.get(v.CandidateId);
                return (
                  <tr key={v.SellerId} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[color:var(--color-text-primary)]">
                        {candidato?.NombreCompleto || "Vendedor sin ficha"}
                      </p>
                      <p className="text-[12px] text-[color:var(--color-text-secondary)]">{candidato?.Email || "-"}</p>
                      <p className="text-[12px] text-[color:var(--color-text-muted)]">
                        {[candidato?.WhatsApp, candidato?.Pais, candidato?.Ciudad].filter(Boolean).join(" / ") || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-[12px] font-medium text-[color:var(--color-text-primary)]">{v.CodigoVendedor}</p>
                      <p className="font-mono text-[12px] text-[color:var(--color-secondary)]">{v.CodigoReferido}</p>
                    </td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.Nivel}</td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.VentasTotales || 0}</td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.ClientesActivos || 0}</td>
                    <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(v.FechaCertificacion)}</td>
                    <td className="px-4 py-3"><Badge tono={TONO[v.Estado] || "neutral"}>{v.Estado}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          className="max-w-[140px] py-1 text-[12px]"
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
