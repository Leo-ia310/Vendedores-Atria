import { AppProviders } from "@/components/app/AppProviders";
import { AppShell } from "@/components/app/AppShell";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
