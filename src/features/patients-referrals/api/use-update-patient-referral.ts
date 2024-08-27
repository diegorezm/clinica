import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.patients.referrals)[":id"]["$put"]
>;
type RequestType = InferRequestType<
  (typeof client.api.patients.referrals)[":id"]["$put"]
>;

export const useUpdatePatientReferral = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.patients.referrals[":id"]["$put"](json);
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registro atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["referrals"],
      });
    },
    onError: () => {
      toast.error("Não foi possível atualizar este registro.");
    },
  });
  return mutation;
};
