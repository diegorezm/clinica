import UserRepository, {IUserRepository} from "@/server/api/routes/users/repositories/user.repository";
import UserService, {IUserService} from "@/server/api/routes/users/services/users.service";
import {DI_SYMBOLS} from "../types";
import {ContainerModule, interfaces} from "inversify";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IUserRepository>(DI_SYMBOLS.IUserRepository).to(UserRepository);
  bind<IUserService>(DI_SYMBOLS.IUserService).to(UserService);
}

export const UserModule = new ContainerModule(initializeModule);
