import { memoryStore } from "./memory.store.mjs";
export function getSnapshot() { return { ...memoryStore, events: memoryStore.events.slice(-30), messages: memoryStore.messages.slice(-50) }; }

