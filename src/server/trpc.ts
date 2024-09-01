import { initTRPC, TRPCError } from "@trpc/server";
import { User } from "lucia";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "./api/common/utils/cookie-manager";

type Context = {
  user?: User;
  req?: NextRequest;
  res?: NextResponse;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const isAuth = t.middleware(async ({ ctx, next }) => {
  const { user } = await validateRequest();
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
