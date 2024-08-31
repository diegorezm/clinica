import tokenService from "@/services/token-service";
import userService from "@/services/user-service";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

export const getTokenFromCookies = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Token not found" });
  }

  const decoded = tokenService.verify(token);

  if (!decoded.valid || decoded.expired || !decoded.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Token inválido ou expirado.",
    });
  }

  const user = await userService.getByEmail(decoded.email);
  if (!user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Usuário não encontrado.",
    });

  return { user };
};

export const setTokenInCookies = (token: string) => {
  const cookieStore = cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
};

export const removeTokenFromCookies = () => {
  const cookieStore = cookies();
  cookieStore.delete("token");
};
