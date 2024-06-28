import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require("postgres");

const DB_URL = process.env.DB_URL;
const TEST_DB_URL = process.env.TEST_DB_URL;
const NODE_ENV = process.env.NODE_ENV || "dev";

if (!DB_URL && !TEST_DB_URL) {
  throw new Error("No database set.");
}

let conn_string = NODE_ENV === "production" ? DB_URL : TEST_DB_URL;

if (!conn_string) {
  throw new Error(
    "No valid connection string set for the current environment.",
  );
}

const client = postgres(conn_string);
const db = drizzle(client);

export default db;
