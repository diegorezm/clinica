import {Doctor, DoctorDTO} from "@/models/Doctor";
import {DoctorWorkDay, WeekDay} from "@/models/Doctor/work-days";
import {DoctorWorkPeriod, Period} from "@/models/Doctor/work-period";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import {TRPCError} from "@trpc/server";
import {type IDoctorRepository} from "../repositories/doctor.repository";
import {handleError} from "@/server/api/common/utils/handle-error";
import {inject, injectable} from "inversify";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {type MySql2Database} from "drizzle-orm/mysql2";

export interface IDoctorService {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Doctor>>; findById(id: string): Promise<Doctor>; findDoctorWorkDays(id: string): Promise<DoctorWorkDay[]>;
  findDoctorWorkPeriods(id: string): Promise<DoctorWorkPeriod[]>;
  create(doctor: DoctorDTO): Promise<void>;
  createDoctorWorkDays(payload: DoctorWorkDay[]): Promise<void>;
  createDoctorWorkPeriods(payload: DoctorWorkPeriod[]): Promise<void>;
  update(doctor: DoctorDTO, doctorID: string): Promise<void>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
  deleteDoctorWorkDays(doctorId: string, day: WeekDay): Promise<void>;
  deleteDoctorWorkPeriod(doctorId: string, period: Period): Promise<void>;
}

@injectable()
export default class DoctorService implements IDoctorService {
  constructor(
    @inject(DI_SYMBOLS.IDoctorRepository) private readonly repository: IDoctorRepository,
    @inject(DI_SYMBOLS.MySql2Database) private readonly db: MySql2Database) {}
  async findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Doctor>> {
    try {
      const doctors = await this.repository.findAll(props);
      return doctors;
    } catch (error) {
      throw handleError(error);
    }
  }
  async findById(id: string): Promise<Doctor> {
    try {
      const doctor = await this.repository.findById(id);
      if (!doctor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Médico não encontrado.",
        });
      }
      return doctor;
    } catch (error) {
      throw handleError(error);
    }
  }
  async findDoctorWorkDays(id: string): Promise<DoctorWorkDay[]> {
    try {
      const workDays = await this.repository.findDoctorWorkDays(id);
      if (!workDays) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não foi localizado nenhum dia de trabalho.",
        });
      }
      return workDays;
    } catch (error) {
      throw handleError(error);
    }
  }
  async findDoctorWorkPeriods(id: string): Promise<DoctorWorkPeriod[]> {
    try {
      const workPeriods = await this.repository.findDoctorWorkPeriods(id);
      if (!workPeriods) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não foi localizado nenhum horário de trabalho.",
        });
      }
      return workPeriods;
    } catch (error) {
      throw handleError(error);
    }
  }
  async create(doctor: DoctorDTO): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.create(doctor, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }

  async createDoctorWorkDays(payload: DoctorWorkDay[]): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.createDoctorWorkDays(payload, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }
  async createDoctorWorkPeriods(payload: DoctorWorkPeriod[]): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.createDoctorWorkPeriods(payload, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(doctor: DoctorDTO, doctorID: string): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.update(doctor, doctorID, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }
  async delete(id: string): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.delete(id, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.bulkDelete(ids, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }
  async deleteDoctorWorkDays(doctorId: string, day: WeekDay): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.deleteDoctorWorkDays(doctorId, day, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }
  async deleteDoctorWorkPeriod(doctorId: string, period: Period): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.deleteDoctorWorkPeriod(doctorId, period, tx);
      })
    } catch (error) {
      throw handleError(error);
    }
  }
}
