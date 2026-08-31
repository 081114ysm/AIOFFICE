import { githubClient } from "./github.client.mjs";

export async function githubController(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/github/user") return githubClient.getAuthenticatedUser();
  if (req.method === "GET" && url.pathname === "/api/github/repository") return githubClient.getRepository();
  if (req.method === "GET" && url.pathname === "/api/github/contents") return githubClient.getContents(url.searchParams.get("path") ?? "", url.searchParams.get("ref") ?? "");
  return false;
}
