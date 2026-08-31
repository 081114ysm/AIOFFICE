import type { Task } from "../../types/office";
export function TaskBoard({ tasks, onRun }: { tasks: Task[]; onRun: (taskId: string) => void }) { return <section className="panel"><div className="panel-title"><h2>Task Board</h2><span className="muted">{tasks.length} tasks</span></div><div className="tasks">{tasks.map((task) => <button className="task" key={task.id} onClick={() => task.status === "READY" || task.status === "TODO" ? onRun(task.id) : undefined}><span className={`dot ${task.status}`} /><span>{task.title}</span><small>{task.status}</small></button>)}</div></section>; }

