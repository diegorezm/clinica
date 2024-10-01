import {UserDTO} from "@/models/User";
import {faker} from "@faker-js/faker";

export const usersFactory = (n: number, role?: "regular" | "doctor") => {
  const dtos: UserDTO[] = [];
  for (let i = 0; i < n; i++) {
    dtos.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: {
          min: 6,
          max: 128,
        },
      }),
      role: role ? "regular" : role,
    });
  }
  return dtos;
};
