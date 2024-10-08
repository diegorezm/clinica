import {Transaction} from "@/db";
import {patientsTable} from "@/db/schema";
import {Patient, PatientDTO} from "@/models/Patient";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {PaginatedResponse, PaginatedRequestProps} from "@/server/api/common/types";
import lower from "@/utils/lower";
import {eq, or, sql} from "drizzle-orm";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {inject, injectable} from "inversify";

export interface IPatientRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Patient>>;
  findByID(id: string): Promise<Patient | null>;
  create(payload: PatientDTO, tx: Transaction): Promise<void>;
  update(payload: PatientDTO, patientId: string, tx: Transaction): Promise<void>;
  delete(id: string, tx: Transaction): Promise<void>;
  bulkDelete(ids: string[], tx: Transaction): Promise<void>;
}

@injectable()
export default class PatientRepository implements IPatientRepository {
  constructor(@inject(DI_SYMBOLS.MySql2Database) readonly db: MySql2Database) {}

  async findAll({q, page = 1, size = 10}: PaginatedRequestProps): Promise<PaginatedResponse<Patient>> {
    const offset = (page - 1) * size;
    const query = this.db.select().from(patientsTable);
    if (q) {
      query.where(
        sql`${lower(patientsTable.name)} LIKE ${`%${q.toLowerCase()}%`} OR ${lower(patientsTable.rg)} LIKE ${`%${q.toLowerCase()}%`}`,
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
      .orderBy(patientsTable.id);
    const hasNextPage = page < numberOfPages;
    return {data, numberOfPages, hasNextPage};
  }

  async findByID(id: string): Promise<Patient | null> {
    const [data] = await this.db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, id));
    return data;
  }

  async create(payload: PatientDTO, tx: Transaction): Promise<void> {
    await tx.insert(patientsTable).values(payload);
  }

  async update(payload: PatientDTO, patientId: string, tx: Transaction): Promise<void> {
    await tx
      .update(patientsTable)
      .set(payload)
      .where(eq(patientsTable.id, patientId));
  }

  async delete(id: string, tx: Transaction): Promise<void> {
    await tx
      .delete(patientsTable)
      .where(eq(patientsTable.id, id));
  }

  async bulkDelete(ids: string[], tx: Transaction): Promise<void> {
    await tx
      .delete(patientsTable)
      .where(or(...ids.map((id) => eq(patientsTable.id, id))));
  }
}
