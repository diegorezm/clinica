<?php

namespace App\Validation;

trait AppointmentRules
{
    public function appointmentRules()
    {
        return [
            'status' => 'required|string',
            'date' => 'required|date|after:today',
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'obs' => 'nullable|string|max:1000',
        ];
    }
}
