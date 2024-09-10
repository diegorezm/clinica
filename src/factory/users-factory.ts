import { UserDTO } from "@/models/User";
import userService from "@/server/api/routes/users/services/users.service";
import { faker } from "@faker-js/faker";

export const usersFactory = (n: number, role?: "regular" | "doctor") => {
  const payload: UserDTO[] = [];
  for (let i = 0; i < n; i++) {
    payload.push({
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
  const users = userService.bulkInsert(payload);
  return users;
};
