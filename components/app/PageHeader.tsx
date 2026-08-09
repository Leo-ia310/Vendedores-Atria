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
        <nav className="no-scrollbar mb-2 flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap pb-1 text-[12px] text-[color:var(--color-text-muted)]">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex shrink-0 items-center gap-1">
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
        <div className="min-w-0">
          <h1 className="break-words text-2xl">{titulo}</h1>
          {descripcion && (
            <p className="mt-1 max-w-3xl break-words text-[14px] leading-6 text-[color:var(--color-text-muted)]">{descripcion}</p>
          )}
        </div>
        {accion && <div className="w-full min-w-0 sm:w-auto">{accion}</div>}
      </div>
    </div>
  );
}
