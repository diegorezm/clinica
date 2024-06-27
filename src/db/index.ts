import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("No database set.");
}

const sql = neon(DB_URL);
const db = drizzle(sql);

export default db;
