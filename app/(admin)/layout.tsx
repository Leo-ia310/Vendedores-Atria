import { AppProviders } from "@/components/app/AppProviders";
import { AppShell } from "@/components/app/AppShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell rol="admin">{children}</AppShell>
    </AppProviders>
  );
}
