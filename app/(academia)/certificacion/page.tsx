"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Award, Copy, KeyRound, MessageCircle, LifeBuoy } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { MARCA } from "@/lib/config";
import { enlaceWhatsApp } from "@/lib/utils";

type Requisitos = {
  modulosCompletos: boolean;
  examenesAprobados: boolean;
  examenFinalAprobado: boolean;
  terminosAceptados: boolean;
  simulacionesCompletas: boolean;
  puntajeFinal: number;
  puntajeMinimo: number;
  puntajeSuficiente: boolean;
  cumpleTodo: boolean;
};

type Credenciales = {
  codigoVendedor: string;
  codigoReferido: string;
  codigoCertificado: string;
  email: string;
  passwordTemporal: string;
};

const DOCS = [
  { id: "terminos", label: "Términos del programa", href: "/legal/terminos" },
  { id: "comisiones", label: "Política de comisiones", href: "/legal/comisiones" },
  { id: "privacidad", label: "Política de privacidad", href: "/legal/privacidad" },
  { id: "conducta", label: "Código de conducta", href: "/legal/conducta" },
];

export default function CertificacionPage() {
  const { toast } = useToast();
  const [req, setReq] = useState<Requisitos | null>(null);
  const [cargando, setCargando] = useState(true);
  const [aceptados, setAceptados] = useState<Record<string, boolean>>({});
  const [confirmaComisiones, setConfirmaComisiones] = useState(false);
  const [confirmaEtica, setConfirmaEtica] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [certificando, setCertificando] = useState(false);
  const [cred, setCred] = useState<Credenciales | null>(null);

  async function cargar() {
    setCargando(true);
    const r = await api<Requisitos>("estadoCertificacion");
    if (r.ok) setReq(r.data);
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  const todosDocs = DOCS.every((d) => aceptados[d.id]) && confirmaComisiones && confirmaEtica;

  async function aceptarTerminos() {
    setGuardando(true);
    const r = await api("aceptarTerminos", { documentos: DOCS.map((d) => d.id) });
    setGuardando(false);
    if (!r.ok) return toast(r.error, "error");
    toast("Términos aceptados.", "success");
    await cargar();
  }

  async function certificar() {
    setCertificando(true);
    const r = await api<Credenciales>("certificar");
    setCertificando(false);
    if (!r.ok) return toast(r.error || "Aún no cumples los requisitos.", "error");
    setCred(r.data);
  }

  if (cargando) return <Skeleton className="h-64 w-full" />;

  const items = req
    ? [
        { ok: req.modulosCompletos, label: "Completar todos los módulos obligatorios" },
        { ok: req.examenesAprobados, label: "Aprobar los exámenes de cada módulo" },
        { ok: req.examenFinalAprobado, label: "Aprobar el examen final" },
        { ok: req.simulacionesCompletas, label: "Completar las simulaciones obligatorias (mínimo 3)" },
        { ok: req.terminosAceptados, label: "Aceptar todos los términos y condiciones" },
        { ok: req.puntajeSuficiente, label: `Alcanzar el puntaje mínimo (${req.puntajeMinimo}%). Actual: ${req.puntajeFinal}%` },
      ]
    : [];

  // Pantalla de credenciales (se muestra UNA sola vez).
  if (cred) {
    return (
      <>
        <PageHeader titulo="¡Certificación completada!" descripcion="Guarda estas credenciales ahora: la contraseña temporal no se volverá a mostrar." />
        <div className="arca-card border-[color:var(--color-success)] p-6">
          <div className="flex items-center gap-3">
            <Award size={28} className="text-[color:var(--color-success)]" />
            <div>
              <p className="text-[16px] font-semibold">Eres asesor comercial certificado de ATRIA</p>
              <p className="text-[13px] text-[color:var(--color-text-muted)]">Certificado {cred.codigoCertificado}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Dato label="Usuario (tu correo)" valor={cred.email} />
            <Dato label="Contraseña temporal" valor={cred.passwordTemporal} mono resaltar />
            <Dato label="Código de vendedor" valor={cred.codigoVendedor} />
            <Dato label="Código de referido" valor={cred.codigoReferido} />
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-md bg-[color:var(--color-warning-bg)] p-3 text-[13px] text-[color:var(--color-warning)]">
            <KeyRound size={16} className="mt-0.5 shrink-0" />
            Al iniciar sesión por primera vez deberás cambiar tu contraseña.
          </div>

          <Link href="/login" className="arca-btn arca-btn-brand mt-5">
            Ir a iniciar sesión
          </Link>
        </div>

        <div className="arca-card mt-5 p-6">
          <p className="text-[16px] font-semibold">Únete a la comunidad de vendedores</p>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
            Entra al grupo de WhatsApp para novedades, dudas y apoyo entre vendedores certificados.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={MARCA.grupoWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="arca-btn arca-btn-brand"
            >
              <MessageCircle size={16} /> Unirme al grupo de WhatsApp
            </a>
            <a
              href={enlaceWhatsApp(MARCA.whatsappSoporte, "Hola, ya me certifiqué como vendedor ATRIA y tengo una consulta.")}
              target="_blank"
              rel="noreferrer"
              className="arca-btn arca-btn-secondary"
            >
              <LifeBuoy size={16} /> Soporte técnico
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        titulo="Certificación"
        descripcion="Cumple todos los requisitos para certificarte y recibir tus credenciales de vendedor."
        breadcrumb={[{ label: "Academia", href: "/academia" }, { label: "Certificación" }]}
      />

      <div className="arca-card mb-6 p-5">
        <h2 className="text-[16px] font-semibold">Requisitos</h2>
        <ul className="mt-3 space-y-2.5">
          {items.map((it) => (
            <li key={it.label} className="flex items-start gap-2.5 text-[14px]">
              {it.ok ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[color:var(--color-success)]" />
              ) : (
                <XCircle size={18} className="mt-0.5 shrink-0 text-[color:var(--color-text-muted)]" />
              )}
              <span className={it.ok ? "text-[color:var(--color-text-primary)]" : "text-[color:var(--color-text-muted)]"}>
                {it.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {!req?.terminosAceptados && (
        <div className="arca-card mb-6 p-5">
          <h2 className="text-[16px] font-semibold">Términos y condiciones</h2>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
            Lee y acepta cada documento. Se registra la versión, fecha y hora de aceptación.
          </p>
          <div className="mt-4 space-y-2.5">
            {DOCS.map((d) => (
              <label key={d.id} className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={!!aceptados[d.id]}
                  onChange={(e) => setAceptados((a) => ({ ...a, [d.id]: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 accent-[color:var(--color-secondary)]"
                />
                <span className="text-[13px] text-[color:var(--color-text-secondary)]">
                  He leído y acepto los{" "}
                  <Link href={d.href} target="_blank" className="text-[color:var(--color-secondary)] underline">
                    {d.label}
                  </Link>.
                </span>
              </label>
            ))}
            <label className="flex items-start gap-2.5">
              <input type="checkbox" checked={confirmaComisiones} onChange={(e) => setConfirmaComisiones(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[color:var(--color-secondary)]" />
              <span className="text-[13px] text-[color:var(--color-text-secondary)]">Confirmo que comprendo el sistema de comisiones (20% primer pago / 10% pago recurrente).</span>
            </label>
            <label className="flex items-start gap-2.5">
              <input type="checkbox" checked={confirmaEtica} onChange={(e) => setConfirmaEtica(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[color:var(--color-secondary)]" />
              <span className="text-[13px] text-[color:var(--color-text-secondary)]">Confirmo que respetaré las reglas éticas del programa.</span>
            </label>
          </div>
          <Button variant="primary" className="mt-4" disabled={!todosDocs} loading={guardando} onClick={aceptarTerminos}>
            Aceptar términos
          </Button>
        </div>
      )}

      <div className="arca-card p-5">
        <h2 className="text-[16px] font-semibold">Certificarme</h2>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          Al certificarte, el sistema creará tus credenciales de vendedor automáticamente.
        </p>
        <Button
          variant="brand"
          size="lg"
          className="mt-4"
          disabled={!req?.cumpleTodo}
          loading={certificando}
          onClick={certificar}
        >
          <Award size={18} /> Obtener mi certificación
        </Button>
        {!req?.cumpleTodo && (
          <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">
            Aún debes cumplir todos los requisitos de arriba.
          </p>
        )}
      </div>
    </>
  );
}

function Dato({ label, valor, mono, resaltar }: { label: string; valor: string; mono?: boolean; resaltar?: boolean }) {
  const { toast } = useToast();
  return (
    <div className={`rounded-md border p-3 ${resaltar ? "border-[color:var(--color-tertiary)] bg-[color:var(--color-surface-2)]" : "border-[color:var(--color-border)]"}`}>
      <p className="text-label">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className={`text-[14px] font-semibold ${mono ? "font-mono" : ""}`}>{valor}</span>
        <button
          type="button"
          onClick={() => { navigator.clipboard?.writeText(valor); toast("Copiado.", "success"); }}
          className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
          aria-label="Copiar"
        >
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
}
