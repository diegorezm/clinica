import {PatientReferral, PatientReferralDTO} from "@/models/Patient/patient-referral"
import {PaginatedResponse} from "@/server/api/common/types"
import {type IPatientReferralRepository, ReferralPaginatedRequestProps} from "../repository/patient-referral.repository"
import {handleError} from "@/server/api/common/utils/handle-error"
import {TRPCError} from "@trpc/server"
import {inject, injectable} from "inversify"
import {DI_SYMBOLS} from "@/server/api/common/di/types"
import {type MySql2Database} from "drizzle-orm/mysql2"

export interface IPatientReferralService {
  findAll(props: ReferralPaginatedRequestProps): Promise<PaginatedResponse<PatientReferral>>
  findByID(id: number): Promise<PatientReferral>
  create(payload: PatientReferralDTO): Promise<void>
  update(payload: Omit<PatientReferralDTO, "patientId">, id: number): Promise<void>
  delete(id: number): Promise<void>
  bulkDelete(ids: number[]): Promise<void>
}

@injectable()
export default class PatientReferralService implements IPatientReferralService {
  constructor(
    @inject(DI_SYMBOLS.IPatientReferralRepository) private readonly repository: IPatientReferralRepository,
    @inject(DI_SYMBOLS.MySql2Database) private readonly db: MySql2Database
  ) {}
  async findAll(props: ReferralPaginatedRequestProps): Promise<PaginatedResponse<PatientReferral>> {
    try {
      const response = await this.repository.findAll(props);
      return response;
    } catch (error) {
      throw handleError(error)
    }
  }

  async findByID(id: number): Promise<PatientReferral> {
    try {
      const patient = await this.repository.findByID(id);
      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Paciente não encontrado.",
        });
      }
      return patient;
    } catch (error) {
      throw handleError(error)
    }
  }

  async create(payload: PatientReferralDTO): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.create(payload, tx);
      })
    } catch (error) {
      throw handleError(error)
    }
  }

  async update(payload: Omit<PatientReferralDTO, "patientId">, id: number): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.update(payload, id, tx);
      })
    } catch (error) {
      throw handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.delete(id, tx);
      })
    } catch (error) {
      throw handleError(error)
    }
  }

  async bulkDelete(ids: number[]): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.bulkDelete(ids, tx);
      })
    } catch (error) {
      throw handleError(error)
    }
  }
}
