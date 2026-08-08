import Link from "next/link";
import {
  ArrowRight,
  UserPlus,
  GraduationCap,
  ClipboardCheck,
  MessageSquare,
  FileSignature,
  Award,
  KeyRound,
  Rocket,
  DollarSign,
  ShoppingCart,
  Package,
  BookOpen,
  Building2,
  BarChart3,
  Users,
  Search,
  Target,
  Presentation,
  ShieldCheck,
  Handshake,
  Wallet,
  Gift,
  Check,
  Utensils,
} from "lucide-react";
import { FAQ } from "@/components/marketing/FAQ";
import { PLANES_EJEMPLO, ejemploComision, COMISIONES } from "@/lib/config";
import { formatearUSD } from "@/lib/utils";

const modulosArca = [
  { icon: ShoppingCart, titulo: "Punto de venta", texto: "Vende rápido, cobra mixto y sigue operando aunque el internet falle." },
  { icon: Utensils, titulo: "Pedidos y menú", texto: "Gestiona menú, pedidos, mesas y cobros para restaurantes con operación diaria." },
  { icon: Package, titulo: "Inventario vivo", texto: "Controla existencias, lotes, vencimientos y movimientos entre sucursales." },
  { icon: BookOpen, titulo: "Contabilidad automática", texto: "Cada venta, compra o gasto genera su asiento contable sin volver a digitar." },
  { icon: Building2, titulo: "Multi-sucursal", texto: "Compara tiendas, consolida resultados y mueve inventario con trazabilidad." },
  { icon: BarChart3, titulo: "Reportes para decidir", texto: "Ventas, rentabilidad, cuentas por cobrar y stock bajo en una sola vista." },
  { icon: Users, titulo: "Roles y permisos", texto: "Cada usuario ve lo que le corresponde, con auditoría de cada acción." },
];

const tareasVendedor = [
  { icon: Search, t: "Buscar negocios potenciales" },
  { icon: Target, t: "Identificar necesidades reales" },
  { icon: UserPlus, t: "Registrar prospectos en el CRM" },
  { icon: Presentation, t: "Explicar ATRIA y coordinar demos" },
  { icon: Handshake, t: "Dar seguimiento y cerrar ventas" },
  { icon: ShieldCheck, t: "Cumplir las políticas comerciales" },
];

const pasos = [
  { icon: UserPlus, t: "Regístrate" },
  { icon: GraduationCap, t: "Completa la academia" },
  { icon: ClipboardCheck, t: "Aprueba los exámenes" },
  { icon: MessageSquare, t: "Realiza simulaciones" },
  { icon: FileSignature, t: "Acepta los términos" },
  { icon: Award, t: "Certifícate" },
  { icon: KeyRound, t: "Recibe tus credenciales" },
  { icon: Rocket, t: "Comienza a vender" },
  { icon: DollarSign, t: "Genera comisiones" },
];

const beneficios = [
  "Capacitación sin costo", "Material comercial listo", "Certificación oficial",
  "Horario flexible", "Comisiones recurrentes", "Dashboard personal",
  "Seguimiento de prospectos", "Recursos descargables", "Actualizaciones constantes",
  "Comunidad de vendedores", "Sesiones grupales", "Asistente de ayuda",
];

const requisitos = [
  "Ser mayor de edad", "Tener correo personal", "Tener WhatsApp",
  "Acceso a internet", "Completar la capacitación", "Aprobar las evaluaciones",
  "Aceptar los términos", "Respetar las políticas comerciales",
  "No prometer funciones inexistentes", "No modificar precios sin autorización",
];

function Section({
  id,
  eyebrow,
  titulo,
  children,
}: {
  id?: string;
  eyebrow?: string;
  titulo?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {(eyebrow || titulo) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {eyebrow && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4b5fd]">
                {eyebrow}
              </span>
            )}
            {titulo && (
              <h2 className="mt-3 text-[32px] font-semibold leading-tight text-white sm:text-[38px]">
                {titulo}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default function LandingReclutamiento() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-28 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[12px] font-medium text-white/75">
              <GraduationCap size={14} className="text-[#c4b5fd]" />
              Academia Comercial ATRIA · Programa de vendedores
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-[40px] font-semibold leading-[1.05] text-white sm:text-[58px]">
              Conviértete en <span className="grad-text">asesor comercial certificado</span> de ATRIA
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-8 text-white/68">
              Aprende desde cero a identificar oportunidades, presentar soluciones, realizar
              demostraciones, manejar objeciones y cerrar ventas de forma profesional para
              comercios y restaurantes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/registro"
                className="arca-btn arca-btn-lg group bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] hover:-translate-y-0.5 hover:brightness-110"
              >
                Comenzar capacitación
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="arca-btn arca-btn-lg border-white/18 bg-[#170b29]/75 text-white hover:-translate-y-0.5 hover:bg-[#211039]"
              >
                Ya tengo una cuenta
              </Link>
            </div>
          </div>

          <div className="mt-14">
            <div className="mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-[16px] border border-white/15 bg-[#0c0518]/80 shadow-[0_40px_110px_rgba(9,4,20,0.6)]">
              <video
                className="h-full w-full"
                src="/recursos/Video-Principal/EL%20CAOS%20QUE%20CONOCES.mp4"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ ES ATRIA */}
      <Section
        id="que-es"
        eyebrow="Qué es ATRIA"
        titulo={<>El sistema operativo del comercio que vas a representar</>}
      >
        <p className="mx-auto mb-10 max-w-3xl text-center text-[16px] leading-7 text-white/65">
          ATRIA es un sistema integral para administrar un negocio: reemplaza Excel y los sistemas
          desconectados con una sola plataforma que conecta el punto de venta, pedidos y menú para
          restaurantes, inventario, reportes y contabilidad. Cada venta genera automáticamente su
          asiento contable de partida doble.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modulosArca.map(({ icon: Icon, titulo, texto }) => (
            <div
              key={titulo}
              className="rounded-[14px] border border-white/10 bg-[linear-gradient(160deg,rgba(51,24,88,0.9),rgba(18,20,63,0.88))] p-6 transition hover:border-[#a78bfa]/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-white">
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-[16px] font-semibold text-white">{titulo}</h3>
              <p className="mt-2 text-[13px] leading-6 text-white/60">{texto}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* QUÉ HARÁ EL VENDEDOR */}
      <Section eyebrow="Tu rol" titulo="Qué hace un asesor comercial de ATRIA">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tareasVendedor.map(({ icon: Icon, t }) => (
            <div key={t} className="flex items-center gap-3 rounded-[12px] border border-white/12 bg-[#1b0d31]/80 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#4c1d95]">
                <Icon size={18} />
              </span>
              <p className="text-[14px] font-medium text-white/80">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section id="como-funciona" eyebrow="El camino" titulo="Cómo funciona el programa">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
          {pasos.map(({ icon: Icon, t }, i) => (
            <div key={t} className="flex flex-col items-center rounded-[12px] border border-white/12 bg-[#1b0d31]/80 p-4 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-[#4c1d95]">
                <Icon size={19} />
              </span>
              <p className="mt-3 text-[12px] font-medium leading-snug text-white/80">{t}</p>
              <span className="mt-2 text-[11px] text-white/35">0{i + 1}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ACADEMIA */}
      <Section id="academia" eyebrow="Academia de ventas" titulo="Qué vas a aprender">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[14px] border border-white/12 bg-[#1b0d31]/80 p-6">
            <ul className="space-y-3 text-[14px] text-white/75">
              {[
                "Dominio del producto ATRIA módulo por módulo",
                "Control de pedidos y menú para restaurantes",
                "Perfil de cliente ideal y señales de oportunidad",
                "Fundamentos de venta consultiva y escucha activa",
                "Prospección ética con guiones para WhatsApp, correo y llamada",
                "Diagnóstico de necesidades y descubrimiento",
                "Demostraciones de 15, 30 y 45 minutos",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#34d399]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[14px] border border-white/12 bg-[#1b0d31]/80 p-6">
            <ul className="space-y-3 text-[14px] text-white/75">
              {[
                "Manejo de objeciones frecuentes con respuestas guiadas",
                "Seguimiento sin acosar y secuencias editables",
                "Técnicas de cierre y próximos pasos claros",
                "Uso del CRM del vendedor",
                "Ética, cumplimiento y política de comisiones",
                "Productividad: metas, agenda y mejora continua",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#34d399]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* COMISIONES */}
      <Section id="comisiones" eyebrow="Comisiones" titulo="Ganas por vender y por retener">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <div className="rounded-[16px] border border-[#a78bfa]/30 bg-[linear-gradient(160deg,rgba(124,58,237,0.22),rgba(37,99,235,0.14))] p-7 text-center">
            <p className="text-[54px] font-bold leading-none text-white">
              {Math.round(COMISIONES.porcentajePrimeraVenta * 100)}%
            </p>
            <p className="mt-2 text-[14px] font-medium text-white/80">Primera venta / primer pago</p>
          </div>
          <div className="rounded-[16px] border border-white/12 bg-[#1b0d31]/80 p-7 text-center">
            <p className="text-[54px] font-bold leading-none text-white">
              {Math.round(COMISIONES.porcentajeRenovacion * 100)}%
            </p>
            <p className="mt-2 text-[14px] font-medium text-white/80">Cada pago recurrente</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[14px] border border-white/12 bg-[#150826]/70">
          <div className="grid grid-cols-3 border-b border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-white/45">
            <span>Plan ATRIA</span>
            <span className="text-right">Tu primera venta</span>
            <span className="text-right">Cada renovación</span>
          </div>
          {PLANES_EJEMPLO.filter((p) => p.precioMensual > 0).map((p) => {
            const c = ejemploComision(p.precioMensual);
            return (
              <div key={p.nombre} className="grid grid-cols-3 items-center border-b border-white/5 px-5 py-4 text-[14px] last:border-b-0">
                <span className="font-medium text-white">
                  {p.nombre}
                  <span className="ml-2 text-white/45">{formatearUSD(p.precioMensual)}/mes</span>
                </span>
                <span className="text-right font-semibold text-[#34d399]">{formatearUSD(c.primeraVenta)}</span>
                <span className="text-right font-semibold text-white/85">{formatearUSD(c.renovacion)}</span>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[13px] leading-6 text-white/50">
          Solo se reconocen clientes registrados correctamente y con evidencia. Las comisiones se
          calculan automáticamente y se muestran de forma transparente en tu panel. Los porcentajes
          son configurables según las reglas vigentes del programa.
        </p>
      </Section>

      {/* BENEFICIOS */}
      <Section id="beneficios" eyebrow="Beneficios" titulo="Lo que recibes al unirte">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {beneficios.map((b) => (
            <div key={b} className="flex items-center gap-2.5 rounded-[10px] border border-white/12 bg-[#1b0d31]/70 px-4 py-3">
              <Gift size={15} className="shrink-0 text-[#c4b5fd]" />
              <span className="text-[13px] text-white/78">{b}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* REQUISITOS */}
      <Section eyebrow="Requisitos" titulo="Qué necesitas para participar">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
          {requisitos.map((r) => (
            <div key={r} className="flex items-center gap-2.5 rounded-[10px] border border-white/12 bg-[#150826]/70 px-4 py-3">
              <Check size={16} className="shrink-0 text-[#34d399]" />
              <span className="text-[14px] text-white/78">{r}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="Preguntas frecuentes" titulo="Respuestas claras antes de empezar">
        <FAQ />
      </Section>

      {/* CTA FINAL */}
      <Section>
        <div className="mx-auto max-w-4xl rounded-[20px] border border-white/12 bg-[linear-gradient(160deg,rgba(124,58,237,0.22),rgba(37,99,235,0.12))] p-10 text-center">
          <h2 className="text-[30px] font-semibold leading-tight text-white sm:text-[34px]">
            Empieza hoy. La capacitación es gratuita.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-white/70">
            Regístrate, aprende a tu ritmo, certifícate y comienza a generar comisiones ayudando a
            negocios reales a ordenarse con ATRIA.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/registro" className="arca-btn arca-btn-lg bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] hover:-translate-y-0.5 hover:brightness-110">
              Comenzar capacitación <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="arca-btn arca-btn-lg border border-white/25 bg-[#170b29]/75 text-white hover:bg-[#211039]">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
