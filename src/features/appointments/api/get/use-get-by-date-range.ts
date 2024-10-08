import {trpc} from "@/lib/trpc";
import {PaginatedRequest} from "@/server/api/common/input/paginated-request";

export const useGetAppointmentByDateRange = (props: PaginatedRequest, start_date: Date, end_date: Date) => {
  const query = trpc.appointments.getByDateRange.useQuery({
    startDate: start_date,
    endDate: end_date,
    props: {
      ...props
    }
  })
  return query
}
