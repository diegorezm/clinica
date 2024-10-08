import {trpc} from "@/lib/trpc";
import {PaginatedRequest} from "@/server/api/common/input/paginated-request";

export const useGetAppointmentByPatientId = (props: PaginatedRequest, patientId?: string) => {
  const query = trpc.appointments.getByPatientId.useQuery({
    patientId: patientId !== undefined ? patientId : "",
    props: {
      ...props
    }
  }, {
    enabled: !!patientId
  });
  return query
}
