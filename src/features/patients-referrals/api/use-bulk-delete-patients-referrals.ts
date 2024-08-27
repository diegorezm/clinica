import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.patients.referrals)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.patients.referrals)["bulk-delete"]["$post"]
>;

export const useBulkDeletePatientsReferrals = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (ids) => {
      const response = await client.api.patients.referrals["bulk-delete"]["$post"](ids);
      const data = await response.json();
      return data
    },
    onSuccess: () => {
      toast.success("Registros deletados com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
    onError: () => {
      toast.error("Não foi possível deletar estes registros.");
    },
  });
  return mutation;
};
