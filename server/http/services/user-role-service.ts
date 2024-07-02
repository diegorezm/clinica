import { sql } from "drizzle-orm";
import db from "../../config/db";
import { userRolesSchema } from "../../config/db/schemas/user-schema";
import { RoleNotFoundException } from "../domain/Role/exceptions/role-not-found";
import { UserNotFoundException } from "../domain/User/exceptions/user-not-found";
import { UserRole } from "../domain/User/user-role";
import roleService from "./roles-service";
import userService from "./user-service";

class UserRoleService {
  async assingToUser(payload: UserRole) {
    const user = await userService.getById(payload.userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    const role = await roleService.getById(payload.roleId);
    if (!role) {
      throw new RoleNotFoundException();
    }
    const userRole: UserRole = {
      userId: user.id,
      roleId: role.id,
    };
    await db.insert(userRolesSchema).values(userRole);
    return userRole;
  }

  async removeFromUser(payload: UserRole) {
    const user = await userService.getById(payload.userId);
    const role = await roleService.getById(payload.roleId);
    await db
      .delete(userRolesSchema)
      .where(
        sql`${userRolesSchema.roleId} = ${role.id} AND ${userRolesSchema.userId} = ${user.id}`,
      );
  }
}

export default new UserRoleService();
