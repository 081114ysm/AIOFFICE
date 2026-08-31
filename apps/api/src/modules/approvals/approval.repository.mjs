import { memoryStore } from "../../infrastructure/database/memory.store.mjs";
export const approvalRepository = { add: (approval) => memoryStore.approvals.push(approval) };

