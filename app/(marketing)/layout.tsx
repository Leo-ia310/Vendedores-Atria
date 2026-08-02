import { LandingShell } from "@/components/marketing/LandingChrome";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingShell>{children}</LandingShell>;
}
