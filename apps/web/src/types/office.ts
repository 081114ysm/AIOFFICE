export type Agent = { id: string; name: string; role: string; department?: string; status: string; color: string; positionX?: number; positionY?: number; roomId?: string; speech?: string; isManager?: boolean };
export type Task = { id: string; title: string; status: string; assigneeAgentId: string };
export type Message = { id?: string; role: string; content: string; createdAt: string };
export type OfficeEvent = { id: string; type: string; projectId: string; payload: { taskId?: string; agentId?: string; meetingId?: string; participantIds?: string[]; destination?: { x: number; y: number; roomId: string } }; occurredAt: string };
export type WorkflowStage = "RESEARCH" | "ANALYSIS" | "IDEATION" | "QA" | "APPROVAL" | "SCRIPT" | "PRODUCTION" | "REVIEW";
export type OfficeState = { preferences: { overlayEnabled: boolean }; projects: { id: string; name: string; status: string; workflowStage?: WorkflowStage }[]; agents: Agent[]; tasks: Task[]; conversations: { id: string; title: string }[]; messages: Message[]; meetings: { id?: string; title: string; status: string }[]; events: OfficeEvent[] };
export type V2Tool = { id: string; name: string; type: string; description: string; risk: string; enabled: boolean };
export type V2State = { tools: V2Tool[]; toolRuns: { id: string; toolId: string; status: string; input: Record<string, unknown> }[]; approvals: { id: string; targetId: string; status: string }[]; memberships: { id: string; agentId: string; role: string }[] };
