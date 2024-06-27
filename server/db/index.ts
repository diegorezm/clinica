import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require("postgres");

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("No database set.");
}

const client = postgres(DB_URL);
const db = drizzle(client);

export default db;
