import { githubCallback, githubLoginUrl, currentUser, logout } from "./auth.service.mjs";
export async function authController(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/auth/github") return githubLoginUrl();
  if (req.method === "GET" && url.pathname === "/api/auth/callback/github") return githubCallback(url.searchParams.get("code"), url.searchParams.get("state"));
  if (req.method === "GET" && url.pathname === "/api/auth/me") return { user: await currentUser(req) };
  if (req.method === "POST" && url.pathname === "/api/auth/logout") return logout(req);
  return false;
}
