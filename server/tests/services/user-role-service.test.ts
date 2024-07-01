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
import { RoleDTO } from "../../http/domain/Role";
import { rolesSchema } from "../../config/db/schemas/roles-schema";
import { createUserDTO, createRoleDTO } from "./test-helpers"; // Import the helper functions

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing user role service", () => {
  afterAll(async () => {
    await db.delete(userRolesSchema).execute();
    await db.delete(usersSchema).execute();
    await db.delete(rolesSchema).execute();
  });

  test.if(DEV_ENV)("Get user with roles by ID", async () => {
    const userData: UserDTO = createUserDTO(); // Use helper function to create user data

    const user = await userService.register(userData);

    const roleData: RoleDTO = createRoleDTO(); // Use helper function to create role data

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
    const userData: UserDTO = createUserDTO(); // Use helper function to create user data

    const user = await userService.register(userData);

    const roleData: RoleDTO = createRoleDTO(); // Use helper function to create role data

    const role = await rolesService.create(roleData);

    const userRole: UserRole = await userRoleService.assingToUser(
      user.id,
      role.id,
    );

    expect(userRole).toBeDefined();
    expect(userRole.userId).toBe(user.id);
    expect(userRole.roleId).toBe(role.id);
  });

  test.if(DEV_ENV)("Assign and fetch user roles", async () => {
    const userData: UserDTO = createUserDTO(); // Use helper function to create user data

    const user = await userService.register(userData);

    const roleData1: RoleDTO = createRoleDTO(); // Use helper function to create role data
    const roleData2: RoleDTO = createRoleDTO(); // Use helper function to create role data

    const role1 = await rolesService.create(roleData1);
    const role2 = await rolesService.create(roleData2);

    await userRoleService.assingToUser(user.id, role1.id);
    await userRoleService.assingToUser(user.id, role2.id);

    const userRoles: UserRole[] = await db
      .select()
      .from(userRolesSchema)
      .where(eq(userRolesSchema.userId, user.id));

    expect(userRoles).toBeDefined();
    expect(userRoles.length).toBe(2);

    const roleIds = userRoles.map((ur) => ur.roleId);
    expect(roleIds).toContain(role1.id);
    expect(roleIds).toContain(role2.id);
  });
});
