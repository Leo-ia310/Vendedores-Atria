"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Search,
  Target,
  Handshake,
  ShieldCheck,
  ClipboardCheck,
  MessageSquare,
  Award,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { useAuth, rutaPorRol } from "@/lib/auth/session";

const PASOS = ["Quiénes somos", "Qué esperamos de ti", "Tu camino aquí"];

const TAREAS = [
  { icon: Search, t: "Buscar negocios potenciales y detectar oportunidades reales." },
  { icon: Target, t: "Presentar ATRIA de forma honesta, sin prometer funciones inexistentes." },
  { icon: Handshake, t: "Dar seguimiento sin acosar y cerrar ventas con criterio." },
  { icon: ShieldCheck, t: "Cumplir siempre las políticas comerciales del programa." },
];

const CAMINO = [
  { icon: GraduationCap, t: "Academia", activo: true },
  { icon: ClipboardCheck, t: "Exámenes" },
  { icon: MessageSquare, t: "Simulaciones" },
  { icon: Award, t: "Certificación" },
  { icon: Rocket, t: "A vender" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { usuario, refrescar } = useAuth();
  const [paso, setPaso] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario && usuario.rol !== "candidato") {
      router.replace(rutaPorRol(usuario));
    }
  }, [usuario, router]);

  async function comenzar() {
    setCargando(true);
    await api("completarOnboarding");
    await refrescar();
    router.push("/academia");
  }

  return (
    <div className="arca-card overflow-hidden">
      <div className="border-b border-[color:var(--color-border)] px-4 py-4 sm:px-6 sm:py-5">
        <h1 className="text-xl">Bienvenido a la Academia Comercial ATRIA</h1>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          Paso {paso + 1} de {PASOS.length} · {PASOS[paso]}
        </p>
        <div className="mt-3">
          <ProgressBar valor={((paso + 1) / PASOS.length) * 100} />
        </div>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
        {paso === 0 && (
          <div className="space-y-3 text-[14px] leading-6 text-[color:var(--color-text-secondary)]">
            <p>
              ATRIA es un sistema integral para administrar un negocio: punto de venta, pedidos y
              menú para restaurantes, inventario, contabilidad automática y reportes en una sola
              plataforma.
            </p>
            <p>
              La Academia Comercial es el programa que te prepara para representarnos: te
              capacitamos gratis, te certificamos y te acompañamos para que generes comisiones
              vendiendo ATRIA a comercios reales.
            </p>
          </div>
        )}

        {paso === 1 && (
          <div className="space-y-3">
            {TAREAS.map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-start gap-3 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--color-tertiary-light)] text-[color:var(--color-primary)]">
                  <Icon size={16} />
                </span>
                <p className="text-[13.5px] leading-5 text-[color:var(--color-text-secondary)]">{t}</p>
              </div>
            ))}
          </div>
        )}

        {paso === 2 && (
          <div className="space-y-5">
            <p className="text-[14px] leading-6 text-[color:var(--color-text-secondary)]">
              Ya te registraste. Esto es lo que sigue antes de empezar a vender:
            </p>
            <div className="grid grid-cols-2 gap-2 min-[520px]:grid-cols-5">
              {CAMINO.map(({ icon: Icon, t, activo }) => (
                <div
                  key={t}
                  className={`flex flex-col items-center rounded-[10px] border px-2 py-3 text-center ${
                    activo
                      ? "border-[color:var(--color-secondary)] bg-[color:var(--color-tertiary-light)]"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  <Icon size={17} className="text-[color:var(--color-primary)]" />
                  <span className="mt-2 text-[11px] font-medium leading-tight text-[color:var(--color-text-secondary)]">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {paso > 0 ? (
          <Button className="w-full sm:w-auto" variant="ghost" onClick={() => setPaso((p) => p - 1)}>
            <ArrowLeft size={16} /> Atrás
          </Button>
        ) : (
          <span />
        )}

        {paso < PASOS.length - 1 ? (
          <Button className="w-full sm:w-auto" variant="brand" onClick={() => setPaso((p) => p + 1)}>
            Continuar <ArrowRight size={16} />
          </Button>
        ) : (
          <Button className="w-full sm:w-auto" variant="brand" onClick={comenzar} loading={cargando}>
            <Check size={16} /> Comenzar capacitación
          </Button>
        )}
      </div>
    </div>
  );
}
