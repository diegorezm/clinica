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
import userParser from "../../config/db/parsers/user-parser";
import authService from "./auth-service";

class UserService {
  async register(payload: UserDTO): Promise<User> {
    const userExists = await this._getByEmail(payload.email).catch((error) => {
      if (error instanceof UserNotFoundException) {
        return null;
      }
      throw error;
    });
    if (userExists) {
      throw new UserAlreadyExistsException();
    }
    const request: UserDTO = {
      ...payload,
      password: await authService.hashPassword(payload.password),
    };

    const [user] = await db.insert(usersSchema).values(request).returning();
    return user;
  }

  async login(payload: LoginDTO) {
    const user = await this._getByEmail(payload.email);
    const compare = await authService.comparePassword(
      payload.password,
      user.password,
    );
    return compare;
  }

  async getById(userId: string): Promise<User> {
    const [user] = await db
      .select({
        id: usersSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        createdAt: usersSchema.createdAt,
        updatedAt: usersSchema.updatedAt,
      })
      .from(usersSchema)
      .where(eq(usersSchema.id, userId))
      .limit(1);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async getByEmail(email: string) {
    const [user] = await db
      .select({
        id: usersSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        createdAt: usersSchema.createdAt,
        updatedAt: usersSchema.updatedAt,
      })
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  private async _getByEmail(email: string) {
    const [user] = await db
      .select({
        id: usersSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        password: usersSchema.password,
        createdAt: usersSchema.createdAt,
        updatedAt: usersSchema.updatedAt,
      })
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);
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

    if (userWithRoles.length === 0) {
      throw new UserNotFoundException();
    }
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
    if (userWithRoles.length === 0) {
      throw new UserNotFoundException();
    }
    return userWithRoles[0];
  }

  async update(userId: string, payload: UserDTO): Promise<User> {
    const [user] = await db
      .update(usersSchema)
      .set(payload)
      .where(eq(usersSchema.id, userId))
      .returning();
    if (!user) {
      throw new UserNotFoundException();
    }
    return userParser.selectSchema.parse(user);
  }

  async remove(userId: string): Promise<void> {
    // if user does not exists, getById throws
    const user = await this.getById(userId);
    await db.delete(usersSchema).where(eq(usersSchema.id, user.id));
  }
}

export default new UserService();
