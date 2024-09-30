import {ReactQueryOptions, trpc} from "@/lib/trpc";
import {toast} from "sonner";

type Opts = ReactQueryOptions["patientsReferrals"]["update"];

export const useUpdatePatientReferral = (opts?: Opts) => {
  const utils = trpc.useUtils();
  const mutation = trpc.patientsReferrals.update.useMutation({
    ...opts,
    onError: (error) => {
      toast.error(
        error?.message ||
        "Falha ao atualizar este registro. Por favor, tente novamente.",
      );
    },
    onSuccess: () => {
      try {
        utils.patientsReferrals.invalidate();
        toast.success("Registro atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar a lista de pacientes.");
      }
    },
  });
  return mutation;
};
