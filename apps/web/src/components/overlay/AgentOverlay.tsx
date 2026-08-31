import type { Agent } from "../../types/office";

const activity: Record<string, string> = { WORKING: "지금 작업을 진행하고 있어요", MEETING: "회의에서 의견을 나누고 있어요", WAITING: "다른 Agent의 결과를 기다리고 있어요", IDLE: "다음 업무를 기다리고 있어요", OFFLINE: "잠시 자리를 비웠어요" };
const positions = ["overlay-agent overlay-agent-pm", "overlay-agent overlay-agent-research", "overlay-agent overlay-agent-dev", "overlay-agent overlay-agent-qa"];

export function AgentOverlay({ agents }: { agents: Agent[] }) { return <div className="agent-overlay" aria-label="AI Agent 데스크톱 오버레이">{agents.map((agent, index) => <div className={positions[index % positions.length]} key={agent.id}><div className="speech-bubble"><strong>{agent.name}</strong><span>{activity[agent.status] ?? "업무 상태를 확인하고 있어요"}</span></div><div className={`overlay-avatar ${agent.status}`} style={{ background: agent.color }}>{agent.role.slice(0, 2)}</div><div className="overlay-shadow" /></div>)}</div>; }

