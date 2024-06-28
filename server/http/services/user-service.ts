import db from "../../config/db";
import {
  rolesSchema,
  userRolesSchema,
  usersSchema,
} from "../../config/db/schemas/user-schema";
import { User, UserDTO } from "../domain/User";
import { LoginDTO } from "../domain/User/user-login";
import { asc, eq } from "drizzle-orm";
import { UserWithRole } from "../domain/User/user-role";

class UserService {
  async register(payload: UserDTO): Promise<User> {
    try {
      const [user] = await db.insert(usersSchema).values(payload).returning();
      return user;
    } catch (error) {
      throw new Error("Error registering user");
    }
  }

  async login(payload: LoginDTO): Promise<LoginDTO> {
    return payload;
  }

  async getById(userId: string): Promise<User> {
    try {
      const [user] = await db
        .select()
        .from(usersSchema)
        .where(eq(usersSchema.id, userId))
        .limit(1);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUsersWithRoles(): Promise<UserWithRole[]> {
    try {
      const userWithRoles = await db
        .select({
          id: usersSchema.id,
          name: usersSchema.name,
          email: usersSchema.email,
          role: rolesSchema.name,
          createdAt: usersSchema.createdAt,
          updatedAt: usersSchema.updatedAt,
        })
        .from(usersSchema)
        .leftJoin(userRolesSchema, eq(usersSchema.id, userRolesSchema.userId))
        .leftJoin(rolesSchema, eq(userRolesSchema.roleId, rolesSchema.id))
        .groupBy(usersSchema.id, rolesSchema.name)
        .orderBy(asc(usersSchema.name))

        .execute();
      return userWithRoles;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUserWithRole(userId: string): Promise<UserWithRole> {
    try {
      const userWithRoles = await db
        .select({
          id: usersSchema.id,
          name: usersSchema.name,
          email: usersSchema.email,
          role: rolesSchema.name,
          createdAt: usersSchema.createdAt,
          updatedAt: usersSchema.updatedAt,
        })
        .from(usersSchema)
        .where(eq(usersSchema.id, userId))
        .leftJoin(userRolesSchema, eq(usersSchema.id, userRolesSchema.userId))
        .leftJoin(rolesSchema, eq(userRolesSchema.roleId, rolesSchema.id))
        .groupBy(usersSchema.id, rolesSchema.name)
        .orderBy(asc(usersSchema.name))
        .limit(1)
        .execute();
      return userWithRoles[0];
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async update(userId: string, payload: UserDTO): Promise<User> {
    try {
      const [user] = await db
        .update(usersSchema)
        .set(payload)
        .where(eq(usersSchema.id, userId))
        .returning();
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async remove(userId: string): Promise<void> {
    try {
      await db.delete(usersSchema).where(eq(usersSchema.id, userId));
    } catch (error) {
      throw new Error("Error removing user");
    }
  }
}

export default new UserService();
