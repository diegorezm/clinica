import { client } from "@/lib/hono";
import { Patient } from "@/models/Patient";
import { PatientReferral } from "@/models/Patient/patient-referral";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetPatientReferral = (id?: number) => {
  const query = useQuery<PatientReferral>({
    enabled: !!id,
    queryKey: ["patient", { id }],
    queryFn: async () => {
      const response = await client.api.patients.referrals.info[":id"]["$get"]({
        param: {
          id: String(id),
        },
      });
      if (!response.ok) {
        throw new Error("Não foi possivel retornar os dados do paciente.");
      }
      const data = await response.json();
      const referral: PatientReferral = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      }
      return referral;
    },
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
  return query;
};
