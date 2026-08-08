"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { KnowledgeAdmin } from "@/components/assistant/KnowledgeAdmin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { formatearFecha } from "@/lib/utils";

type NoResuelta = {
  UnresolvedId: string;
  Pregunta: string;
  Contexto: string;
  Fecha: string;
  Revisado: string;
  RespuestaAgregada: string;
};

export default function AdminChatbot() {
  const { filas, cargando, recargar } = useAdminData<NoResuelta>("PreguntasNoResueltas");
  const { toast } = useToast();
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [ocupado, setOcupado] = useState("");

  async function resolver(id: string) {
    setOcupado(id);
    const respuesta = respuestas[id] || "";
    const result = await api("adminResolverPregunta", { unresolvedId: id, respuesta });
    setOcupado("");
    if (!result.ok) return toast(result.error, "error");
    toast("Pregunta marcada como revisada.", "success");
    recargar();
  }

  const pendientes = filas.filter((question) => String(question.Revisado) !== "true");

  return (
    <>
      <PageHeader
        titulo="Asistente y chatbot"
        descripcion="Administra la base oficial del asistente IA y conserva el fallback del chatbot tradicional."
      />

      <KnowledgeAdmin />

      <section className="mt-5">
        <div className="mb-3">
          <h2 className="text-[15px] font-semibold text-[color:var(--color-text-primary)]">
            Preguntas sin resolver del chatbot legacy
          </h2>
          <p className="mt-0.5 text-[13px] text-[color:var(--color-text-muted)]">
            Se conserva como respaldo del motor basado en reglas.
          </p>
        </div>

        {cargando ? (
          <div className="space-y-3">
            {[0, 1].map((item) => <Skeleton key={item} className="h-20 w-full" />)}
          </div>
        ) : pendientes.length === 0 ? (
          <div className="arca-card">
            <EmptyState
              icon={MessageCircle}
              titulo="No hay preguntas sin resolver"
              descripcion="Cuando el fallback no reconozca algo, aparecera aqui."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {pendientes.map((question) => (
              <div key={question.UnresolvedId} className="arca-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[color:var(--color-text-primary)]">
                      "{question.Pregunta}"
                    </p>
                    <p className="mt-0.5 text-[12px] text-[color:var(--color-text-muted)]">
                      {question.Contexto && `Contexto: ${question.Contexto} · `}
                      {formatearFecha(question.Fecha)}
                    </p>
                  </div>
                  <Badge tono="warning">Sin revisar</Badge>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="Respuesta o nota para la base de conocimiento..."
                    value={respuestas[question.UnresolvedId] || ""}
                    onChange={(event) => setRespuestas((current) => ({
                      ...current,
                      [question.UnresolvedId]: event.target.value,
                    }))}
                  />
                  <Button
                    variant="secondary"
                    loading={ocupado === question.UnresolvedId}
                    onClick={() => resolver(question.UnresolvedId)}
                  >
                    <Check size={14} /> Marcar revisada
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
