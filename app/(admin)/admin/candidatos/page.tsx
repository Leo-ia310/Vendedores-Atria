"use client";

import { useState } from "react";
import { Users2, Check, X, Ban } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";
import { formatearFecha } from "@/lib/utils";

type Candidato = {
  CandidateId: string; NombreCompleto: string; Pais: string; Email: string; WhatsApp: string;
  Estado: string; Progreso: number; Certificado: string; FechaRegistro: string;
};

const TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  en_capacitacion: "info", aprobado: "success", certificado: "success",
  rechazado: "error", suspendido: "warning",
};

export default function AdminCandidatos() {
  const { filas, cargando, recargar } = useAdminData<Candidato>("Candidatos");
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [ocupado, setOcupado] = useState("");

  async function accion(candidateId: string, accion: string) {
    setOcupado(candidateId + accion);
    const r = await api("adminCandidato", { candidateId, accion });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    toast("Candidato actualizado.", "success");
    recargar();
  }

  const lista = filas.filter((c) =>
    !busca ||
    c.NombreCompleto?.toLowerCase().includes(busca.toLowerCase()) ||
    c.Email?.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <PageHeader titulo="Candidatos" descripcion="Revisa y gestiona a los candidatos en capacitación." />
      <div className="mb-4 max-w-sm">
        <Input placeholder="Buscar por nombre o correo…" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      {cargando ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : lista.length === 0 ? (
        <div className="arca-card"><EmptyState icon={Users2} titulo="Sin candidatos" /></div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Candidato</th>
                <th className="px-4 py-3 font-semibold">País</th>
                <th className="px-4 py-3 font-semibold">Progreso</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Registro</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.CandidateId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[color:var(--color-text-primary)]">{c.NombreCompleto}</p>
                    <p className="text-[color:var(--color-text-muted)]">{c.Email}</p>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{c.Pais || "—"}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{c.Progreso || 0}%</td>
                  <td className="px-4 py-3"><Badge tono={TONO[c.Estado] || "neutral"}>{String(c.Estado).replace("_", " ")}</Badge></td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(c.FechaRegistro)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button size="sm" variant="secondary" loading={ocupado === c.CandidateId + "aprobar"} onClick={() => accion(c.CandidateId, "aprobar")}><Check size={13} /></Button>
                      <Button size="sm" variant="ghost" loading={ocupado === c.CandidateId + "suspender"} onClick={() => accion(c.CandidateId, "suspender")}><Ban size={13} /></Button>
                      <Button size="sm" variant="danger" loading={ocupado === c.CandidateId + "rechazar"} onClick={() => accion(c.CandidateId, "rechazar")}><X size={13} /></Button>
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
