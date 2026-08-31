import { createId, now } from "../../common/id.mjs";
import { pool } from "../database/postgres.mjs";
const subscribers = new Set();
export function subscribeEvents(socket) { subscribers.add(socket); socket.on("close", () => subscribers.delete(socket)); }
export function publish(type, projectId, payload = {}) {
  const event = { id: createId(), type, projectId, payload, occurredAt: now() };
  void pool.query("insert into events (id, type, project_id, payload, occurred_at) values ($1, $2, $3, $4, $5)", [event.id, event.type, projectId, payload, event.occurredAt]);
  for (const socket of subscribers) if (socket.readyState === 1) socket.send(JSON.stringify(event));
  return event;
}
