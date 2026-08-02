import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  titulo,
  descripcion,
  breadcrumb,
  accion,
}: {
  titulo: string;
  descripcion?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  accion?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-2 flex items-center gap-1 text-[12px] text-[color:var(--color-text-muted)]">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {b.href ? (
                <Link href={b.href} className="hover:text-[color:var(--color-text-primary)]">
                  {b.label}
                </Link>
              ) : (
                <span>{b.label}</span>
              )}
              {i < breadcrumb.length - 1 && <ChevronRight size={13} />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl">{titulo}</h1>
          {descripcion && (
            <p className="mt-1 text-[14px] text-[color:var(--color-text-muted)]">{descripcion}</p>
          )}
        </div>
        {accion}
      </div>
    </div>
  );
}
