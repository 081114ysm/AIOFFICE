import { getState } from "../infrastructure/database/state.repository.mjs";
import { healthController } from "../modules/health/health.controller.mjs";
import { projectController } from "../modules/projects/project.controller.mjs";
import { taskController } from "../modules/tasks/task.controller.mjs";
import { conversationController } from "../modules/conversations/conversation.controller.mjs";
import { meetingController } from "../modules/meetings/meeting.controller.mjs";
import { approvalController } from "../modules/approvals/approval.controller.mjs";
import { preferencesController } from "../modules/preferences/preferences.controller.mjs";
import { v2Controller } from "../modules/v2/v2.controller.mjs";
import { githubController } from "../modules/github/github.controller.mjs";
import { aiController } from "../modules/ai/ai.controller.mjs";

export async function route(req, res, url) {
  if (url.pathname.startsWith("/api/v2")) return v2Controller(req, res, url);
  if (url.pathname.startsWith("/api/github")) return githubController(req, res, url);
  if (url.pathname.startsWith("/api/ai")) return aiController(req, res, url);
  if (req.method === "GET" && url.pathname === "/health") return healthController(req, res);
  if (req.method === "GET" && url.pathname === "/api/state") return getState();
  if (url.pathname === "/api/projects") return projectController(req, res);
  const task = url.pathname.match(/^\/api\/tasks\/([^/]+)\/run$/); if (task) return taskController(req, res, task[1]);
  const conversation = url.pathname.match(/^\/api\/conversations\/([^/]+)\/messages$/); if (conversation) return conversationController(req, res, conversation[1]);
  if (url.pathname === "/api/meetings") return meetingController(req, res);
  if (url.pathname === "/api/preferences/overlay") return preferencesController(req, res);
  const approval = url.pathname.match(/^\/api\/approvals\/([^/]+)\/approve$/); if (approval) return approvalController(req, res, approval[1]);
  return false;
}
