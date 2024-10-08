import {SafeUser, User, UserDTO} from "@/models/User";
import {LoginDTO} from "@/models/User/auth";
import {type IUserRepository} from "../../users/repositories/user.repository";
import {TRPCError} from "@trpc/server";
import {hash, verify} from "@node-rs/argon2";
import {handleError} from "@/server/api/common/utils/handle-error";
import {lucia} from "@/lib/auth";
import {createSessionCookie, deleteSessionCookie} from "@/server/api/common/utils/cookie-manager";
import {inject, injectable} from "inversify";
import {DI_SYMBOLS} from "@/server/api/common/di/types";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {type IDoctorRepository} from "../../doctors/repositories/doctor.repository";
import {DoctorDTO} from "@/models/Doctor";
import {Transaction} from "@/db";

type UserWithDoctorDTO = {user: UserDTO, doctor: DoctorDTO};

export interface IAuthService {
  register(payload: UserDTO): Promise<SafeUser>;
  registerDoctor(payload: UserWithDoctorDTO): Promise<void>;
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
  constructor(
    @inject(DI_SYMBOLS.IUserRepository) private readonly repository: IUserRepository,
    @inject(DI_SYMBOLS.MySql2Database) private readonly db: MySql2Database,
    @inject(DI_SYMBOLS.IDoctorRepository) private readonly doctorRepository: IDoctorRepository
  ) {}

  async register(payload: UserDTO): Promise<SafeUser> {
    const user = this.db.transaction(async (tx) => {
      return this.registerUser(payload, tx);
    })
    return user
  }

  async registerDoctor(payload: UserWithDoctorDTO): Promise<void> {
    try {
      this.db.transaction(async (tx) => {
        await this.repository.create(payload.user, tx);
        await this.doctorRepository.create(payload.doctor, tx);
      })
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

  private async registerUser(payload: UserDTO, tx: Transaction): SafeUser {
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
      await this.repository.create(payload, tx);
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

  logout(): void {
    deleteSessionCookie();
  }
}
