import Link from "next/link";
import { LandingBackground } from "@/components/marketing/LandingChrome";
import { Logo } from "@/components/ui/Logo";
import { AppProviders } from "@/components/app/AppProviders";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <LandingBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <Link href="/" className="mb-8">
          <Logo eager />
        </Link>
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-center text-[12px] text-white/40">
          © {new Date().getFullYear()} ATRIA · Academia Comercial
        </p>
      </div>
    </AppProviders>
  );
}
