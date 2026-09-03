import { spawn } from "node:child_process";
import { config } from "../../config/env.mjs";

function runCodex(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["exec", "--json", "--sandbox", "read-only", "--ephemeral", "-C", config.workspaceRoot, prompt], {
      cwd: config.workspaceRoot,
      shell: false,
      env: {
        PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/Users/081114ysm/.local/bin",
        HOME: "/Users/081114ysm",
        CODEX_HOME: "/Users/081114ysm/.codex",
      },
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (fn, value) => { if (settled) return; settled = true; fn(value); };
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      finish(reject, Object.assign(new Error("Codex 응답 시간이 초과되었습니다."), { statusCode: 408 }));
    }, config.toolTimeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => { clearTimeout(timer); finish(reject, error); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        const message = stderr.trim().split("\n").at(-1) || `Codex 실행 실패 (${code})`;
        finish(reject, Object.assign(new Error(message.slice(0, 500)), { statusCode: 502 }));
        return;
      }
      try {
        const items = stdout.split("\n").filter(Boolean).map((line) => JSON.parse(line));
        const message = items.find((item) => item.type === "item.completed" && item.item?.type === "agent_message");
        const text = message?.item?.text;
        if (!text) throw new Error("Codex가 텍스트 응답을 반환하지 않았습니다.");
        finish(resolve, { id: items.find((item) => item.type === "thread.started")?.thread_id ?? "codex-local", model: "codex-cli", text });
      } catch (error) {
        finish(reject, Object.assign(new Error(error instanceof Error ? error.message : "Codex 응답 해석 실패"), { statusCode: 502 }));
      }
    });
  });
}

export function generateCodexResponse(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) throw new Error("prompt가 필요합니다.");
  if (prompt.length > 8_000) throw new Error("prompt는 8,000자 이내여야 합니다.");
  return runCodex(prompt);
}
