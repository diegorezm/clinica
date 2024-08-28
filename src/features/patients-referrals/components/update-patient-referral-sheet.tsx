import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LoadingSpinner from "@/components/loading-spinner";
import { useConfirm } from "@/hooks/use-confirm";
import { useBulkDeletePatientsReferrals } from "../api/use-bulk-delete-patients-referrals";
import { useOpenUpdatePatientReferral } from "../hooks/use-open-update-patient-referral";
import { useUpdatePatientReferral } from "../api/use-update-patient-referral";
import { useGetPatientReferral } from "../api/use-get-patient-referral";
import { PatientReferralDTO } from "@/models/Patient/patient-referral";
import PatientReferralForm from "./patient-referral-form";

export default function UpdatePatientReferralSheet() {
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Esta ação é irreversível. Ao deletar os registros, eles serão permanentemente removidos e não poderão ser recuperados.",
  );
  const { id, isOpen, onClose } = useOpenUpdatePatientReferral();
  const deleteReferralQuery = useBulkDeletePatientsReferrals();
  const updateReferralQuery = useUpdatePatientReferral();
  const referralQuery = useGetPatientReferral(id);

  const defaultValues = referralQuery.data;

  const onDelete = async () => {
    if (id === undefined) return;

    const ok = await confirm();
    if (ok) {
      deleteReferralQuery.mutate([id], {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  async function onSubmit(values: PatientReferralDTO) {
    console.log(id);
    await updateReferralQuery.mutateAsync(
      {
        data: { ...values },
        id: id!,
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
        {referralQuery.isPending ? (
          <LoadingSpinner />
        ) : (
          <PatientReferralForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            patientId={defaultValues?.patientId!}
            disabled={
              updateReferralQuery.isPending || deleteReferralQuery.isPending
            }
            onDelete={onDelete}
            editMode
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
