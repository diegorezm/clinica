import db from "../../config/db";
import {
  userRolesSchema,
  usersSchema,
} from "../../config/db/schemas/user-schema";
import { User, UserDTO } from "../domain/User";
import { LoginDTO } from "../domain/User/user-login";
import { asc, eq } from "drizzle-orm";
import { UserWithRole } from "../domain/User/user-role";
import { UserNotFoundException } from "../domain/User/exceptions/user-not-found";
import { UserAlreadyExistsException } from "../domain/User/exceptions/user-already-exists";
import { rolesSchema } from "../../config/db/schemas/roles-schema";

class UserService {
  async register(payload: UserDTO): Promise<User> {
    const userExists = await this.getByEmail(payload.email).catch((error) => {
      if (error instanceof UserNotFoundException) {
        return null;
      }
      throw error;
    });
    if (userExists) {
      throw new UserAlreadyExistsException();
    }
    const [user] = await db.insert(usersSchema).values(payload).returning();
    return user;
  }

  async login(payload: LoginDTO): Promise<LoginDTO> {
    return payload;
  }

  async getById(userId: string): Promise<User> {
    const [user] = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, userId))
      .limit(1);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const [user] = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email));
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async getUsersWithRoles(): Promise<UserWithRole[]> {
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
  }

  async getUserWithRole(userId: string): Promise<UserWithRole> {
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
  }

  async update(userId: string, payload: UserDTO): Promise<User> {
    const [user] = await db
      .update(usersSchema)
      .set(payload)
      .where(eq(usersSchema.id, userId))
      .returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async remove(userId: string): Promise<void> {
    await db.delete(usersSchema).where(eq(usersSchema.id, userId));
  }
}

export default new UserService();
