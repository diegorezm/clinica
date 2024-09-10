import { PatientDTO } from "@/models/Patient";
import patientService from "@/server/api/routes/patients/services/patients.service";
import { faker } from "@faker-js/faker";

type PatientFactory = (n: number) => PatientDTO[];
export const patientFactory: PatientFactory = (n) => {
  const payload: PatientDTO[] = [];
  for (let index = 0; index < n; index++) {
    payload.push({
      name: faker.person.firstName(),
      phone: faker.phone.number(),
      rg: faker.string.alphanumeric({ length: 12 }),
      insurance: faker.person.jobType(),
      insuranceNumber: String(faker.number.float()),
    });
  }
  const patients = patientService.bulkInsert(payload);
  return patients;
};
