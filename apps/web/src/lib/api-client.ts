import type { OfficeState, V2State } from "../types/office";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${API}${path}`, { ...init, credentials: "include" }); if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload.message ?? "API 요청에 실패했습니다."); } return response.json() as Promise<T>; }
export const officeApi = {
  getState: () => request<OfficeState>("/api/state"),
  sendMessage: (conversationId: string, content: string) => request(`/api/conversations/${conversationId}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) }),
  runTask: (taskId: string) => request(`/api/tasks/${taskId}/run`, { method: "POST" }),
  reviewTask: (taskId: string, result: "PASS" | "FAIL", evidence: string) => request(`/api/tasks/${taskId}/qa`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ result, evidence }) }),
  createMeeting: (projectId: string) => request("/api/meetings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ projectId, title: "Agent 협업 회의" }) })
  ,resumeConversation: (conversationId: string) => request(`/api/conversations/${conversationId}/resume`, { method: "POST" })
  ,updateOverlayPreference: (overlayEnabled: boolean) => request("/api/preferences/overlay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ overlayEnabled }) })
  ,getV2: () => request<V2State>("/api/v2")
  ,requestToolRun: (toolId: string, projectId: string) => request("/api/v2/tool-runs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ toolId, projectId }) })
  ,approveToolRun: (runId: string) => request(`/api/v2/tool-runs/${runId}/approve`, { method: "POST" })
  ,getGithubUser: () => request("/api/github/user")
  ,getGithubRepository: () => request("/api/github/repository")
  ,getGithubContents: (path = "", ref = "") => request(`/api/github/contents?path=${encodeURIComponent(path)}&ref=${encodeURIComponent(ref)}`)
  ,generateAiResponse: (prompt: string) => request<{ id: string; model: string; text: string }>("/api/ai/respond", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }) })
};

export function connectOfficeEvents(onEvent: (event: { type: string; [key: string]: unknown }) => void) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const socket = new WebSocket(`${base.replace(/^http/, "ws")}/ws`);
  socket.addEventListener("message", (message) => {
    try { onEvent(JSON.parse(message.data as string)); } catch { /* Ignore malformed events. */ }
  });
  return () => socket.close();
}
