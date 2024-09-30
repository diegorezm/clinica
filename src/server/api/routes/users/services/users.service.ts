import {SafeUser, toSafeUser, UserDTO} from "@/models/User";
import {PaginatedRequestProps, PaginatedResponse} from "@/server/api/common/types";
import {type IUserRepository} from "../repositories/user.repository";
import {handleError} from "@/server/api/common/utils/handle-error";
import {TRPCError} from "@trpc/server";
import {inject, injectable} from "inversify";
import {DI_SYMBOLS} from "@/server/api/common/di/types";

export interface IUserService {
  findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<SafeUser>>;
  findByID(id: string): Promise<SafeUser>;
  findByEmail(email: string): Promise<SafeUser>;
  create(payload: UserDTO): Promise<void>;
  update(payload: UserDTO, userId: string): Promise<void>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
}

@injectable()
export default class UserService implements IUserService {
  constructor(@inject(DI_SYMBOLS.IUserRepository) readonly repository: IUserRepository) {}

  async findAll(props: PaginatedRequestProps): Promise<PaginatedResponse<SafeUser>> {
    try {
      const response = await this.repository.findAll(props);
      const safeUsers = response.data.map((user) => toSafeUser(user));
      return {
        ...response,
        data: safeUsers
      };
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByID(id: string): Promise<SafeUser> {
    try {
      const user = await this.repository.findByID(id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuario não encontrado.",
        });
      }
      return toSafeUser(user);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByEmail(email: string): Promise<SafeUser> {
    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuario não encontrado.",
        })
      }
      return toSafeUser(user);
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(payload: UserDTO): Promise<void> {
    try {
      const userExists = await this.repository.findByEmail(payload.email);
      if (userExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email ja esta cadastrado.",
        })
      }
      await this.repository.create(payload);
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(payload: UserDTO, userId: string): Promise<void> {
    try {
      await this.repository.update(payload, userId);
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw handleError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await this.repository.bulkDelete(ids);
    } catch (error) {
      throw handleError(error);
    }
  }
}
