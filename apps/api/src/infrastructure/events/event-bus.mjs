import { createId, now } from "../../common/id.mjs";
import { memoryStore } from "../database/memory.store.mjs";
export function publish(type, projectId, payload = {}) { const event = { id: createId(), type, projectId, payload, occurredAt: now() }; memoryStore.events.push(event); return event; }

