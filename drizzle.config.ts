import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schemas/*",
  out: "./drizzle",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: process.env.DB_HOST,
    url: process.env.DB_URL,
  },
});
