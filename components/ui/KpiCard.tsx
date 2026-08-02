import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
  tono = "brand",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tono?: "brand" | "success" | "warning" | "info";
}) {
  const colores: Record<string, string> = {
    brand: "text-[color:var(--color-secondary)] bg-[color:var(--color-surface-2)]",
    success: "text-[color:var(--color-success)] bg-[color:var(--color-success-bg)]",
    warning: "text-[color:var(--color-warning)] bg-[color:var(--color-warning-bg)]",
    info: "text-[color:var(--color-info)] bg-[color:var(--color-info-bg)]",
  };
  return (
    <div className="arca-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-label">{label}</p>
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-md ${colores[tono]}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="mt-2 text-[26px] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
        {value}
      </p>
      {hint && (
        <p className="mt-1.5 text-[12px] text-[color:var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  );
}
