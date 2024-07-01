import { faker } from "@faker-js/faker";
import { UserDTO } from "../../http/domain/User";
import { DoctorDTO } from "../../http/domain/Doctor";
import { WeekDays, WorkDayDTO } from "../../http/domain/WorkDay";
import { RoleDTO } from "../../http/domain/Role";
import { PatientDTO } from "../../http/domain/Patient";
import { ReferralDTO } from "../../http/domain/Patient/referrals";
import { AttendanceDTO } from "../../http/domain/Attendance";
import { attendancesSchema } from "../../config/db/schemas/attendances-schema";

export function createUserDTO(): UserDTO {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

export function createDoctorDTO(userId: string): DoctorDTO {
  return {
    userId: userId,
    crm: faker.string.alphanumeric(6),
    jobFunction: faker.person.jobType(),
  };
}

export function createWorkDayDTO(doctorId: number): WorkDayDTO {
  return {
    doctorId: doctorId,
    day: faker.helpers.enumValue(WeekDays),
  };
}

export function createRoleDTO(): RoleDTO {
  return {
    name: faker.string.alpha(6),
    permissions: ["read", "write", "delete"], // Adjust permissions as needed
  };
}

export function createPatientDTO(): PatientDTO {
  return {
    name: faker.person.firstName(),
    phone: faker.string.alphanumeric(9),
    rg: faker.string.alphanumeric({ length: { min: 8, max: 9 } }),
    insurance: faker.company.name(),
    insuranceNumber: faker.string.alphanumeric(8),
  };
}

export function createReferralDTO(patientId: number): ReferralDTO {
  return {
    cid: faker.string.alphanumeric(8),
    crm: faker.string.alphanumeric(8),
    patientId: patientId,
    jobFunction: faker.person.jobType(),
  };
}
export function createAttendanceDTO(
  doctorId: number,
  patientId: number,
): AttendanceDTO {
  return {
    doctorId: doctorId,
    patientId: patientId,
    appointmentDate: faker.date.soon(),
    status: faker.helpers.arrayElement(attendancesSchema.status.enumValues),
  };
}
