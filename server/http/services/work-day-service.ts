import { eq, sql } from "drizzle-orm";
import db from "../../config/db";
import { workDaysSchema } from "../../config/db/schemas/work-day-schema";
import { WorkDay, WorkDayDTO } from "../domain/WorkDay";

class WorkDayService {
  async getDoctorWorkDays(doctorId: number): Promise<WorkDay[]> {
    return await db
      .select()
      .from(workDaysSchema)
      .where(eq(workDaysSchema.doctorId, doctorId));
  }
  async assignDayToDoctor(payload: WorkDayDTO): Promise<WorkDay> {
    const [workDay] = await db
      .insert(workDaysSchema)
      .values(payload)
      .returning();
    return workDay;
  }
  async removeWorkDayFromDoctor(payload: WorkDayDTO): Promise<void> {
    await db
      .delete(workDaysSchema)
      .where(
        sql`${workDaysSchema.doctorId} = ${payload.doctorId} AND ${workDaysSchema.day} = ${payload.day}`,
      )
      .execute();
  }
}
export default new WorkDayService();
