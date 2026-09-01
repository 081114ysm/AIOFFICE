import type { OfficeEvent } from "../../types/office";

const labels: Record<string, string> = {
  AGENT_RUN_STARTED: "작업을 시작했습니다.",
  AGENT_RUN_COMPLETED: "작업을 완료했습니다.",
  MESSAGE_CREATED: "새 메시지를 남겼습니다.",
  TOOL_RUN_REQUESTED: "도구 실행 승인을 요청했습니다.",
};

export function LiveActivity({ events }: { events: OfficeEvent[] }) {
  return <section className="panel live-activity"><div className="panel-title"><div><span className="section-kicker">LIVE FEED</span><h2>실시간 활동</h2></div><span className="live-status"><i />연결됨</span></div><div className="activity-list">{events.slice(-6).reverse().map((event) => <div className="activity-item" key={event.id}><span className={`activity-icon ${event.type.includes("COMPLETED") ? "done" : "working"}`}>{event.type.includes("COMPLETED") ? "✓" : "·"}</span><div><strong>{event.type.replaceAll("_", " ")}</strong><p>{labels[event.type] ?? "오피스 이벤트가 발생했습니다."}</p></div><time>{new Date(event.occurredAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</time></div>)}{events.length === 0 && <p className="empty-state">아직 활동 기록이 없습니다.</p>}</div></section>;
}
