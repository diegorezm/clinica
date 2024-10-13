<?php

namespace App\Validation;

trait PatientRules
{
    protected function patientRules($patientId = null): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'required|min:11|max:15',
            'rg' => ['nullable', 'string', 'max:20', 'unique:patients,rg,' . $patientId],
            'insurance' => 'nullable|string|max:255',
            'insurance_number' => 'nullable|string|max:255',
        ];
    }
}
