import { trpc } from "@/lib/trpc";

// great name for a query
export const useMe = () => {
  const query = trpc.auth.me.useQuery();
  return query;
};
