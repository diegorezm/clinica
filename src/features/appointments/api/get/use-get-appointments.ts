import {trpc} from "@/lib/trpc";
import {PaginatedRequest} from "@/server/api/common/input/paginated-request";

export const useGetAppointments = (props: PaginatedRequest) => {
  const query = trpc.appointments.getAll.useQuery({
    ...props
  });
  return query
}
