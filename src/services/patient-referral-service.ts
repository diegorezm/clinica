import { and, eq, sql } from "drizzle-orm";
import db from "@/db";
import { patientReferralsTable } from "../db/schema";
import lower from "@/utils/lower";
import { PatientReferralDTO } from "@/models/Patient/patient-referral";
import { HTTPException } from "hono/http-exception";

class PatientReferralService {
  async getAll({
    q,
    page = 1,
    size = 10,
    patientId,
  }: {
    q?: string;
    page?: number;
    size?: number;
    patientId: number;
  }) {
    const offset = (page - 1) * size;
    const query = db.select().from(patientReferralsTable);
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

    const sizeOfTable = await db
      .select({ count: sql<number>`count(*)` })
      .from(query.as("filtered"))
      .limit(1);
    const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
    const data = await query
      .limit(size)
      .offset(offset)
      .orderBy(patientReferralsTable.id);
    const hasNextPage = page < numberOfPages;
    return { data, hasNextPage, numberOfPages };
  }

  async getById(id: number) {
    const [data] = await db
      .select()
      .from(patientReferralsTable)
      .where(eq(patientReferralsTable.id, id));
    return data;
  }

  async create(payload: PatientReferralDTO) {
    const [response] = await db.insert(patientReferralsTable).values(payload);
    const data = await this.getById(response.insertId);
    return data;
  }

  async update(payload: PatientReferralDTO, id: number) {
    const [response] = await db
      .update(patientReferralsTable)
      .set(payload)
      .where(eq(patientReferralsTable.id, id));
    if (response.fieldCount === 0) {
      throw new HTTPException(404);
    }
    const data = await this.getById(id);
    return data;
  }

  async delete(id: number) {
    await db
      .delete(patientReferralsTable)
      .where(eq(patientReferralsTable.id, id));
  }

  async bulkDelete(ids: number[]) {
    const deletePromises = ids.map((id) => this.delete(id));
    await Promise.all(deletePromises);
    return ids.length;
  }
}
const patientReferralService = new PatientReferralService();
export default patientReferralService;
