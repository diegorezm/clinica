import {usersTable} from "@/db/schema";
import {User, UserDTO} from "@/models/User";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import lower from "@/utils/lower";
import {eq, or, sql} from "drizzle-orm";
import {MySql2Database} from "drizzle-orm/mysql2";

export interface IUserRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<User>>;
  findByID(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(payload: UserDTO): Promise<void>;
  update(payload: UserDTO, userId: string): Promise<void>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
}

export default class UserRepository implements IUserRepository {
  constructor(private readonly db: MySql2Database) {}

  async findAll({q, page = 1, size = 10}: PaginatedRequestProps): Promise<PaginatedResponse<User>> {
    const offset = (page - 1) * size;
    const query = this.db.select().from(usersTable);
    if (q) {
      query.where(
        sql`${lower(usersTable.name)} LIKE ${`%${q.toLowerCase()}%`} OR ${lower(usersTable.email)} LIKE ${`%${q.toLowerCase()}%`}`,
      );
    }
    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);
    const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
    const data = await query
      .limit(size)
      .offset(offset)
      .orderBy(usersTable.id);
    const hasNextPage = page < numberOfPages;
    return {data, numberOfPages, hasNextPage};
  }

  async findByID(id: string): Promise<User | null> {
    const [data] = await this.db.select().from(usersTable).where(eq(usersTable.id, id));
    return data
  }

  async findByEmail(email: string): Promise<User | null> {
    const [data] = await this.db.select().from(usersTable).where(eq(usersTable.email, email));
    return data
  }

  async create(payload: UserDTO): Promise<void> {
    await this.db.insert(usersTable).values(payload);
  }

  async update(payload: UserDTO, userId: string): Promise<void> {
    await this.db
      .update(usersTable)
      .set(payload)
      .where(eq(usersTable.id, userId));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(usersTable).where(eq(usersTable.id, id));
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.db.delete(usersTable).where(or(...ids.map((id) => eq(usersTable.id, id))));
  }
}
