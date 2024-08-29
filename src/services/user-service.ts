import db from "@/db";
import { usersTable } from "@/db/schema";
import { UserDTO } from "@/models/User";
import lower from "@/utils/lower";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

class UserService {
  async getAll({
    q,
    page = 1,
    size = 10,
  }: {
    q?: string;
    page?: number;
    size?: number;
  }) {
    const offset = (page - 1) * size;

    const query = db.select().from(usersTable).limit(size).offset(offset);
    if (q) {
      query.where(
        sql`${lower(usersTable.name)} LIKE ${`%${q.toLowerCase()}%`}`,
      );
    }

    const sizeOfTable = await db
      .select({ count: sql<number>`count(*)` })
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
    const data = await query;
    const hasNextPage = page < numberOfPages;
    return { data, numberOfPages, hasNextPage };
  }

  async getById(id: string) {
    const [data] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return data;
  }

  async getByEmail(email: string) {
    const [data] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return data;
  }

  async update(payload: UserDTO, id: string) {
    await db.update(usersTable).set(payload).where(eq(usersTable.id, id));
    return await this.getById(id);
  }

  async delete(id: string) {
    await db.delete(usersTable).where(eq(usersTable.id, id));
  }

  async bulkDelete(ids: string[]) {
    ids.map(async (e) => await this.delete(e));
  }
}
const userService = new UserService();
export default userService;
