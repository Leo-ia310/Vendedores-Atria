"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { Skeleton, useToast } from "@/components/ui/Feedback";
import { useAdminData } from "@/lib/hooks/useAdminData";
import { api } from "@/lib/api";

type Config = { Clave: string; Valor: string; Descripcion: string };

export default function AdminConfig() {
  const { filas, cargando, recargar } = useAdminData<Config>("Configuracion");
  const { toast } = useToast();
  const [valores, setValores] = useState<Record<string, string>>({});
  const [ocupado, setOcupado] = useState("");

  async function guardar(clave: string, valorActual: string) {
    const valor = valores[clave] ?? valorActual;
    setOcupado(clave);
    const r = await api("adminConfigSet", { clave, valor });
    setOcupado("");
    if (!r.ok) return toast(r.error, "error");
    toast(`"${clave}" actualizado.`, "success");
    recargar();
  }

  return (
    <>
      <PageHeader
        titulo="Configuración"
        descripcion="Ajusta porcentajes de comisión, puntaje mínimo, intentos y más. Los cálculos usan estos valores."
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="grid gap-3">
          {filas.map((c) => (
            <Card key={c.Clave} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor={c.Clave}>{c.Clave}</Label>
                <Input
                  id={c.Clave}
                  defaultValue={c.Valor}
                  onChange={(e) => setValores((v) => ({ ...v, [c.Clave]: e.target.value }))}
                />
                {c.Descripcion && (
                  <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">{c.Descripcion}</p>
                )}
              </div>
              <Button variant="secondary" loading={ocupado === c.Clave} onClick={() => guardar(c.Clave, c.Valor)}>
                <Save size={14} /> Guardar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
