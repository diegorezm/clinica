import {trpc} from "@/lib/trpc";

export const useGetAppointment = (id?: number) => {
  const query = trpc.appointments.getById.useQuery(
    id !== undefined ? id : -1, {
    enabled: !!id
  });
  return query
}
