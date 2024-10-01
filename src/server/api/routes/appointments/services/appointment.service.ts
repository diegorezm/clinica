import {Appointment, AppointmentDTO, AppointmentWithInfo, Status} from "@/models/Appointment";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import type {IAppointmentRepository} from "../repositories/appointment.repository";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {inject, injectable} from "inversify";
import {handleError} from "@/server/api/common/utils/handle-error";
import {TRPCError} from "@trpc/server";

export interface IAppointmentService {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  findByID(id: number): Promise<Appointment | null>;
  findByDoctorId(doctorId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  findByPatientId(patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  findByDoctorIdAndPatientId(doctorId: string, patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  findByDate(date: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  findByDateRange(startDate: Date, endDate: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>>;
  create(payload: AppointmentDTO): Promise<void>;
  createBulk(payloads: AppointmentDTO[]): Promise<void>;
  updateStatus(id: number, status: Status): Promise<void>;
  delete(id: number): Promise<void>;
  bulkDelete(ids: number[]): Promise<void>;
}

@injectable()
export default class AppointmentService implements IAppointmentService {
  constructor(@inject(DI_SYMBOLS.IAppointmentRepository) private readonly repository: IAppointmentRepository) {}

  async findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    try {
      const response = await this.repository.findAll(props);
      return response
    } catch (e) {
      throw handleError(e)
    }
  }

  async findByID(id: number): Promise<Appointment | null> {
    try {
      const response = await this.repository.findByID(id);
      if (!response) throw new TRPCError({
        code: "NOT_FOUND",
        message: "Nenhum registro encontrado."
      })
      return response
    } catch (e) {
      throw handleError(e)
    }
  }
  async findByDoctorId(doctorId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    try {
      const response = await this.repository.findByDoctorId(doctorId, props);
      return response
    } catch (e) {
      throw handleError(e)
    }
  }

  async findByPatientId(patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    try {
      const response = await this.repository.findByPatientId(patientId, props);
      return response
    } catch (e) {
      throw handleError(e)
    }
  }

  async findByDoctorIdAndPatientId(doctorId: string, patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    try {
      const response = await this.repository.findByDoctorIdAndPatientId(doctorId, patientId, props);
      return response
    } catch (e) {
      throw handleError(e)
    }
  }

  async findByDate(date: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    try {
      const response = await this.repository.findByDate(date, props);
      return response
    } catch (e) {
      throw handleError(e)
    }
  }

  async findByDateRange(startDate: Date, endDate: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<AppointmentWithInfo>> {
    try {
      const response = await this.repository.findByDateRange(startDate, endDate, props);
      return response
    } catch (e) {
      throw handleError(e)
    }
  }

  async create(payload: AppointmentDTO): Promise<void> {
    try {
      await this.repository.create(payload);
    } catch (error) {
      throw handleError(error)
    }
  }

  async createBulk(payloads: AppointmentDTO[]): Promise<void> {
    try {
      await this.repository.createBulk(payloads);
    } catch (error) {
      throw handleError(error)
    }
  }

  async updateStatus(id: number, status: Status): Promise<void> {
    try {
      await this.repository.updateStatus(id, status);
    } catch (error) {
      throw handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw handleError(error)
    }
  }

  async bulkDelete(ids: number[]): Promise<void> {
    try {
      await this.repository.bulkDelete(ids);
    } catch (error) {
      throw handleError(error)
    }
  }
}
