import { router, adminProcedure, privateProcedure } from "@/server/trpc";
import doctorService from "./services/doctors.service";
import { paginatedRequestSchema } from "../../common/input/paginated-request";
import { doctorInsertSchema } from "@/models/Doctor";
import { z } from "zod";

const routes = router({
  get: privateProcedure
    .input(paginatedRequestSchema)
    .query(async ({ input }) => {
      const response = await doctorService.getAll(input);
      return response;
    }),
  getById: privateProcedure.input(z.number()).query(async ({ input }) => {
    const response = await doctorService.getById(input);
    return response;
  }),
  create: adminProcedure
    .input(doctorInsertSchema)
    .mutation(async ({ input }) => {
      const response = await doctorService.create(input);
      return response;
    }),
  update: adminProcedure
    .input(
      z.object({
        data: doctorInsertSchema.pick({
          jobFunction: true,
          crm: true,
        }),
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await doctorService.update(input.data, input.id);
      return response;
    }),
  delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
    await doctorService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: adminProcedure
    .input(z.number().array())
    .mutation(async ({ input }) => {
      const response = await doctorService.bulkDelete(input);

      return {
        message: response + " registros removidos com sucesso!",
      };
    }),
});
export default routes;
