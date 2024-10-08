import {trpc} from "@/lib/trpc";
import {PaginatedRequest} from "@/server/api/common/input/paginated-request";

export const useGetAppointmentByDate = (props: PaginatedRequest, date: Date) => {
  const query = trpc.appointments.getByDate.useQuery({
    data: date,
    props: {
      ...props
    }
  })
  return query
}
