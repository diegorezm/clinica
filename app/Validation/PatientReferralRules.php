<?php

namespace App\Validation;

trait PatientReferralRules
{
    protected function rules()
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'doctor_fn' => ['required', 'string', 'max:255'],
            'cid' => ['required', 'string', 'max:125'],
            'crm' => ['required', 'string', 'max:255'],
        ];
    }
}
