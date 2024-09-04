import { z } from "zod";

import { router, privateProcedure } from "@/server/trpc";
import { paginatedRequestSchema } from "@/server/api/common/input/paginated-request";

import { patientInsertSchema } from "@/models/Patient";

import { TRPCError } from "@trpc/server";

import patientService from "./services/patients.service";

const routes = router({
  get: privateProcedure
    .input(paginatedRequestSchema)
    .query(async ({ input }) => {
      const patients = await patientService.getAll(input);
      return patients;
    }),
  getById: privateProcedure
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
  create: privateProcedure
    .input(patientInsertSchema)
    .mutation(async ({ input }) => {
      const patient = await patientService.create(input);
      return patient;
    }),
  update: privateProcedure
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
  delete: privateProcedure.input(z.number()).mutation(async ({ input }) => {
    await patientService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: privateProcedure
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
