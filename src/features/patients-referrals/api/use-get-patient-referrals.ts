import { client } from "@/lib/hono";
import { PatientReferral } from "@/models/Patient/patient-referral";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type ResponseType = {
  data: PatientReferral[];
  numberOfPages: number;
  hasNextPage: boolean;
};

export const useGetPatientsReferrals = ({
  patientId,
  q,
  page = 1,
  size = 10,
}: {
  patientId: number;
  q?: string;
  page?: number;
  size?: number;
}) => {
  const query = useQuery<ResponseType>({
    queryKey: ["referrals", page, size, q],
    queryFn: async () => {
      const response = await client.api.patients.referrals[":patientId"]["$get"]({
        param: {
          patientId: String(patientId),
        },
        query: {
          q,
          page: String(page),
          size: String(size),
        },
      });
      if (!response.ok) {
        throw new Error(
          "Não foi possivel retornar os encaminhamentos deste paciente.",
        );
      }
      const data = await response.json();
      const transformedData = data.data.map((referral) => ({
        ...referral,
        createdAt: new Date(referral.createdAt),
        updatedAt: new Date(referral.updatedAt),
      }));
      return {
        data: transformedData,
        numberOfPages: data.numberOfPages,
        hasNextPage: data.hasNextPage,
      };
    },
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
  return query;
};
