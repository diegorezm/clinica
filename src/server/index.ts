import patientsRoutes from "@/routes/patients-routes";
import { router } from "./trpc";
import patientsReferralsRoutes from "@/routes/patients-referrals-routes";
import authRoutes from "@/routes/auth-routes";
export const appRouter = router({
  patients: patientsRoutes,
  patientsReferrals: patientsReferralsRoutes,
  auth: authRoutes,
});
export type AppRouter = typeof appRouter;
