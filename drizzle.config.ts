import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.DB_URL!;
const TEST_DB_URL = process.env.TEST_DB_URL!;
const NODE_ENV = process.env.NODE_ENV || "dev";
const CONN_STR = NODE_ENV === "dev" ? TEST_DB_URL : DB_URL;

export default defineConfig({
  schema: "./server/db/schemas/*",
  out: "./drizzle",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: process.env.DB_HOST,
    url: CONN_STR,
  },
});
