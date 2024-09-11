import db from "@/db";
import { doctorWorkPeriodTable } from "@/db/schema";
import { DoctorWorkPeriod, Period } from "@/models/Doctor/work-period";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

class DoctorWorkPeriodService {
  async get(doctorId: number): Promise<Period[]> {
    const response = await db
      .select()
      .from(doctorWorkPeriodTable)
      .where(eq(doctorWorkPeriodTable.doctorId, doctorId));
    const periods: Period[] = response.map((e) => {
      return e.period;
    });
    return periods;
  }

  async create(payload: DoctorWorkPeriod) {
    const periods = await this.get(payload.doctorId);
    if (periods.length >= 3) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Este médico já está atribuído a todos os períodos disponíveis de trabalho.",
      });
    }
    await db.insert(doctorWorkPeriodTable).values(payload);
  }

  async delete(payload: DoctorWorkPeriod) {
    await db
      .delete(doctorWorkPeriodTable)
      .where(
        and(
          eq(doctorWorkPeriodTable.doctorId, payload.doctorId),
          eq(doctorWorkPeriodTable.period, payload.period),
        ),
      );
  }
}
const doctorWorkDayService = new DoctorWorkPeriodService();
export default doctorWorkDayService;
