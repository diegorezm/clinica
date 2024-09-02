import { defineConfig } from "drizzle-kit";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } from "./src/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  out: "./drizzle",
  dbCredentials: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD,
  },
  verbose: true,
  strict: true,
});
