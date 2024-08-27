import { client } from "@/lib/hono";
import { Patient } from "@/models/Patient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type ResponseType = {
  data: Patient[];
  numberOfPages: number;
  hasNextPage: boolean;
};

export const useGetPatients = ({
  q,
  page = 1,
  size = 10,
}: {
  q?: string;
  page?: number;
  size?: number;
}) => {
  const query = useQuery<ResponseType>({
    queryKey: ["patients", { page, size, q }],
    queryFn: async () => {
      const response = await client.api.patients.$get({
        query: { page: String(page), size: String(size), q },
      });
      if (!response.ok) {
        throw new Error("Não foi possivel retornar os pacientes.");
      }
      const data = await response.json();
      const transformedData = data.data.map((patient) => ({
        ...patient,
        createdAt: new Date(patient.createdAt),
        updatedAt: new Date(patient.updatedAt),
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
