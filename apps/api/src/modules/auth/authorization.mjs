import { currentUser } from "./auth.service.mjs";

export async function requireRole(req, roles = ["CEO"]) {
  const user = await currentUser(req);
  if (!user) throw Object.assign(new Error("로그인이 필요합니다."), { statusCode: 401 });
  if (!roles.includes(user.role)) throw Object.assign(new Error("이 작업을 수행할 권한이 없습니다."), { statusCode: 403 });
  return user;
}
