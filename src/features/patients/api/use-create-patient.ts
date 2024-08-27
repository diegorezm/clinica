import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.patients.$post>;
type RequestType = InferRequestType<typeof client.api.patients.$post>["json"];

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.patients.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: () => {
      toast.error("Não foi possível criar este registro.");
    },
  });
  return mutation;
};
