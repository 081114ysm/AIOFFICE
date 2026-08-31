import { readBody } from "../../http/body.mjs";
import { updatePreferences } from "./preferences.service.mjs";
export async function preferencesController(req, res) { if (req.method !== "POST") return false; return updatePreferences(await readBody(req)); }
