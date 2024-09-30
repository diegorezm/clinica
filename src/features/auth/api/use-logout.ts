import {trpc} from "@/lib/trpc";

export const useLogout = () => {
  const mutation = trpc.auth.logout.useMutation();
  return mutation;
};
