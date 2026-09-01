import type { Agent } from "../../types/office";

const rooms = [
  { name: "대표실", className: "room-ceo", accent: "blue" },
  { name: "기획·리서치", className: "room-research", accent: "sky" },
  { name: "콘텐츠 제작", className: "room-content", accent: "violet" },
  { name: "개발·자동화", className: "room-dev", accent: "mint" },
  { name: "브랜드 QA", className: "room-qa", accent: "yellow" },
];

function shortName(agent: Agent) {
  return agent.name.length > 4 ? agent.name.slice(0, 3) : agent.name;
}

export function PixelOfficeMap({ agents }: { agents: Agent[] }) {
  return (
    <div className="pixel-office-map" aria-label="AI 직원 실시간 사무실 맵">
      <div className="map-grid" />
      <div className="map-road road-horizontal" />
      <div className="map-road road-vertical" />
      {rooms.map((room, index) => {
        const roomAgents = agents.filter((_, agentIndex) => agentIndex % rooms.length === index);
        return (
          <div className={`office-room ${room.className}`} key={room.name}>
            <div className="room-label"><span className={`room-light ${room.accent}`} />{room.name}<small>{roomAgents.length}명</small></div>
            <div className="room-desks">
              {[0, 1, 2].map((desk) => <span className="pixel-desk" key={desk}><i /></span>)}
            </div>
            <div className="room-agents">
              {roomAgents.slice(0, 4).map((agent) => (
                <div className="map-agent" key={agent.id} title={`${agent.name} · ${agent.status}`}>
                  <span className={`pixel-person ${agent.status}`} style={{ background: agent.color }} />
                  <small>{shortName(agent)}</small>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="map-legend"><span><i className="legend-dot working" />작업 중</span><span><i className="legend-dot idle" />대기</span><span className="live-label">LIVE</span></div>
    </div>
  );
}
