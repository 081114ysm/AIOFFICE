import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { config } from "../../config/env.mjs";
import { githubClient } from "../github/github.client.mjs";

function safePath(inputPath) {
  if (!inputPath || path.isAbsolute(inputPath)) throw Object.assign(new Error("workspace 상대 경로만 사용할 수 있습니다."), { statusCode: 400 });
  const root = path.resolve(config.workspaceRoot);
  const target = path.resolve(root, inputPath);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw Object.assign(new Error("workspace 밖의 경로입니다."), { statusCode: 403 });
  if (target.includes(`${path.sep}.git${path.sep}`) || target.endsWith(`${path.sep}.env`) || target.includes(`${path.sep}.env.`)) throw Object.assign(new Error("보호된 경로입니다."), { statusCode: 403 });
  return target;
}

function limitedCommand(command) {
  const text = String(command ?? "").trim();
  const parts = text.split(/\s+/).filter(Boolean);
  const executable = parts[0];
  const allowed = new Set(["ls", "pwd", "find", "git"]);
  const denied = /[;&|`$<>]|\brm\b|\bsudo\b|\bchmod\b|\bchown\b|\bcurl\b|\bwget\b|\bssh\b|\bgit\s+(push|reset|clean|checkout)\b/i;
  if (!executable || !allowed.has(executable) || denied.test(text)) throw Object.assign(new Error("허용되지 않은 Terminal 명령입니다. 허용 명령: ls, pwd, find, git(read-only)"), { statusCode: 403 });
  if (executable === "git" && !["status", "diff", "log", "branch"].includes(parts[1])) throw Object.assign(new Error("허용되지 않은 git 하위 명령입니다."), { statusCode: 403 });
  return parts;
}

function executeCommand(parts) {
  return new Promise((resolve, reject) => {
    const child = spawn(parts[0], parts.slice(1), { cwd: config.workspaceRoot, shell: false, env: { PATH: process.env.PATH, NODE_ENV: "development" } });
    let stdout = ""; let stderr = ""; let settled = false;
    const finish = (fn, value) => { if (settled) return; settled = true; fn(value); };
    const timer = setTimeout(() => { child.kill("SIGTERM"); finish(reject, Object.assign(new Error("Terminal 실행 시간이 초과되었습니다."), { statusCode: 408 })); }, config.toolTimeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => { clearTimeout(timer); finish(reject, error); });
    child.on("close", (code) => { clearTimeout(timer); finish(resolve, { code, stdout: stdout.slice(0, 20_000), stderr: stderr.slice(0, 20_000) }); });
  });
}

function executeCodexInspection(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["exec", "--json", "--sandbox", "read-only", "--ephemeral", "-C", config.workspaceRoot, String(prompt ?? "")], { cwd: config.workspaceRoot, shell: false, env: { PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/Users/081114ysm/.local/bin", CODEX_HOME: "/Users/081114ysm/.codex" } });
    let stdout = ""; let stderr = ""; let settled = false;
    const finish = (fn, value) => { if (settled) return; settled = true; fn(value); };
    const timer = setTimeout(() => { child.kill("SIGTERM"); finish(reject, Object.assign(new Error("Codex 분석 시간이 초과되었습니다."), { statusCode: 408 })); }, config.toolTimeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); }); child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => { clearTimeout(timer); finish(reject, error); });
    child.on("close", (code) => { clearTimeout(timer); finish(resolve, { code, stdout: stdout.slice(-30_000), stderr: stderr.slice(-10_000), mode: "read-only" }); });
  });
}

export async function executeTool(toolId, input = {}) {
  if (toolId === "codex.inspect") return executeCodexInspection(input.prompt);
  if (toolId === "github.read") return input.path ? githubClient.getContents(input.path, input.ref) : githubClient.getRepository();
  if (toolId === "filesystem.read") return { path: input.path, content: await fs.readFile(safePath(input.path), "utf8") };
  if (toolId === "filesystem.write") { const target = safePath(input.path); await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, String(input.content ?? ""), "utf8"); return { path: input.path, bytes: Buffer.byteLength(String(input.content ?? "")) }; }
  if (toolId === "terminal.exec") return executeCommand(limitedCommand(input.command));
  if (toolId === "github.commit") { const current = await githubClient.getContents(input.path, input.branch); return githubClient.upsertContent({ path: input.path, content: String(input.content ?? ""), message: String(input.message || "feat: update workspace file"), branch: input.branch, sha: current.sha }); }
  if (toolId === "github.pr") return githubClient.createPullRequest({ title: String(input.title || "AI Office change"), body: String(input.body || "Created after CEO approval by AI Office."), head: String(input.head), base: String(input.base || "main") });
  throw Object.assign(new Error("지원하지 않는 Tool입니다."), { statusCode: 404 });
}
