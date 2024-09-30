import {patientsTable} from "@/db/schema";
import {Patient, PatientDTO} from "@/models/Patient";
import {PaginatedResponse, PaginatedRequestProps} from "@/server/api/common/types";
import lower from "@/utils/lower";
import {eq, or, sql} from "drizzle-orm";
import {MySql2Database} from "drizzle-orm/mysql2";

export interface IPatientRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Patient>>;
  findByID(id: string): Promise<Patient | null>;
  create(payload: PatientDTO): Promise<void>;
  update(payload: PatientDTO, patientId: string): Promise<void>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
}

export default class PatientRepository implements IPatientRepository {
  constructor(private readonly db: MySql2Database) {}

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

  async create(payload: PatientDTO): Promise<void> {
    await this.db.insert(patientsTable).values(payload);
  }

  async update(payload: PatientDTO, patientId: string): Promise<void> {
    await this.db
      .update(patientsTable)
      .set(payload)
      .where(eq(patientsTable.id, patientId));
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(patientsTable)
      .where(eq(patientsTable.id, id));
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.db
      .delete(patientsTable)
      .where(or(...ids.map((id) => eq(patientsTable.id, id))));
  }
}
