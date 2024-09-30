import "reflect-metadata";
import {initTRPC, TRPCError} from "@trpc/server";
import {User} from "lucia";
import {NextRequest, NextResponse} from "next/server";
import {validateRequest} from "./api/common/utils/cookie-manager";

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
