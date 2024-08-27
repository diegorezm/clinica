import { and, eq, ne, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import db from "@/db";
import { patientsTable } from "@/db/schema";
import { PatientDTO } from "@/models/Patient";
import lower from "@/utils/lower";

class PatientService {
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
    const query = db.select().from(patientsTable);
    if (q) {
      query.where(
        sql`${lower(patientsTable.name)} LIKE ${`%${q.toLowerCase()}%`} OR ${lower(patientsTable.rg)} LIKE ${`%${q.toLowerCase()}%`}`,
      );
    }
    const sizeOfTable = await db
      .select({ count: sql<number>`count(*)` })
      .from(query.as("filtered"))
      .limit(1);
    const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
    const data = await query
      .limit(size)
      .offset(offset)
      .orderBy(patientsTable.id);
    const hasNextPage = page < numberOfPages;
    return { data, numberOfPages, hasNextPage };
  }

  async getById(id: number) {
    const [data] = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, id));

    if (!data)
      throw new HTTPException(404, {
        message: "Paciente não encontrado.",
      });
    return data;
  }

  async create(payload: PatientDTO) {
    const [response] = await db.insert(patientsTable).values(payload);
    const data = await this.getById(response.insertId);
    return data;
  }

  async update(payload: PatientDTO, patientId: number) {
    if (payload.rg) {
      const existingPatient = await db
        .select()
        .from(patientsTable)
        .where(
          and(
            eq(patientsTable.rg, payload.rg),
            ne(patientsTable.id, patientId),
          ),
        )
        .limit(1);

      if (existingPatient.length > 0) {
        throw new HTTPException(409, {
          message: "RG já está em uso por outro paciente.",
        });
      }
    }
    const [response] = await db
      .update(patientsTable)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(patientsTable.id, patientId));

    if (response.affectedRows === 0) {
      throw new HTTPException(404, {
        message: "Paciente não encontrado.",
      });
    }
    const data = await this.getById(patientId);
    return data;
  }

  async delete(id: number) {
    await db.delete(patientsTable).where(eq(patientsTable.id, id));
  }

  async bulkDelete(ids: number[]) {
    ids.map((e) => this.delete(e));
  }
}
const patientService = new PatientService();

export default patientService;
