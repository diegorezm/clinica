import {TRPCError} from "@trpc/server";

export const handleError = (error: unknown) => {
  if (error instanceof TRPCError) {
    return error;
  }
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Erro interno do servidor.",
  });
}
