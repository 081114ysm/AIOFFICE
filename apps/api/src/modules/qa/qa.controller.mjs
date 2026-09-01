import { readBody } from "../../http/body.mjs";
import { reviewTask } from "./qa.service.mjs";
export async function qaController(req, res, taskId) { if (req.method !== "POST") return false; return reviewTask(taskId, await readBody(req)); }
