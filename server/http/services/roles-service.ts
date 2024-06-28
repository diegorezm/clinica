import { eq } from "drizzle-orm";
import db from "../../config/db";
import { rolesSchema } from "../../config/db/schemas/user-schema";
import { Role, RoleDTO } from "../domain/Role";

class RoleService {
  async create(payload: RoleDTO): Promise<Role> {
    try {
      const [role] = await db.insert(rolesSchema).values(payload).returning();
      return role;
    } catch (error) {
      throw new Error("Error creating role");
    }
  }

  async bulkCreate(payload: RoleDTO[]): Promise<Role[]> {
    try {
      return await Promise.all(payload.map(async (e) => await this.create(e)));
    } catch (error) {
      throw new Error("Error creating roles in bulk");
    }
  }

  async remove(roleId: number): Promise<void> {
    try {
      await db.delete(rolesSchema).where(eq(rolesSchema.id, roleId));
    } catch (error) {
      throw new Error("Error removing role");
    }
  }

  async getById(roleId: number): Promise<Role> {
    try {
      const [role] = await db
        .select()
        .from(rolesSchema)
        .where(eq(rolesSchema.id, roleId));
      if (!role) {
        throw new Error("Role not found");
      }
      return role;
    } catch (error) {
      throw new Error("Error fetching role");
    }
  }
}

export default new RoleService();
