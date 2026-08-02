"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Feedback";
import { AuthProvider } from "@/lib/auth/session";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
