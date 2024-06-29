import { describe, expect, test, afterAll } from "bun:test";
import db from "../../config/db";
import { RoleDTO } from "../../http/domain/Role";
import rolesService from "../../http/services/roles-service";
import { rolesSchema } from "../../config/db/schemas/roles-schema";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing role service", () => {
  // Clean up database after all tests
  afterAll(async () => {
    await db.delete(rolesSchema).execute();
  });

  test.if(DEV_ENV)("Create a role", async () => {
    const roleData: RoleDTO = {
      name: "Admin",
      permissions: ["read", "write"],
    };

    const role = await rolesService.create(roleData);

    expect(role).toBeDefined();
    expect(role.id).toBeDefined();
    expect(role.name).toBe(roleData.name);
    expect(role.permissions).toEqual(roleData.permissions);
  });

  test.if(DEV_ENV)("Get role by ID", async () => {
    const roleData: RoleDTO = {
      name: "Manager",
      permissions: ["read"],
    };

    const newRole = await rolesService.create(roleData);
    const fetchedRole = await rolesService.getById(newRole.id);

    expect(fetchedRole).toBeDefined();
    expect(fetchedRole.id).toBe(newRole.id);
    expect(fetchedRole.name).toBe(newRole.name);
    expect(fetchedRole.permissions).toEqual(newRole.permissions);
  });

  test.if(DEV_ENV)("Remove role", async () => {
    const roleData: RoleDTO = {
      name: "ToDelete Role",
      permissions: ["delete"],
    };

    const newRole = await rolesService.create(roleData);
    await rolesService.remove(newRole.id);
    let deletedRole;
    try {
      deletedRole = await rolesService.getById(newRole.id);
    } catch (error: any) {
      expect(error).toBeDefined();
    }
    expect(deletedRole).toBeUndefined();
  });
});
