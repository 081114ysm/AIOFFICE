import { create } from "zustand";
import { persist } from "zustand/middleware";
import { officeApi } from "../lib/api-client";
import { notificationService } from "../lib/notification-service";
import type { OfficeState, V2State } from "../types/office";

export type InAppNotification = { id: string; title: string; message: string; createdAt: string };
type OfficeStore = { data: OfficeState | null; v2: V2State | null; isLoading: boolean; error: string | null; messageDraft: string; notifications: InAppNotification[]; notificationsReady: boolean; overlayEnabled: boolean; setMessageDraft: (value: string) => void; setOverlayEnabled: (enabled: boolean) => void; fetchState: () => Promise<void>; fetchV2: () => Promise<void>; requestToolRun: (toolId: string) => Promise<void>; approveToolRun: (runId: string) => Promise<void>; sendMessage: () => Promise<void>; runTask: (taskId: string) => Promise<void>; createMeeting: () => Promise<void>; enableNotifications: () => Promise<NotificationPermission | "denied">; dismissNotification: (id: string) => void };

function completedTaskNotification(data: OfficeState, taskId?: string) { return data.tasks.find((task) => task.id === taskId)?.title ?? "AI 작업"; }

export const useOfficeStore = create<OfficeStore>()(persist((set, get) => ({
  data: null, v2: null, isLoading: false, error: null, messageDraft: "", notifications: [], notificationsReady: false, overlayEnabled: false,
  setMessageDraft: (value) => set({ messageDraft: value }),
  setOverlayEnabled: (enabled) => { set({ overlayEnabled: enabled }); void officeApi.updateOverlayPreference(enabled); },
  fetchV2: async () => { try { set({ v2: await officeApi.getV2() }); } catch (error) { set({ error: error instanceof Error ? error.message : "V2 상태를 불러오지 못했습니다." }); } },
  requestToolRun: async (toolId) => { const projectId = get().data?.projects[0]?.id; if (!projectId) return; await officeApi.requestToolRun(toolId, projectId); await get().fetchV2(); },
  approveToolRun: async (runId) => { await officeApi.approveToolRun(runId); await get().fetchV2(); },
  fetchState: async () => {
    set({ isLoading: true, error: null });
    try {
      const next = await officeApi.getState(); const previous = get().data;
      if (previous) {
        const oldEvents = new Set(previous.events.map((event) => event.id));
        next.events.filter((event) => !oldEvents.has(event.id) && event.type === "AGENT_RUN_COMPLETED").forEach((event) => {
          const title = completedTaskNotification(next, event.payload.taskId); const notice = { id: event.id, title: "AI Office 작업 완료", message: `\"${title}\" 작업이 검토 대기 상태가 되었습니다.`, createdAt: event.occurredAt };
          set((state) => ({ notifications: [notice, ...state.notifications].slice(0, 5) })); notificationService.taskCompleted(title);
        });
      }
      set({ data: next, isLoading: false, notificationsReady: true });
    } catch (error) { set({ isLoading: false, error: error instanceof Error ? error.message : "상태를 불러오지 못했습니다." }); }
  },
  sendMessage: async () => { const { data, messageDraft } = get(); if (!data || !messageDraft.trim()) return; await officeApi.sendMessage(data.conversations[0].id, messageDraft.trim()); set({ messageDraft: "" }); await get().fetchState(); },
  runTask: async (taskId) => { await officeApi.runTask(taskId); await get().fetchState(); },
  createMeeting: async () => { const projectId = get().data?.projects[0]?.id; if (!projectId) return; await officeApi.createMeeting(projectId); await get().fetchState(); },
  enableNotifications: async () => { const permission = await notificationService.requestPermission(); set({ notificationsReady: permission === "granted" }); return permission; },
  dismissNotification: (id) => set((state) => ({ notifications: state.notifications.filter((notice) => notice.id !== id) }))
}), { name: "ai-office-preferences", partialize: (state) => ({ overlayEnabled: state.overlayEnabled }) }));
