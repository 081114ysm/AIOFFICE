"use client";
import { useEffect } from "react";
import { Dashboard } from "../components/dashboard/Dashboard";
import { useOfficeStore } from "../store/office-store";

export default function HomePage() {
  const { data, isLoading, error, messageDraft, notifications, overlayEnabled, setMessageDraft, setOverlayEnabled, fetchState, connectLive, sendMessage, runTask, createMeeting, enableNotifications, dismissNotification } = useOfficeStore();
  useEffect(() => { void fetchState(); const disconnect = connectLive(); const timer = setInterval(() => { void fetchState(); }, 10000); return () => { disconnect(); clearInterval(timer); }; }, [fetchState, connectLive]);
  if (isLoading && !data) return <main><p>AI Office 연결 중...</p></main>;
  if (error && !data) return <main className="connection-state"><p>연결 실패: {error}</p>{error.includes("로그인") && <a className="primary-button" href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/github`}>GitHub로 로그인</a>}</main>;
  if (!data) return <main><p>표시할 데이터가 없습니다.</p></main>;
  return <Dashboard data={data} draft={messageDraft} notices={notifications} overlayEnabled={overlayEnabled} onDraftChange={setMessageDraft} onSend={() => void sendMessage()} onRunTask={(id) => void runTask(id)} onCreateMeeting={() => void createMeeting()} onEnableNotifications={() => void enableNotifications()} onDismissNotification={dismissNotification} onOverlayChange={setOverlayEnabled} />;
}
