import { AppProviders } from "@/components/app/AppProviders";
import { AppShell } from "@/components/app/AppShell";

export default function AcademiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell rol="candidato">{children}</AppShell>
    </AppProviders>
  );
}
