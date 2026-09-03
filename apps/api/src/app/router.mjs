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
import { authController } from "../modules/auth/auth.controller.mjs";
import { qaController } from "../modules/qa/qa.controller.mjs";
import { requireRole } from "../modules/auth/authorization.mjs";
import { agentCollaborationController } from "../modules/agents/agent-collaboration.controller.mjs";
import { workspaceController } from "../modules/workspace/workspace.controller.mjs";

export async function route(req, res, url) {
  if (url.pathname.startsWith("/api/v2")) { await requireRole(req, ["CEO", "PM", "DEVELOPER"]); return v2Controller(req, res, url); }
  if (url.pathname.startsWith("/api/github")) { await requireRole(req, ["CEO", "PM", "DEVELOPER", "QA"]); return githubController(req, res, url); }
  if (url.pathname.startsWith("/api/ai")) { await requireRole(req, ["CEO", "PM", "DEVELOPER", "RESEARCH", "QA"]); return aiController(req, res, url); }
  if (url.pathname.startsWith("/api/agents")) { await requireRole(req, ["CEO", "PM", "DEVELOPER", "RESEARCH", "QA"]); return agentCollaborationController(req, res, url); }
  if (url.pathname.startsWith("/api/auth")) return authController(req, res, url);
  if (url.pathname.startsWith("/api/workspace")) { await requireRole(req, ["CEO"]); return workspaceController(req, res, url); }
  if (req.method === "GET" && url.pathname === "/health") return healthController(req, res);
  if (req.method === "GET" && url.pathname === "/api/state") { await requireRole(req, ["CEO", "PM", "DEVELOPER", "RESEARCH", "QA"]); return getState(); }
  if (url.pathname === "/api/projects") { await requireRole(req, ["CEO", "PM"]); return projectController(req, res); }
  const task = url.pathname.match(/^\/api\/tasks\/([^/]+)\/run$/); if (task) { await requireRole(req, ["CEO", "PM", "DEVELOPER"]); return taskController(req, res, task[1]); }
  const qa = url.pathname.match(/^\/api\/tasks\/([^/]+)\/qa$/); if (qa) { await requireRole(req, ["CEO", "QA"]); return qaController(req, res, qa[1]); }
  const resume = url.pathname.match(/^\/api\/conversations\/([^/]+)\/resume$/); if (resume) { await requireRole(req, ["CEO", "PM"]); return conversationController(req, res, resume[1]); }
  const conversation = url.pathname.match(/^\/api\/conversations\/([^/]+)(?:\/messages)?$/); if (conversation) { await requireRole(req, ["CEO", "PM", "DEVELOPER", "RESEARCH"]); return conversationController(req, res, conversation[1]); }
  const meeting = url.pathname.match(/^\/api\/meetings(?:\/([^/]+)\/complete)?$/); if (meeting) { await requireRole(req, ["CEO", "PM"]); return meetingController(req, res, meeting[1]); }
  if (url.pathname === "/api/preferences/overlay") { await requireRole(req, ["CEO"]); return preferencesController(req, res); }
  const approval = url.pathname.match(/^\/api\/approvals\/([^/]+)\/approve$/); if (approval) { await requireRole(req, ["CEO"]); return approvalController(req, res, approval[1]); }
  return false;
}
