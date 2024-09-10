import { DoctorDTO } from "@/models/Doctor";
import { usersFactory } from "./users-factory";
import { faker } from "@faker-js/faker";
import doctorService from "@/server/api/routes/doctors/services/doctors.service";

export const doctorFactory = (n: number) => {
  const users = usersFactory(n, "doctor");
  const payload: DoctorDTO[] = [];
  users.forEach((e) => {
    payload.push({
      userId: e.id,
      crm: faker.string.alphanumeric({
        length: {
          min: 6,
          max: 12,
        },
      }),
      jobFunction: faker.person.jobType(),
    });
  });
  const doctors = doctorService.bulkInsert(payload);
  return doctors;
};
