import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import PatientReferralForm from "./patient-referral-form";
import {PatientReferralDTO} from "@/models/Patient/patient-referral";
import {useOpenCreatePatientReferral} from "../hooks/use-open-create-patient-referrals";
import {useCreatePatientsReferrals} from "../api/use-create-patient-referral";

export default function CreatePatientReferralSheet() {
  const {isOpen, onClose, patientId} = useOpenCreatePatientReferral();
  const {mutateAsync, isPending} = useCreatePatientsReferrals();

  async function onSubmit(values: PatientReferralDTO) {
    await mutateAsync(values);
    onClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registrar encaminhamento</SheetTitle>
          <SheetDescription>Preencha os campos abaixo.</SheetDescription>
        </SheetHeader>
        <PatientReferralForm
          disabled={isPending}
          onSubmit={onSubmit}
          patientId={patientId as number}
        />
      </SheetContent>
    </Sheet>
  );
}
