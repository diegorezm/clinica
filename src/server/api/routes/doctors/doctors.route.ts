import DoctorRepository from "./repositories/doctor.repository";

import {router, adminProcedure, privateProcedure} from "@/server/trpc";
import {paginatedRequestSchema} from "../../common/input/paginated-request";
import {doctorInsertSchema} from "@/models/Doctor";
import {z} from "zod";
import db from "@/db";
import DoctorService from "./services/doctors.service";
import {doctorWorkDayInsertSchema} from "@/models/Doctor/work-days";
import {doctorWorkPeriodInsertSchema} from "@/models/Doctor/work-period";

const doctorRepository = new DoctorRepository(db)
const doctorService = new DoctorService(doctorRepository);

const routes = router({
  get: privateProcedure
    .input(paginatedRequestSchema)
    .query(async ({input}) => {
      const response = await doctorService.findAll(input);
      return response;
    }),
  getById: privateProcedure.input(z.string().uuid()).query(async ({input}) => {
    const response = await doctorService.findById(input);
    return response;
  }),
  getWorkDays: privateProcedure
    .input(z.string().uuid())
    .query(async ({input}) => {
      const response = await doctorService.findDoctorWorkDays(input);
      return response;
    }),
  getWorkPeriods: privateProcedure
    .input(z.string().uuid())
    .query(async ({input}) => {
      const response = await doctorService.findDoctorWorkPeriods(input);
      return response;
    }),
  create: adminProcedure
    .input(doctorInsertSchema)
    .mutation(async ({input}) => {
      await doctorService.create(input);
      return {message: "Registro criado com sucesso!"};
    }),
  createDoctorWorkDay: adminProcedure
    .input(doctorWorkDayInsertSchema.array())
    .mutation(async ({input}) => {
      await doctorService.createDoctorWorkDays(input);
      return {message: "Registro criado com sucesso!"};
    }),
  createDoctorWorkPeriod: adminProcedure
    .input(doctorWorkPeriodInsertSchema.array())
    .mutation(async ({input}) => {
      await doctorService.createDoctorWorkPeriods(input);
      return {message: "Registro criado com sucesso!"};
    }),
  update: adminProcedure
    .input(
      z.object({
        data: doctorInsertSchema,
        id: z.string(),
      }),
    )
    .mutation(async ({input}) => {
      await doctorService.update(input.data, input.id);
      return {message: "Registro atualizado com sucesso!"};
    }),
  delete: adminProcedure.input(z.string().uuid()).mutation(async ({input}) => {
    await doctorService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: adminProcedure
    .input(z.string().array())
    .mutation(async ({input}) => {
      await doctorService.bulkDelete(input);
      return {
        message: "Registros removidos com sucesso!",
      };
    }),
  deleteDoctorWorkDays: adminProcedure
    .input(doctorWorkDayInsertSchema)
    .mutation(async ({input}) => {
      await doctorService.deleteDoctorWorkDays(input.doctorId, input.day);
      return {message: "Registro removido com sucesso!"};
    }),
  deleteDoctorWorkPeriod: adminProcedure
    .input(doctorWorkPeriodInsertSchema)
    .mutation(async ({input}) => {
      await doctorService.deleteDoctorWorkPeriod(input.doctorId, input.period);
      return {message: "Registro removido com sucesso!"};
    }),
});
export default routes;
