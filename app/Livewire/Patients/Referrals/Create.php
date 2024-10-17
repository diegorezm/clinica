<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\Patient;
use App\Models\PatientReferral;

class Create extends Form
{

    public function submit()
    {
        $this->validation();
        PatientReferral::create([
            'patient_id' => $this->patient_id,
            'doctor_specialty' => $this->doctor_specialty,
            'cid' => $this->cid,
            'crm' => $this->crm,
        ]);
        $id = $this->patient_id;
        $this->reset();
        return redirect('/dashboard/patients/show/' . $id);
    }

    public function render()
    {
        return view('livewire.patients.referrals.create');
    }
}
