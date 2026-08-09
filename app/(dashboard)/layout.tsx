import { AppProviders } from "@/components/app/AppProviders";
import { AppShell } from "@/components/app/AppShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell rol="vendedor">{children}</AppShell>
    </AppProviders>
  );
}
