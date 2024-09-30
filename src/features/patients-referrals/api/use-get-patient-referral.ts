import {trpc} from "@/lib/trpc";

export const useGetPatientReferral = (id?: number) => {
  const query = trpc.patientsReferrals.getById.useQuery(id!, {
    enabled: !!id,
    select: (data) => {
      const referral = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
      return referral;
    },
  });
  return query;
};
