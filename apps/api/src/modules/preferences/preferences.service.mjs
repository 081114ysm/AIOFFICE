import { memoryStore } from "../../infrastructure/database/memory.store.mjs";
export function updatePreferences(input) { memoryStore.preferences.overlayEnabled = Boolean(input.overlayEnabled); return memoryStore.preferences; }

