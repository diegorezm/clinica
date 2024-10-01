import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Trash2} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  PatientReferralDTO,
  patientReferralsTableInsertSchema,
} from "@/models/Patient/patient-referral";
import {useForm} from "react-hook-form";
import {z} from "zod";

type Props = {
  onSubmit: (values: PatientReferralDTO) => void;
  defaultValues?: PatientReferralDTO;
  disabled?: boolean;
  editMode?: boolean;
  onDelete?: () => void;
  patientId: string;
};
export default function PatientReferralForm({
  patientId,
  onSubmit,
  defaultValues,
  onDelete = () => {},
  disabled = false,
  editMode = false,
}: Props) {
  const values =
    defaultValues !== undefined
      ? defaultValues
      : {
        cid: "",
        crm: "",
        jobFunction: "",
        patientId,
      };
  const form = useForm<z.infer<typeof patientReferralsTableInsertSchema>>({
    resolver: zodResolver(patientReferralsTableInsertSchema),
    defaultValues: values,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cid"
          render={({field}) => (
            <FormItem>
              <FormLabel>CID</FormLabel>
              <FormControl>
                <Input placeholder="CID..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="crm"
          render={({field}) => (
            <FormItem>
              <FormLabel>CRM</FormLabel>
              <FormControl>
                <Input placeholder="CRM..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobFunction"
          render={({field}) => (
            <FormItem>
              <FormLabel>Função do médico</FormLabel>
              <FormControl>
                <Input placeholder="Função..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row items-center gap-2">
          <Button type="submit" disabled={disabled} className="w-full">
            {editMode ? "Salvar mudanças" : "Criar registro"}
          </Button>
          {editMode && (
            <Button
              variant={"outline"}
              className="w-full"
              onClick={onDelete}
              disabled={disabled}
              type="button"
            >
              <Trash2 className="size-4 mr-2" />
              Deletar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
