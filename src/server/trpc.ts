import tokenService from "@/services/token-service";
import userService from "@/services/user-service";
import { getTokenFromCookies } from "@/utils/token";
import { initTRPC, TRPCError } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = await getTokenFromCookies();
  return {
    user,
    req,
    res,
  };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const isAuth = t.middleware(async ({ ctx, next }) => {
  const { user } = await getTokenFromCookies();
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
