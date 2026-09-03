import { approveProject } from "./approval.service.mjs";
export async function approvalController(req, res, projectId) { if (req.method !== "POST") return false; return approveProject(projectId); }
