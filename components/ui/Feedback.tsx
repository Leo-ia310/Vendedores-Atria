"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Skeleton ---------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

/* ---------- EmptyState ---------- */
export function EmptyState({
  icon: Icon = Inbox,
  titulo,
  descripcion,
  accion,
}: {
  icon?: LucideIcon;
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-[15px] font-semibold text-[color:var(--color-text-primary)]">
          {titulo}
        </p>
        {descripcion && (
          <p className="mt-1 max-w-sm text-[13px] text-[color:var(--color-text-muted)]">
            {descripcion}
          </p>
        )}
      </div>
      {accion}
    </div>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ valor }: { valor: number }) {
  const pct = Math.max(0, Math.min(100, valor));
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Toasts ---------- */
type ToastTipo = "success" | "error" | "info";
type Toast = { id: number; tipo: ToastTipo; mensaje: string };

const ToastCtx = createContext<{
  toast: (mensaje: string, tipo?: ToastTipo) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

const ICONOS: Record<ToastTipo, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((mensaje: string, tipo: ToastTipo = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tipo, mensaje }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const cerrar = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => {
          const Icon = ICONOS[t.tipo];
          const tono =
            t.tipo === "success"
              ? "border-[color:var(--color-success)] text-[color:var(--color-success)]"
              : t.tipo === "error"
                ? "border-[color:var(--color-error)] text-[color:var(--color-error)]"
                : "border-[color:var(--color-info)] text-[color:var(--color-info)]";
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border-l-4 bg-[color:var(--color-surface)] px-4 py-3 shadow-[var(--shadow-lg)]",
                tono,
              )}
              role="status"
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-[13px] text-[color:var(--color-text-primary)]">
                {t.mensaje}
              </p>
              <button
                type="button"
                onClick={() => cerrar(t.id)}
                className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
