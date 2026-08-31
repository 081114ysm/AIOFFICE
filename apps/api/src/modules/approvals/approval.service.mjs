import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { projectRepository } from "../projects/project.repository.mjs";
import { approvalRepository } from "./approval.repository.mjs";
export async function approveProject(projectId) { const project = await projectRepository.findById(projectId); if (!project) throw Object.assign(new Error("Project not found"), { statusCode: 404 }); project.status = "DONE"; const saved = await projectRepository.save(project); await approvalRepository.add({ id: createId(), projectId, status: "APPROVED", createdAt: now() }); publish("PROJECT_APPROVED", projectId); return saved; }
