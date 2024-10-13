<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use App\Validation\PatientRules;
use Livewire\Component;
use Mary\Traits\Toast;

class Update extends Component
{
    use Toast, PatientRules;

    public int $id;
    public $name = '';
    public $phone = '';
    public $rg = '';
    public $insurance = '';
    public $insurance_number = '';


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
        $this->validate($this->patientRules($this->id));

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
    }

    public function render()
    {
        return view('livewire.patients.update');
    }
}
