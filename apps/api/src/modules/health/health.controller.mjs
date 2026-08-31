import { databaseHealth } from "../../infrastructure/database/postgres.mjs";

export async function healthController() {
  return { status: "ok", service: "ai-office-api", time: new Date().toISOString(), database: await databaseHealth() };
}
