import { userInsertSchema } from "@/models/User";
import { loginSchema } from "@/models/User/auth";
import { router, publicProcedure, isAuth } from "@/server/trpc";
import authService from "@/services/auth-service";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

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
    const cookieStore = cookies();
    const response = await authService.login(input);
    cookieStore.set("token", response.token, {
      httpOnly: true,
    });
    return response;
  }),
  logout: publicProcedure.use(isAuth).mutation(async ({ ctx }) => {
    ctx.res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
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
