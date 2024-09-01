import { router, publicProcedure, isAuth } from "@/server/trpc";

import { userInsertSchema } from "@/models/User";
import { loginSchema } from "@/models/User/auth";

import authService from "./services/auth.service";

import { TRPCError } from "@trpc/server";

const routes = router({
  verify: publicProcedure.use(isAuth).query(async ({ ctx }) => {
    try {
      const { user } = ctx;
      return {
        user,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Algo deu errado. Por favor, faça login novamente.",
        });
      }
    }
  }),
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    const response = await authService.login(input);
    return response;
  }),
  logout: publicProcedure.use(isAuth).mutation(async () => {
    authService.logout();
    return {
      message: "Logout realizado com sucesso!",
      success: true,
    };
  }),

  register: publicProcedure
    .use(isAuth)
    .input(userInsertSchema)
    .mutation(async ({ input }) => {
      const response = await authService.register(input);
      return response;
    }),
});
export default routes;
