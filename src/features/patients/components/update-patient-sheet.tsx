import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PatientDTO } from "@/models/Patient";
import { useGetPatient } from "../api/use-get-patient";
import PatientsForm from "./patients-form";
import LoadingSpinner from "@/components/loading-spinner";
import { useConfirm } from "@/hooks/use-confirm";
import { useBulkDeletePatients } from "../api/use-bulk-delete-patients";
import { useOpenUpdatePatient } from "../hooks/use-open-update-patient";
import { useUpdatePatient } from "../api/use-update-patient";

export default function UpdatePatientSheet() {
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Esta ação é irreversível. Ao deletar os registros, eles serão permanentemente removidos e não poderão ser recuperados.",
  );
  const { id, isOpen, onClose } = useOpenUpdatePatient();
  const deletePatientsQuery = useBulkDeletePatients();
  const updatePatientQuery = useUpdatePatient();
  const patientQuery = useGetPatient(id);

  const defaultValues = patientQuery.data;

  const onDelete = async () => {
    if (id === undefined) return;

    const ok = await confirm();
    if (ok) {
      deletePatientsQuery.mutate(
        { json: { ids: [id] } },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  async function onSubmit(values: PatientDTO) {
    await updatePatientQuery.mutateAsync(
      {
        json: { ...values },
        param: {
          id: String(id),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <ConfirmDialog />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Atualizar paciente</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo com as informações detalhadas do paciente.
          </SheetDescription>
        </SheetHeader>
        {patientQuery.isPending ? (
          <LoadingSpinner />
        ) : (
          <PatientsForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            disabled={
              updatePatientQuery.isPending || deletePatientsQuery.isPending
            }
            onDelete={onDelete}
            editMode
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
