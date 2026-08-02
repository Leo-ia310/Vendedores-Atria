"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { api } from "@/lib/api";
import { useAuth, rutaPorRol } from "@/lib/auth/session";
import { useToast } from "@/components/ui/Feedback";

export default function CambiarPasswordPage() {
  const router = useRouter();
  const { usuario, refrescar } = useAuth();
  const { toast } = useToast();
  const obligatorio = usuario?.debeCambiarPassword;

  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (nueva.length < 8) return setError("La nueva contraseña debe tener al menos 8 caracteres.");
    if (nueva !== confirmar) return setError("Las contraseñas no coinciden.");
    setCargando(true);
    const r = await api("cambiarPassword", { actual, nueva });
    setCargando(false);
    if (!r.ok) return setError(r.error || "No se pudo cambiar la contraseña.");
    toast("Contraseña actualizada.", "success");
    await refrescar();
    router.push(rutaPorRol({ ...(usuario as NonNullable<typeof usuario>), debeCambiarPassword: false }));
  }

  return (
    <div className="arca-card overflow-hidden">
      <div className="border-b border-[color:var(--color-border)] px-6 py-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-[color:var(--color-secondary)]" />
          <h1 className="text-xl">Cambiar contraseña</h1>
        </div>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          {obligatorio
            ? "Por seguridad, define una contraseña nueva antes de continuar."
            : "Actualiza tu contraseña de acceso."}
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
        {!obligatorio && (
          <div>
            <Label htmlFor="actual" required>Contraseña actual</Label>
            <Input id="actual" type="password" value={actual} onChange={(e) => setActual(e.target.value)} required={!obligatorio} />
          </div>
        )}
        <div>
          <Label htmlFor="nueva" required>Nueva contraseña</Label>
          <Input id="nueva" type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="confirmar" required>Confirmar contraseña</Label>
          <Input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
        </div>
        {error && <FieldError>{error}</FieldError>}
        <Button type="submit" variant="brand" size="lg" loading={cargando} className="w-full">
          Guardar contraseña
        </Button>
      </form>
    </div>
  );
}
