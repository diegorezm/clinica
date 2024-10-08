import {drizzle, MySql2PreparedQueryHKT, MySql2QueryResultHKT} from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER} from "@/env";
import {ExtractTablesWithRelations} from "drizzle-orm";
import {MySqlTransaction} from "drizzle-orm/mysql-core";

const conn = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

const db = drizzle(conn);
export type Transaction = MySqlTransaction<MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>>;
export default db;
