<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\PatientReferral;
use Illuminate\Support\Facades\DB;

class Create extends Form
{

    public function submit()
    {
        $this->validation();
        DB::transaction(function () {
            try {
                PatientReferral::create([
                    'patient_id' => $this->patient_id,
                    'doctor_specialty' => $this->doctor_specialty,
                    'cid' => $this->cid,
                    'crm' => $this->crm,
                ]);
                $id = $this->patient_id;
                $this->reset();
                return redirect('/dashboard/patients/show/' . $id);
            } catch (\Exception $e) {
                $this->error($e->getMessage());
                DB::rollBack();
            }
        });
    }

    public function render()
    {
        return view('livewire.patients.referrals.create');
    }
}
