import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { meetingRepository } from "./meeting.repository.mjs";
export async function createMeeting(input) { const meeting = { id: createId(), projectId: input.projectId, title: input.title || "Agent 협업 회의", status: "IN_PROGRESS", createdAt: now() }; const saved = await meetingRepository.create(meeting); publish("MEETING_STARTED", meeting.projectId, { meetingId: meeting.id }); return saved; }
