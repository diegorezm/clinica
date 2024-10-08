import {DI_SYMBOLS} from "../types";

import {ContainerModule, interfaces} from "inversify";
import PatientReferralService, {IPatientReferralService} from "@/server/api/infra/patients/services/patient-referral.service";
import PatientReferralRepository, {IPatientReferralRepository} from "@/server/api/infra/patients/repository/patient-referral.repository";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IPatientReferralRepository>(DI_SYMBOLS.IPatientReferralRepository).to(PatientReferralRepository);
  bind<IPatientReferralService>(DI_SYMBOLS.IPatientReferralService).to(PatientReferralService);
}

export const PatientReferralModule = new ContainerModule(initializeModule);
