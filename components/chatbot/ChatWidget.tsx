"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { analizar } from "@/lib/chatbot/engine";
import { api } from "@/lib/api";
import { MARCA } from "@/lib/config";
import { enlaceWhatsApp, cn } from "@/lib/utils";

type Mensaje = {
  de: "bot" | "usuario";
  texto: string;
  quickReplies?: string[];
};

// Atajos de navegación: ciertas respuestas rápidas llevan a una página.
const NAV: Record<string, string> = {
  "Ir a recuperar acceso": "/recuperar",
  "Ir a certificación": "/certificacion",
  "Ir al simulador": "/simulador",
  "Ver mis comisiones": "/panel/comisiones",
  "Ver mis ventas": "/panel/ventas",
  "Registrar un prospecto": "/panel/crm",
  "Registrar actividad": "/panel/crm",
  "Ver términos": "/legal/terminos",
  "Política de comisiones": "/legal/comisiones",
  "Política de prospectos": "/legal/prospectos",
  "Código de conducta": "/legal/conducta",
};

const BIENVENIDA: Mensaje = {
  de: "bot",
  texto: "¡Hola! Soy el Asistente Comercial ARCA. Estoy aquí para ayudarte con el producto, la academia, las comisiones y tu cuenta. ¿Qué necesitas?",
  quickReplies: ["¿Qué es ARCA?", "¿Cómo funcionan las comisiones?", "¿Cómo me certifico?", "Tengo un problema para entrar"],
};

export function ChatWidget() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA]);
  const [texto, setTexto] = useState("");
  const [contexto, setContexto] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  function abrirWhatsApp() {
    window.open(
      enlaceWhatsApp(MARCA.whatsappSoporte, "Hola, necesito ayuda con la Academia Comercial ARCA."),
      "_blank",
    );
  }

  function enviar(entrada: string) {
    const limpio = entrada.trim();
    if (!limpio) return;

    // Atajos especiales.
    if (limpio === "Escribir por WhatsApp" || limpio === "Contactar soporte") {
      setMensajes((m) => [...m, { de: "usuario", texto: limpio }]);
      abrirWhatsApp();
      setMensajes((m) => [...m, { de: "bot", texto: "Te abrí WhatsApp de soporte. Si prefieres, sigo ayudándote aquí." }]);
      setTexto("");
      return;
    }
    if (limpio === "Empezar de nuevo") {
      setMensajes([BIENVENIDA]);
      setContexto(null);
      setTexto("");
      return;
    }
    if (NAV[limpio]) {
      setMensajes((m) => [...m, { de: "usuario", texto: limpio }]);
      router.push(NAV[limpio]);
      setAbierto(false);
      setTexto("");
      return;
    }

    setMensajes((m) => [...m, { de: "usuario", texto: limpio }]);
    setTexto("");

    const r = analizar(limpio, contexto);
    setMensajes((m) => [...m, { de: "bot", texto: r.respuesta, quickReplies: r.quickReplies }]);
    setContexto(r.intencion?.id ?? contexto);

    // Registro (best-effort) para métricas y mejora.
    api("registrarChat", {
      mensaje: limpio,
      intencion: r.intencion?.id || "ninguna",
      confianza: r.confianza,
      respuesta: r.respuesta,
      resuelto: !!r.intencion,
    });
    if (!r.intencion) {
      api("registrarPreguntaNoResuelta", { pregunta: limpio, contexto: contexto || "" });
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--grad-brand-from),var(--grad-brand-to))] text-white shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition hover:scale-105"
        aria-label={abierto ? "Cerrar asistente" : "Abrir asistente"}
      >
        {abierto ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Panel */}
      {abierto && (
        <div className="fixed bottom-24 right-5 z-[80] flex h-[520px] w-[min(94vw,380px)] flex-col overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-lg)]">
          <div className="flex items-center gap-2.5 bg-[color:var(--color-primary)] px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Bot size={18} />
            </span>
            <div>
              <p className="text-[14px] font-semibold leading-tight">Asistente Comercial ARCA</p>
              <p className="text-[11px] text-white/60">Respuestas guiadas · no es un humano</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[color:var(--color-neutral)] px-3 py-4">
            {mensajes.map((m, i) => (
              <div key={i}>
                <div className={cn("flex items-start gap-2", m.de === "usuario" && "flex-row-reverse")}>
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    m.de === "bot"
                      ? "bg-[color:var(--color-tertiary-light)] text-[color:var(--color-primary)]"
                      : "bg-[color:var(--color-primary)] text-white",
                  )}>
                    {m.de === "bot" ? <Bot size={14} /> : <User size={14} />}
                  </span>
                  <div className={cn(
                    "max-w-[80%] rounded-[12px] px-3 py-2 text-[13px] leading-6",
                    m.de === "bot"
                      ? "rounded-tl-none bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                      : "rounded-tr-none bg-[color:var(--color-primary)] text-white",
                  )}>
                    {m.texto}
                  </div>
                </div>
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-9">
                    {m.quickReplies.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => enviar(q)}
                        className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] px-3 py-1 text-[12px] text-[color:var(--color-secondary)] transition hover:border-[color:var(--color-tertiary)] hover:bg-[color:var(--color-surface-2)]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={finRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); enviar(texto); }}
            className="flex items-center gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3"
          >
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="arca-input"
            />
            <button
              type="submit"
              className="arca-btn arca-btn-brand shrink-0 px-3"
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
