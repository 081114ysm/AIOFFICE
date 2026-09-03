import OpenAI from "openai";
import { config } from "../../config/env.mjs";
import { generateCodexResponse } from "./codex.client.mjs";

let client;
const calls = [];
function getClient() {
  if (!config.openaiApiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
  client ??= new OpenAI({ apiKey: config.openaiApiKey });
  return client;
}
function checkQuota() {
  const now = Date.now();
  while (calls[0] && calls[0] < now - 86_400_000) calls.shift();
  if (calls.length >= config.openaiDailyLimit) throw new Error("오늘의 AI 호출 한도를 초과했습니다.");
  if (calls.filter((time) => time >= now - 60_000).length >= config.openaiPerMinuteLimit) throw new Error("분당 AI 호출 한도를 초과했습니다.");
  calls.push(now);
}
export async function generateAgentResponse(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) throw new Error("prompt가 필요합니다.");
  if (prompt.length > 8_000) throw new Error("prompt는 8,000자 이내여야 합니다.");
  if (config.aiProvider === "codex_cli") return generateCodexResponse(prompt);
  checkQuota();
  const response = await getClient().responses.create({ model: config.openaiModel, instructions: "당신은 AI Office의 업무 에이전트입니다. 사실과 추측을 구분하고, 파일 변경이나 외부 작업이 필요하면 먼저 승인 요청을 반환하세요.", input: prompt, max_output_tokens: 2_000 });
  return { id: response.id, model: config.openaiModel, text: response.output_text };
}
