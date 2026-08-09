"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ProgressBar } from "@/components/ui/Feedback";
import { api, setToken } from "@/lib/api";
import { esEmailValido, esTelefonoValido, calcularEdad } from "@/lib/utils";

type Datos = {
  nombreCompleto: string; pais: string; ciudad: string; fechaNacimiento: string;
  email: string; whatsapp: string; documento: string; idioma: string; fuenteConocio: string;
  experiencia: string; experienciaSoftware: string; sectores: string; disponibilidad: string;
  medioContacto: string; motivacion: string; password: string; confirmar: string;
  consentimientoDatos: boolean; confirmaVeracidad: boolean; aceptaComunicaciones: boolean;
};

const INICIAL: Datos = {
  nombreCompleto: "", pais: "", ciudad: "", fechaNacimiento: "", email: "", whatsapp: "",
  documento: "", idioma: "es", fuenteConocio: "", experiencia: "", experienciaSoftware: "",
  sectores: "", disponibilidad: "", medioContacto: "WhatsApp", motivacion: "", password: "",
  confirmar: "", consentimientoDatos: false, confirmaVeracidad: false, aceptaComunicaciones: false,
};

const PAISES = [
  "Argentina",
  "Belice",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Haiti",
  "Honduras",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Paraguay",
  "Peru",
  "Puerto Rico",
  "Republica Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro pais de Latinoamerica",
];
const PASOS = ["Datos personales", "Perfil comercial", "Cuenta y consentimientos"];

export default function RegistroPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [d, setD] = useState<Datos>(INICIAL);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGlobal, setErrorGlobal] = useState("");
  const [cargando, setCargando] = useState(false);

  function set<K extends keyof Datos>(k: K, v: Datos[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
    setErrores((e) => ({ ...e, [k]: "" }));
  }

  function validarPaso(p: number): boolean {
    const e: Record<string, string> = {};
    if (p === 0) {
      if (!d.nombreCompleto.trim()) e.nombreCompleto = "Requerido.";
      if (!d.pais) e.pais = "Selecciona tu país.";
      if (!d.email.trim()) e.email = "Requerido.";
      else if (!esEmailValido(d.email)) e.email = "Correo inválido.";
      if (!d.whatsapp.trim()) e.whatsapp = "Requerido.";
      else if (!esTelefonoValido(d.whatsapp)) e.whatsapp = "Incluye código de país (ej. +505...).";
      if (d.fechaNacimiento && calcularEdad(d.fechaNacimiento) < 18)
        e.fechaNacimiento = "Debes ser mayor de edad.";
    }
    if (p === 2) {
      if (d.password.length < 8) e.password = "Mínimo 8 caracteres.";
      if (d.password !== d.confirmar) e.confirmar = "Las contraseñas no coinciden.";
      if (!d.consentimientoDatos) e.consentimientoDatos = "Debes autorizar el tratamiento de datos.";
      if (!d.confirmaVeracidad) e.confirmaVeracidad = "Debes confirmar que la información es veraz.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function siguiente() {
    if (validarPaso(paso)) setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  }

  async function enviar() {
    if (!validarPaso(2)) return;
    setErrorGlobal("");
    setCargando(true);
    const r = await api<{ token: string; candidateId: string }>("registrarCandidato", {
      nombreCompleto: d.nombreCompleto, pais: d.pais, ciudad: d.ciudad,
      fechaNacimiento: d.fechaNacimiento, email: d.email.trim().toLowerCase(), whatsapp: d.whatsapp,
      documento: d.documento, idioma: d.idioma, fuenteConocio: d.fuenteConocio,
      experiencia: d.experiencia, experienciaSoftware: d.experienciaSoftware, sectores: d.sectores,
      disponibilidad: d.disponibilidad, medioContacto: d.medioContacto, motivacion: d.motivacion,
      password: d.password, consentimientoDatos: d.consentimientoDatos,
      confirmaVeracidad: d.confirmaVeracidad, aceptaComunicaciones: d.aceptaComunicaciones,
    });
    setCargando(false);
    if (!r.ok) {
      setErrorGlobal(r.error || "No se pudo completar el registro.");
      return;
    }
    setToken(r.data.token);
    router.push("/academia");
  }

  return (
    <div className="arca-card overflow-hidden">
      <div className="border-b border-[color:var(--color-border)] px-6 py-5">
        <h1 className="text-xl">Registro de candidato</h1>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-muted)]">
          Paso {paso + 1} de {PASOS.length} · {PASOS[paso]}
        </p>
        <div className="mt-3">
          <ProgressBar valor={((paso + 1) / PASOS.length) * 100} />
        </div>
      </div>

      <div className="space-y-4 px-6 py-6">
        {paso === 0 && (
          <>
            <div>
              <Label htmlFor="nombre" required>Nombre completo</Label>
              <Input id="nombre" value={d.nombreCompleto} onChange={(e) => set("nombreCompleto", e.target.value)} invalid={!!errores.nombreCompleto} />
              <FieldError>{errores.nombreCompleto}</FieldError>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="pais" required>País</Label>
                <Select id="pais" value={d.pais} onChange={(e) => set("pais", e.target.value)} invalid={!!errores.pais}>
                  <option value="">Selecciona…</option>
                  {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
                <FieldError>{errores.pais}</FieldError>
              </div>
              <div>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input id="ciudad" value={d.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email" required>Correo personal</Label>
                <Input id="email" type="email" value={d.email} onChange={(e) => set("email", e.target.value)} invalid={!!errores.email} />
                <FieldError>{errores.email}</FieldError>
              </div>
              <div>
                <Label htmlFor="whatsapp" required hint="con código de país">WhatsApp</Label>
                <Input id="whatsapp" value={d.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+50588887777" invalid={!!errores.whatsapp} />
                <FieldError>{errores.whatsapp}</FieldError>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fnac">Fecha de nacimiento</Label>
                <Input id="fnac" type="date" value={d.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)} invalid={!!errores.fechaNacimiento} />
                <FieldError>{errores.fechaNacimiento}</FieldError>
              </div>
              <div>
                <Label htmlFor="fuente">¿Cómo conociste el programa?</Label>
                <Input id="fuente" value={d.fuenteConocio} onChange={(e) => set("fuenteConocio", e.target.value)} placeholder="Redes, referido, etc." />
              </div>
            </div>
          </>
        )}

        {paso === 1 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="exp">Experiencia en ventas</Label>
                <Select id="exp" value={d.experiencia} onChange={(e) => set("experiencia", e.target.value)}>
                  <option value="">Selecciona…</option>
                  <option>Ninguna</option>
                  <option>Menos de 1 año</option>
                  <option>1 a 3 años</option>
                  <option>Más de 3 años</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="expsw">Experiencia vendiendo software</Label>
                <Select id="expsw" value={d.experienciaSoftware} onChange={(e) => set("experienciaSoftware", e.target.value)}>
                  <option value="">Selecciona…</option>
                  <option>Ninguna</option>
                  <option>Algo</option>
                  <option>Bastante</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="sectores">Sectores que conoces</Label>
              <Input id="sectores" value={d.sectores} onChange={(e) => set("sectores", e.target.value)} placeholder="Ferreterías, farmacias, distribuidoras…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="disp">Disponibilidad semanal</Label>
                <Select id="disp" value={d.disponibilidad} onChange={(e) => set("disponibilidad", e.target.value)}>
                  <option value="">Selecciona…</option>
                  <option>Menos de 10 h</option>
                  <option>10 a 20 h</option>
                  <option>20 a 40 h</option>
                  <option>Tiempo completo</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="medio">Medio de contacto preferido</Label>
                <Select id="medio" value={d.medioContacto} onChange={(e) => set("medioContacto", e.target.value)}>
                  <option>WhatsApp</option>
                  <option>Correo</option>
                  <option>Llamada</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="motiv">¿Por qué quieres formar parte del programa?</Label>
              <Textarea id="motiv" value={d.motivacion} onChange={(e) => set("motivacion", e.target.value)} rows={3} />
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="pass" required>Contraseña</Label>
                <PasswordInput id="pass" value={d.password} onChange={(e) => set("password", e.target.value)} invalid={!!errores.password} />
                <FieldError>{errores.password}</FieldError>
              </div>
              <div>
                <Label htmlFor="conf" required>Confirmar contraseña</Label>
                <PasswordInput id="conf" value={d.confirmar} onChange={(e) => set("confirmar", e.target.value)} invalid={!!errores.confirmar} />
                <FieldError>{errores.confirmar}</FieldError>
              </div>
            </div>

            <div className="space-y-3 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4">
              <Checkbox
                checked={d.consentimientoDatos}
                onChange={(v) => set("consentimientoDatos", v)}
                error={errores.consentimientoDatos}
              >
                Autorizo el tratamiento de mis datos conforme a la{" "}
                <Link href="/legal/privacidad" target="_blank" className="text-[color:var(--color-secondary)] underline">
                  Política de privacidad
                </Link>.
              </Checkbox>
              <Checkbox
                checked={d.confirmaVeracidad}
                onChange={(v) => set("confirmaVeracidad", v)}
                error={errores.confirmaVeracidad}
              >
                Confirmo que la información proporcionada es verdadera.
              </Checkbox>
              <Checkbox checked={d.aceptaComunicaciones} onChange={(v) => set("aceptaComunicaciones", v)}>
                Acepto recibir comunicaciones sobre el programa (opcional).
              </Checkbox>
            </div>
            {errorGlobal && <FieldError>{errorGlobal}</FieldError>}
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-6 py-4">
        {paso > 0 ? (
          <Button variant="ghost" onClick={() => setPaso((p) => p - 1)}>
            <ArrowLeft size={16} /> Atrás
          </Button>
        ) : (
          <Link href="/login" className="arca-btn arca-btn-ghost">Ya tengo cuenta</Link>
        )}

        {paso < PASOS.length - 1 ? (
          <Button variant="brand" onClick={siguiente}>
            Continuar <ArrowRight size={16} />
          </Button>
        ) : (
          <Button variant="brand" onClick={enviar} loading={cargando}>
            <Check size={16} /> Crear cuenta y empezar
          </Button>
        )}
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-secondary)]"
      />
      <span className="text-[13px] leading-5 text-[color:var(--color-text-secondary)]">
        {children}
        {error && <span className="mt-0.5 block text-[12px] text-[color:var(--color-error)]">{error}</span>}
      </span>
    </label>
  );
}
