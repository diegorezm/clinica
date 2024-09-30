import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {PatientDTO, patientInsertSchema} from "@/models/Patient";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {PhoneInput} from "@/components/phone-input";
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

type Props = {
  onSubmit: (values: PatientDTO) => void;
  defaultValues?: PatientDTO;
  disabled?: boolean;
  editMode?: boolean;
  onDelete?: () => void;
};

export default function PatientsForm({
  onSubmit,
  onDelete,
  defaultValues,
  editMode = false,
  disabled = false,
}: Props) {
  const values =
    defaultValues !== undefined
      ? defaultValues
      : {
        rg: undefined,
        name: "",
        phone: "",
        insurance: undefined,
        insuranceNumber: undefined,
      };
  const form = useForm<z.infer<typeof patientInsertSchema>>({
    resolver: zodResolver(patientInsertSchema),
    defaultValues: values,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do paciente..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({field}) => (
            <FormItem>
              <FormLabel>Tel</FormLabel>
              <FormControl>
                <PhoneInput {...field} defaultCountry="BR" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rg"
          render={({field}) => (
            <FormItem>
              <FormLabel>rg</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rg do paciente..."
                  onChange={(e) => field.onChange(e.target.value ?? undefined)}
                  name={field.name}
                  disabled={field.disabled}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insurance"
          render={({field}) => (
            <FormItem>
              <FormLabel>Carteira médica</FormLabel>
              <FormControl>
                <Input
                  placeholder="Carteira médica..."
                  onChange={(e) => field.onChange(e.target.value ?? undefined)}
                  name={field.name}
                  disabled={field.disabled}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insuranceNumber"
          render={({field}) => (
            <FormItem>
              <FormLabel>Número da carteira</FormLabel>
              <FormControl>
                <Input
                  placeholder="Número da carteira..."
                  onChange={(e) => field.onChange(e.target.value ?? undefined)}
                  name={field.name}
                  disabled={field.disabled}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value ?? undefined}
                />
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
