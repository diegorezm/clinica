import { router, publicProcedure, isAdmin } from "@/server/trpc";
import doctorService from "./services/doctors.service";
import { paginatedRequestSchema } from "../../common/input/paginated-request";
import { doctorInsertSchema } from "@/models/Doctor";
import { z } from "zod";

const doctorsProcedure = publicProcedure.use(isAdmin);

const routes = router({
  getAll: publicProcedure
    .input(paginatedRequestSchema)
    .query(async ({ input }) => {
      const response = await doctorService.getAll(input);
      return response;
    }),
  create: doctorsProcedure
    .input(doctorInsertSchema)
    .mutation(async ({ input }) => {
      const response = await doctorService.create(input);
      return response;
    }),
  update: doctorsProcedure
    .input(
      z.object({
        data: doctorInsertSchema,
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await doctorService.update(input.data, input.id);
      return response;
    }),
  delete: doctorsProcedure.input(z.number()).mutation(async ({ input }) => {
    await doctorService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: doctorsProcedure
    .input(z.number().array())
    .mutation(async ({ input }) => {
      const response = await doctorService.bulkDelete(input);

      return {
        message: response + " registros removidos com sucesso!",
      };
    }),
});
export default routes;
