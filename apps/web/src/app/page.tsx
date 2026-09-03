"use client";
import { useEffect } from "react";
import { Dashboard } from "../components/dashboard/Dashboard";
import { useOfficeStore } from "../store/office-store";

function LoginGate({ message }: { message: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return <main className="login-gate">
    <div className="login-gate__window">
      <header className="login-gate__header">
        <div className="brand-lockup"><span className="brand-mark">✦</span><div><span className="eyebrow">AI OFFICE · PIXEL WORLD</span><h1>AI Office Workspace</h1></div></div>
        <span className="login-gate__status"><i /> LOCAL · READY</span>
      </header>
      <section className="login-gate__content">
        <div className="login-gate__map" aria-hidden="true"><span /><span /><span /><span /><b>AI</b></div>
        <div className="login-gate__card">
          <span className="section-kicker">CEO ACCESS · 01</span>
          <h2>오피스에 입장하세요</h2>
          <p>{message === "로그인이 필요합니다." ? "GitHub 계정으로 로그인하면 나만의 AI 직원들과 작업을 시작할 수 있어요." : message}</p>
          <a className="primary-button" href={`${apiBase}/api/auth/github`}>GitHub로 로그인 <span>→</span></a>
          <small>GitHub OAuth로 안전하게 인증합니다.</small>
        </div>
      </section>
      <footer className="login-gate__footer"><span>◈ 32 AGENTS STANDBY</span><span>WORKSPACE AWAITING CEO</span></footer>
    </div>
  </main>;
}

export default function HomePage() {
  const { data, isLoading, error, messageDraft, notifications, overlayEnabled, setMessageDraft, setOverlayEnabled, fetchState, connectLive, sendMessage, runTask, createMeeting, enableNotifications, dismissNotification } = useOfficeStore();
  useEffect(() => { void fetchState(); const disconnect = connectLive(); const timer = setInterval(() => { void fetchState(); }, 10000); return () => { disconnect(); clearInterval(timer); }; }, [fetchState, connectLive]);
  if (isLoading && !data) return <main><p>AI Office 연결 중...</p></main>;
  if (error && !data) return <LoginGate message={error} />;
  if (!data) return <LoginGate message="로그인이 필요합니다." />;
  return <Dashboard data={data} draft={messageDraft} notices={notifications} overlayEnabled={overlayEnabled} onDraftChange={setMessageDraft} onSend={() => void sendMessage()} onRunTask={(id) => void runTask(id)} onCreateMeeting={() => void createMeeting()} onEnableNotifications={() => void enableNotifications()} onDismissNotification={dismissNotification} onOverlayChange={setOverlayEnabled} />;
}
