import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.patients)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.patients)["bulk-delete"]["$post"]
>;

export const useBulkDeletePatients = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (ids) => {
      await client.api.patients["bulk-delete"]["$post"](ids);
      return ids.json.ids;
    },
    onSuccess: () => {
      toast.success("Registros deletados com sucesso!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Não foi possível deletar estes registros.");
    },
  });
  return mutation;
};
