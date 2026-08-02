"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  abierto,
  onCerrar,
  titulo,
  children,
  footer,
  ancho = "max-w-lg",
}: {
  abierto: boolean;
  onCerrar: () => void;
  titulo?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  ancho?: string;
}) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(15,8,26,0.55)] p-4 backdrop-blur-sm"
      onMouseDown={onCerrar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`arca-card w-full ${ancho} max-h-[90vh] overflow-auto`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
            <h3 className="text-[15px] font-semibold">{titulo}</h3>
            <button
              type="button"
              onClick={onCerrar}
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
