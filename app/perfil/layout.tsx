import { AppProviders } from "@/components/app/AppProviders";
import { AppShell } from "@/components/app/AppShell";
import { LazyChatWidget } from "@/components/chatbot/LazyChatWidget";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
      <LazyChatWidget />
    </AppProviders>
  );
}
