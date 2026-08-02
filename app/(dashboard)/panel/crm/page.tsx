"use client";

import { useEffect, useState } from "react";
import { Plus, Users2, Building2 } from "lucide-react";
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
  ProspectId: string; Empresa: string; Contacto: string; Email: string; WhatsApp: string;
  Pais: string; Sector: string; Fuente: string; Etapa: string; ValorEstimado: number;
  ProximaAccion: string; FechaSeguimiento: string; Notas: string; FechaCreacion: string;
};

const ETAPA_TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  nuevo: "neutral", contactado: "info", respondio: "info", calificado: "info",
  reunion: "warning", demo: "warning", propuesta: "warning", negociacion: "warning",
  ganado: "success", perdido: "error", futuro: "neutral",
};

export default function CrmPage() {
  const { toast } = useToast();
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [detalle, setDetalle] = useState<Prospecto | null>(null);

  async function cargar() {
    setCargando(true);
    const r = await api<Prospecto[]>("listarProspectos");
    if (r.ok) setProspectos(r.data);
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  return (
    <>
      <PageHeader
        titulo="CRM y prospectos"
        descripcion="Registra oportunidades, muévelas por etapas y da seguimiento."
        accion={
          <Button variant="brand" onClick={() => setModalNuevo(true)}>
            <Plus size={16} /> Nuevo prospecto
          </Button>
        }
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : prospectos.length === 0 ? (
        <div className="arca-card">
          <EmptyState
            icon={Users2}
            titulo="Aún no tienes prospectos"
            descripcion="Registra tu primer prospecto para empezar a dar seguimiento."
            accion={<Button variant="brand" onClick={() => setModalNuevo(true)}><Plus size={16} /> Nuevo prospecto</Button>}
          />
        </div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Empresa / Contacto</th>
                <th className="px-4 py-3 font-semibold">Sector</th>
                <th className="px-4 py-3 font-semibold">Etapa</th>
                <th className="px-4 py-3 text-right font-semibold">Valor est.</th>
                <th className="px-4 py-3 font-semibold">Próxima acción</th>
              </tr>
            </thead>
            <tbody>
              {prospectos.map((p) => (
                <tr
                  key={p.ProspectId}
                  onClick={() => setDetalle(p)}
                  className="cursor-pointer border-b border-[color:var(--color-border)] transition last:border-0 hover:bg-[color:var(--color-surface-2)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={15} className="text-[color:var(--color-text-muted)]" />
                      <div>
                        <p className="font-medium text-[color:var(--color-text-primary)]">{p.Empresa || "—"}</p>
                        <p className="text-[color:var(--color-text-muted)]">{p.Contacto}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{p.Sector || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tono={ETAPA_TONO[p.Etapa] || "neutral"}>
                      {ETAPAS_CRM.find((e) => e.id === p.Etapa)?.nombre || p.Etapa}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(p.ValorEstimado || 0))}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{p.ProximaAccion || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalNuevo && (
        <NuevoProspectoModal
          onCerrar={() => setModalNuevo(false)}
          onCreado={() => { setModalNuevo(false); cargar(); }}
        />
      )}
      {detalle && (
        <DetalleProspectoModal
          prospecto={detalle}
          onCerrar={() => setDetalle(null)}
          onActualizado={() => { setDetalle(null); cargar(); }}
        />
      )}
    </>
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
        <div><Label htmlFor="pa">País</Label><Input id="pa" value={f.pais} onChange={(e) => setF({ ...f, pais: e.target.value })} /></div>
        <div><Label htmlFor="se">Sector</Label><Input id="se" value={f.sector} onChange={(e) => setF({ ...f, sector: e.target.value })} placeholder="Ferretería, farmacia…" /></div>
        <div><Label htmlFor="fu">Fuente</Label><Input id="fu" value={f.fuente} onChange={(e) => setF({ ...f, fuente: e.target.value })} placeholder="Referido, redes…" /></div>
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
    toast("Prospecto actualizado.", "success");
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
        <p>Contacto: {prospecto.Contacto || "—"} · {prospecto.WhatsApp || prospecto.Email || "sin contacto"}</p>
        <p>Creado: {formatearFecha(prospecto.FechaCreacion)}</p>
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
        <Label htmlFor="pa">Próxima acción</Label>
        <Input id="pa" value={proximaAccion} onChange={(e) => setProximaAccion(e.target.value)} placeholder="Ej. Enviar propuesta" />
      </div>

      <div className="mt-5 border-t border-[color:var(--color-border)] pt-4">
        <p className="text-label">Registrar actividad</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-[160px_1fr]">
          <Select value={tipoActividad} onChange={(e) => setTipoActividad(e.target.value)}>
            <option value="nota">Nota</option>
            <option value="llamada">Llamada</option>
            <option value="reunion">Reunión</option>
            <option value="mensaje">Mensaje</option>
            <option value="propuesta">Propuesta</option>
          </Select>
          <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe la interacción (opcional)" />
        </div>
      </div>
    </Modal>
  );
}
