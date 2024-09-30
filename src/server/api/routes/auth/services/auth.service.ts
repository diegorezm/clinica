import {User, UserDTO} from "@/models/User";
import {LoginDTO} from "@/models/User/auth";
import {type IUserRepository} from "../../users/repositories/user.repository";
import {TRPCError} from "@trpc/server";
import {hash, verify} from "@node-rs/argon2";
import {handleError} from "@/server/api/common/utils/handle-error";
import {lucia} from "@/lib/auth";
import {createSessionCookie, deleteSessionCookie} from "@/server/api/common/utils/cookie-manager";
import {inject, injectable} from "inversify";
import {DI_SYMBOLS} from "@/server/api/common/di/types";

export interface IAuthService {
  register(payload: UserDTO): Promise<User>;
  login(payload: LoginDTO): Promise<User>;
  logout(): void;
}

export const HASH_CONFIG = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

@injectable()
export default class AuthService implements IAuthService {
  constructor(@inject(DI_SYMBOLS.IUserRepository) private readonly repository: IUserRepository) {}

  async register(payload: UserDTO): Promise<User> {
    const userExists = await this.repository.findByEmail(payload.email);
    if (userExists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Este email ja esta cadastrado."
      })
    }
    const hashPass = await hash(payload.password, HASH_CONFIG)
    if (!hashPass) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possivel registrar este usuario.",
      });
    }
    payload.password = hashPass;
    try {
      await this.repository.create(payload);
      const user = await this.repository.findByEmail(payload.email);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possivel encontrar o registro deste usuario.",
        })
      }
      return user;
    } catch (error) {
      throw handleError(error);
    }
  }

  async login(payload: LoginDTO): Promise<User> {
    const user = await this.repository.findByEmail(payload.email);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Usuario não encontrado. Tem certeza que digitou o email corretamente?",
      });
    }
    const verifyPass = await verify(user.password, payload.password);
    if (!verifyPass) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Senha invalida.",
      });
    }
    const session = await lucia.createSession(user.id, {});
    createSessionCookie(session.id)
    return user
  }

  logout(): void {
    deleteSessionCookie();
  }
}
