import { config } from "../../config/env.mjs";

const headers = { accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" };
const [owner, repo] = config.githubRepository.split("/");

async function request(path) {
  if (!config.githubToken) throw new Error("GITHUB_TOKEN이 설정되지 않았습니다.");
  const response = await fetch(`${config.githubApiUrl}${path}`, { headers: { ...headers, authorization: `Bearer ${config.githubToken}` } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? `GitHub API 요청 실패 (${response.status})`);
  return payload;
}

async function writeRequest(path, method, body) {
  if (!config.githubToken) throw new Error("GITHUB_TOKEN이 설정되지 않았습니다.");
  const response = await fetch(`${config.githubApiUrl}${path}`, { method, headers: { ...headers, authorization: `Bearer ${config.githubToken}`, "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? `GitHub API 요청 실패 (${response.status})`);
  return payload;
}

export const githubClient = {
  getAuthenticatedUser: () => request("/user"),
  getRepository: () => request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`),
  getContents: (path = "", ref = "") => {
    const suffix = path ? `/${path.split("/").map(encodeURIComponent).join("/")}` : "";
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    return request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${suffix}${query}`);
  },
  upsertContent: async ({ path, content, message, branch, sha }) => writeRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`, "PUT", { message, content: Buffer.from(content, "utf8").toString("base64"), branch, ...(sha ? { sha } : {}) }),
  createPullRequest: ({ title, body, head, base = "main" }) => writeRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls`, "POST", { title, body, head, base }),
};
