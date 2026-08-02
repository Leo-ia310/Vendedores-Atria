"use client";

import { useState } from "react";
import { UserCircle } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Feedback";
import { useAuth } from "@/lib/auth/session";
import { api } from "@/lib/api";
import Link from "next/link";

export default function PerfilPage() {
  const { usuario } = useAuth();
  const { toast } = useToast();
  const [ciudad, setCiudad] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [idioma, setIdioma] = useState("es");
  const [medio, setMedio] = useState("WhatsApp");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    const r = await api("actualizarPerfil", {
      ciudad, whatsapp, idioma, medioContacto: medio,
    });
    setGuardando(false);
    if (!r.ok) return toast(r.error, "error");
    toast("Perfil actualizado.", "success");
  }

  return (
    <>
      <PageHeader titulo="Mi perfil" descripcion="Actualiza tus datos de contacto y preferencias." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-tertiary-light)] text-[color:var(--color-primary)]">
              <UserCircle size={26} />
            </span>
            <div>
              <p className="text-[15px] font-semibold">{usuario?.email}</p>
              <p className="text-[12px] uppercase tracking-wide text-[color:var(--color-text-muted)]">
                {usuario?.rol}
              </p>
            </div>
          </div>
          <div className="mt-5 border-t border-[color:var(--color-border)] pt-4">
            <Link href="/cambiar-password" className="arca-btn arca-btn-secondary w-full">
              Cambiar contraseña
            </Link>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[16px] font-semibold">Datos de contacto</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="wa">WhatsApp</Label>
              <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+505..." />
            </div>
            <div>
              <Label htmlFor="idioma">Idioma</Label>
              <Select id="idioma" value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="medio">Medio de contacto</Label>
              <Select id="medio" value={medio} onChange={(e) => setMedio(e.target.value)}>
                <option>WhatsApp</option>
                <option>Correo</option>
                <option>Llamada</option>
              </Select>
            </div>
          </div>
          <Button variant="brand" className="mt-4" loading={guardando} onClick={guardar}>
            Guardar cambios
          </Button>
        </Card>
      </div>
    </>
  );
}
