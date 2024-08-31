import { User, UserDTO } from "@/models/User";
import { LoginDTO } from "@/models/User/auth";
import userService from "./user-service";
import { TRPCError } from "@trpc/server";
import encoder from "@/lib/encoder";
import db from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import tokenService from "./token-service";

class AuthService {
  async register(payload: UserDTO) {
    const userExists = await userService.getByEmail(payload.email);
    if (userExists !== undefined) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Usuário já existe.",
      });
    }
    const hashPass = encoder.encrypt(payload.password);
    if (!hashPass) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possivel registrar este usuario.",
      });
    }
    payload.password = hashPass;
    const [response] = await db.insert(usersTable).values(payload);
    const user = await userService.getById(String(response.insertId));
    return user;
  }

  async login(payload: LoginDTO) {
    const user = await this.getByEmail(payload.email);
    if (user === undefined) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Usuário não existe.",
      });
    }
    const userPwd = encoder.decrypt(user.password);
    if (userPwd === payload.password) {
      const token = tokenService.sign(user.email);
      return {
        user: user as User,
        token,
      };
    }
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Senha inválida.",
    });
  }
  private async getByEmail(email: string) {
    const [data] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return data;
  }
}

const authService = new AuthService();
export default authService;
