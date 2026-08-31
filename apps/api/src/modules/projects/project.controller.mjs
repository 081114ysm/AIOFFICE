import { readBody } from "../../http/body.mjs";
import { createProject } from "./project.service.mjs";
export async function projectController(req, res) { if (req.method !== "POST") return false; return createProject(await readBody(req)); }

