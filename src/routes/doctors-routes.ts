import { router, publicProcedure } from "@/server/trpc";
import { paginatedRequestSchema } from ".";
import doctorService from "@/services/doctor-service";
import { z } from "zod";
import { doctorInsertSchema } from "@/models/Doctor";

const routes = router({
  get: publicProcedure
    .input(paginatedRequestSchema)
    .query(async ({ input }) => {
      const data = await doctorService.getAll(input);
      return data;
    }),
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const data = await doctorService.getById(input);
    return data;
  }),
  create: publicProcedure
    .input(doctorInsertSchema)
    .mutation(async ({ input }) => {
      const data = await doctorService.create(input);
      return data;
    }),
  update: publicProcedure
    .input(
      z.object({
        data: doctorInsertSchema,
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const data = await doctorService.update(input.data, input.id);
      return data;
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await doctorService.delete(input);
  }),
  bulkDelete: publicProcedure
    .input(z.number().array())
    .mutation(async ({ input }) => {
      await doctorService.bulkDelete(input);
    }),
});
export default routes;
