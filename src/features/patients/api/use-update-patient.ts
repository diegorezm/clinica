import {toast} from "sonner";
import {trpc} from "@/lib/trpc";

export const useUpdatePatient = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.patients.update.useMutation({
    onError: (error) => {
      toast.error(
        error?.message ||
        "Falha ao atualizar paciente. Por favor, tente novamente.",
      );
    },
    onSuccess: () => {
      try {
        utils.patients.invalidate();
        toast.success("Registro atualizado com sucesso.");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de pacientes.");
      }
    },
  });
  return mutation;
};
