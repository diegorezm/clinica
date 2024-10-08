import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useRegisterDoctor = () => {
  const mutation = trpc.auth.registerDoctor.useMutation({
    onError: (error) => {
      toast.error(error.message ?? "Não foi possivel registrar este doutor.");
    },
    onSuccess: () => {
      toast.success("Doutor registrado com sucesso!");
    }
  });
  return mutation;
}
