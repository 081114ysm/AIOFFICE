import { memoryStore } from "../../infrastructure/database/memory.store.mjs";
export const meetingRepository = { create: (meeting) => { memoryStore.meetings.unshift(meeting); return meeting; } };

