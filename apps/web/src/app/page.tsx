"use client";
import { useEffect } from "react";
import { Dashboard } from "../components/dashboard/Dashboard";
import { useOfficeStore } from "../store/office-store";

export default function HomePage() {
  const { data, v2, isLoading, error, messageDraft, notifications, overlayEnabled, setMessageDraft, setOverlayEnabled, fetchState, fetchV2, connectLive, sendMessage, runTask, createMeeting, requestToolRun, approveToolRun, enableNotifications, dismissNotification } = useOfficeStore();
  useEffect(() => { void fetchState(); void fetchV2(); const disconnect = connectLive(); const timer = setInterval(() => { void fetchState(); void fetchV2(); }, 10000); return () => { disconnect(); clearInterval(timer); }; }, [fetchState, fetchV2, connectLive]);
  if (isLoading && !data) return <main><p>AI Office 연결 중...</p></main>;
  if (error && !data) return <main><p>연결 실패: {error}</p></main>;
  if (!data) return <main><p>표시할 데이터가 없습니다.</p></main>;
  return <Dashboard data={data} v2={v2} draft={messageDraft} notices={notifications} overlayEnabled={overlayEnabled} onDraftChange={setMessageDraft} onSend={() => void sendMessage()} onRunTask={(id) => void runTask(id)} onCreateMeeting={() => void createMeeting()} onEnableNotifications={() => void enableNotifications()} onDismissNotification={dismissNotification} onOverlayChange={setOverlayEnabled} onRequestTool={(id, input) => void requestToolRun(id, input)} onApproveTool={(id) => void approveToolRun(id)} />;
}
