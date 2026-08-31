import { memoryStore } from "../../infrastructure/database/memory.store.mjs";
export const taskRepository = { findById: (id) => memoryStore.tasks.find((task) => task.id === id), save: (task) => task };

