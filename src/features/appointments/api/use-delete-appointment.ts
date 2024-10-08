import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useDeleteAppointment = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.appointments.delete.useMutation({
    onSuccess: () => {
      toast.success("Registro removido com sucesso!")
      utils.appointments.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro ao remover o registro.")
    }
  });
  return mutation
}
