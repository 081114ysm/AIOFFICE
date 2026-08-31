import type { Agent } from "../../types/office";
export function AgentGrid({ agents }: { agents: Agent[] }) { return <div className="agents">{agents.map((agent) => <div className="agent" key={agent.id}><div className="avatar" style={{ background: agent.color }}>{agent.role.slice(0, 2)}</div><div><strong>{agent.name}</strong><span className={`agent-status ${agent.status}`}>{agent.status}</span></div><div className="desk">▦</div></div>)}</div>; }

