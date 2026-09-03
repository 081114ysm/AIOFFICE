import { readBody } from "../../http/body.mjs";
import { completeMeeting, createMeeting } from "./meeting.service.mjs";
export async function meetingController(req, res, meetingId) { if (req.method !== "POST") return false; const body = await readBody(req); return meetingId ? completeMeeting(meetingId, body) : createMeeting(body); }
