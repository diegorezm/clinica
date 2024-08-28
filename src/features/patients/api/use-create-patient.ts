import { ReactQueryOptions, trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Opts = ReactQueryOptions["patients"]["create"];

export const useCreatePatient = (opts?: Opts) => {
  const utils = trpc.useUtils();
  const mutation = trpc.patients.create.useMutation({
    ...opts,
    onError: (error) => {
      toast.error(error.message ?? "Não foi possível criar este registro.");
    },
    onSuccess: async () => {
      try {
        utils.patients.invalidate();
        toast.success("Registro criado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de pacientes.");
      }
    },
  });
  return mutation;
};
