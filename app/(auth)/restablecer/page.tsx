"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Feedback";

export default function RestablecerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [token, setTokenVal] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (nueva.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (nueva !== confirmar) return setError("Las contraseñas no coinciden.");
    setCargando(true);
    const r = await api("restablecerPassword", { token: token.trim(), nueva });
    setCargando(false);
    if (!r.ok) return setError(r.error || "No se pudo restablecer.");
    toast("Contraseña restablecida. Ya puedes iniciar sesión.", "success");
    router.push("/login");
  }

  return (
    <div className="arca-card overflow-hidden">
      <div className="border-b border-[color:var(--color-border)] px-6 py-5">
        <h1 className="text-xl">Nueva contraseña</h1>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          Ingresa el código que recibiste y tu nueva contraseña.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
        <div>
          <Label htmlFor="token" required>Código de recuperación</Label>
          <Input id="token" value={token} onChange={(e) => setTokenVal(e.target.value)} required />
        </div>
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
          Restablecer contraseña
        </Button>
        <p className="text-center text-[13px] text-[color:var(--color-text-muted)]">
          <Link href="/login" className="font-medium text-[color:var(--color-secondary)] hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
