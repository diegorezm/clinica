import { z } from "zod";

import { router, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

import { patientReferralsTableInsertSchema } from "@/models/Patient/patient-referral";
import { paginatedRequestSchema } from "@/server/api/common/input/paginated-request";
import patientReferralService from "./services/patients-referrals.service";

const routes = router({
  get: publicProcedure
    .input(
      z.object({
        param: paginatedRequestSchema,
        patientId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const data = await patientReferralService.getAll({
        ...input.param,
        patientId: input.patientId,
      });
      return data;
    }),
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const data = await patientReferralService.getById(input);
    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Encaminhamento não encontrado.",
      });
    }
    return data;
  }),
  create: publicProcedure
    .input(patientReferralsTableInsertSchema)
    .mutation(async ({ input }) => {
      const data = await patientReferralService.create(input);
      return data;
    }),
  update: publicProcedure
    .input(
      z.object({
        data: patientReferralsTableInsertSchema,
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const data = await patientReferralService.update(input.data, input.id);
      return data;
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await patientReferralService.delete(input);
  }),
  bulkDelete: publicProcedure
    .input(z.number().array())
    .mutation(async ({ input }) => {
      const deletedCount = await patientReferralService.bulkDelete(input);
      return {
        message: deletedCount + " registros removidos com sucesso!",
      };
    }),
});
export default routes;
