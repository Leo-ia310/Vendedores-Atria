"use client";

import { PageHeader } from "@/components/app/PageHeader";
import { KnowledgeAdmin } from "@/components/assistant/KnowledgeAdmin";

export default function AdminChatbot() {
  return (
    <>
      <PageHeader
        titulo="Asistente IA"
        descripcion="Administra la base oficial y convierte preguntas sin respuesta en aprendizaje continuo."
      />
      <KnowledgeAdmin />
    </>
  );
}
