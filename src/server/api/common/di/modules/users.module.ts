import {DI_SYMBOLS} from "../types";
import {ContainerModule, interfaces} from "inversify";
import UserRepository, {IUserRepository} from "@/server/api/infra/users/repositories/user.repository";
import UserService, {IUserService} from "@/server/api/infra/users/services/users.service";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IUserRepository>(DI_SYMBOLS.IUserRepository).to(UserRepository);
  bind<IUserService>(DI_SYMBOLS.IUserService).to(UserService);
}

export const UserModule = new ContainerModule(initializeModule);
