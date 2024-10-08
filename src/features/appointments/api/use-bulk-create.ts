import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useBulkCreateAppointments = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.appointments.bulkCreate.useMutation({
    onSuccess: () => {
      toast.success("Registros criados com sucesso!")
      utils.appointments.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro ao criar os registros.")
    }
  });
  return mutation
}
