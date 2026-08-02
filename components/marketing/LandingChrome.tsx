"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Instagram, Facebook, Linkedin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LazyChatWidget } from "@/components/chatbot/LazyChatWidget";
import { MARCA } from "@/lib/config";
import { cn } from "@/lib/utils";

const landingStyles = `
  .lc-bg{background:
    radial-gradient(ellipse at 50% -20%, rgba(124,58,237,.42) 0%, rgba(37,99,235,.16) 38%, transparent 68%),
    linear-gradient(180deg,#0b0416 0%,#100720 46%,#080311 100%);
  }
`;

export function LandingBackground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: landingStyles }} />
      <div aria-hidden className="lc-bg fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
    </>
  );
}

const NAV_LINKS = [
  ["#como-funciona", "Cómo funciona"],
  ["#academia", "Academia"],
  ["#beneficios", "Beneficios"],
  ["#comisiones", "Comisiones"],
  ["#faq", "Preguntas frecuentes"],
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-[#0b0416]/60 shadow-[0_10px_35px_rgba(7,2,18,0.22)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Logo eager />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 text-[12px] text-white/75 sm:flex md:gap-3 lg:gap-5 lg:text-[13px]">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="whitespace-nowrap rounded px-2 py-1 transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="arca-btn arca-btn-sm border-[#a78bfa]/35 bg-[#170b29]/80 text-white shadow-[0_8px_24px_rgba(7,2,18,0.22)] hover:bg-[#211039]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="arca-btn arca-btn-sm bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] hover:brightness-110"
          >
            Comenzar capacitación
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((s) => !s)}
          className="arca-btn p-2 text-white hover:bg-white/10 sm:hidden"
          aria-label="Menú"
          aria-expanded={abierto}
        >
          {abierto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {abierto && (
        <div className="border-t border-white/10 bg-[#0b0416]/95 px-5 py-4 text-white backdrop-blur-xl sm:hidden">
          <nav className="flex flex-col gap-3 text-[14px] text-white/80">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setAbierto(false)}>
                {label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Link href="/login" className="arca-btn border-[#a78bfa]/35 bg-[#170b29] text-white">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="arca-btn bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-white">
                Comenzar capacitación
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

const REDES = [
  { nombre: "Instagram", href: MARCA.redes.instagram, icono: Instagram },
  { nombre: "Facebook", href: MARCA.redes.facebook, icono: Facebook },
  { nombre: "LinkedIn", href: MARCA.redes.linkedin, icono: Linkedin },
];

const LEGALES = [
  ["/legal/terminos", "Términos del programa"],
  ["/legal/comisiones", "Política de comisiones"],
  ["/legal/privacidad", "Política de privacidad"],
  ["/legal/conducta", "Código de conducta"],
  ["/legal/prospectos", "Política de prospectos"],
];

export function LandingFooter() {
  return (
    <footer className="relative z-10 overflow-hidden bg-[linear-gradient(180deg,rgba(11,4,22,0)_0%,#080311_60%,#07020f_100%)] pt-24 text-white">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 pb-14 lg:grid-cols-[1.1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-md text-[16px] font-medium leading-7 text-white/85">
              Formamos, certificamos y potenciamos a los asesores comerciales de ATRIA.
            </p>
            <p className="mt-3 max-w-md text-[13px] leading-6 text-white/50">
              Capacitación gratuita, certificación oficial y comisiones recurrentes por cada
              negocio que ayudas a ordenar con ATRIA.
            </p>
            <div className="mt-7">
              <p className="text-label text-white/35">Síguenos</p>
              <div className="mt-3 flex items-center gap-2.5">
                {REDES.map(({ nombre, href, icono: Icono }) => (
                  <a
                    key={nombre}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={nombre}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/55 transition hover:border-[#a78bfa]/55 hover:text-white"
                  >
                    <Icono size={17} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <nav>
              <p className="text-label text-white/35">Programa</p>
              <div className="mt-5 flex flex-col gap-3 text-[13px] text-white/58">
                <a href="/#como-funciona" className="hover:text-white">Cómo funciona</a>
                <a href="/#academia" className="hover:text-white">Academia</a>
                <a href="/#comisiones" className="hover:text-white">Comisiones</a>
                <a href="/#faq" className="hover:text-white">Preguntas frecuentes</a>
              </div>
            </nav>
            <nav>
              <p className="text-label text-white/35">Cuenta</p>
              <div className="mt-5 flex flex-col gap-3 text-[13px] text-white/58">
                <Link href="/registro" className="hover:text-white">Comenzar capacitación</Link>
                <Link href="/login" className="hover:text-white">Iniciar sesión</Link>
                <Link href="/recuperar" className="hover:text-white">Recuperar acceso</Link>
              </div>
            </nav>
            <nav>
              <p className="text-label text-white/35">Legal</p>
              <div className="mt-5 flex flex-col gap-3 text-[13px] text-white/58">
                {LEGALES.map(([href, label]) => (
                  <Link key={href} href={href} className="hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
        <div className="flex flex-col gap-3 py-7 text-[12px] text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ATRIA · Academia Comercial. Todos los derechos reservados.</span>
          <a href={`https://wa.me/${MARCA.whatsappSoporte}`} className="hover:text-white" target="_blank" rel="noreferrer">
            WhatsApp de soporte
          </a>
        </div>
      </div>
    </footer>
  );
}

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingBackground />
      <LandingNav />
      <main className="relative z-10 overflow-hidden text-white">{children}</main>
      <LandingFooter />
      <LazyChatWidget />
    </>
  );
}
