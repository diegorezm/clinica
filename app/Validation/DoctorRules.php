<?php

namespace App\Validation;

trait DoctorRules
{
    protected function doctorRules()
    {
        return [
            'crm' => ['required', 'string', 'max:22'],
            'specialty' => ['required', 'string', 'max:255'],
            'user_id' => ['required', 'exists:users,id'],
        ];
    }
}
