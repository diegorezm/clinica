import {patientReferralsTable} from "@/db/schema";
import {inject, injectable} from 'inversify'
import {PatientReferral, PatientReferralDTO} from "@/models/Patient/patient-referral";
import {PaginatedResponse, PaginatedRequestProps} from "@/server/api/common/types";
import lower from "@/utils/lower";
import {and, eq, or, sql} from "drizzle-orm";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {DI_SYMBOLS} from "@/server/api/common/di/types";

export interface ReferralPaginatedRequestProps extends PaginatedRequestProps {
  patientId: string;
};

export interface IPatientReferralRepository {
  findAll(props: ReferralPaginatedRequestProps): Promise<PaginatedResponse<PatientReferral>>;
  findByID(id: number): Promise<PatientReferral | null>;
  create(payload: PatientReferralDTO): Promise<void>;
  update(payload: Omit<PatientReferralDTO, "patientId">, id: number): Promise<void>;
  delete(id: number): Promise<void>;
  bulkDelete(ids: number[]): Promise<void>;
}

@injectable()
export default class PatientReferralRepository implements IPatientReferralRepository {
  constructor(@inject(DI_SYMBOLS.MySql2Database) private readonly db: MySql2Database) {}

  async findAll({page = 1, size = 10, q, patientId}: ReferralPaginatedRequestProps): Promise<PaginatedResponse<PatientReferral>> {
    const offset = (page - 1) * size;
    const query = this.db.select().from(patientReferralsTable);
    if (q) {
      query.where(
        and(
          sql`${lower(patientReferralsTable.cid)} LIKE ${`%${q.toLowerCase()}%`} OR ${lower(patientReferralsTable.crm)} LIKE ${`%${q.toLowerCase()}%`}`,
          eq(patientReferralsTable.patientId, patientId),
        ),
      );
    } else {
      query.where(eq(patientReferralsTable.patientId, patientId));
    }

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);
    const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
    const data = await query
      .limit(size)
      .offset(offset)
      .orderBy(patientReferralsTable.id);
    const hasNextPage = page < numberOfPages;
    return {data, hasNextPage, numberOfPages};
  }

  async findByID(id: number): Promise<PatientReferral | null> {
    const [data] = await this.
      db.select().from(patientReferralsTable).where(eq(patientReferralsTable.id, id));
    return data
  }

  async create(payload: PatientReferralDTO): Promise<void> {
    await this.db
      .insert(patientReferralsTable)
      .values(payload)
  }

  async update(payload: Omit<PatientReferralDTO, "patientId">, id: number): Promise<void> {
    await this.db.update(patientReferralsTable)
      .set(payload)
      .where(eq(patientReferralsTable.id, id));
  }
  async delete(id: number): Promise<void> {
    await this.db.delete(patientReferralsTable).where(eq(patientReferralsTable.id, id));
  }
  async bulkDelete(ids: number[]): Promise<void> {
    await this.db.delete(patientReferralsTable).
      where(or(...ids.map(id => eq(patientReferralsTable.id, id))));
  }
}
