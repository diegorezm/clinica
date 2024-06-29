import { eq } from "drizzle-orm";
import db from "../../config/db";
import { Role, RoleDTO } from "../domain/Role";
import { RoleNotFoundException } from "../domain/Role/exceptions/role-not-found";
import { rolesSchema } from "../../config/db/schemas/roles-schema";

class RoleService {
  async create(payload: RoleDTO): Promise<Role> {
    const [role] = await db.insert(rolesSchema).values(payload).returning();
    return role;
  }

  async bulkCreate(payload: RoleDTO[]): Promise<Role[]> {
    return await Promise.all(payload.map(async (e) => await this.create(e)));
  }

  async remove(roleId: number): Promise<void> {
    // if role does not exists, getById throws
    const role = await this.getById(roleId);
    await db.delete(rolesSchema).where(eq(rolesSchema.id, role.id));
  }

  async getById(roleId: number): Promise<Role> {
    const [role] = await db
      .select()
      .from(rolesSchema)
      .where(eq(rolesSchema.id, roleId));
    if (!role) {
      throw new RoleNotFoundException();
    }
    return role;
  }
}

export default new RoleService();
