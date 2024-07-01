import { eq } from "drizzle-orm";
import db from "../../config/db";
import { referralsSchema } from "../../config/db/schemas/referrals-schema";
import { Referral, ReferralDTO } from "../domain/Patient/referrals";
import { ReferralNotFoundException } from "../domain/Patient/exceptions/referral-not-found";

class ReferralService {
  async getById(id: string): Promise<Referral> {
    const [referral] = await db
      .select()
      .from(referralsSchema)
      .where(eq(referralsSchema.id, id))
      .limit(1);
    if (!referral) {
      throw new ReferralNotFoundException();
    }
    return referral;
  }
  async getByPatient(patientId: number): Promise<Referral[]> {
    return await db
      .select()
      .from(referralsSchema)
      .where(eq(referralsSchema.patientId, patientId));
  }
  async getByCid(cid: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referralsSchema)
      .where(eq(referralsSchema.cid, cid));
  }
  async getByCrm(crm: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referralsSchema)
      .where(eq(referralsSchema.crm, crm));
  }
  async create(payload: ReferralDTO): Promise<Referral> {
    const [referral] = await db
      .insert(referralsSchema)
      .values(payload)
      .returning();
    return referral;
  }
  async update() {}
  async delete(id: string) {
    const referral = await this.getById(id);
    await db.delete(referralsSchema).where(eq(referralsSchema.id, referral.id));
  }
}
export default new ReferralService();
