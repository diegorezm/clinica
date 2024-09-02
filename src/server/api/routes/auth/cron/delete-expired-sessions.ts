import db from "@/db";
import { sessionTable } from "@/db/schema";
import { sql } from "drizzle-orm";

export const deleteExpiredSessions = async () => {
  const results = await db
    .delete(sessionTable)
    .where(
      sql`${sessionTable.expiresAt} < ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}`,
    );
  return Number(results[0].affectedRows);
};
