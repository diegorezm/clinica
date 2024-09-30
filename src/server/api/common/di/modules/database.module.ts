import db from "@/db";
import {MySql2Database} from "drizzle-orm/mysql2";
import {ContainerModule, interfaces} from "inversify";
import {DI_SYMBOLS} from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  bind<MySql2Database>(DI_SYMBOLS.MySql2Database).toConstantValue(db);
}

export const DatabaseModule = new ContainerModule(initializeModule);
