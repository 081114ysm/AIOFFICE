import type { OfficeState, V2State } from "../types/office";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${API}${path}`, init); if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload.message ?? "API 요청에 실패했습니다."); } return response.json() as Promise<T>; }
export const officeApi = {
  getState: () => request<OfficeState>("/api/state"),
  sendMessage: (conversationId: string, content: string) => request(`/api/conversations/${conversationId}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) }),
  runTask: (taskId: string) => request(`/api/tasks/${taskId}/run`, { method: "POST" }),
  createMeeting: (projectId: string) => request("/api/meetings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ projectId, title: "Agent 협업 회의" }) })
  ,updateOverlayPreference: (overlayEnabled: boolean) => request("/api/preferences/overlay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ overlayEnabled }) })
  ,getV2: () => request<V2State>("/api/v2")
  ,requestToolRun: (toolId: string, projectId: string) => request("/api/v2/tool-runs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ toolId, projectId }) })
  ,approveToolRun: (runId: string) => request(`/api/v2/tool-runs/${runId}/approve`, { method: "POST" })
};
