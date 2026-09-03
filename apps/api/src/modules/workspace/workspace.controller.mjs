import { stat } from "node:fs/promises";
import path from "node:path";
import { config } from "../../config/env.mjs";

export async function workspaceController(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/workspace") return { root: config.workspaceRoot };
  if (req.method !== "POST" || url.pathname !== "/api/workspace/select") return false;
  const body = await new Promise((resolveBody, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; if (raw.length > 16_000) reject(Object.assign(new Error("요청이 너무 큽니다."), { statusCode: 413 })); });
    req.on("end", () => { try { resolveBody(JSON.parse(raw || "{}")); } catch { reject(Object.assign(new Error("JSON 형식이 올바르지 않습니다."), { statusCode: 400 })); } });
    req.on("error", reject);
  });
  const requestedRoot = typeof body?.root === "string" ? body.root.trim() : "";
  if (!requestedRoot || !path.isAbsolute(requestedRoot)) throw Object.assign(new Error("절대 경로 폴더를 선택해야 합니다."), { statusCode: 400 });
  const resolvedRoot = path.resolve(requestedRoot);
  const details = await stat(resolvedRoot).catch(() => null);
  if (!details?.isDirectory()) throw Object.assign(new Error("선택한 경로가 폴더가 아닙니다."), { statusCode: 400 });
  config.workspaceRoot = resolvedRoot;
  return { root: config.workspaceRoot };
}
