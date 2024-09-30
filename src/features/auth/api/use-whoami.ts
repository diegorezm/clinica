import {trpc} from "@/lib/trpc";

export const useWhoAmI = () => {
  const query = trpc.user.whoAmI.useQuery();
  return query;
};
