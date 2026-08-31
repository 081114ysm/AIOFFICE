import { readBody } from "../../http/body.mjs";
import { createMeeting } from "./meeting.service.mjs";
export async function meetingController(req, res) { if (req.method !== "POST") return false; return createMeeting(await readBody(req)); }

