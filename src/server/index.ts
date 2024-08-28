import patientsRoutes from "@/routes/patients-routes";
import { router } from "./trpc";
import patientsReferralsRoutes from "@/routes/patients-referrals-routes";
export const appRouter = router({
  patients: patientsRoutes,
  patientsReferrals: patientsReferralsRoutes,
});
export type AppRouter = typeof appRouter;
