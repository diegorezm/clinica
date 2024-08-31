import { trpc } from "@/lib/trpc";

export const useVerifyAuth = () => {
  const query = trpc.auth.verify.useQuery();
  return query;
};
