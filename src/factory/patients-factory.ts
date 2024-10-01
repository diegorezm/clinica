import {PatientDTO} from "@/models/Patient";
import {faker} from "@faker-js/faker";

type PatientFactory = (n: number) => PatientDTO[];
export const patientFactory: PatientFactory = (n) => {
  const dtos: PatientDTO[] = [];
  for (let index = 0; index < n; index++) {
    dtos.push({
      name: faker.person.firstName(),
      phone: faker.phone.number(),
      rg: faker.string.alphanumeric({length: 12}),
      insurance: faker.person.jobType(),
      insuranceNumber: String(faker.number.float()),
    });
  }
  return dtos;
};
