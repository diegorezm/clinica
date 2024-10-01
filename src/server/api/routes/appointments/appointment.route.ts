import {appointmentInsertSchema} from "@/models/Appointment";
import {privateProcedure, router} from "@/server/trpc";
import {getInjections} from "../../common/di/container";

const routes = router({
  create: privateProcedure
    .input(appointmentInsertSchema)
    .mutation(async ({input}) => {
      const service = getInjections("IAppointmentService");
      await service.create(input);
    }),
})

export default routes
