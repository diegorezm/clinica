<?php

namespace App\Http\Controllers;

use App\Models\Patient;

class PatientReferralController extends Controller
{
    public function create(Patient $patient)
    {
        return view('pages.patients.referrals.create', [
            'patient' => $patient
        ]);
    }

    public function update(Patient $patient)
    {
        return view('pages.patients.referrals.update', [
            'patient' => $patient,
        ]);
    }
}
