"use client";

import { useState } from "react";
import { MessageCircle, Check } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";
import { formatearFecha } from "@/lib/utils";

type NoResuelta = {
  UnresolvedId: string; Pregunta: string; Contexto: string; Fecha: string;
  Revisado: string; RespuestaAgregada: string;
};

export default function AdminChatbot() {
  const { filas, cargando, recargar } = useAdminData<NoResuelta>("PreguntasNoResueltas");
  const { toast } = useToast();
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [ocupado, setOcupado] = useState("");

  async function resolver(id: string) {
    setOcupado(id);
    const r = await api("adminResolverPregunta", { unresolvedId: id, respuesta: respuestas[id] || "" });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    toast("Pregunta marcada como revisada.", "success");
    recargar();
  }

  const pendientes = filas.filter((q) => String(q.Revisado) !== "true");

  return (
    <>
      <PageHeader
        titulo="Chatbot"
        descripcion="Preguntas que el Asistente Comercial ATRIA no pudo responder. Agrega respuestas para mejorar la base de conocimiento."
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : pendientes.length === 0 ? (
        <div className="arca-card"><EmptyState icon={MessageCircle} titulo="No hay preguntas sin resolver" descripcion="Cuando el asistente no reconozca algo, aparecerá aquí." /></div>
      ) : (
        <div className="space-y-3">
          {pendientes.map((q) => (
            <div key={q.UnresolvedId} className="arca-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[color:var(--color-text-primary)]">“{q.Pregunta}”</p>
                  <p className="mt-0.5 text-[12px] text-[color:var(--color-text-muted)]">
                    {q.Contexto && `Contexto: ${q.Contexto} · `}{formatearFecha(q.Fecha)}
                  </p>
                </div>
                <Badge tono="warning">Sin revisar</Badge>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Respuesta o nota para la base de conocimiento…"
                  value={respuestas[q.UnresolvedId] || ""}
                  onChange={(e) => setRespuestas((r) => ({ ...r, [q.UnresolvedId]: e.target.value }))}
                />
                <Button variant="secondary" loading={ocupado === q.UnresolvedId} onClick={() => resolver(q.UnresolvedId)}>
                  <Check size={14} /> Marcar revisada
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
