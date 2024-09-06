import { ReactQueryOptions, trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Opts = ReactQueryOptions["user"]["update"];

export const useUpdateUser = (opts?: Opts) => {
  const mutation = trpc.user.update.useMutation({
    ...opts,
    onError: (error) => {
      toast.error(error.message ?? "Não foi possivel atualizar este registro.");
    },
  });
  return mutation;
};
