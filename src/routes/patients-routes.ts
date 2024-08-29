import { router, publicProcedure } from "@/server/trpc";
import patientService from "@/services/patient-service";
import { z } from "zod";
import { paginatedRequestSchema } from ".";
import { patientInsertSchema } from "@/models/Patient";
import { TRPCError } from "@trpc/server";

const routes = router({
  get: publicProcedure
    .input(paginatedRequestSchema)
    .query(async ({ input }) => {
      const patients = await patientService.getAll(input);
      return patients;
    }),
  getById: publicProcedure
    .input(z.number().optional())
    .query(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      const patient = await patientService.getById(input);
      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Paciente não encontrado.",
        });
      }
      return patient;
    }),
  create: publicProcedure
    .input(patientInsertSchema)
    .mutation(async ({ input }) => {
      const patient = await patientService.create(input);
      return patient;
    }),
  update: publicProcedure
    .input(
      z.object({
        patientId: z.number(),
        payload: patientInsertSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const patient = await patientService.update(
        input.payload,
        input.patientId,
      );
      return patient;
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await patientService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: publicProcedure
    .input(
      z.object({
        ids: z.number().array(),
      }),
    )
    .mutation(async ({ input }) => {
      const { ids } = input;
      const deletedCount = await patientService.bulkDelete(ids);
      return {
        message: deletedCount + " registros removidos com sucesso!",
      };
    }),
});

export default routes;
