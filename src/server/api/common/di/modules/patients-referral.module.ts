import PatientReferralRepository, {IPatientReferralRepository} from "@/server/api/routes/patients/repository/patient-referral.repository";
import {ContainerModule, interfaces} from "inversify";
import {DI_SYMBOLS} from "../types";
import PatientReferralService, {IPatientReferralService} from "@/server/api/routes/patients/services/patient-referral.service";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IPatientReferralRepository>(DI_SYMBOLS.IPatientReferralRepository).to(PatientReferralRepository);
  bind<IPatientReferralService>(DI_SYMBOLS.IPatientReferralService).to(PatientReferralService);
}

export const PatientReferralModule = new ContainerModule(initializeModule);
