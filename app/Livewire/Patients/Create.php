<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use App\Validation\PatientRules;
use Livewire\Component;
use Mary\Traits\Toast;

class Create extends Component
{
    use Toast, PatientRules;

    public $name = '';
    public $phone = '';
    public $rg = '';
    public $insurance = '';
    public $insurance_number = '';

    public function submit()
    {
        // Validate the data
        $this->validate($this->rules());

        // Create the patient record
        Patient::create([
            'name' => $this->name,
            'phone' => $this->phone,
            'rg' => $this->rg ?: null,
            'insurance' => $this->insurance,
            'insurance_number' => $this->insurance_number,
        ]);

        $this->reset();
        $this->success('Registro criado com sucesso.', position: 'toast-bottom');
        sleep(1);
        return redirect('/dashboard/patients');
    }

    public function render()
    {
        return view('livewire.patients.create');
    }
}
