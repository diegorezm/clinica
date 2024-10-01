import {trpc} from "@/lib/trpc";

type Props = {
  patientId: string;
  q?: string;
  page?: number;
  size?: number;
};
export const useGetPatientsReferrals = ({
  patientId,
  q,
  page = 1,
  size = 10,
}: Props) => {
  const query = trpc.patientsReferrals.get.useQuery(
    {
      patientId,
      param: {
        q,
        page,
        size,
      },
    },
    {
      select: (data) => {
        const transformedData = data.data.map((patient) => ({
          ...patient,
          createdAt: new Date(patient.createdAt),
          updatedAt: new Date(patient.updatedAt),
        }));
        return {
          ...data,
          data: transformedData,
        };
      },
    },
  );
  return query;
};
