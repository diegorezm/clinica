import db from "@/db";
import { usersTable } from "@/db/schema";
import { UserDTO } from "@/models/User";
import lower from "@/utils/lower";
import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

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
    if (!data) {
      throw new HTTPException(404, { message: "Usuário não encontrado." });
    }
    return data;
  }

  async create(payload: UserDTO) {
    const [response] = await db.insert(usersTable).values(payload);
    const userId = response.insertId.toString();
    return await this.getById(userId);
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
const userService = new UserService()
export default userService;
