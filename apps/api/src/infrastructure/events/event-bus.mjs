import { createId, now } from "../../common/id.mjs";
import { memoryStore } from "../database/memory.store.mjs";
const subscribers = new Set();
export function subscribeEvents(socket) { subscribers.add(socket); socket.on("close", () => subscribers.delete(socket)); }
export function publish(type, projectId, payload = {}) {
  const event = { id: createId(), type, projectId, payload, occurredAt: now() };
  memoryStore.events.push(event);
  for (const socket of subscribers) if (socket.readyState === 1) socket.send(JSON.stringify(event));
  return event;
}
