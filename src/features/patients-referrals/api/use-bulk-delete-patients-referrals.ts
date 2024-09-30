import {toast} from "sonner";
import {trpc} from "@/lib/trpc";

export const useBulkDeletePatientsReferrals = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.patientsReferrals.bulkDelete.useMutation({
    onError: (error) => {
      toast.error(
        error?.message ||
        "Falha ao excluir pacientes. Por favor, tente novamente.",
      );
    },
    onSuccess: (data) => {
      try {
        utils.patientsReferrals.invalidate();
        toast.success(data.message || "Encaminhamentos excluídos com sucesso.");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de pacientes.");
      }
    },
  });
  return mutation;
};
