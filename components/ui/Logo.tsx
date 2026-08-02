import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo de ATRIA + submarca del programa.
 * `variant="mark"` muestra solo el símbolo; `full` incluye el wordmark.
 */
export function Logo({
  className,
  variant = "full",
  tono = "light",
  eager = false,
}: {
  className?: string;
  variant?: "mark" | "full";
  tono?: "light" | "dark";
  eager?: boolean;
}) {
  const texto = tono === "light" ? "text-white" : "text-[color:var(--color-text-primary)]";
  const sub = tono === "light" ? "text-white/55" : "text-[color:var(--color-text-muted)]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo-arca-mark.png"
        alt="ATRIA"
        width={2248}
        height={1860}
        priority={eager}
        sizes="40px"
        className="h-8 w-auto"
      />
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className={cn("text-[17px] font-semibold tracking-[-0.02em]", texto)}>
            ATRIA
          </span>
          <span className={cn("text-[9.5px] font-medium uppercase tracking-[0.14em]", sub)}>
            Academia comercial
          </span>
        </span>
      )}
    </span>
  );
}
