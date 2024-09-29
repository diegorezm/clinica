import db from "@/db";
import {z} from "zod";

import {router, publicProcedure} from "@/server/trpc";
import {patientReferralsTableInsertSchema} from "@/models/Patient/patient-referral";
import {paginatedRequestSchema} from "@/server/api/common/input/paginated-request";
import PatientReferralRepository from "./repository/patient-referral.repository";
import PatientReferralService from "./services/patient-referral.service";

const patientReferralRepository = new PatientReferralRepository(db);
const patientReferralService = new PatientReferralService(patientReferralRepository);

const routes = router({
  get: publicProcedure
    .input(
      z.object({
        param: paginatedRequestSchema,
        patientId: z.string(),
      }),
    )
    .query(async ({input}) => {
      const data = await patientReferralService.findAll({
        ...input.param,
        patientId: input.patientId,
      });
      return data;
    }),
  getById: publicProcedure.input(z.number()).query(async ({input}) => {
    const data = await patientReferralService.findByID(input);
    return data;
  }),
  create: publicProcedure
    .input(patientReferralsTableInsertSchema)
    .mutation(async ({input}) => {
      await patientReferralService.create(input);
      return {
        message: "Paciente criado com sucesso!",
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        data: patientReferralsTableInsertSchema,
        id: z.number(),
      }),
    )
    .mutation(async ({input}) => {
      await patientReferralService.update(input.data, input.id);
      return {
        message: "Paciente atualizado com sucesso!",
      };
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({input}) => {
    await patientReferralService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    }
  }),
  bulkDelete: publicProcedure
    .input(z.number().array())
    .mutation(async ({input}) => {
      await patientReferralService.bulkDelete(input);
      return {
        message: "Registros removidos com sucesso!",
      };
    }),
});
export default routes;
