"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PREGUNTAS: Array<[string, string]> = [
  ["¿Necesito experiencia previa en ventas?", "No. La academia te lleva desde cero: aprenderás prospección, diagnóstico, demostración, manejo de objeciones y cierre paso a paso."],
  ["¿Cuánto dura la capacitación?", "Depende de tu ritmo. Los módulos suman varias horas de contenido; puedes avanzar cuando quieras y retomar donde lo dejaste."],
  ["¿Cuánto puedo ganar?", "Ganas 15% de comisión sobre la primera venta de cada cliente y 5% sobre sus renovaciones. No hay límite de clientes; tus ingresos dependen de tu actividad."],
  ["¿Cómo funcionan las comisiones?", "Se calculan automáticamente en tu panel cuando una venta es aprobada. Solo se reconocen clientes registrados correctamente y con evidencia."],
  ["¿Cuándo recibo mi cuenta de vendedor?", "Al completar todos los módulos, aprobar los exámenes y el examen final, hacer las simulaciones y aceptar los términos. El sistema crea tus credenciales automáticamente."],
  ["¿Puedo trabajar desde otro país?", "Sí. El programa está pensado para Latinoamérica. Solo necesitas internet, correo y WhatsApp."],
  ["¿Qué pasa si no apruebo un examen?", "Tienes varios intentos configurables por examen. Si los agotas, puedes repasar el módulo antes de un nuevo intento según las reglas vigentes."],
  ["¿Qué pasa si otro vendedor ya registró al cliente?", "La atribución respeta al primero que registró correctamente al prospecto con evidencia. Los duplicados pasan a revisión administrativa."],
  ["¿Puedo ofrecer descuentos por mi cuenta?", "No. No se permite modificar precios ni ofrecer descuentos sin autorización. Es parte del código de conducta."],
  ["¿Cómo recibo mis pagos?", "Las comisiones aprobadas se programan y se pagan según las reglas y el método acordado. Todo queda visible y transparente en tu panel."],
  ["¿Dónde resuelvo mis dudas?", "Tienes el Asistente Comercial ATRIA dentro de la plataforma y, como último recurso, el WhatsApp de soporte."],
  ["¿Qué necesito para certificarme?", "Completar los módulos obligatorios, aprobar los exámenes y el final con el puntaje mínimo, hacer las simulaciones y aceptar todos los términos."],
];

export function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/10 overflow-hidden rounded-[14px] border border-white/10 bg-[#150826]/70">
      {PREGUNTAS.map(([q, a], i) => {
        const activo = abierto === i;
        return (
          <div key={q}>
            <button
              type="button"
              onClick={() => setAbierto(activo ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={activo}
            >
              <span className="text-[15px] font-medium text-white">{q}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 text-[#a78bfa] transition-transform", activo && "rotate-180")}
              />
            </button>
            {activo && (
              <p className="px-5 pb-5 text-[14px] leading-7 text-white/65">{a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
