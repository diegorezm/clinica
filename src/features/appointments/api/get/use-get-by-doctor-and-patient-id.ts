import {trpc} from "@/lib/trpc";
import {PaginatedRequest} from "@/server/api/common/input/paginated-request";

export const useGetByDoctorAndPatientId = (props: PaginatedRequest, doctorId?: string, patientId?: string) => {
  const query = trpc.appointments.getByDoctorIdAndPatientId.useQuery({
    doctorId: doctorId !== undefined ? doctorId : "",
    patientId: patientId !== undefined ? patientId : "",
    props: {
      ...props
    }
  }, {
    enabled: !!doctorId && !!patientId
  });
  return query
}
