<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\Patient;
use App\Models\PatientReferral;
use App\Validation\PatientReferralRules;
use Livewire\Component;

class Create extends Component
{
    use PatientReferralRules;

    public string $doctor_fn = '';

    public string $cid = '';

    public string $crm = '';

    public int $patient_id;


    public function mount(Patient $patient)
    {
        $this->patient_id = $patient->id;
    }

    public function submit()
    {
        $this->validate($this->rules());

        PatientReferral::create([
            'patient_id' => $this->patient_id,
            'doctor_fn' => $this->doctor_fn,
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
