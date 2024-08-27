import { SQL, sql } from "drizzle-orm";
import { AnyMySqlColumn } from "drizzle-orm/mysql-core";

export default function lower(field: AnyMySqlColumn): SQL {
  return sql`lower(${field})`;
}
