<?php

namespace App\Http\Controllers;

use App\Models\PatientReferral;

class PatientReferralController extends Controller
{
    public function create()
    {
        return view('pages.patients.referrals.create');
    }

    public function update(PatientReferral $referral)
    {
        return view('pages.patients.referrals.update', [
            'referral' => $referral,
        ]);
    }
}
