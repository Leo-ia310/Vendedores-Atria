import { AppProviders } from "@/components/app/AppProviders";
import { AppShell } from "@/components/app/AppShell";
import { LazyChatWidget } from "@/components/chatbot/LazyChatWidget";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell rol="vendedor">{children}</AppShell>
      <LazyChatWidget />
    </AppProviders>
  );
}
