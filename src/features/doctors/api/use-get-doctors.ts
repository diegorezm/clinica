import { ReactQueryOptions, RouterInputs, trpc } from "@/lib/trpc";

type Opts = ReactQueryOptions["doctors"]["get"];
type RequestType = RouterInputs["doctors"]["get"];

interface Props extends RequestType {
  opts?: Opts;
}

export const useGetDoctors = ({ q, page = 1, size = 10, opts }: Props) => {
  const query = trpc.doctors.get.useQuery(
    {
      q,
      page,
      size,
    },
    {
      ...opts,
      select: (data) => {
        const parsedData = data.data.map((e) => {
          const newDoctor = {
            ...e,
            createdAt: new Date(e.createdAt),
            updatedAt: new Date(e.updatedAt),
          };
          return {
            ...newDoctor,
          };
        });
        return {
          ...data,
          data: parsedData,
        };
      },
    },
  );

  return query;
};
