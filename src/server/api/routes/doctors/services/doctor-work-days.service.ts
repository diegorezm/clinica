import db from "@/db";
import { doctorWorkDaysTable } from "@/db/schema";
import { DoctorWorkDay, WeekDay } from "@/models/Doctor/work-days";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

class DoctorWorkDayService {
  async get(doctorId: number): Promise<WeekDay[]> {
    const response = await db
      .select()
      .from(doctorWorkDaysTable)
      .where(eq(doctorWorkDaysTable.doctorId, doctorId));
    const weekDays = response.map((e) => {
      return e.day;
    });
    return weekDays;
  }

  async create(payload: DoctorWorkDay) {
    const periods = await this.get(payload.doctorId);
    if (periods.length >= 7) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Este médico já está atribuído a todos os dias disponíveis de trabalho.",
      });
    }
    await db.insert(doctorWorkDaysTable).values(payload);
  }

  async delete(payload: DoctorWorkDay) {
    await db
      .delete(doctorWorkDaysTable)
      .where(
        and(
          eq(doctorWorkDaysTable.doctorId, payload.doctorId),
          eq(doctorWorkDaysTable.day, payload.day),
        ),
      );
  }
}
const doctorWorkDayService = new DoctorWorkDayService();
export default doctorWorkDayService;
