import {trpc} from "@/lib/trpc";
import {PaginatedRequest} from "@/server/api/common/input/paginated-request";

export const useGetAppointmentByDoctorId = (props: PaginatedRequest, doctorId?: string) => {
  const query = trpc.appointments.getByDoctorId.useQuery({
    doctorId: doctorId !== undefined ? doctorId : "",
    props: {
      ...props
    }
  }, {
    enabled: !!doctorId
  });
  return query
}
