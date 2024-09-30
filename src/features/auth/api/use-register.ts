import {trpc} from "@/lib/trpc";
import {toast} from "sonner";

export const useRegister = () => {
  const mutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Usuario criado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
