import { describe, expect, test, afterAll } from "bun:test";
import db from "../../config/db";
import { usersSchema } from "../../config/db/schemas/user-schema";
import { UserDTO } from "../../http/domain/User";
import userService from "../../http/services/user-service";
import { UserWithRole } from "../../http/domain/User/user-role";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing user service", () => {
  // Clean up database after all tests
  afterAll(async () => {
    await db.delete(usersSchema).execute(); // Clean users table
  });

  test.if(DEV_ENV)("Register a user and delete", async () => {
    const userData: UserDTO = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const user = await userService.register(userData);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  test.if(DEV_ENV)("Get user by ID", async () => {
    const userData: UserDTO = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password456",
    };

    const newUser = await userService.register(userData);
    const fetchedUser = await userService.getById(newUser.id);

    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.id).toBe(newUser.id);
    expect(fetchedUser.name).toBe(newUser.name);
    expect(fetchedUser.email).toBe(newUser.email);
  });

  test.if(DEV_ENV)("Get users with roles", async () => {
    // Assuming some setup for users with roles in the database
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

  test.if(DEV_ENV)("Get user with roles by ID", async () => {
    const userData: UserDTO = {
      name: "RoleWIthID",
      email: "roelid@example.com",
      password: "password123",
    };

    const user = await userService.register(userData);

    const userWithRoles: UserWithRole = await userService.getUserWithRole(
      user.id,
    );

    expect(userWithRoles).toBeDefined();
    expect(userWithRoles.id).toBe(user.id);
    expect(userWithRoles.name).toBeDefined();
    expect(userWithRoles.email).toBeDefined();
    expect(userWithRoles.role).toBeNull();
  });

  test.if(DEV_ENV)("Update user", async () => {
    const userData: UserDTO = {
      name: "Updated Name",
      email: "updated.email@example.com",
      password: "",
    };

    const newUser = await userService.register({
      name: "Original Name",
      email: "original.email@example.com",
      password: "password789",
    });

    const updatedUser = await userService.update(newUser.id, userData);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.id).toBe(newUser.id);
    expect(updatedUser.name).toBe(userData.name);
    expect(updatedUser.email).toBe(userData.email);
  });

  test.if(DEV_ENV)("Remove user", async () => {
    const userData: UserDTO = {
      name: "ToDelete User",
      email: "todelete.user@example.com",
      password: "password999",
    };

    const newUser = await userService.register(userData);
    await userService.remove(newUser.id);

    // Attempt to fetch the user to ensure it's deleted
    let deletedUser;
    try {
      deletedUser = await userService.getById(newUser.id);
    } catch (error: any) {
      expect(error.message).toBeDefined();
    }
    expect(deletedUser).toBeUndefined();
  });
});
