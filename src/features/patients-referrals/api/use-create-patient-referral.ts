import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export const useCreatePatientsReferrals = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.patientsReferrals.create.useMutation({
    onError: (error) => {
      toast.error(error.message ?? "Não foi possível criar este registro.");
    },
    onSuccess: async () => {
      try {
        utils.patientsReferrals.invalidate();
        toast.success("Registro criado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de pacientes.");
      }
    },
  });
  return mutation;
};
