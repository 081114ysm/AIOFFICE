import { readBody } from "../../http/body.mjs";
import { addMessage } from "./conversation.service.mjs";
import { conversationRepository } from "./conversation.repository.mjs";
export async function conversationController(req, res, conversationId) { if (req.method === "GET") return conversationRepository.details(conversationId); if (req.method === "POST" && req.url?.endsWith("/resume")) return conversationRepository.resume(conversationId, "기존 작업 Context를 복원하고 작업을 재개했습니다."); if (req.method === "POST") return addMessage(conversationId, await readBody(req)); return false; }
