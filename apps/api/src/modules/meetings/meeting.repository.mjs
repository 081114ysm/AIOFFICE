import { pool } from "../../infrastructure/database/postgres.mjs";
export const meetingRepository = { create: async (meeting) => (await pool.query("insert into meetings (id, project_id, title, status, created_at) values ($1, $2, $3, $4, $5) returning id, project_id, title, status, created_at", [meeting.id, meeting.projectId, meeting.title, meeting.status, meeting.createdAt])).rows[0] };
