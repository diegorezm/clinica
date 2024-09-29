import {z} from "zod";

import {router, privateProcedure} from "@/server/trpc";
import {paginatedRequestSchema} from "@/server/api/common/input/paginated-request";

import {patientInsertSchema} from "@/models/Patient";

import {TRPCError} from "@trpc/server";
import PatientService from "./services/patients.service";
import db from "@/db";
import PatientRepository from "./repository/patient.repository";

const patientRepository = new PatientRepository(db);
const patientService = new PatientService(patientRepository);

const routes = router({
  get: privateProcedure
    .input(paginatedRequestSchema)
    .query(async ({input}) => {
      const patients = await patientService.findAll(input);
      return patients;
    }),
  getById: privateProcedure
    .input(z.string().optional())
    .query(async ({input}) => {
      if (!input) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      const patient = await patientService.findByID(input);
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
    .mutation(async ({input}) => {
      await patientService.create(input);
      return {
        message: "Paciente criado com sucesso!",
      }
    }),
  update: privateProcedure
    .input(
      z.object({
        patientId: z.string(),
        payload: patientInsertSchema,
      }),
    )
    .mutation(async ({input}) => {
      await patientService.update(
        input.payload,
        input.patientId,
      );
      return {
        message: "Paciente atualizado com sucesso!",
      }
    }),
  delete: privateProcedure.input(z.string()).mutation(async ({input}) => {
    await patientService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: privateProcedure
    .input(
      z.string().array(),
    )
    .mutation(async ({input}) => {
      await patientService.bulkDelete(input);
      return {
        message: "Registros removidos com sucesso!",
      };
    }),
});

export default routes;
