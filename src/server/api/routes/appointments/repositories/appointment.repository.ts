import {Appointment, AppointmentDTO, Status} from "@/models/Appointment";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {inject, injectable} from "inversify";

export interface IAppointmentRepository {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>>;
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

  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    throw new Error("Method not implemented.");
  }
  findByID(id: number): Promise<Appointment | null> {
    throw new Error("Method not implemented.");
  }
  findByDoctorId(doctorId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    throw new Error("Method not implemented.");
  }
  findByPatientId(patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    throw new Error("Method not implemented.");
  }
  findByDoctorIdAndPatientId(doctorId: string, patientId: string, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    throw new Error("Method not implemented.");
  }
  findByDate(date: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    throw new Error("Method not implemented.");
  }
  findByDateRange(startDate: Date, endDate: Date, props: PaginatedRequestProps): Promise<PaginatedResponse<Appointment>> {
    throw new Error("Method not implemented.");
  }
  create(payload: AppointmentDTO): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createBulk(payloads: AppointmentDTO[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateStatus(id: number, status: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  bulkDelete(ids: number[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
