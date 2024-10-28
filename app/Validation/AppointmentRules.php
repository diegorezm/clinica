<?php

namespace App\Validation;

trait AppointmentRules
{
    public function appointmentRules(bool $forUpdate = false): array
    {
        $rules = [
            'status' => 'required|string',
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'time' => 'required|date_format:H:i',
            'obs' => 'nullable|string|max:1000',
        ];
        if (!$forUpdate) {
            $rules['date'] = 'required|date|after_or_equal:today';
        } else {
            $rules['date'] = 'required|date';
        }
        return $rules;
    }
}
