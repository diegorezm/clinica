<?php

namespace App\Validation;

trait PatientReferralRules
{
    protected function patientReferralRules()
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'doctor_specialty' => ['required', 'string', 'max:255'],
            'cid' => ['required', 'string', 'max:125'],
            'crm' => ['required', 'string', 'max:255'],
        ];
    }
}
