import {router} from "./trpc";

import patientsRoutes from './api/infra/patients/routes/patients.route';
import doctorsRoutes from './api/infra/doctors/routes/doctors.route';
import patientsReferralsRoutes from './api/infra/patients/routes/patients-referrals.route';
import authRoutes from './api/infra/auth/routes/auth.route';
import userRoutes from './api/infra/users/routes/users.route';
import appointmentsRoutes from './api/infra/appointments/routes/appointments.route';

export const appRouter = router({
  patients: patientsRoutes,
  doctors: doctorsRoutes,
  patientsReferrals: patientsReferralsRoutes,
  auth: authRoutes,
  user: userRoutes,
  appointments: appointmentsRoutes
});

export type AppRouter = typeof appRouter;
