<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class Update extends Form
{
    public int $id;

    public function mount(Patient $patient)
    {
        $this->id = $patient->id;
        $this->name = $patient->name;
        $this->phone = $patient->phone;
        $this->rg = $patient->rg;
        $this->insurance = $patient->insurance;
        $this->insurance_number = $patient->insurance_number;
    }

    public function submit()
    {
        $this->validation($this->id);

        DB::transaction(function () {
            try {
                $patient = Patient::find($this->id);
                $patient->update([
                    'name' => $this->name,
                    'phone' => $this->phone,
                    'rg' => $this->rg,
                    'insurance' => $this->insurance,
                    'insurance_number' => $this->insurance_number,
                ]);

                $this->success('Paciente atualizado com sucesso!');
                return redirect("/dashboard/patients/show/{$patient->id}");
            } catch (\Exception $e) {
                $this->error($e->getMessage());
                DB::rollBack();
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.patients.update');
    }
}
