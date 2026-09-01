"use client";

import { useEffect, useState } from "react";
import { AgentOverlay } from "../../components/overlay/AgentOverlay";
import { connectOfficeEvents } from "../../lib/api-client";
import { useOfficeStore } from "../../store/office-store";

export default function OverlayPage() {
  const { data, fetchState } = useOfficeStore(); const [event, setEvent] = useState<{ type?: string; agentId?: string } | null>(null);
  useEffect(() => { document.body.classList.add("overlay-body"); void fetchState(); const disconnect = connectOfficeEvents((next) => { setEvent({ type: next.type, agentId: typeof next.agentId === "string" ? next.agentId : typeof next.payload === "object" && next.payload && "agentId" in next.payload ? String(next.payload.agentId) : undefined }); void fetchState(); }); const timer = setInterval(() => void fetchState(), 10000); return () => { disconnect(); clearInterval(timer); document.body.classList.remove("overlay-body"); }; }, [fetchState]);
  return <main className="overlay-page">{data?.preferences.overlayEnabled ? <AgentOverlay agents={data.agents} event={event} /> : null}</main>;
}
