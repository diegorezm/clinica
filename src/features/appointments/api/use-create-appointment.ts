import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useCreateAppointment = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      toast.success("Registro criado com sucesso!")
      utils.appointments.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro ao criar o registro.")
    }
  });
  return mutation
}
