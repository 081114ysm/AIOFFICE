export type ProjectStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "WAITING_APPROVAL" | "DONE";
export type TaskStatus = "TODO" | "READY" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "DONE" | "FAILED";
export type AgentStatus = "IDLE" | "WORKING" | "MEETING" | "WAITING" | "OFFLINE";

export type AgentRole = "PM" | "RESEARCH" | "DEVELOPER" | "QA";

export interface DomainEvent<TPayload = unknown> {
  id: string;
  type: string;
  projectId: string;
  occurredAt: string;
  payload: TPayload;
}

