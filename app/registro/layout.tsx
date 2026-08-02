import Link from "next/link";
import { LandingBackground } from "@/components/marketing/LandingChrome";
import { Logo } from "@/components/ui/Logo";
import { AppProviders } from "@/components/app/AppProviders";

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <LandingBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center px-5 py-10">
        <Link href="/" className="mb-8">
          <Logo eager />
        </Link>
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </AppProviders>
  );
}
