import type { Agent } from "../../types/office";

const rooms = [
  { id: "ceo", name: "대표실", x: 2, y: 3, w: 22, h: 25, accent: "blue" },
  { id: "brand", name: "브랜드 인텔리전스", x: 27, y: 3, w: 22, h: 25, accent: "sky" },
  { id: "strategy-1", name: "콘텐츠 전략 1", x: 52, y: 3, w: 22, h: 25, accent: "violet" },
  { id: "research", name: "시장조사", x: 77, y: 3, w: 21, h: 25, accent: "mint" },
  { id: "qa", name: "브랜드 QA", x: 2, y: 57, w: 22, h: 28, accent: "yellow" },
  { id: "strategy-2", name: "콘텐츠 전략 2", x: 27, y: 57, w: 22, h: 28, accent: "violet" },
  { id: "reels", name: "릴스 제작", x: 52, y: 57, w: 22, h: 28, accent: "sky" },
  { id: "carousel", name: "캐러셀 제작", x: 77, y: 57, w: 21, h: 28, accent: "mint" },
  { id: "partners", name: "파트너십", x: 2, y: 32, w: 22, h: 20, accent: "mint" },
  { id: "finance", name: "재무·사업관리", x: 27, y: 32, w: 22, h: 20, accent: "mint" },
  { id: "review", name: "성과리뷰", x: 52, y: 32, w: 22, h: 20, accent: "yellow" },
  { id: "automation", name: "자동화 운영", x: 77, y: 32, w: 21, h: 20, accent: "blue" },
];

function shortName(agent: Agent) { return agent.name.length > 4 ? agent.name.slice(0, 3) : agent.name; }

export function PixelOfficeMap({ agents }: { agents: Agent[] }) {
  return <div className="pixel-office-map" aria-label="AI 직원 실시간 사무실 맵">
    <div className="map-grid" /><div className="map-road road-horizontal" /><div className="map-road road-vertical" />
    <div className="map-room-floor-label">AI OFFICE FLOOR · REAL-TIME WORLD</div>
    {rooms.map((room) => <div className="office-room" key={room.id} style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` }}>
      <div className="room-label"><span className={`room-light ${room.accent}`} />{room.name}<small>{agents.filter((agent) => agent.roomId === room.id).length}명</small></div>
      <div className="room-desks">{[0, 1, 2].map((desk) => <span className="pixel-desk" key={desk}><i /></span>)}</div>
    </div>)}
    {agents.map((agent, index) => <div className={`map-agent ${agent.status}`} key={agent.id} title={`${agent.name} · ${agent.department ?? agent.role} · ${agent.speech ?? "업무 대기 중"}`} style={{ left: `${agent.positionX ?? 5 + (index % 8) * 11}%`, top: `${agent.positionY ?? 10 + Math.floor(index / 8) * 20}%` }}>
      <span className={`pixel-person ${agent.status}`} style={{ background: agent.color }} /><small>{shortName(agent)}</small>
      {agent.status === "WORKING" && <span className="map-speech">{agent.speech ?? "일하는 중…"}</span>}
    </div>)}
    <div className="map-legend"><span><i className="legend-dot working" />작업 중</span><span><i className="legend-dot waiting" />승인 대기</span><span><i className="legend-dot idle" />대기</span><span className="live-label">● LIVE</span></div>
  </div>;
}
