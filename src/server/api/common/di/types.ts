import {MySql2Database} from "drizzle-orm/mysql2"
import {IDoctorRepository} from "../../routes/doctors/repositories/doctor.repository"
import {IDoctorService} from "../../routes/doctors/services/doctors.service"
import {IPatientReferralRepository} from "../../routes/patients/repository/patient-referral.repository"
import {IPatientRepository} from "../../routes/patients/repository/patient.repository"
import {IPatientService} from "../../routes/patients/services/patients.service"
import {IUserRepository} from "../../routes/users/repositories/user.repository"
import {IUserService} from "../../routes/users/services/users.service"
import {IAuthService} from "../../routes/auth/services/auth.service"
import {IPatientReferralService} from "../../routes/patients/services/patient-referral.service"
import {IAppointmentRepository} from "../../routes/appointments/repositories/appointment.repository"

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
  IAuthService: IAuthService
}

