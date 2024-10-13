<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\Patient;
use App\Models\PatientReferral;
use App\Validation\PatientReferralRules;
use Livewire\Component;

class Update extends Component
{
    use PatientReferralRules;

    public string $doctor_fn = '';

    public string $cid = '';

    public string $crm = '';

    public int $patient_id;

    public string $patient_name = '';

    public PatientReferral $referral;

    public function mount(Patient $patient)
    {
        $this->patient_name = $patient->name;
        $this->patient_id = $patient->id;

        $this->referral = PatientReferral::where('patient_id', $patient->id)->first();

        $this->doctor_fn = $this->referral->doctor_fn;
        $this->cid = $this->referral->cid;
        $this->crm = $this->referral->crm;
    }

    public function submit()
    {
        $this->validate($this->rules());

        $this->referral->update([
            'doctor_fn' => $this->doctor_fn,
            'cid' => $this->cid,
            'crm' => $this->crm,
        ]);
        $id = $this->referral->patient_id;
        $this->reset();
        return redirect("/dashboard/patients/show/{$id}");
    }

    public function render()
    {
        return view('livewire.patients.referrals.update');
    }
}
