import { router, publicProcedure, isAuth } from "@/server/trpc";

import { userInsertSchema } from "@/models/User";
import { loginSchema } from "@/models/User/auth";

import authService from "./services/auth.service";

import { TRPCError } from "@trpc/server";
import { validateRequest } from "../../common/utils/cookie-manager";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import userService from "../users/services/users.service";

const routes = router({
  me: publicProcedure.use(isAuth).query(async ({ ctx }) => {
    try {
      const { user } = ctx;
      const getUserById = await userService.getById(user.id);
      return {
        user: getUserById,
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
    // should move this logic somewhere
    const { session } = await validateRequest();
    if (!session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
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
