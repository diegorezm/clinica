import {Transaction} from "@/db";
import {doctorsTable, doctorWorkDaysTable, doctorWorkPeriodTable, usersTable} from "@/db/schema";
import {Doctor, DoctorDTO} from "@/models/Doctor";
import {DoctorWorkDay, WeekDay} from "@/models/Doctor/work-days";
import {DoctorWorkPeriod, Period} from "@/models/Doctor/work-period";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {PaginatedResponse, PaginatedRequestProps} from "@/server/api/common/types";
import {handleError} from "@/server/api/common/utils/handle-error";
import lower from "@/utils/lower";
import {and, eq, or, sql} from "drizzle-orm";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {inject, injectable} from "inversify";

export interface IDoctorRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Doctor>>;
  findById(id: string): Promise<Doctor | null>;
  findDoctorWorkDays(id: string): Promise<DoctorWorkDay[]>;
  findDoctorWorkPeriods(id: string): Promise<DoctorWorkPeriod[]>;
  create(doctor: DoctorDTO, tx: Transaction): Promise<void>;
  createDoctorWorkDays(payload: DoctorWorkDay[], tx: Transaction): Promise<void>;
  createDoctorWorkPeriods(payload: DoctorWorkPeriod[], tx: Transaction): Promise<void>;
  update(doctor: DoctorDTO, doctorID: string, tx: Transaction): Promise<void>;
  delete(id: string, tx: Transaction): Promise<void>;
  bulkDelete(ids: string[], tx: Transaction): Promise<void>;
  deleteDoctorWorkDays(doctorId: string, day: WeekDay, tx: Transaction): Promise<void>;
  deleteDoctorWorkPeriod(doctorId: string, period: Period, tx: Transaction): Promise<void>;
}

@injectable()
export default class DoctorRepository implements IDoctorRepository {
  constructor(@inject(DI_SYMBOLS.MySql2Database) private readonly db: MySql2Database) {}

  async findAll({q, size, page}: PaginatedRequestProps): Promise<PaginatedResponse<Doctor>> {
    try {
      const offset = (page - 1) * size;

      const query = this.db
        .select({
          id: doctorsTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
          jobFunction: doctorsTable.jobFunction,
          crm: doctorsTable.crm,
          createdAt: doctorsTable.createdAt,
          updatedAt: doctorsTable.updatedAt,
          userId: sql`users.id as userId`,
        })
        .from(doctorsTable)
        .limit(size)
        .offset(offset)
        .innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id));

      if (q !== undefined && q.length > 0) {
        query.where(
          sql`${lower(usersTable.name)} LIKE ${`%${q.toLowerCase()}%`}`,
        );
      }

      const sizeOfTable = await this.db
        .select({count: sql<number>`count(*)`})
        .from(query.as("filtered"))
        .limit(1);

      const numberOfPages = Math.ceil(sizeOfTable[0].count / size);

      const rawData = await query;
      const doctors: Doctor[] = [];
      for (const e of rawData) {
        const [dWorkDays, dPeriods] = await Promise.all([
          this.findDoctorWorkDays(e.id),
          this.findDoctorWorkPeriods(e.id)
        ]);
        const workDays = dWorkDays.map((day) => day.day);
        const periods = dPeriods.map((period) => period.period);

        const doctor: Doctor = {
          ...e,
          userId: e.userId as string,
          workDays,
          periods
        }
        doctors.push(doctor)
      }
      const hasNextPage = page < numberOfPages;
      return {data: doctors, numberOfPages, hasNextPage};
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: string): Promise<Doctor | null> {
    const [data] = await this.db.select({
      id: doctorsTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      jobFunction: doctorsTable.jobFunction,
      crm: doctorsTable.crm,
      createdAt: doctorsTable.createdAt,
      updatedAt: doctorsTable.updatedAt,
      userId: usersTable.id,
    }).from(doctorsTable).where(eq(doctorsTable.id, id))
      .innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id));

    const [dWorkDays, dPeriods] = await Promise.all([
      this.findDoctorWorkDays(data.id),
      this.findDoctorWorkPeriods(data.id)
    ]);
    const workDays = dWorkDays.map((day) => day.day);
    const periods = dPeriods.map((period) => period.period);
    const doctor: Doctor = {
      ...data,
      workDays,
      periods,
    }
    return doctor;
  }

  async findDoctorWorkPeriods(doctorId: string): Promise<DoctorWorkPeriod[]> {
    const data = await this.db.select().from(doctorWorkPeriodTable).where(eq(doctorWorkPeriodTable.doctorId, doctorId));
    if (!data) return []
    return data
  }

  async findDoctorWorkDays(doctorId: string): Promise<DoctorWorkDay[]> {
    const data = await this.db.select().from(doctorWorkDaysTable).where(eq(doctorWorkDaysTable.doctorId, doctorId));
    if (!data) return []
    return data
  }


  async create(doctor: DoctorDTO, tx: Transaction): Promise<void> {
    await tx.insert(doctorsTable).values(doctor);
  }

  async createDoctorWorkPeriods(periods: DoctorWorkPeriod[], tx: Transaction): Promise<void> {
    await tx.insert(doctorWorkPeriodTable).values(periods);
  }

  async createDoctorWorkDays(days: DoctorWorkDay[], tx: Transaction): Promise<void> {
    await tx.insert(doctorWorkDaysTable).values(days);
  }

  async update(doctor: DoctorDTO, doctorID: string, tx: Transaction): Promise<void> {
    await tx.update(doctorsTable).set(doctor).where(eq(doctorsTable.id, doctorID));
  }

  async delete(id: string, tx: Transaction): Promise<void> {
    await tx
      .delete(doctorsTable)
      .where(eq(doctorsTable.id, id));
  }

  async bulkDelete(ids: string[], tx: Transaction): Promise<void> {
    await tx
      .delete(doctorsTable)
      .where(or(...ids.map((id) => eq(doctorsTable.id, id))));
  }

  async deleteDoctorWorkDays(doctorId: string, day: WeekDay, tx: Transaction): Promise<void> {
    await tx
      .delete(doctorWorkDaysTable)
      .where(and(eq(doctorWorkDaysTable.day, day), eq(doctorWorkDaysTable.doctorId, doctorId)));
  }

  async deleteDoctorWorkPeriod(doctorId: string, period: Period, tx: Transaction): Promise<void> {
    await tx
      .delete(doctorWorkPeriodTable)
      .where(and(eq(doctorWorkPeriodTable.period, period), eq(doctorWorkPeriodTable.doctorId, doctorId)));
  }
}
