import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { meetingRepository } from "./meeting.repository.mjs";
export function createMeeting(input) { const meeting = { id: createId(), projectId: input.projectId || "project-demo", title: input.title || "Agent 협업 회의", status: "IN_PROGRESS", participants: ["agent-pm", "agent-dev", "agent-qa"], createdAt: now() }; meetingRepository.create(meeting); publish("MEETING_STARTED", meeting.projectId, { meetingId: meeting.id }); return meeting; }

