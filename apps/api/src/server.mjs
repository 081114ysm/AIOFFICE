import { createServer } from "node:http";
import { config } from "./config/env.mjs";
import { cors, json } from "./http/response.mjs";
import { route } from "./app/router.mjs";
import { migrate, pool } from "./infrastructure/database/postgres.mjs";

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return cors(res, config.webOrigin);
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  try {
    const result = await route(req, res, url);
    if (result !== false) return json(res, 200, result, config.webOrigin);
    return json(res, 404, { message: "Not found" }, config.webOrigin);
  } catch (error) { return json(res, 400, { message: error instanceof Error ? error.message : "Bad request" }, config.webOrigin); }
});

async function start() {
  if (!config.databaseUrl) throw new Error("DATABASE_URL이 설정되지 않았습니다.");
  await migrate();
  server.listen(config.port, "127.0.0.1", () => console.log(`AI Office API listening on http://localhost:${config.port}`));
}

start().catch(async (error) => {
  console.error("AI Office API startup failed:", error);
  await pool.end();
  process.exitCode = 1;
});
