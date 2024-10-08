import DoctorRepository, {IDoctorRepository} from "@/server/api/infra/doctors/repositories/doctor.repository";
import DoctorService, {IDoctorService} from "@/server/api/infra/doctors/services/doctors.service";
import {ContainerModule, interfaces} from "inversify";
import {DI_SYMBOLS} from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IDoctorRepository>(DI_SYMBOLS.IDoctorRepository).to(DoctorRepository);
  bind<IDoctorService>(DI_SYMBOLS.IDoctorService).to(DoctorService);
}

export const DoctorModule = new ContainerModule(initializeModule);
