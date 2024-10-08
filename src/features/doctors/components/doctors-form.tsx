import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
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
import {DoctorWithUserDTO, doctorWithUserSchema} from "@/models/Doctor";

type Props = {
  onSubmit: (values: DoctorWithUserDTO) => void;
  defaultValues?: DoctorWithUserDTO;
  disabled?: boolean;
  editMode?: boolean;
  onDelete?: () => void;
};

export default function DoctorsForm({
  onSubmit,
  onDelete,
  defaultValues,
  editMode = false,
  disabled = false,
}: Props) {
  const values: DoctorWithUserDTO =
    defaultValues !== undefined
      ? defaultValues
      : {
        doctor: {
          crm: "",
          jobFunction: "",
          userId: "",
        },
        user: {
          name: "",
          role: "doctor",
          email: "",
          password: "",
        },
      };
  const form = useForm<z.infer<typeof doctorWithUserSchema>>({
    resolver: zodResolver(doctorWithUserSchema),
    defaultValues: values,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user.name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user.email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!editMode && (
          <FormField
            control={form.control}
            name="user.password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Senha..."
                    onChange={(e) =>
                      field.onChange(e.target.value ?? undefined)
                    }
                    name={field.name}
                    disabled={field.disabled}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? undefined}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="doctor.jobFunction"
          render={({field}) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input
                  placeholder="Função..."
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
          name="doctor.crm"
          render={({field}) => (
            <FormItem>
              <FormLabel>crm</FormLabel>
              <FormControl>
                <Input
                  placeholder="CRM..."
                  onChange={(e) => field.onChange(e.target.value ?? undefined)}
                  name={field.name}
                  disabled={field.disabled}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value ?? undefined}
                  maxLength={6}
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
