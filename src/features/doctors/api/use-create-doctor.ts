import {ReactQueryOptions, trpc} from "@/lib/trpc";
import {toast} from "sonner";

type Opts = ReactQueryOptions["doctors"]["create"];

export const useCreateDoctor = (opts?: Opts) => {
  const utils = trpc.useUtils();
  const mutation = trpc.doctors.create.useMutation({
    ...opts,
    onError: (error) => {
      toast.error(error.message ?? "Não foi possível criar este registro.");
    },
    onSuccess: async () => {
      try {
        utils.doctors.invalidate();
        toast.success("Registro criado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de doutores.");
      }
    },
  });
  return mutation;
};
