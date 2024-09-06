import { router } from "./trpc";
import patientsRoutes from "@/server/api/routes/patients/patients.route";
import patientsReferralsRoutes from "@/server/api/routes/patients/patients-referrals.route";
import doctorsRoutes from "@/server/api/routes/doctors/doctors.route";
import userRoutes from "@/server/api/routes/users/users.route";
import authRoutes from "@/server/api/routes/auth/auth.route";

export const appRouter = router({
  patients: patientsRoutes,
  doctors: doctorsRoutes,
  patientsReferrals: patientsReferralsRoutes,
  auth: authRoutes,
  user: userRoutes,
});

export type AppRouter = typeof appRouter;
