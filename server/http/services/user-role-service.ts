import db from "../../config/db";
import { userRolesSchema } from "../../config/db/schemas/user-schema";
import { RoleNotFoundException } from "../domain/Role/exceptions/role-not-found";
import { UserNotFoundException } from "../domain/User/exceptions/user-not-found";
import { UserRole } from "../domain/User/user-role";
import roleService from "./roles-service";
import userService from "./user-service";

class UserRoleService {
  async assingToUser(userId: string, roleId: number) {
    const user = await userService.getById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    const role = await roleService.getById(roleId);
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
}

export default new UserRoleService();
