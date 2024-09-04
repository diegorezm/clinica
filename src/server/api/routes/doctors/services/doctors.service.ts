import db from "@/db";
import lower from "@/utils/lower";
import { eq, sql } from "drizzle-orm";

import { doctorsTable, usersTable } from "@/db/schema";

import { DoctorDTO } from "@/models/Doctor";
import { TRPCError } from "@trpc/server";

class DoctorService {
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

    const query = db
      .select({
        user: usersTable,
        doctor: doctorsTable,
      })
      .from(doctorsTable)
      .limit(size)
      .offset(offset)
      .innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id));
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

  async getById(id: number) {
    const [data] = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, id));

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Doutor não encontrado.",
      });
    }
    return data;
  }

  async create(payload: DoctorDTO) {
    const [response] = await db.insert(doctorsTable).values(payload);
    const data = await this.getById(response.insertId);
    return data;
  }

  async update(payload: DoctorDTO, doctorId: number) {
    const [response] = await db
      .update(doctorsTable)
      .set(payload)
      .where(eq(doctorsTable.id, doctorId));
    if (response.affectedRows === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Registro não encontrado.",
      });
    }
    const data = await this.getById(doctorId);
    return data;
  }

  async delete(id: number) {
    await db.delete(doctorsTable).where(eq(doctorsTable.id, id));
  }

  async bulkDelete(ids: number[]) {
    const deletedPromises = ids.map((e) => this.delete(e));
    await Promise.all(deletedPromises);
    return deletedPromises.length;
  }
}
const doctorService = new DoctorService();
export default doctorService;
