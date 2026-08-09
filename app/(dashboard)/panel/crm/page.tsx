"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Users2, Building2, CalendarClock, Mail, Phone, Tag, Search } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { ETAPAS_CRM, type EtapaCrmId } from "@/lib/config";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Prospecto = {
  ProspectId: string;
  Empresa: string;
  Contacto: string;
  Email: string;
  WhatsApp: string;
  Pais: string;
  Sector: string;
  Fuente: string;
  Etapa: string;
  ValorEstimado: number;
  ProximaAccion: string;
  FechaSeguimiento: string;
  Notas: string;
  FechaCreacion: string;
};

const ETAPA_TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  nuevo: "neutral",
  contactado: "info",
  respondio: "info",
  calificado: "info",
  reunion: "warning",
  demo: "warning",
  propuesta: "warning",
  negociacion: "warning",
  ganado: "success",
  perdido: "error",
  futuro: "neutral",
};

function esCliente(prospecto: Prospecto) {
  return prospecto.Etapa === "ganado";
}

export default function CrmPage() {
  const { toast } = useToast();
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [detalle, setDetalle] = useState<Prospecto | null>(null);
  const [busca, setBusca] = useState("");
  const [relacion, setRelacion] = useState("todos");
  const [etapaFiltro, setEtapaFiltro] = useState("todas");
  const [sectorFiltro, setSectorFiltro] = useState("todos");
  const [fuenteFiltro, setFuenteFiltro] = useState("todas");
  const [seguimientoFiltro, setSeguimientoFiltro] = useState("todos");

  async function cargar() {
    setCargando(true);
    const r = await api<Prospecto[]>("listarProspectos");
    if (r.ok) setProspectos(r.data);
    setCargando(false);
  }

  useEffect(() => {
    void cargar();
  }, []);

  const sectores = useMemo(
    () => Array.from(new Set(prospectos.map((p) => p.Sector).filter(Boolean))).sort(),
    [prospectos],
  );
  const fuentes = useMemo(
    () => Array.from(new Set(prospectos.map((p) => p.Fuente).filter(Boolean))).sort(),
    [prospectos],
  );
  const hoy = new Date().toISOString().slice(0, 10);
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return prospectos.filter((p) => {
      const cliente = esCliente(p);
      const seguimiento = p.FechaSeguimiento || "";
      const texto = [
        p.Empresa,
        p.Contacto,
        p.Email,
        p.WhatsApp,
        p.Pais,
        p.Sector,
        p.Fuente,
        p.Etapa,
        p.Notas,
      ].join(" ").toLowerCase();

      return (relacion === "todos" || (relacion === "clientes" ? cliente : !cliente))
        && (etapaFiltro === "todas" || p.Etapa === etapaFiltro)
        && (sectorFiltro === "todos" || p.Sector === sectorFiltro)
        && (fuenteFiltro === "todas" || p.Fuente === fuenteFiltro)
        && (
          seguimientoFiltro === "todos"
          || (seguimientoFiltro === "hoy" && seguimiento === hoy)
          || (seguimientoFiltro === "vencidos" && seguimiento && seguimiento < hoy)
          || (seguimientoFiltro === "sin_fecha" && !seguimiento)
        )
        && (!q || texto.includes(q));
    });
  }, [busca, etapaFiltro, fuenteFiltro, hoy, prospectos, relacion, sectorFiltro, seguimientoFiltro]);

  return (
    <>
      <PageHeader
        titulo="CRM"
        descripcion="Gestiona prospectos y clientes activos con seguimiento claro."
        accion={
          <Button variant="brand" onClick={() => setModalNuevo(true)}>
            <Plus size={16} /> Nuevo prospecto
          </Button>
        }
      />

      <div className="arca-card mb-5 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_160px_180px_180px_180px_180px]">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]" />
            <Input
              className="pl-9"
              placeholder="Buscar empresa, contacto, correo, WhatsApp, notas..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
          <Select value={relacion} onChange={(event) => setRelacion(event.target.value)}>
            <option value="todos">Todos</option>
            <option value="prospectos">Prospectos</option>
            <option value="clientes">Clientes</option>
          </Select>
          <Select value={etapaFiltro} onChange={(event) => setEtapaFiltro(event.target.value)}>
            <option value="todas">Todas las etapas</option>
            {ETAPAS_CRM.map((etapa) => <option key={etapa.id} value={etapa.id}>{etapa.nombre}</option>)}
          </Select>
          <Select value={sectorFiltro} onChange={(event) => setSectorFiltro(event.target.value)}>
            <option value="todos">Todos los sectores</option>
            {sectores.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
          </Select>
          <Select value={fuenteFiltro} onChange={(event) => setFuenteFiltro(event.target.value)}>
            <option value="todas">Todas las fuentes</option>
            {fuentes.map((fuente) => <option key={fuente} value={fuente}>{fuente}</option>)}
          </Select>
          <Select value={seguimientoFiltro} onChange={(event) => setSeguimientoFiltro(event.target.value)}>
            <option value="todos">Seguimiento</option>
            <option value="hoy">Hoy</option>
            <option value="vencidos">Vencidos</option>
            <option value="sin_fecha">Sin fecha</option>
          </Select>
        </div>
        <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">
          Mostrando {filtrados.length} de {prospectos.length} registros.
        </p>
      </div>

      {cargando ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : prospectos.length === 0 ? (
        <div className="arca-card">
          <EmptyState
            icon={Users2}
            titulo="Aun no tienes registros"
            descripcion="Registra tu primer prospecto para empezar a dar seguimiento."
            accion={<Button variant="brand" onClick={() => setModalNuevo(true)}><Plus size={16} /> Nuevo prospecto</Button>}
          />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="arca-card">
          <EmptyState
            icon={Users2}
            titulo="Sin resultados"
            descripcion="Ajusta los filtros para ver mas registros del CRM."
          />
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4">
            {ETAPAS_CRM.map((etapa) => {
              const items = filtrados.filter((p) => p.Etapa === etapa.id);
              return (
                <section
                  key={etapa.id}
                  className="flex w-[280px] shrink-0 flex-col rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[color:var(--color-border)] px-3 py-3">
                    <h2 className="truncate text-[13px] font-semibold text-[color:var(--color-text-primary)]">
                      {etapa.nombre}
                    </h2>
                    <Badge tono={ETAPA_TONO[etapa.id] || "neutral"}>{items.length}</Badge>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-3">
                    {items.length === 0 ? (
                      <div className="rounded-md border border-dashed border-[color:var(--color-border-strong)] bg-white/60 px-3 py-6 text-center text-[12px] text-[color:var(--color-text-muted)]">
                        Sin registros
                      </div>
                    ) : (
                      items.map((p) => (
                        <ProspectoKanbanCard
                          key={p.ProspectId}
                          prospecto={p}
                          onClick={() => setDetalle(p)}
                        />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {modalNuevo && (
        <NuevoProspectoModal
          onCerrar={() => setModalNuevo(false)}
          onCreado={() => { setModalNuevo(false); void cargar(); }}
        />
      )}
      {detalle && (
        <DetalleProspectoModal
          prospecto={detalle}
          onCerrar={() => setDetalle(null)}
          onActualizado={() => { setDetalle(null); void cargar(); }}
        />
      )}
    </>
  );
}

function ProspectoKanbanCard({
  prospecto,
  onClick,
}: {
  prospecto: Prospecto;
  onClick: () => void;
}) {
  const contacto = prospecto.WhatsApp || prospecto.Email || "sin contacto";
  const ContactIcon = prospecto.WhatsApp ? Phone : Mail;
  const cliente = esCliente(prospecto);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md border border-[color:var(--color-border)] bg-white p-3 text-left shadow-sm transition hover:border-[color:var(--color-tertiary)] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <Building2 size={15} className="mt-0.5 shrink-0 text-[color:var(--color-text-muted)]" />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-[color:var(--color-text-primary)]">
              {prospecto.Empresa || prospecto.Contacto || "Registro sin nombre"}
            </p>
            {prospecto.Contacto && (
              <p className="truncate text-[12px] text-[color:var(--color-text-muted)]">
                {prospecto.Contacto}
              </p>
            )}
          </div>
        </div>
        <Badge tono={cliente ? "success" : "info"}>{cliente ? "Cliente" : "Prospecto"}</Badge>
      </div>

      <div className="mt-3 space-y-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
        <p className="flex min-w-0 items-center gap-1.5">
          <ContactIcon size={13} className="shrink-0 text-[color:var(--color-text-muted)]" />
          <span className="truncate">{contacto}</span>
        </p>
        {(prospecto.Sector || prospecto.Fuente) && (
          <p className="flex min-w-0 items-center gap-1.5">
            <Tag size={13} className="shrink-0 text-[color:var(--color-text-muted)]" />
            <span className="truncate">
              {[prospecto.Sector, prospecto.Fuente].filter(Boolean).join(" / ")}
            </span>
          </p>
        )}
        <p className="font-medium text-[color:var(--color-text-primary)]">
          {formatearUSD(Number(prospecto.ValorEstimado || 0))}
        </p>
        {(prospecto.ProximaAccion || prospecto.FechaSeguimiento) && (
          <p className="flex items-start gap-1.5 text-[color:var(--color-text-muted)]">
            <CalendarClock size={13} className="mt-0.5 shrink-0" />
            <span>
              {prospecto.ProximaAccion || "Dar seguimiento"}
              {prospecto.FechaSeguimiento ? ` / ${formatearFecha(prospecto.FechaSeguimiento)}` : ""}
            </span>
          </p>
        )}
        {prospecto.Notas && (
          <p className="line-clamp-2 rounded bg-[color:var(--color-surface-2)] px-2 py-1 text-[11.5px] text-[color:var(--color-text-muted)]">
            {prospecto.Notas}
          </p>
        )}
      </div>
    </button>
  );
}

function NuevoProspectoModal({ onCerrar, onCreado }: { onCerrar: () => void; onCreado: () => void }) {
  const { toast } = useToast();
  const [f, setF] = useState({ empresa: "", contacto: "", email: "", whatsapp: "", pais: "", sector: "", fuente: "", valorEstimado: "", notas: "" });
  const [guardando, setGuardando] = useState(false);

  async function crear() {
    if (!f.empresa && !f.contacto) return toast("Indica empresa o contacto.", "error");
    setGuardando(true);
    const r = await api("crearProspecto", { ...f, valorEstimado: Number(f.valorEstimado || 0) });
    setGuardando(false);
    if (!r.ok) return toast(r.error, "error");
    toast("Prospecto creado.", "success");
    onCreado();
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Nuevo prospecto"
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button variant="brand" loading={guardando} onClick={crear}>Crear</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="emp">Empresa</Label><Input id="emp" value={f.empresa} onChange={(e) => setF({ ...f, empresa: e.target.value })} /></div>
        <div><Label htmlFor="con">Contacto</Label><Input id="con" value={f.contacto} onChange={(e) => setF({ ...f, contacto: e.target.value })} /></div>
        <div><Label htmlFor="em">Correo</Label><Input id="em" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><Label htmlFor="wa">WhatsApp</Label><Input id="wa" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} /></div>
        <div><Label htmlFor="pa">Pais</Label><Input id="pa" value={f.pais} onChange={(e) => setF({ ...f, pais: e.target.value })} /></div>
        <div><Label htmlFor="se">Sector</Label><Input id="se" value={f.sector} onChange={(e) => setF({ ...f, sector: e.target.value })} placeholder="Ferreteria, farmacia..." /></div>
        <div><Label htmlFor="fu">Fuente</Label><Input id="fu" value={f.fuente} onChange={(e) => setF({ ...f, fuente: e.target.value })} placeholder="Referido, redes..." /></div>
        <div><Label htmlFor="ve">Valor estimado (USD)</Label><Input id="ve" type="number" value={f.valorEstimado} onChange={(e) => setF({ ...f, valorEstimado: e.target.value })} /></div>
      </div>
      <div className="mt-4"><Label htmlFor="no">Notas</Label><Textarea id="no" rows={3} value={f.notas} onChange={(e) => setF({ ...f, notas: e.target.value })} /></div>
    </Modal>
  );
}

function DetalleProspectoModal({
  prospecto, onCerrar, onActualizado,
}: {
  prospecto: Prospecto; onCerrar: () => void; onActualizado: () => void;
}) {
  const { toast } = useToast();
  const [etapa, setEtapa] = useState<EtapaCrmId>(prospecto.Etapa as EtapaCrmId);
  const [proximaAccion, setProximaAccion] = useState(prospecto.ProximaAccion || "");
  const [fechaSeguimiento, setFechaSeguimiento] = useState(prospecto.FechaSeguimiento || "");
  const [tipoActividad, setTipoActividad] = useState("nota");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    const upd = await api("actualizarProspecto", {
      prospectId: prospecto.ProspectId, etapa, proximaAccion, fechaSeguimiento,
    });
    if (descripcion.trim()) {
      await api("registrarActividad", {
        prospectId: prospecto.ProspectId, tipo: tipoActividad, descripcion,
        proximaAccion, fechaSeguimiento,
      });
    }
    setGuardando(false);
    if (!upd.ok) return toast(upd.error, "error");
    toast("Registro actualizado.", "success");
    onActualizado();
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={prospecto.Empresa || prospecto.Contacto}
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar}>Cerrar</Button>
          <Button variant="brand" loading={guardando} onClick={guardar}>Guardar</Button>
        </>
      }
    >
      <div className="space-y-1 text-[13px] text-[color:var(--color-text-muted)]">
        <p>Tipo: {esCliente(prospecto) ? "Cliente" : "Prospecto"}</p>
        <p>Contacto: {prospecto.Contacto || "-"} / {prospecto.WhatsApp || prospecto.Email || "sin contacto"}</p>
        <p>Creado: {formatearFecha(prospecto.FechaCreacion)}</p>
        {prospecto.Fuente && <p>Fuente: {prospecto.Fuente}</p>}
        {prospecto.Notas && <p>Notas: {prospecto.Notas}</p>}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="et">Etapa</Label>
          <Select id="et" value={etapa} onChange={(e) => setEtapa(e.target.value as EtapaCrmId)}>
            {ETAPAS_CRM.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="fs">Fecha de seguimiento</Label>
          <Input id="fs" type="date" value={fechaSeguimiento} onChange={(e) => setFechaSeguimiento(e.target.value)} />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="pa">Proxima accion</Label>
        <Input id="pa" value={proximaAccion} onChange={(e) => setProximaAccion(e.target.value)} placeholder="Ej. Enviar propuesta" />
      </div>

      <div className="mt-5 border-t border-[color:var(--color-border)] pt-4">
        <p className="text-label">Registrar actividad</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-[160px_1fr]">
          <Select value={tipoActividad} onChange={(e) => setTipoActividad(e.target.value)}>
            <option value="nota">Nota</option>
            <option value="llamada">Llamada</option>
            <option value="reunion">Reunion</option>
            <option value="mensaje">Mensaje</option>
            <option value="propuesta">Propuesta</option>
          </Select>
          <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe la interaccion (opcional)" />
        </div>
      </div>
    </Modal>
  );
}
