import type { OfficeState } from "../../types/office";
import { AgentGrid } from "../office/AgentGrid";
import { ConversationPanel } from "../conversation/ConversationPanel";
import { TaskBoard } from "../tasks/TaskBoard";
import { NotificationCenter } from "../notifications/NotificationCenter";
import type { InAppNotification } from "../../store/office-store";
import { WorkflowStrip } from "../workflow/WorkflowStrip";
import { PixelOfficeMap } from "../office/PixelOfficeMap";
import { LiveActivity } from "../activity/LiveActivity";

type Props = {
  data: OfficeState;
  draft: string;
  notices: InAppNotification[];
  overlayEnabled: boolean;
  workspaceRoot: string | null;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRunTask: (id: string) => void;
  onCreateMeeting: () => void;
  onEnableNotifications: () => void;
  onDismissNotification: (id: string) => void;
  onOverlayChange: (enabled: boolean) => void;
  onSelectWorkspace: () => void;
};

export function Dashboard({ data, draft, notices, overlayEnabled, workspaceRoot, onDraftChange, onSend, onRunTask, onCreateMeeting, onEnableNotifications, onDismissNotification, onOverlayChange, onSelectWorkspace }: Props) {
  const active = data.projects[0];
  return <main className="shell game-shell">
    <header><div className="brand-lockup"><div className="brand-mark">✦</div><div><span className="eyebrow">AI OFFICE · PIXEL WORLD</span><h1>{active?.name ?? "AI Office"}</h1><p className="muted">32명의 AI 직원이 오늘의 업무를 진행 중입니다.</p></div></div><div className="header-actions"><button className="secondary-button workspace-button" onClick={onSelectWorkspace} title={workspaceRoot ?? "Electron 앱에서 작업 폴더를 선택하세요."}>⌂ {workspaceRoot ? workspaceRoot.split("/").filter(Boolean).at(-1) : "폴더 선택"}</button><button className="secondary-button" onClick={onEnableNotifications}>🔔 알림</button><button className="secondary-button overlay-toggle" onClick={() => onOverlayChange(!overlayEnabled)}>◉ 오버레이 {overlayEnabled ? "ON" : "OFF"}</button><button className="primary-button" onClick={onCreateMeeting}>+ 회의 소집</button><span className="status-pill"><i /> LIVE · {active?.status ?? "PLANNING"}</span></div></header>
    <WorkflowStrip stage={active?.workflowStage} />
    <div className="dashboard-grid"><section className="panel office office-map-panel"><div className="panel-title"><div><span className="section-kicker">AI OFFICE FLOOR</span><h2>실시간 오피스</h2></div><span className="muted">{data.agents.length} agents online</span></div><PixelOfficeMap agents={data.agents} /></section><aside className="side-column"><ConversationPanel messages={data.messages} draft={draft} onDraftChange={onDraftChange} onSend={onSend} /><LiveActivity events={data.events} /><TaskBoard tasks={data.tasks} onRun={onRunTask} /></aside></div>
    <section className="agent-roster panel"><div className="panel-title"><div><span className="section-kicker">AGENT ROSTER</span><h2>오늘 출근한 직원</h2></div><span className="muted">{data.agents.length}명</span></div><AgentGrid agents={data.agents} /></section>
    {overlayEnabled && <div className="overlay-active-note">데스크톱 오버레이 연결됨</div>}<NotificationCenter notices={notices} onDismiss={onDismissNotification} />
  </main>;
}
