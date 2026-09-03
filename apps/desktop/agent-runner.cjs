const { spawn } = require("node:child_process");
class ReadOnlyAgentRunner {
  constructor({ workspaceRoot, onEvent = () => {} }) { this.workspaceRoot = workspaceRoot; this.sessions = new Map(); this.onEvent = onEvent; }
  start({ id, name = "Codex Agent", prompt }) { if (this.sessions.has(id)) throw new Error("Agent session is already running"); const child = spawn("codex", ["exec", "--json", "--sandbox", "read-only", "--ephemeral", "-C", this.workspaceRoot, String(prompt || "프로젝트 구조와 현재 구현 상태를 분석하고 계획만 작성해줘. 파일은 수정하지 마.")], { cwd: this.workspaceRoot, shell: false, env: { PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/Users/081114ysm/.local/bin" } }); const session = { id, name, child }; this.sessions.set(id, session); this.emit("AGENT_STARTED", session, {}); child.stdout.on("data", (data) => this.emit("AGENT_OUTPUT", session, { data: data.toString().slice(-20_000) })); child.stderr.on("data", (data) => this.emit("AGENT_ERROR", session, { data: data.toString().slice(-8_000) })); child.on("close", (code) => { this.sessions.delete(id); this.emit("AGENT_EXITED", session, { code }); }); child.on("error", (error) => this.emit("AGENT_ERROR", session, { message: error.message })); return { id, status: "WORKING" }; }
  stop(id) { const session = this.sessions.get(id); if (!session) return false; session.child.kill("SIGTERM"); return true; }
  emit(type, session, payload) { this.onEvent({ type, agentId: session.id, agentName: session.name, payload, occurredAt: new Date().toISOString() }); }
}
module.exports = { ReadOnlyAgentRunner };
