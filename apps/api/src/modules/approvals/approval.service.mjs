import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { projectRepository } from "../projects/project.repository.mjs";
import { approvalRepository } from "./approval.repository.mjs";
export async function approveProject(projectId) { const project = await projectRepository.findById(projectId); if (!project) throw Object.assign(new Error("Project not found"), { statusCode: 404 }); if (project.status !== "WAITING_APPROVAL") throw Object.assign(new Error("승인 대기 상태의 Project만 승인할 수 있습니다."), { statusCode: 409 }); project.status = "DONE"; project.workflow_stage = "SCRIPT"; const saved = await projectRepository.save(project); await approvalRepository.add({ id: createId(), projectId, status: "APPROVED", createdAt: now() }); publish("PROJECT_APPROVED", projectId); return saved; }
