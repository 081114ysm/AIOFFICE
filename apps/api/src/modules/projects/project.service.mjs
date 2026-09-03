import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { projectRepository } from "./project.repository.mjs";
export async function createProject(input) { const project = { id: createId(), name: input.name || "새 프로젝트", description: input.description || "", status: "PLANNING", createdAt: now() }; const saved = await projectRepository.create(project); publish("PROJECT_CREATED", project.id, { name: project.name }); return saved; }
