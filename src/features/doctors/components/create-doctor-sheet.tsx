import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {useOpenCreateDoctor} from "../hooks/use-open-create-doctor";
import DoctorsForm from "./doctors-form";
import {useCreateDoctor} from "../api/use-create-doctor";
import {DoctorWithUserDTO} from "@/models/Doctor";
import {useRegister} from "@/features/auth/api/use-register";

export default function CreatePatientSheet() {
  const createDoctorQuery = useCreateDoctor();
  const registerQuery = useRegister();
  const {isOpen, onClose} = useOpenCreateDoctor();

  async function onSubmit(values: DoctorWithUserDTO) {
    const user = await registerQuery.mutateAsync({
      name: values.user.name,
      email: values.user.email,
      password: values.user.password,
      role: values.user.role,
    });

    await createDoctorQuery.mutateAsync({
      crm: values.doctor.crm,
      jobFunction: values.doctor.jobFunction,
      userId: user.id,
    });
    if (!registerQuery.isError && !createDoctorQuery.isError) {
      onClose();
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registrar doutor</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo com as informações detalhadas do doutor.
          </SheetDescription>
        </SheetHeader>
        <DoctorsForm
          disabled={createDoctorQuery.isPending || registerQuery.isPending}
          onSubmit={onSubmit}
        />
      </SheetContent>
    </Sheet>
  );
}
