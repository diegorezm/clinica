import { client } from "@/lib/hono";
import { Patient } from "@/models/Patient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetPatient = (id?: number) => {
  const query = useQuery<Patient>({
    enabled: !!id,
    queryKey: ["patient", { id }],
    queryFn: async () => {
      const response = await client.api.patients[":id"]["$get"]({
        param: {
          id: String(id),
        },
      });
      if (!response.ok) {
        throw new Error("Não foi possivel retornar os dados do paciente.");
      }
      const { data } = await response.json();
      const patient: Patient = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
      return patient;
    },
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
  return query;
};
