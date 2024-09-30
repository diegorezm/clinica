import db from "@/db";
import UserService from "./services/users.service";
import UserRepository from "./repositories/user.repository";
import {router, adminProcedure, privateProcedure} from "@/server/trpc";
import {paginatedRequestSchema} from "../../common/input/paginated-request";
import {z} from "zod";
import {userInsertSchema} from "@/models/User";
import {TRPCError} from "@trpc/server";

const userRepository = new UserRepository(db)
const userService = new UserService(userRepository);

const route = router({
  whoAmI: privateProcedure.query(async ({ctx}) => {
    const ctxUser = ctx.user;
    if (!ctxUser) {
      throw new TRPCError({code: "UNAUTHORIZED"});
    }
    const user = await userService.findByID(ctxUser.id);
    return user
  }),
  get: adminProcedure.input(paginatedRequestSchema).query(async ({input}) => {
    return await userService.findAll(input);
  }),
  getByID: adminProcedure.input(z.string().uuid()).query(async ({input}) => {
    return await userService.findByID(input);
  }),
  getByEmail: adminProcedure.input(z.string().email()).query(async ({input}) => {
    return await userService.findByEmail(input);
  }),
  update: adminProcedure.input(z.object({
    id: z.string().uuid(),
    payload: userInsertSchema
  })).mutation(async ({input}) => {
    await userService.update(input.payload, input.id);
    return {
      message: "Registro atualizado com sucesso!"
    }
  }),
  delete: adminProcedure.input(z.string().uuid()).mutation(async ({input}) => {
    await userService.delete(input);
    return {
      message: "Registro removido com sucesso!",
    };
  }),
  bulkDelete: adminProcedure.input(z.array(z.string().uuid())).mutation(async ({input}) => {
    await userService.bulkDelete(input);
    return {
      message: "Registros removidos com sucesso!",
    };
  }),

});

export default route;
