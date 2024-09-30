import {appointmentsTable, doctorsTable, patientsTable, usersTable} from "@/db/schema";
import {Appointment, AppointmentDTO, AppointmentWithInfo, Status} from "@/models/Appointment";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import lower from "@/utils/lower";
import {and, between, DrizzleError, eq, or, sql} from "drizzle-orm";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {inject, injectable} from "inversify";

export interface IAppointmentRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  findByID(id: number): Promise<Appointment | null>;
  findByDoctorId(doctorId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>>;
  findByPatientId(patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>>;
  findByDoctorIdAndPatientId(doctorId: string, patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>>;
  findByDate(date: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>>;
  findByDateRange(startDate: Date, endDate: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>>;
  create(payload: AppointmentDTO): Promise<void>;
  createBulk(payloads: AppointmentDTO[]): Promise<void>;
  updateStatus(id: number, status: Status): Promise<void>;
  delete(id: number): Promise<void>;
  bulkDelete(ids: number[]): Promise<void>;
}

@injectable()
export default class AppointmentRepository implements IAppointmentRepository {
  constructor(@inject(DI_SYMBOLS.MySql2Database) readonly db: MySql2Database) {}

  private withInfoQuery(q?: string) {
    const query = this.db
      .select({
        id: appointmentsTable.id,
        status: appointmentsTable.status,
        appointmentDate: appointmentsTable.appointmentDate,
        patientId: patientsTable.id,
        doctorId: doctorsTable.id,
        patientName: patientsTable.name,
        patientRg: patientsTable.rg,
        doctorName: usersTable.name,
        doctorFn: doctorsTable.jobFunction,
        createdAt: appointmentsTable.createdAt,
        updatedAt: appointmentsTable.updatedAt,
      })
      .from(appointmentsTable)
      .leftJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .leftJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .leftJoin(usersTable, eq(usersTable.id, doctorsTable.userId))
      .orderBy(appointmentsTable.id);

    if (q) {
      const queries = [
        sql`${lower(doctorsTable.jobFunction)} LIKE ${`%${q.toLowerCase()}%`}`,
        sql`${lower(patientsTable.name)} LIKE ${`%${q.toLowerCase()}%`}`,
        sql`${lower(patientsTable.rg)} LIKE ${`%${q.toLowerCase()}%`}`,
        sql`${lower(usersTable.name)} LIKE ${`%${q.toLowerCase()}%`}`,
      ] as const

      query.where(or(...queries));
    }

    return query
  }

  async findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    const query = this.withInfoQuery(props.q);
    const offset = (props.page - 1) * props.size;

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / props.size);

    const hasNextPage = props.page < numberOfPages;
    const results = await query.limit(props.size).offset(offset);
    const data: AppointmentWithInfo[] = []

    for (const result of results) {
      if (result.doctorId === null || result.patientId === null) {
        throw new DrizzleError({message: "Patient or doctor not found"})
      }
      data.push({
        ...result,
        doctorId: result.doctorId as string,
        patientId: result.patientId as string
      })
    }
    return {data, numberOfPages, hasNextPage};
  }

  async findByID(id: number): Promise<Appointment | null> {
    const [data] = await this.db
      .select().from(appointmentsTable).where(eq(appointmentsTable.id, id));
    return data
  }

  async findByDoctorId(doctorId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    const query = this.withInfoQuery(props.q).where(eq(appointmentsTable.doctorId, doctorId));

    const offset = (props.page - 1) * props.size;

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / props.size);

    const hasNextPage = props.page < numberOfPages;
    const results = await query.limit(props.size).offset(offset);
    const data: AppointmentWithInfo[] = []

    for (const result of results) {
      if (result.doctorId === null || result.patientId === null) {
        throw new DrizzleError({message: "Patient or doctor not found"})
      }
      data.push({
        ...result,
        doctorId: result.doctorId as string,
        patientId: result.patientId as string
      })
    }
    return {data, numberOfPages, hasNextPage};
  }

  async findByPatientId(patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    const query = this.withInfoQuery(props.q).where(eq(appointmentsTable.patientId, patientId));

    const offset = (props.page - 1) * props.size;

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / props.size);

    const hasNextPage = props.page < numberOfPages;
    const results = await query.limit(props.size).offset(offset);
    const data: AppointmentWithInfo[] = []

    for (const result of results) {
      if (result.doctorId === null || result.patientId === null) {
        throw new DrizzleError({message: "Patient or doctor not found"})
      }
      data.push({
        ...result,
        doctorId: result.doctorId as string,
        patientId: result.patientId as string
      })
    }
    return {data, numberOfPages, hasNextPage};
  }

  async findByDoctorIdAndPatientId(doctorId: string, patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    const query = this.withInfoQuery(props.q)
      .where(and(eq(appointmentsTable.doctorId, doctorId), eq(appointmentsTable.patientId, patientId)));

    const offset = (props.page - 1) * props.size;

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / props.size);

    const hasNextPage = props.page < numberOfPages;
    const results = await query.limit(props.size).offset(offset);
    const data: AppointmentWithInfo[] = []

    for (const result of results) {
      if (result.doctorId === null || result.patientId === null) {
        throw new DrizzleError({message: "Patient or doctor not found"})
      }
      data.push({
        ...result,
        doctorId: result.doctorId as string,
        patientId: result.patientId as string
      })
    }
    return {data, numberOfPages, hasNextPage};

  }

  async findByDate(date: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    const query = this.withInfoQuery(props.q).where(eq(appointmentsTable.appointmentDate, date));
    const offset = (props.page - 1) * props.size;

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / props.size);

    const hasNextPage = props.page < numberOfPages;
    const results = await query.limit(props.size).offset(offset);
    const data: AppointmentWithInfo[] = []

    for (const result of results) {
      if (result.doctorId === null || result.patientId === null) {
        throw new DrizzleError({message: "Patient or doctor not found"})
      }
      data.push({
        ...result,
        doctorId: result.doctorId as string,
        patientId: result.patientId as string
      })
    }
    return {data, numberOfPages, hasNextPage};
  }

  async findByDateRange(startDate: Date, endDate: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    const query = this.withInfoQuery(props.q);
    query.where(between(appointmentsTable.appointmentDate, startDate, endDate));
    const offset = (props.page - 1) * props.size;

    const sizeOfTable = await this.db
      .select({count: sql<number>`count(*)`})
      .from(query.as("filtered"))
      .limit(1);

    const numberOfPages = Math.ceil(sizeOfTable[0].count / props.size);

    const hasNextPage = props.page < numberOfPages;
    const results = await query.limit(props.size).offset(offset);
    const data: AppointmentWithInfo[] = []

    for (const result of results) {
      if (result.doctorId === null || result.patientId === null) {
        throw new DrizzleError({message: "Patient or doctor not found"})
      }
      data.push({
        ...result,
        doctorId: result.doctorId as string,
        patientId: result.patientId as string
      })
    }
    return {data, numberOfPages, hasNextPage};
  }

  async create(payload: AppointmentDTO): Promise<void> {
    await this.db
      .insert(appointmentsTable)
      .values(payload);
  }

  async createBulk(payloads: AppointmentDTO[]): Promise<void> {
    await this.db
      .insert(appointmentsTable)
      .values(payloads);
  }

  async updateStatus(id: number, status: Status): Promise<void> {
    await this.db.update(appointmentsTable).set({status}).where(eq(appointmentsTable.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await this.db.delete(appointmentsTable).where(or(...ids.map((id) => eq(appointmentsTable.id, id))));
  }

}
