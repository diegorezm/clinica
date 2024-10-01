import {appointmentInsertSchema} from "@/models/Appointment";
import {privateProcedure, router} from "@/server/trpc";
import {getInjections} from "../../common/di/container";
import {paginatedRequestSchema} from "../../common/input/paginated-request";
import {z} from "zod";
import {Status} from '@/models/Appointment';

const routes = router({
  getAll: privateProcedure
    .input(paginatedRequestSchema)
    .query(async ({input}) => {
      const service = getInjections("IAppointmentService");
      return service.findAll(input);
    }),
  getById: privateProcedure.input(z.number().nonnegative()).query(async ({input}) => {
    const service = getInjections("IAppointmentService");
    return service.findByID(input);
  }),
  getByDoctorId: privateProcedure
    .input(z.object({
      doctorId: z.string(),
      props: paginatedRequestSchema
    }))
    .query(async ({input}) => {
      const service = getInjections("IAppointmentService");
      return service.findByDoctorId(input.doctorId, input.props);
    }),
  getByPatientId: privateProcedure.input(z.object({
    patientId: z.string(),
    props: paginatedRequestSchema
  })).query(async ({input}) => {
    const service = getInjections("IAppointmentService");
    return service.findByPatientId(input.patientId, input.props);
  }),
  getByDoctorIdAndPatientId: privateProcedure.input(z.object({
    patientId: z.string(),
    doctorId: z.string(),
    props: paginatedRequestSchema
  })).query(async ({input}) => {
    const service = getInjections("IAppointmentService");
    return service.findByDoctorIdAndPatientId(input.doctorId, input.patientId, input.props);
  }),
  getByDate: privateProcedure.input(z.object({
    data: z.date(),
    props: paginatedRequestSchema
  })).query(async ({input}) => {
    const service = getInjections("IAppointmentService");
    return service.findByDate(input.data, input.props);
  }),
  getByDateRange: privateProcedure.input(z.object({
    startDate: z.date(),
    endDate: z.date(),
    props: paginatedRequestSchema
  })).query(async ({input}) => {
    const service = getInjections("IAppointmentService");
    return service.findByDateRange(input.startDate, input.endDate, input.props);
  }),
  create: privateProcedure
    .input(appointmentInsertSchema)
    .mutation(async ({input}) => {
      const service = getInjections("IAppointmentService");
      await service.create(input);
    }),
  bulkCreate: privateProcedure.input(z.array(appointmentInsertSchema)).mutation(async ({input}) => {
    const service = getInjections("IAppointmentService");
    await service.createBulk(input);
    return {
      message: "Registros inseridos com sucesso!",
    }
  }),
  updateStatus: privateProcedure.input(z.object({
    id: z.number().nonnegative(),
    status: z.nativeEnum(Status)
  })).mutation(async ({input}) => {
    const service = getInjections("IAppointmentService");
    await service.updateStatus(input.id, input.status);
    return {
      message: "Status alterado com sucesso!",
    }
  }),
  delete: privateProcedure.input(z.number().nonnegative()).mutation(async ({input}) => {
    const service = getInjections("IAppointmentService");
    await service.delete(input);
    return {
      message: "Registro excluído com sucesso!",
    }
  }),
  bulkDelete: privateProcedure.input(z.array(z.number().nonnegative())).mutation(async ({input}) => {
    const service = getInjections("IAppointmentService");
    await service.bulkDelete(input);
    return {
      message: "Registros excluídos com sucesso!",
    }
  })
})

export default routes
