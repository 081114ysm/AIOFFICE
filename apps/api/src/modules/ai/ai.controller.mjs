import { readBody } from "../../http/body.mjs";
import { generateAgentResponse } from "./openai.client.mjs";
export async function aiController(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/ai/respond") return generateAgentResponse((await readBody(req)).prompt);
  return false;
}
