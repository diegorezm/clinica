import { trpc, ReactQueryOptions } from "@/lib/trpc";
import { User } from "@/models/User";
import { toast } from "sonner";
import { useAuthStore } from "../hooks/use-auth-store";

type Opts = ReactQueryOptions["auth"]["login"];

export const useLogin = (opts?: Opts) => {
  const { setUser } = useAuthStore();
  const mutation = trpc.auth.login.useMutation({
    ...opts,
    onSuccess: (data, ...rest) => {
      toast.success("Login realizado com sucesso!");
      const user: User = {
        ...data.user,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      };
      setUser(user);
      if (opts?.onSuccess) {
        opts.onSuccess(data, ...rest);
      }
    },
    onError: (error: any, ...rest) => {
      toast.error(error.message ?? "Erro inesperado.");
      if (opts?.onError) {
        opts.onError(error, ...rest);
      }
    },
  });
  return mutation;
};
