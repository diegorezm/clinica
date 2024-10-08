import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useBulkDeleteAppointments = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.appointments.bulkDelete.useMutation({
    onSuccess: () => {
      toast.success("Registros removidos com sucesso!")
      utils.appointments.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro ao remover os registros.")
    }
  });
  return mutation
}
