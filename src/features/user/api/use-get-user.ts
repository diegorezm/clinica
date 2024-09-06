import { ReactQueryOptions, trpc } from "@/lib/trpc";

type Opts = ReactQueryOptions["user"]["getById"];

export const useGetUser = (id: string, opts?: Opts) => {
  const query = trpc.user.getById.useQuery(id, {
    ...opts,
  });
  return query;
};
