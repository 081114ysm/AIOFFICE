import { readBody } from "../../http/body.mjs";
import { deliverAgentMessage, rememberAgent, recallAgent } from "./agent-collaboration.service.mjs";

export async function agentCollaborationController(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/agents/messages") return deliverAgentMessage(await readBody(req));
  if (req.method === "POST" && url.pathname === "/api/agents/memories") return rememberAgent(await readBody(req));
  if (req.method === "GET" && url.pathname === "/api/agents/memories") return recallAgent({ projectId: url.searchParams.get("projectId"), agentId: url.searchParams.get("agentId"), query: url.searchParams.get("query") });
  return false;
}
