"use client";

import { useEffect } from "react";
import { AgentOverlay } from "../../components/overlay/AgentOverlay";
import { useOfficeStore } from "../../store/office-store";

export default function OverlayPage() {
  const { data, fetchState } = useOfficeStore();
  useEffect(() => { document.body.classList.add("overlay-body"); void fetchState(); const timer = setInterval(() => void fetchState(), 1500); return () => { clearInterval(timer); document.body.classList.remove("overlay-body"); }; }, [fetchState]);
  return <main className="overlay-page">{data?.preferences.overlayEnabled ? <AgentOverlay agents={data.agents} /> : null}</main>;
}
