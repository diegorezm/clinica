import { describe, expect, test, afterAll } from "bun:test";
import db from "../../config/db";
import { usersSchema } from "../../config/db/schemas/user-schema";
import { UserDTO } from "../../http/domain/User";
import userService from "../../http/services/user-service";
import { UserWithRole } from "../../http/domain/User/user-role";
import { UserAlreadyExistsException } from "../../http/domain/User/exceptions/user-already-exists";
import { UserNotFoundException } from "../../http/domain/User/exceptions/user-not-found";
import { createUserDTO } from "../helpers";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing user service", () => {
  // Clean up database after all tests
  afterAll(async () => {
    await db.delete(usersSchema).execute(); // Clean users table
  });

  test.if(DEV_ENV)("Register a user and delete", async () => {
    const userData: UserDTO = createUserDTO(); // Use helper function to create user data

    const user = await userService.register(userData);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  test.if(DEV_ENV)("Test user already exists exception", async () => {
    const userData: UserDTO = createUserDTO();
    const userData2: UserDTO = createUserDTO(); // Creating a duplicate email intentionally

    try {
      await userService.register(userData);
      await userService.register(userData2);
    } catch (error: any) {
      expect(error).toBeInstanceOf(UserAlreadyExistsException);
    }
  });

  test.if(DEV_ENV)("Get user by ID", async () => {
    const userData: UserDTO = createUserDTO();

    const newUser = await userService.register(userData);
    const fetchedUser = await userService.getById(newUser.id);

    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.id).toBe(newUser.id);
    expect(fetchedUser.name).toBe(newUser.name);
    expect(fetchedUser.email).toBe(newUser.email);
  });

  test.if(DEV_ENV)("Get users with roles", async () => {
    const usersWithRoles: UserWithRole[] =
      await userService.getUsersWithRoles();

    expect(usersWithRoles).toBeDefined();
    expect(usersWithRoles.length).toBeGreaterThan(0);

    usersWithRoles.forEach((user) => {
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.role).toBeNull();
    });
  });

  test.if(DEV_ENV)("Remove user", async () => {
    const userData: UserDTO = createUserDTO();

    const newUser = await userService.register(userData);
    await userService.remove(newUser.id);

    // Attempt to fetch the user to ensure it's deleted
    let deletedUser;
    try {
      deletedUser = await userService.getById(newUser.id);
    } catch (error: any) {
      expect(error).toBeInstanceOf(UserNotFoundException);
    }
    expect(deletedUser).toBeUndefined();
  });
});
