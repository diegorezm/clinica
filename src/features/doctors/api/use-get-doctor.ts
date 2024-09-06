import { trpc } from "@/lib/trpc";
import { Doctor } from "@/models/Doctor";

export const useGetDoctor = (id?: number) => {
  const query = trpc.doctors.getById.useQuery(id!, {
    enabled: !!id,
    select: (data) => {
      const doctor: Doctor = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
      return doctor;
    },
  });
  return query;
};
