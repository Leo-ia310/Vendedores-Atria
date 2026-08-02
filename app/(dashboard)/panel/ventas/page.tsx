"use client";

import { useEffect, useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, Select } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { PLANES_EJEMPLO } from "@/lib/config";
import { formatearUSD, formatearFecha } from "@/lib/utils";

type Venta = {
  SaleId: string; Cliente: string; Plan: string; Monto: number; TipoVenta: string;
  FechaVenta: string; Estado: string;
};

const ESTADO_TONO: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  pendiente: "warning", en_revision: "info", aprobada: "success", rechazada: "error",
  cancelada: "neutral", reembolsada: "error",
};

export default function VentasPage() {
  const { toast } = useToast();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(false);

  async function cargar() {
    setCargando(true);
    const r = await api<Venta[]>("listarVentas");
    if (r.ok) setVentas(r.data);
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  return (
    <>
      <PageHeader
        titulo="Ventas"
        descripcion="Registra tus ventas. Cada una entra como pendiente hasta ser validada por un administrador."
        accion={<Button variant="brand" onClick={() => setModal(true)}><Plus size={16} /> Registrar venta</Button>}
      />

      {cargando ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : ventas.length === 0 ? (
        <div className="arca-card">
          <EmptyState icon={ShoppingBag} titulo="Sin ventas registradas" descripcion="Registra tu primera venta para enviarla a validación." />
        </div>
      ) : (
        <div className="arca-card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.SaleId} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[color:var(--color-text-primary)]">{v.Cliente}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.Plan}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{v.TipoVenta === "renovacion" ? "Renovación" : "Primera"}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatearUSD(Number(v.Monto || 0))}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">{formatearFecha(v.FechaVenta)}</td>
                  <td className="px-4 py-3"><Badge tono={ESTADO_TONO[v.Estado] || "neutral"}>{v.Estado.replace("_", " ")}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <NuevaVentaModal onCerrar={() => setModal(false)} onCreada={() => { setModal(false); cargar(); }} />}
    </>
  );
}

function NuevaVentaModal({ onCerrar, onCreada }: { onCerrar: () => void; onCreada: () => void }) {
  const { toast } = useToast();
  const [f, setF] = useState({ cliente: "", plan: "Pro", monto: "45.99", tipoVenta: "primera", comprobante: "" });
  const [guardando, setGuardando] = useState(false);

  async function crear() {
    if (!f.cliente || Number(f.monto) <= 0) return toast("Cliente y monto (>0) son obligatorios.", "error");
    setGuardando(true);
    const r = await api("registrarVenta", { ...f, monto: Number(f.monto) });
    setGuardando(false);
    if (!r.ok) return toast(r.error, "error");
    toast("Venta registrada como pendiente.", "success");
    onCreada();
  }

  return (
    <Modal
      abierto onCerrar={onCerrar} titulo="Registrar venta"
      footer={<><Button variant="ghost" onClick={onCerrar}>Cancelar</Button><Button variant="brand" loading={guardando} onClick={crear}>Registrar</Button></>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label htmlFor="cl" required>Cliente / empresa</Label><Input id="cl" value={f.cliente} onChange={(e) => setF({ ...f, cliente: e.target.value })} /></div>
        <div>
          <Label htmlFor="pl">Plan</Label>
          <Select id="pl" value={f.plan} onChange={(e) => {
            const plan = e.target.value;
            const p = PLANES_EJEMPLO.find((x) => x.nombre === plan);
            setF({ ...f, plan, monto: p ? String(p.precioMensual) : f.monto });
          }}>
            {PLANES_EJEMPLO.map((p) => <option key={p.nombre} value={p.nombre}>{p.nombre}</option>)}
          </Select>
        </div>
        <div><Label htmlFor="mo" required>Monto (USD)</Label><Input id="mo" type="number" value={f.monto} onChange={(e) => setF({ ...f, monto: e.target.value })} /></div>
        <div>
          <Label htmlFor="tv">Tipo de venta</Label>
          <Select id="tv" value={f.tipoVenta} onChange={(e) => setF({ ...f, tipoVenta: e.target.value })}>
            <option value="primera">Primera venta (15%)</option>
            <option value="renovacion">Renovación (5%)</option>
          </Select>
        </div>
        <div><Label htmlFor="cp">Comprobante / referencia</Label><Input id="cp" value={f.comprobante} onChange={(e) => setF({ ...f, comprobante: e.target.value })} placeholder="Enlace o nota" /></div>
      </div>
      <p className="mt-3 text-[12px] text-[color:var(--color-text-muted)]">
        La comisión se calcula automáticamente cuando un administrador apruebe la venta.
      </p>
    </Modal>
  );
}
