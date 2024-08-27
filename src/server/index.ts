import patientsRoutes from "@/routes/patients-routes";
import { router } from "./trpc";
export const appRouter = router({
  patients: patientsRoutes,
});
export type AppRouter = typeof appRouter;
