"use client";

import { useMemo, useState } from "react";
import { Users2 } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { formatearFecha } from "@/lib/utils";

type Candidato = {
  CandidateId: string;
  NombreCompleto: string;
  Pais: string;
  Ciudad?: string;
  Email: string;
  WhatsApp: string;
  Estado: string;
  Progreso: number;
  Certificado: string;
  FechaRegistro: string;
  FuenteConocio?: string;
};

const TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  en_capacitacion: "info",
  aprobado: "success",
  certificado: "success",
  rechazado: "error",
  suspendido: "warning",
};

export default function AdminCandidatos() {
  const { filas, cargando } = useAdminData<Candidato>("Candidatos");
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState("todos");

  const estados = useMemo(
    () => Array.from(new Set(filas.map((c) => String(c.Estado || "")).filter(Boolean))).sort(),
    [filas],
  );

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return filas.filter((c) => {
      const coincideEstado = estado === "todos" || String(c.Estado) === estado;
      const texto = [
        c.NombreCompleto,
        c.Email,
        c.WhatsApp,
        c.Pais,
        c.Ciudad,
        c.Estado,
        c.Certificado,
        c.FuenteConocio,
      ].join(" ").toLowerCase();
      return coincideEstado && (!q || texto.includes(q));
    });
  }, [busca, estado, filas]);

  return (
    <>
      <PageHeader
        titulo="Candidatos"
        descripcion="Consulta candidatos en capacitacion. El vendedor se activa automaticamente al certificarse."
      />

      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <Input
          placeholder="Buscar por nombre, correo, WhatsApp, pais, fuente o estado..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
        <Select value={estado} onChange={(event) => setEstado(event.target.value)}>
          <option value="todos">Todos los estados</option>
          {estados.map((item) => (
            <option key={item} value={item}>{item.replace("_", " ")}</option>
          ))}
        </Select>
      </div>

      {cargando ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : lista.length === 0 ? (
        <div className="arca-card"><EmptyState icon={Users2} titulo="Sin candidatos" /></div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Candidato</th>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Pais</th>
                <th className="px-4 py-3 font-semibold">Progreso</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Registro</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.CandidateId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[color:var(--color-text-primary)]">{c.NombreCompleto}</p>
                    {c.FuenteConocio && (
                      <p className="text-[12px] text-[color:var(--color-text-muted)]">Fuente: {c.FuenteConocio}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                    <p>{c.Email || "-"}</p>
                    <p className="text-[12px] text-[color:var(--color-text-muted)]">{c.WhatsApp || ""}</p>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                    {[c.Pais, c.Ciudad].filter(Boolean).join(" / ") || "-"}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{c.Progreso || 0}%</td>
                  <td className="px-4 py-3">
                    <Badge tono={TONO[c.Estado] || "neutral"}>{String(c.Estado || "").replace("_", " ")}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(c.FechaRegistro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
