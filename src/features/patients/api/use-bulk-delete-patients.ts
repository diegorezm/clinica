import {toast} from "sonner";
import {ReactQueryOptions, trpc} from "@/lib/trpc";

type Opts = ReactQueryOptions["patients"]["bulkDelete"];

export const useBulkDeletePatients = (options?: Opts) => {
  const utils = trpc.useUtils();
  const mutation = trpc.patients.bulkDelete.useMutation({
    ...options,
    onError: (error, variables, context) => {
      toast.error(
        error?.message ||
        "Falha ao excluir pacientes. Por favor, tente novamente.",
      );

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    onSuccess: async (data) => {
      try {
        utils.patients.invalidate();
        toast.success(data.message || "Pacientes excluídos com sucesso.");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de pacientes.");
      }
    },
  });

  return mutation;
};
