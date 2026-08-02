"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { useAuth, rutaPorRol } from "@/lib/auth/session";
import { api } from "@/lib/api";

export default function LoginPage() {
  const { entrar } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const r = await entrar(email.trim().toLowerCase(), password);
    if (!r.ok) {
      setError(r.error || "No se pudo iniciar sesión.");
      setCargando(false);
      return;
    }
    // Relee la sesión para decidir la ruta (rol / cambio de contraseña).
    const s = await api<{ usuario: Parameters<typeof rutaPorRol>[0] }>("sesionActual");
    const destino = s.ok ? rutaPorRol(s.data.usuario) : "/academia";
    router.push(destino);
  }

  return (
    <div className="arca-card overflow-hidden">
      <div className="border-b border-[color:var(--color-border)] px-6 py-5">
        <h1 className="text-xl">Iniciar sesión</h1>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          Accede a tu capacitación o a tu panel de vendedor.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
        <div>
          <Label htmlFor="email" required>Correo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password" required>Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-1.5 text-right">
            <Link href="/recuperar" className="text-[12px] text-[color:var(--color-secondary)] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {error && <FieldError>{error}</FieldError>}

        <Button type="submit" variant="brand" size="lg" loading={cargando} className="w-full">
          <LogIn size={16} /> Entrar
        </Button>

        <p className="text-center text-[13px] text-[color:var(--color-text-muted)]">
          ¿Aún no participas?{" "}
          <Link href="/registro" className="font-medium text-[color:var(--color-secondary)] hover:underline">
            Comenzar capacitación
          </Link>
        </p>
      </form>
    </div>
  );
}
