import {Container} from "inversify";

import {DI_RETURN_TYPES, DI_SYMBOLS} from "@/server/api/common/di/types";

import {DatabaseModule} from "./modules/database.module";
import {PatientModule} from "./modules/patients.module";
import {PatientReferralModule} from "./modules/patients-referral.module";
import {DoctorModule} from "./modules/doctors.module";
import {UserModule} from "./modules/users.module";
import {AuthModule} from "./modules/auth.module";

import {NODE_ENV} from '@/env'

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(DatabaseModule)
  ApplicationContainer.load(PatientModule)
  ApplicationContainer.load(PatientReferralModule)
  ApplicationContainer.load(DoctorModule)
  ApplicationContainer.load(UserModule)
  ApplicationContainer.load(AuthModule)
}

export const destroyContainer = () => {
  ApplicationContainer.unload(DatabaseModule)
  ApplicationContainer.unload(PatientModule)
  ApplicationContainer.unload(PatientReferralModule)
  ApplicationContainer.unload(DoctorModule)
  ApplicationContainer.unload(UserModule)
}

if (NODE_ENV !== 'test') {
  initializeContainer();
}

export function getInjections<K extends keyof typeof DI_SYMBOLS>(symbol: K): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

export {ApplicationContainer}
