const stages = ["시장조사", "기획", "브랜드 QA", "대표 승인", "제작"];
export function WorkflowStrip() { return <section className="workflow-strip"><div className="workflow-heading"><span className="eyebrow">TODAY'S WORKFLOW</span><span className="muted">Agent handoff</span></div><div className="workflow-steps">{stages.map((stage, index) => <div className={`workflow-step ${index === 1 ? "active" : ""}`} key={stage}><span className="workflow-index">0{index + 1}</span><strong>{stage}</strong>{index < stages.length - 1 && <span className="workflow-arrow">→</span>}</div>)}</div></section>; }

