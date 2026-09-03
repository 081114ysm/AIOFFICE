import { createHash, randomBytes, randomUUID } from "node:crypto";
import { pool } from "../../infrastructure/database/postgres.mjs";
import { config } from "../../config/env.mjs";

const pendingStates = new Map();
const hash = (value) => createHash("sha256").update(value).digest("hex");
export function githubLoginUrl() {
  if (!config.githubClientId) throw new Error("GITHUB_CLIENT_ID가 설정되지 않았습니다.");
  const state = randomBytes(24).toString("hex");
  pendingStates.set(state, Date.now() + 10 * 60_000);
  const params = new URLSearchParams({ client_id: config.githubClientId, redirect_uri: config.authCallbackUrl, state, scope: "read:user user:email" });
  return { url: `https://github.com/login/oauth/authorize?${params}` };
}
export async function githubCallback(code, state) {
  if (!code || !state || pendingStates.get(state) < Date.now()) throw new Error("OAuth state가 유효하지 않습니다.");
  pendingStates.delete(state);
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ client_id: config.githubClientId, client_secret: config.githubClientSecret, code, redirect_uri: config.authCallbackUrl }) });
  const token = await tokenResponse.json();
  if (!token.access_token) throw new Error(token.error_description ?? "GitHub OAuth 토큰 발급에 실패했습니다.");
  const userResponse = await fetch("https://api.github.com/user", { headers: { accept: "application/vnd.github+json", authorization: `Bearer ${token.access_token}` } });
  const githubUser = await userResponse.json();
  if (!userResponse.ok) throw new Error("GitHub 사용자 정보를 가져오지 못했습니다.");
  const user = (await pool.query("insert into users (id, github_id, login, display_name) values ($1, $2, $3, $4) on conflict (github_id) do update set login = excluded.login, display_name = excluded.display_name, updated_at = now() returning id, login, display_name, role", [randomUUID(), String(githubUser.id), githubUser.login, githubUser.name ?? githubUser.login])).rows[0];
  const sessionToken = randomBytes(32).toString("hex");
  await pool.query("insert into sessions (id, user_id, token_hash, expires_at) values ($1, $2, $3, now() + ($4 || ' days')::interval)", [randomUUID(), user.id, hash(sessionToken), config.authSessionDays]);
  return { user, setCookie: `ai_office_session=${sessionToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${config.authSessionDays * 86400}`, redirect: `${config.webOrigin}/?auth=success` };
}
export async function currentUser(req) {
  const token = (req.headers.cookie ?? "").split(";").map((item) => item.trim()).find((item) => item.startsWith("ai_office_session="))?.split("=")[1];
  if (!token) return null;
  return (await pool.query("select u.id, u.login, u.display_name, u.role from sessions s join users u on u.id = s.user_id where s.token_hash = $1 and s.expires_at > now()", [hash(token)])).rows[0] ?? null;
}
export async function logout(req) {
  const token = (req.headers.cookie ?? "").split(";").map((item) => item.trim()).find((item) => item.startsWith("ai_office_session="))?.split("=")[1];
  if (token) await pool.query("delete from sessions where token_hash = $1", [hash(token)]);
  return { setCookie: "ai_office_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0" };
}
