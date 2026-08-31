import { runTask } from "./task.service.mjs";
export async function taskController(req, res, taskId) { if (req.method !== "POST") return false; return { task: await runTask(taskId) }; }
