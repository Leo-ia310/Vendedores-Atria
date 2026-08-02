"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { api } from "@/lib/api";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    await api("solicitarRecuperacion", { email: email.trim().toLowerCase() });
    // Respuesta uniforme: no revelamos si el correo existe.
    setEnviado(true);
    setCargando(false);
  }

  return (
    <div className="arca-card overflow-hidden">
      <div className="border-b border-[color:var(--color-border)] px-6 py-5">
        <h1 className="text-xl">Recuperar acceso</h1>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          Te enviaremos un código para restablecer tu contraseña.
        </p>
      </div>

      {enviado ? (
        <div className="px-6 py-8 text-center">
          <MailCheck size={40} className="mx-auto text-[color:var(--color-success)]" />
          <p className="mt-4 text-[14px] text-[color:var(--color-text-primary)]">
            Si el correo está registrado, recibirás un código para restablecer tu contraseña.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/restablecer" className="arca-btn arca-btn-secondary">
              Ya tengo un código
            </Link>
            <Link href="/login" className="arca-btn arca-btn-ghost">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
          <div>
            <Label htmlFor="email" required>Correo</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <Button type="submit" variant="brand" size="lg" loading={cargando} className="w-full">
            Enviar código
          </Button>
          <p className="text-center text-[13px] text-[color:var(--color-text-muted)]">
            <Link href="/login" className="font-medium text-[color:var(--color-secondary)] hover:underline">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
