import {MySql2Database} from "drizzle-orm/mysql2"
import {IDoctorRepository} from "../../infra/doctors/repositories/doctor.repository"
import {IDoctorService} from "../../infra/doctors/services/doctors.service"
import {IPatientReferralRepository} from "../../infra/patients/repository/patient-referral.repository"
import {IPatientRepository} from "../../infra/patients/repository/patient.repository"
import {IPatientService} from "../../infra/patients/services/patients.service"
import {IUserRepository} from "../../infra/users/repositories/user.repository"
import {IUserService} from "../../infra/users/services/users.service"
import {IAuthService} from "../../infra/auth/services/auth.service"
import {IPatientReferralService} from "../../infra/patients/services/patient-referral.service"
import {IAppointmentRepository} from "../../infra/appointments/repositories/appointment.repository"
import {IAppointmentService} from "../../infra/appointments/services/appointment.service"

export const DI_SYMBOLS = {
  //db
  MySql2Database: Symbol.for("MySql2Database"),

  // repositories
  IDoctorRepository: Symbol.for("IDoctorRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  IPatientRepository: Symbol.for("IPatientRepository"),
  IPatientReferralRepository: Symbol.for("IPatientReferralRepository"),
  IAppointmentRepository: Symbol.for("IAppointmentRepository"),

  //services
  IDoctorService: Symbol.for("IDoctorService"),
  IUserService: Symbol.for("IUserService"),
  IPatientService: Symbol.for("IPatientService"),
  IPatientReferralService: Symbol.for("IPatientReferralService"),
  IAppointmentService: Symbol.for("IAppointmentService"),
  IAuthService: Symbol.for("IAuthService"),
} as const

export interface DI_RETURN_TYPES {
  //db
  MySql2Database: MySql2Database

  //repositories
  IDoctorRepository: IDoctorRepository
  IUserRepository: IUserRepository
  IPatientRepository: IPatientRepository
  IPatientReferralRepository: IPatientReferralRepository
  IAppointmentRepository: IAppointmentRepository

  // services
  IDoctorService: IDoctorService
  IUserService: IUserService
  IPatientService: IPatientService
  IPatientReferralService: IPatientReferralService
  IAppointmentService: IAppointmentService
  IAuthService: IAuthService
}

