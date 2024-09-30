import {ContainerModule, interfaces} from "inversify";
import {DI_SYMBOLS} from "../types";
import AppointmentRepository, {IAppointmentRepository} from "@/server/api/routes/appointments/repositories/appointment.repository";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IAppointmentRepository>(DI_SYMBOLS.IAppointmentRepository).to(AppointmentRepository);
}

export const AppointmentModule = new ContainerModule(initializeModule);
