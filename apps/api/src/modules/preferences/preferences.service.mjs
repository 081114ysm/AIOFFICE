import { pool } from "../../infrastructure/database/postgres.mjs";
export async function updatePreferences(input) { const result = await pool.query("update preferences set overlay_enabled = $1, updated_at = now() where id = true returning overlay_enabled", [Boolean(input.overlayEnabled)]); return { overlayEnabled: result.rows[0].overlay_enabled }; }
