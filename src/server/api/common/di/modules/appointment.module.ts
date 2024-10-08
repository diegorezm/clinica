import {ContainerModule, interfaces} from "inversify";
import {DI_SYMBOLS} from "../types";
import AppointmentRepository, {IAppointmentRepository} from "@/server/api/infra/appointments/repositories/appointment.repository";
import AppointmentService, {IAppointmentService} from "@/server/api/infra/appointments/services/appointment.service";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IAppointmentRepository>(DI_SYMBOLS.IAppointmentRepository).to(AppointmentRepository);
  bind<IAppointmentService>(DI_SYMBOLS.IAppointmentService).to(AppointmentService);
}

export const AppointmentModule = new ContainerModule(initializeModule);
