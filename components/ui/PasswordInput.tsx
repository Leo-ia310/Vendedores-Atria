"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[color:var(--color-text-muted)] transition hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-primary)]"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar contrasena" : "Ver contrasena"}
        title={visible ? "Ocultar contrasena" : "Ver contrasena"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
