import {router, adminProcedure, privateProcedure} from "@/server/trpc";
import {paginatedRequestSchema} from "../../common/input/paginated-request";
import {z} from "zod";
import {userInsertSchema} from "@/models/User";
import {TRPCError} from "@trpc/server";
import {getInjections} from "../../common/di/container";


const route = router({
  whoAmI: privateProcedure.query(async ({ctx}) => {
    const ctxUser = ctx.user;
    if (!ctxUser) {
      throw new TRPCError({code: "UNAUTHORIZED"});
    }
    const userService = getInjections("IUserService");
    const user = await userService.findByID(ctxUser.id);
    return user
  }),
  get: adminProcedure.input(paginatedRequestSchema).query(async ({input}) => {

    const userService = getInjections("IUserService");
    return await userService.findAll(input);
  }),
  getByID: adminProcedure.input(z.string().uuid()).query(async ({input}) => {

    const userService = getInjections("IUserService");
    return await userService.findByID(input);
  }),
  getByEmail: adminProcedure.input(z.string().email()).query(async ({input}) => {

    const userService = getInjections("IUserService");
    return await userService.findByEmail(input);
  }),
  update: adminProcedure.input(z.object({
    id: z.string().uuid(),
    payload: userInsertSchema
  })).mutation(async ({input}) => {
    const userService = getInjections("IUserService");
    await userService.update(input.payload, input.id);
    return {
      message: "Registro atualizado com sucesso!"
    }
  }),
  delete: adminProcedure.input(z.string().uuid()).mutation(async ({input}) => {
    const userService = getInjections("IUserService");
    await userService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: adminProcedure.input(z.array(z.string().uuid())).mutation(async ({input}) => {
    const userService = getInjections("IUserService");
    await userService.bulkDelete(input);
    return {
      message: "Registros removidos com sucesso!",
    };
  }),

});

export default route;
