import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tono = "success" | "warning" | "error" | "info" | "neutral";

export function Badge({
  children,
  tono = "neutral",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span className={cn("arca-badge", `arca-badge-${tono}`, className)}>
      {children}
    </span>
  );
}
