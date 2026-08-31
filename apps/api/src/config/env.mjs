export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  githubToken: process.env.GITHUB_TOKEN ?? "",
  githubApiUrl: process.env.GITHUB_API_URL ?? "https://api.github.com",
  githubRepository: process.env.GITHUB_REPOSITORY ?? "081114ysm/AIOFFICE",
  databaseUrl: process.env.DATABASE_URL ?? "",
};
