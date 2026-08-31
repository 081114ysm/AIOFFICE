import { readBody } from "../../http/body.mjs";
import { addMessage } from "./conversation.service.mjs";
export async function conversationController(req, res, conversationId) { if (req.method !== "POST") return false; return addMessage(conversationId, await readBody(req)); }

