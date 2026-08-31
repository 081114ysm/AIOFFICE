import { memoryStore } from "../../infrastructure/database/memory.store.mjs";
export const conversationRepository = { findById: (id) => memoryStore.conversations.find((conversation) => conversation.id === id), addMessage: (message) => memoryStore.messages.push(message), addTask: (task) => memoryStore.tasks.push(task), save: (conversation) => conversation };

