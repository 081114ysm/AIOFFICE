import { memoryStore } from "../../infrastructure/database/memory.store.mjs";
export const projectRepository = { findById: (id) => memoryStore.projects.find((project) => project.id === id), create: (project) => { memoryStore.projects.unshift(project); return project; }, save: (project) => project };

