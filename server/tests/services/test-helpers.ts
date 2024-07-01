import { faker } from "@faker-js/faker";
import { UserDTO } from "../../http/domain/User";
import { DoctorDTO } from "../../http/domain/Doctor";
import { WeekDays, WorkDayDTO } from "../../http/domain/WorkDay";
import { RoleDTO } from "../../http/domain/Role";
import { PatientDTO } from "../../http/domain/Patient";

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
    name: faker.company.name(),
    permissions: ["read", "write", "delete"], // Adjust permissions as needed
  };
}

export function createPatientDTO(): PatientDTO {
  return {
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    rg: faker.string.alphanumeric(10),
    insurance: faker.company.name(),
    insuranceNumber: faker.string.alphanumeric(10),
  };
}
