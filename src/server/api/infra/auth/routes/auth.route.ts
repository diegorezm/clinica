import {router, publicProcedure, privateProcedure, adminProcedure} from "@/server/trpc";
import {userInsertSchema} from "@/models/User";
import {loginSchema} from "@/models/User/auth";
import {lucia} from "@/lib/auth";
import {cookies} from "next/headers";
import {TRPCError} from "@trpc/server";
import {getInjections} from "@/server/api/common/di/container";
import {validateRequest} from "@/server/api/common/utils/cookie-manager";
import {doctorInsertSchema} from "@/models/Doctor";
import {z} from "zod";

const routes = router({
  login: publicProcedure.input(loginSchema).mutation(async ({input}) => {
    const authService = getInjections("IAuthService");
    const response = await authService.login(input);
    return response;
  }),
  register: adminProcedure
    .input(userInsertSchema)
    .mutation(async ({input}) => {
      const authService = getInjections("IAuthService");
      const response = await authService.register(input);
      return response;
    }),
  registerDoctor: adminProcedure
    .input(z.object({user: userInsertSchema, doctor: doctorInsertSchema}))
    .mutation(async ({input}) => {
      const authService = getInjections("IAuthService");
      const response = await authService.registerDoctor(input);
      return response;
    }),
  logout: privateProcedure.mutation(async () => {
    // should move this logic somewhere
    const {session} = await validateRequest();
    if (!session) {
      throw new TRPCError({code: "UNAUTHORIZED", });
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
});
export default routes;
