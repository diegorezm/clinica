import db from "@/db";
import { eq, or, sql } from "drizzle-orm";
import {
  appointmentsTable,
  doctorsTable,
  patientsTable,
  usersTable,
} from "@/db/schema";

import lower from "@/utils/lower";

import { AppointmentDTO } from "@/models/Appointment";
import { TRPCError } from "@trpc/server";

class AppointmentService {
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

    const query = db
      .select()
      .from(appointmentsTable)
      .limit(size)
      .offset(offset)
      .innerJoin(
        patientsTable,
        eq(patientsTable.id, appointmentsTable.patientId),
      )
      .innerJoin(doctorsTable, eq(doctorsTable.id, appointmentsTable.doctorId))
      .innerJoin(usersTable, eq(usersTable.id, doctorsTable.userId));
    if (q) {
      query.where(
        or(
          sql`${lower(patientsTable.name)} LIKE ${`%${q.toLowerCase()}%`} OR ${lower(usersTable.name)} LIKE ${`%${q.toLowerCase()}%`}`,
        ),
      );
    }

    const sizeOfTable = await db
      .select({ count: sql<number>`count(*)` })
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / size);
    const data = await query;
    const hasNextPage = page < numberOfPages;
    return { data, numberOfPages, hasNextPage };
  }

  async getById(id: number) {
    const [data] = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, id));

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Agendamento não encontrado.",
      });
    }
    return data;
  }

  async create(payload: AppointmentDTO) {
    const [response] = await db.insert(appointmentsTable).values(payload);
    const entity = await this.getById(response.insertId);
    return entity;
  }

  async update(payload: AppointmentDTO, appointmentId: number) {
    const [response] = await db
      .update(appointmentsTable)
      .set(payload)
      .where(eq(appointmentsTable.id, appointmentId));
    if (response.fieldCount === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Agendamento não encontrado.",
      });
    }

    const entity = await this.getById(appointmentId);
    return entity;
  }

  async delete(id: number) {
    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));
  }

  async bulkDelete(ids: number[]) {
    ids.map((e) => this.delete(e));
  }
}
const appointmentService = new AppointmentService();
export default appointmentService;
