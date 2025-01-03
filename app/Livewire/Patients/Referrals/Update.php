<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\Patient;
use App\Models\PatientReferral;
use Illuminate\Support\Facades\DB;

class Update extends Form
{
    public PatientReferral $referral;

    public string $patient_name;

    public function mount(PatientReferral $referral)
    {

        $this->referral = $referral;
        $this->patient_id = $referral->patient_id;
        $patient = Patient::find($referral->patient_id);
        $this->patient_name = $patient->name;
        $this->doctor_specialty = $this->referral->doctor_specialty;
        $this->cid = $this->referral->cid;
        $this->crm = $this->referral->crm;
    }

    public function submit()
    {
        $this->validation();

        DB::transaction(function () {

            try {
                $this->referral->update([
                    'cid' => $this->cid,
                    'crm' => $this->crm,
                    'doctor_specialty' => $this->doctor_specialty,
                ]);
                $id = $this->referral->patient_id;
                return redirect("/dashboard/patients/show/{$id}");
            } catch (\Exception $e) {
                $this->error('Erro ao atualizar registro.');
                DB::rollBack();
            }
        });
    }

    public function render()
    {
        return view('livewire.patients.referrals.update');
    }
}
