import pg from "pg";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { config } from "../../config/env.mjs";

const { Pool } = pg;
export const pool = new Pool({ connectionString: config.databaseUrl, max: 10, idleTimeoutMillis: 30_000 });

export async function migrate() {
  const currentFile = fileURLToPath(import.meta.url);
  const schemaPath = resolve(dirname(currentFile), "../../../sql/001_initial_schema.sql");
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);
}

export async function databaseHealth() {
  const result = await pool.query("select now() as now");
  return { connected: true, now: result.rows[0].now };
}
