import {Doctor, DoctorDTO} from "@/models/Doctor";
import {DoctorWorkDay, WeekDay} from "@/models/Doctor/work-days";
import {DoctorWorkPeriod, Period} from "@/models/Doctor/work-period";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import {TRPCError} from "@trpc/server";
import {IDoctorRepository} from "../repositories/doctor.repository";
import {handleError} from "@/server/api/common/utils/handle-error";

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

export default class DoctorService implements IDoctorService {
  constructor(private readonly repository: IDoctorRepository) {}
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
      await this.repository.create(doctor);
    } catch (error) {
      throw handleError(error);
    }
  }

  async createDoctorWorkDays(payload: DoctorWorkDay[]): Promise<void> {
    try {
      await this.repository.createDoctorWorkDays(payload);
    } catch (error) {
      throw handleError(error);
    }
  }
  async createDoctorWorkPeriods(payload: DoctorWorkPeriod[]): Promise<void> {
    try {
      await this.repository.createDoctorWorkPeriods(payload);
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(doctor: DoctorDTO, doctorID: string): Promise<void> {
    try {
      await this.repository.update(doctor, doctorID);
    } catch (error) {
      throw handleError(error);
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw handleError(error);
    }
  }
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await this.repository.bulkDelete(ids);
    } catch (error) {
      throw handleError(error);
    }
  }
  async deleteDoctorWorkDays(doctorId: string, day: WeekDay): Promise<void> {
    try {
      await this.repository.deleteDoctorWorkDays(doctorId, day);
    } catch (error) {
      throw handleError(error);
    }
  }
  async deleteDoctorWorkPeriod(doctorId: string, period: Period): Promise<void> {
    try {
      await this.repository.deleteDoctorWorkPeriod(doctorId, period);
    } catch (error) {
      throw handleError(error);
    }
  }
}
