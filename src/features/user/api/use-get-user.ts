import {ReactQueryOptions, trpc} from "@/lib/trpc";

type UserGetUsersOpts = ReactQueryOptions["user"]["getByID"];


export const useGetUser = (id: string, opts?: UserGetUsersOpts) => {
  const query = trpc.user.getByID.useQuery(id, {
    ...opts
  });
  return query;
};

export const useGetUserByEmail = (email: string) => {
  const query = trpc.user.getByEmail.useQuery(email);
  return query;
};
