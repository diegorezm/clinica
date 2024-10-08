import {Transaction} from "@/db";
import {usersTable} from "@/db/schema";
import {User, UserDTO} from "@/models/User";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import lower from "@/utils/lower";
import {eq, or, sql} from "drizzle-orm";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {inject, injectable} from "inversify";

export interface IUserRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<User>>;
  findByID(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(payload: UserDTO, tx: Transaction): Promise<void>;
  bulkCreate(payload: UserDTO[], tx: Transaction): Promise<void>;
  update(payload: UserDTO, userId: string, tx: Transaction): Promise<void>;
  delete(id: string, tx: Transaction): Promise<void>;
  bulkDelete(ids: string[], tx: Transaction): Promise<void>;
}

@injectable()
export default class UserRepository implements IUserRepository {
  constructor(@inject(DI_SYMBOLS.MySql2Database) private readonly db: MySql2Database) {}

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
      .limit(1); const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
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

  async create(payload: UserDTO, tx: Transaction): Promise<void> {
    await tx.insert(usersTable).values(payload);
  }

  async bulkCreate(payload: UserDTO[], tx: Transaction): Promise<void> {
    await tx.insert(usersTable).values(payload);
  }

  async update(payload: UserDTO, userId: string, tx: Transaction): Promise<void> {
    await tx
      .update(usersTable)
      .set(payload)
      .where(eq(usersTable.id, userId));
  }

  async delete(id: string, tx: Transaction): Promise<void> {
    await tx.delete(usersTable).where(eq(usersTable.id, id));
  }

  async bulkDelete(ids: string[], tx: Transaction): Promise<void> {
    await tx.delete(usersTable).where(or(...ids.map((id) => eq(usersTable.id, id))));
  }
}
