import AuthService, {IAuthService} from "@/server/api/infra/auth/services/auth.service";
import {ContainerModule, interfaces} from "inversify";
import {DI_SYMBOLS} from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IAuthService>(DI_SYMBOLS.IAuthService).to(AuthService);
}

export const AuthModule = new ContainerModule(initializeModule);
