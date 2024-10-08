import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {useOpenCreateDoctor} from "../hooks/use-open-create-doctor";
import DoctorsForm from "./doctors-form";
import {DoctorWithUserDTO} from "@/models/Doctor";
import {useRegisterDoctor} from "@/features/auth/api/use-register-doctor";

export default function CreatDoctorsSheet() {
  const registerDoctorQuery = useRegisterDoctor();
  const {isOpen, onClose} = useOpenCreateDoctor();

  async function onSubmit(values: DoctorWithUserDTO) {
    await registerDoctorQuery.mutateAsync(values);
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
          disabled={registerDoctorQuery.isPending}
          onSubmit={onSubmit}
        />
      </SheetContent>
    </Sheet>
  );
}
