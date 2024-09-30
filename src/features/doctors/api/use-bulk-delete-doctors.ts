import {toast} from "sonner";
import {ReactQueryOptions, trpc} from "@/lib/trpc";

type Opts = ReactQueryOptions["doctors"]["bulkDelete"];

export const useBulkDeleteDoctors = (options?: Opts) => {
  const utils = trpc.useUtils();
  const mutation = trpc.doctors.bulkDelete.useMutation({
    ...options,
    onError: (error, variables, context) => {
      toast.error(
        error?.message ||
        "Falha ao excluir este registro. Por favor, tente novamente.",
      );

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    onSuccess: async (data) => {
      try {
        utils.doctors.invalidate();
        toast.success(data.message || "Registros excluídos com sucesso.");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de doutores.");
      }
    },
  });

  return mutation;
};
