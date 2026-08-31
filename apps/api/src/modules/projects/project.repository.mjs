import { pool } from "../../infrastructure/database/postgres.mjs";
export const projectRepository = {
  findById: async (id) => (await pool.query("select id, name, description, status, created_at from projects where id = $1", [id])).rows[0],
  create: async (project) => (await pool.query("insert into projects (id, name, description, status, created_at, updated_at) values ($1, $2, $3, $4, $5, $5) returning id, name, description, status, created_at", [project.id, project.name, project.description, project.status, project.createdAt])).rows[0],
  save: async (project) => (await pool.query("update projects set name = $2, description = $3, status = $4, updated_at = now() where id = $1 returning id, name, description, status, updated_at", [project.id, project.name, project.description, project.status])).rows[0],
};
