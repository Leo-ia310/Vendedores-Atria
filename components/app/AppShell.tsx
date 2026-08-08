"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap, LayoutDashboard, Users2, ShoppingBag, Wallet,
  FolderDown, UserCircle, LogOut, Menu, ShieldCheck, Settings, MessageCircle, Award, Bot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NotificacionesBell, type Notificacion } from "@/components/app/NotificacionesBell";
import { api } from "@/lib/api";
import { useAuth, type Rol } from "@/lib/auth/session";
import { cn, iniciales } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV: Record<Rol, NavItem[]> = {
  candidato: [
    { href: "/academia", label: "Academia", icon: GraduationCap },
    { href: "/simulador", label: "Simulador", icon: MessageCircle },
    { href: "/asistente", label: "Asistente", icon: Bot },
    { href: "/certificacion", label: "Certificación", icon: Award },
    { href: "/perfil", label: "Mi perfil", icon: UserCircle },
  ],
  vendedor: [
    { href: "/panel", label: "Resumen", icon: LayoutDashboard },
    { href: "/panel/crm", label: "CRM y prospectos", icon: Users2 },
    { href: "/panel/ventas", label: "Ventas", icon: ShoppingBag },
    { href: "/panel/comisiones", label: "Comisiones", icon: Wallet },
    { href: "/panel/recursos", label: "Recursos", icon: FolderDown },
    { href: "/panel/asistente", label: "Asistente", icon: Bot },
    { href: "/perfil", label: "Mi perfil", icon: UserCircle },
  ],
  admin: [
    { href: "/admin", label: "Resumen", icon: LayoutDashboard },
    { href: "/admin/candidatos", label: "Candidatos", icon: Users2 },
    { href: "/admin/vendedores", label: "Vendedores", icon: ShieldCheck },
    { href: "/admin/ventas", label: "Ventas", icon: ShoppingBag },
    { href: "/admin/comisiones", label: "Comisiones", icon: Wallet },
    { href: "/admin/chatbot", label: "Chatbot", icon: MessageCircle },
    { href: "/admin/config", label: "Configuración", icon: Settings },
  ],
};

export function AppShell({
  rol,
  children,
}: {
  rol?: Rol;
  children: ReactNode;
}) {
  const { usuario, cargando, salir } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  // Guard: exige sesión y (si se especifica) rol correcto.
  useEffect(() => {
    if (cargando) return;
    if (!usuario) {
      router.replace("/login");
      return;
    }
    if (usuario.debeCambiarPassword) {
      router.replace("/cambiar-password");
      return;
    }
    if (rol) {
      const permitido = usuario.rol === rol || usuario.rol === "admin";
      if (!permitido) {
        router.replace(usuario.rol === "vendedor" ? "/panel" : "/academia");
      }
    }
  }, [cargando, usuario, rol, router]);

  useEffect(() => {
    if (!usuario || usuario.rol !== "vendedor") {
      setNotificaciones([]);
      return;
    }
    let activo = true;
    api<Notificacion[]>("notificacionesVendedor").then((r) => {
      if (activo && r.ok) setNotificaciones(r.data);
    });
    return () => {
      activo = false;
    };
  }, [usuario]);

  if (cargando || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-neutral)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-tertiary)] border-t-transparent" />
      </div>
    );
  }

  const rolEfectivo: Rol = rol ?? usuario.rol;
  const items = NAV[rolEfectivo];

  return (
    <div className="min-h-screen bg-[color:var(--color-neutral)]">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[288px] flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-primary)] sm:flex">
        <SidebarContenido items={items} pathname={pathname} rol={rolEfectivo} />
      </aside>

      {/* Sidebar móvil */}
      {movilAbierto && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMovilAbierto(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(288px,86vw)] flex-col bg-[color:var(--color-primary)]">
            <SidebarContenido items={items} pathname={pathname} rol={rolEfectivo} onNavigate={() => setMovilAbierto(false)} />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <div className="sm:pl-[288px]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 sm:px-6">
          <button
            type="button"
            className="arca-btn arca-btn-ghost h-9 w-9 shrink-0 p-0 sm:hidden"
            onClick={() => setMovilAbierto(true)}
            aria-label="Menú"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1" />
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {(rolEfectivo === "vendedor" || rolEfectivo === "admin") && (
              <NotificacionesBell notificaciones={notificaciones} />
            )}
            <span className="hidden max-w-[180px] truncate text-[13px] text-[color:var(--color-text-muted)] min-[420px]:inline">
              {usuario.email}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-tertiary-light)] text-[12px] font-semibold text-[color:var(--color-primary)]">
              {iniciales(usuario.email)}
            </span>
            <button
              type="button"
              onClick={salir}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-[color:var(--color-error)] shadow-[var(--shadow-sm)] transition hover:border-[color:var(--color-error)] hover:bg-[color:var(--color-error-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-error)]"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContenido({
  items,
  pathname,
  rol,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  rol: Rol;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <Logo eager />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium leading-tight transition",
                activo
                  ? "bg-white/15 text-white"
                  : "text-white/65 hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon size={17} className="shrink-0" />
              <span className="min-w-0">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-3">
        <span className="text-[11px] uppercase tracking-wide text-white/40">
          {rol === "admin" ? "Administración" : rol === "vendedor" ? "Vendedor certificado" : "En capacitación"}
        </span>
      </div>
    </>
  );
}
