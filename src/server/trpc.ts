import "reflect-metadata";
import {initTRPC, TRPCError} from "@trpc/server";
import {User} from "lucia";
import {NextRequest, NextResponse} from "next/server";
import {validateRequest} from "./api/common/utils/cookie-manager";
import {getInjections} from "./api/common/di/container";

type Context = {
  user?: User;
  req?: NextRequest;
  res?: NextResponse;
};

const t = initTRPC.context<Context>().create();

export const isAuth = t.middleware(async ({ctx, next}) => {
  const {user} = await validateRequest();
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Faça login para realizar esta ação.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const isAdmin = t.middleware(async ({ctx, next}) => {
  const {user} = await validateRequest();
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Faça login para realizar esta ação.",
    });
  }
  // TODO: check if user is admin
  const userService = getInjections("IUserService")
  const u = await userService.findByID(user.id)
  const isAdmin = u.role === "admin"
  if (!isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Este usuário não tem permissão para realizar esta ação.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);
