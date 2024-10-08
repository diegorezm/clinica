import {trpc} from "@/lib/trpc"
import {toast} from "sonner";

export const useUpdateAppointment = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Registro atualizado com sucesso!")
      utils.appointments.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro ao criar o registro.")
    }
  })
  return mutation
}
