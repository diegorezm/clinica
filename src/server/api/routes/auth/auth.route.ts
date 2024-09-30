import db from "@/db";
import {router, publicProcedure, isAuth, privateProcedure, adminProcedure} from "@/server/trpc";
import {userInsertSchema} from "@/models/User";
import {loginSchema} from "@/models/User/auth";
import {validateRequest} from "../../common/utils/cookie-manager";
import {lucia} from "@/lib/auth";
import {cookies} from "next/headers";
import {TRPCError} from "@trpc/server";
import UserRepository from "../users/repositories/user.repository";
import AuthService from "./services/auth.service";

const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);

const routes = router({
  login: publicProcedure.input(loginSchema).mutation(async ({input}) => {
    const response = await authService.login(input);
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
  register: adminProcedure
    .use(isAuth)
    .input(userInsertSchema)
    .mutation(async ({input}) => {
      const response = await authService.register(input);
      return response;
    }),
});
export default routes;
