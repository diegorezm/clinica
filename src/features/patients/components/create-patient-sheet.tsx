import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PatientDTO } from "@/models/Patient";
import { useCreatePatient } from "../api/use-create-patient";
import { useOpenCreatePatient } from "../hooks/use-open-create-patient";
import PatientsForm from "./patients-form";

export default function CreatePatientSheet() {
  const { isOpen, onClose } = useOpenCreatePatient();
  const { mutateAsync, isPending } = useCreatePatient();

  async function onSubmit(values: PatientDTO) {
    await mutateAsync(values);
    onClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registrar paciente</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo com as informações detalhadas do paciente.
          </SheetDescription>
        </SheetHeader>
        <PatientsForm disabled={isPending} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
