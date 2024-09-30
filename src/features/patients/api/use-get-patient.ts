import {trpc} from "@/lib/trpc";
import {Patient} from "@/models/Patient";

export const useGetPatient = (id?: string) => {
  const query = trpc.patients.getById.useQuery(id, {
    enabled: !!id,
    select: (data) => {
      const patient: Patient = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
      return patient;
    },
  });
  return query;
};
