import { router } from "./trpc";
import patientsRoutes from "@/server/api/routes/patients/patients.route";
import patientsReferralsRoutes from "@/server/api/routes/patients/patients-referrals.route";
import authRoutes from "@/server/api/routes/auth/auth.route";

export const appRouter = router({
  patients: patientsRoutes,
  patientsReferrals: patientsReferralsRoutes,
  auth: authRoutes,
});

export type AppRouter = typeof appRouter;
