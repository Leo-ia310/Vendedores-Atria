"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(
  () => import("@/components/chatbot/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false },
);

export function LazyChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <ChatWidget /> : null;
}
