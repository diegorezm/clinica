import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const DB_URL = process.env.DB_URL;
const TEST_DB_URL = process.env.TEST_DB_URL;
const NODE_ENV = process.env.NODE_ENV || "dev";

if (!DB_URL && !TEST_DB_URL) {
  throw new Error("No database set.");
}

let conn_string = NODE_ENV === "production" ? DB_URL : TEST_DB_URL;

if (conn_string === undefined) {
  throw new Error(
    "No valid connection string set for the current environment.",
  );
}

// const client = postgres(conn_string);
const client = new Client({
  connectionString: conn_string,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
  } catch (err: any) {
    console.error("Error connecting to PostgreSQL database:", err.message);
    throw err;
  }
}
connectDB();
const db = drizzle(client);

export default db;
