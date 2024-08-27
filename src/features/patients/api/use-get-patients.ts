import { ReactQueryOptions, RouterInputs, trpc } from "@/lib/trpc";

type Opts = ReactQueryOptions["patients"]["get"];
type RequestType = RouterInputs["patients"]["get"];

interface Props extends RequestType {
  opts?: Opts;
}

export const useGetPatients = ({ q, page = 1, size = 10, opts }: Props) => {
  const query = trpc.patients.get.useQuery(
    {
      q,
      page,
      size,
    },
    {
      ...opts,
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
