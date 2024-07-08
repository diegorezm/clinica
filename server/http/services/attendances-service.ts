import { eq, sql } from "drizzle-orm";
import db from "../../config/db";
import { attendancesSchema } from "../../config/db/schemas/attendances-schema";
import { Attendance, AttendanceDTO } from "../domain/Attendance";
import { AttendanceNotFoundException } from "../domain/Attendance/exceptions/attendence-not-found";

class AttendancesService {
  async getById(id: number): Promise<Attendance> {
    const [attendence] = await db
      .select()
      .from(attendancesSchema)
      .where(eq(attendancesSchema.id, id));
    if (!attendence) {
      throw new AttendanceNotFoundException();
    }
    return attendence;
  }
  async getByPatientId(patientId: number): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendancesSchema)
      .where(eq(attendancesSchema.patientId, patientId));
  }
  async getByDoctorId(doctorId: number) {
    return await db
      .select()
      .from(attendancesSchema)
      .where(eq(attendancesSchema.doctorId, doctorId));
  }
  async getByDoctorIdAndPatientId({
    patientId,
    doctorId,
  }: {
    patientId: number;
    doctorId: number;
  }) {
    return await db
      .select()
      .from(attendancesSchema)
      .where(
        sql`${attendancesSchema.doctorId} = ${doctorId} AND ${attendancesSchema.patientId} = ${patientId}`,
      );
  }
  async create(payload: AttendanceDTO): Promise<Attendance> {
    const [attendence] = await db
      .insert(attendancesSchema)
      .values(payload)
      .returning();
    return attendence;
  }
  async update() {}
  async updateStatus({
    id,
    status,
  }: {
    id: number;
    status: "f" | "fj" | "fm" | "ok";
  }) {
    let attendence = await this.getById(id);
    const attendences = await db
      .update(attendancesSchema)
      .set({ status: status })
      .where(eq(attendancesSchema.id, attendence.id))
      .returning();
    return attendences;
  }
  async delete(id: number) {
    let attendance = await this.getById(id);
    await db
      .delete(attendancesSchema)
      .where(eq(attendancesSchema.id, attendance.id));
  }
}
export default new AttendancesService();
