import { randomUUID } from "node:crypto";
export const createId = () => randomUUID();
export const now = () => new Date().toISOString();

