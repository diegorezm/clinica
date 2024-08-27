"use client";

import CreatePatientReferralSheet from "@/features/patients-referrals/components/create-patient-referral-sheet";
import UpdatePatientReferralSheet from "@/features/patients-referrals/components/update-patient-referral-sheet";
import CreatePatientSheet from "@/features/patients/components/create-patient-sheet";
import UpdatePatientSheet from "@/features/patients/components/update-patient-sheet";

export default function SheetProvider() {
  return (
    <>
      <CreatePatientSheet />
      <UpdatePatientSheet />
      <CreatePatientReferralSheet />
      <UpdatePatientReferralSheet />
    </>
  );
}
