import PatientRepository, {IPatientRepository} from "@/server/api/routes/patients/repository/patient.repository";
import PatientService, {IPatientService} from "@/server/api/routes/patients/services/patients.service";
import {DI_SYMBOLS} from "../types";
import {ContainerModule, interfaces} from "inversify";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IPatientRepository>(DI_SYMBOLS.IPatientRepository).to(PatientRepository);
  bind<IPatientService>(DI_SYMBOLS.IPatientService).to(PatientService);
}

export const PatientModule = new ContainerModule(initializeModule);


