import { runTask } from "./task.service.mjs";
export function taskController(req, res, taskId) { if (req.method !== "POST") return false; return { task: runTask(taskId) }; }

