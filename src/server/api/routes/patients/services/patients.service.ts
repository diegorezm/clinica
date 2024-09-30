import {Patient, PatientDTO} from "@/models/Patient";
import {PaginatedResponse, PaginatedRequestProps} from "@/server/api/common/types";
import {TRPCError} from "@trpc/server";
import {type IPatientRepository} from "../repository/patient.repository";
import {handleError} from "@/server/api/common/utils/handle-error";
import {inject, injectable} from "inversify";
import {DI_SYMBOLS} from "@/server/api/common/di/types";

export interface IPatientService {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Patient>>;
  findByID(id: string): Promise<Patient>;
  create(payload: PatientDTO): Promise<void>;
  update(payload: PatientDTO, patientId: string): Promise<void>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
}

@injectable()
export default class PatientService implements IPatientService {
  constructor(@inject(DI_SYMBOLS.IPatientRepository) private readonly repository: IPatientRepository) {}

  async findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<Patient>> {
    try {
      const patients = await this.repository.findAll(props);
      return patients;
    } catch (error) {
      throw handleError(error);
    }
  }
  async findByID(id: string): Promise<Patient> {
    try {
      const patient = await this.repository.findByID(id);
      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Paciente não encontrado.",
        });
      }
      return patient;
    }
    catch (error) {
      throw handleError(error);
    }
  }

  async create(payload: PatientDTO): Promise<void> {
    try {
      await this.repository.create(payload);
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(payload: PatientDTO, patientId: string): Promise<void> {
    try {
      await this.repository.update(payload, patientId);
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
}
