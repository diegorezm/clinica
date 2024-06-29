import { describe, expect, test, afterAll } from "bun:test";
import db from "../../config/db";
import {
  usersSchema,
  userRolesSchema,
} from "../../config/db/schemas/user-schema";
import userService from "../../http/services/user-service";
import userRoleService from "../../http/services/user-role-service";
import { UserRole, UserWithRole } from "../../http/domain/User/user-role";
import rolesService from "../../http/services/roles-service";
import { eq } from "drizzle-orm";
import { UserDTO } from "../../http/domain/User";
import { rolesSchema } from "../../config/db/schemas/roles-schema";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing user role service", () => {
  afterAll(async () => {
    await db.delete(userRolesSchema).execute();
    await db.delete(usersSchema).execute();
    await db.delete(rolesSchema).execute();
  });

  test.if(DEV_ENV)("Get user with roles by ID", async () => {
    const userData: UserDTO = {
      name: "RoleWIthID",
      email: "roelid@example.com",
      password: "password123",
    };

    const user = await userService.register(userData);

    const roleData = {
      name: "Admin",
      permissions: ["read", "write"],
    };

    const role = await rolesService.create(roleData);
    await userRoleService.assingToUser(user.id, role.id);

    const userWithRoles: UserWithRole = await userService.getUserWithRole(
      user.id,
    );

    expect(userWithRoles).toBeDefined();
    expect(userWithRoles.id).toBe(user.id);
    expect(userWithRoles.name).toBeDefined();
    expect(userWithRoles.email).toBeDefined();
    expect(userWithRoles.role).toBeDefined();
  });

  test.if(DEV_ENV)("Assign role to user", async () => {
    // Create a user
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    const user = await userService.register(userData);

    // Create a role
    const roleData = {
      name: "Admin",
      permissions: ["read", "write"],
    };
    const role = await rolesService.create(roleData);

    // Assign the role to the user
    const userRole: UserRole = await userRoleService.assingToUser(
      user.id,
      role.id,
    );

    // Verify the assigned user role
    expect(userRole).toBeDefined();
    expect(userRole.userId).toBe(user.id);
    expect(userRole.roleId).toBe(role.id);
  });

  test.if(DEV_ENV)("Assign and fetch user roles", async () => {
    // Create a user
    const userData = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password456",
    };
    const user = await userService.register(userData);

    // Create multiple roles
    const roleData1 = {
      name: "Manager",
      permissions: ["read"],
    };
    const roleData2 = {
      name: "Editor",
      permissions: ["write"],
    };
    const role1 = await rolesService.create(roleData1);
    const role2 = await rolesService.create(roleData2);

    // Assign roles to the user
    await userRoleService.assingToUser(user.id, role1.id);
    await userRoleService.assingToUser(user.id, role2.id);

    // Fetch user roles
    const userRoles: UserRole[] = await db
      .select()
      .from(userRolesSchema)
      .where(eq(userRolesSchema.userId, user.id));

    // Verify the fetched user roles
    expect(userRoles).toBeDefined();
    expect(userRoles.length).toBe(2);

    // Check if the assigned roles match
    const roleIds = userRoles.map((ur) => ur.roleId);
    expect(roleIds).toContain(role1.id);
    expect(roleIds).toContain(role2.id);
  });
});
