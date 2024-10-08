import {trpc} from "@/lib/trpc";
import {useAuthStore} from "../hooks/use-auth-store";

export const useLogout = () => {
  const {clearAuth} = useAuthStore();
  const mutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearAuth();
    }
  });
  return mutation;
};
