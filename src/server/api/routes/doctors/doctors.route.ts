import {router, adminProcedure, privateProcedure} from "@/server/trpc";
import {paginatedRequestSchema} from "../../common/input/paginated-request";
import {doctorInsertSchema} from "@/models/Doctor";
import {z} from "zod";
import {doctorWorkDayInsertSchema} from "@/models/Doctor/work-days";
import {doctorWorkPeriodInsertSchema} from "@/models/Doctor/work-period";
import {getInjections} from "../../common/di/container";

const routes = router({
  get: privateProcedure
    .input(paginatedRequestSchema)
    .query(async ({input}) => {
      const doctorService = getInjections("IDoctorService");
      const response = await doctorService.findAll(input);
      return response;
    }),
  getById: privateProcedure.input(z.string().uuid()).query(async ({input}) => {

    const doctorService = getInjections("IDoctorService");
    const response = await doctorService.findById(input);
    return response;
  }),
  getWorkDays: privateProcedure
    .input(z.string().uuid())
    .query(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
      const response = await doctorService.findDoctorWorkDays(input);
      return response;
    }),
  getWorkPeriods: privateProcedure
    .input(z.string().uuid())
    .query(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
      const response = await doctorService.findDoctorWorkPeriods(input);
      return response;
    }),
  create: adminProcedure
    .input(doctorInsertSchema)
    .mutation(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
      await doctorService.create(input);
      return {message: "Registro criado com sucesso!"};
    }),
  createDoctorWorkDay: adminProcedure
    .input(doctorWorkDayInsertSchema.array())
    .mutation(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
      await doctorService.createDoctorWorkDays(input);
      return {message: "Registro criado com sucesso!"};
    }),
  createDoctorWorkPeriod: adminProcedure
    .input(doctorWorkPeriodInsertSchema.array())
    .mutation(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
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

      const doctorService = getInjections("IDoctorService");
      await doctorService.update(input.data, input.id);
      return {message: "Registro atualizado com sucesso!"};
    }),
  delete: adminProcedure.input(z.string().uuid()).mutation(async ({input}) => {

    const doctorService = getInjections("IDoctorService");
    await doctorService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: adminProcedure
    .input(z.string().array())
    .mutation(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
      await doctorService.bulkDelete(input);
      return {
        message: "Registros removidos com sucesso!",
      };
    }),
  deleteDoctorWorkDays: adminProcedure
    .input(doctorWorkDayInsertSchema)
    .mutation(async ({input}) => {

      const doctorService = getInjections("IDoctorService");
      await doctorService.deleteDoctorWorkDays(input.doctorId, input.day);
      return {message: "Registro removido com sucesso!"};
    }),
  deleteDoctorWorkPeriod: adminProcedure
    .input(doctorWorkPeriodInsertSchema)
    .mutation(async ({input}) => {
      const doctorService = getInjections("IDoctorService");
      await doctorService.deleteDoctorWorkPeriod(input.doctorId, input.period);
      return {message: "Registro removido com sucesso!"};
    }),
});
export default routes;
