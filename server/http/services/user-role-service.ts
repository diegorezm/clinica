import db from "../../config/db";
import { userRolesSchema } from "../../config/db/schemas/user-schema";
import { UserRole } from "../domain/User/user-role";
import roleService from "./roles-service";
import userService from "./user-service";

class UserRoleService {
  async assingToUser(userId: string, roleId: number) {
    const user = await userService.getById(userId);
    const role = await roleService.getById(roleId);
    const userRole: UserRole = {
      userId: user.id,
      roleId: role.id,
    };
    await db.insert(userRolesSchema).values(userRole);
    return userRole;
  }
}

export default new UserRoleService();
