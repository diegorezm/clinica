import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useDeleteUser = () => {
  const mutation = trpc.user.delete.useMutation({
    onError: (error) => {
      toast.error(error.message ?? "Não foi possivel remover este registro.");
    },
    onSuccess: () => {
      toast.success("Registro removido com sucesso!");
    }
  });
  return mutation
}
