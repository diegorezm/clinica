<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use Livewire\Component;
use Mary\Traits\Toast;

class Show extends Component
{
    use Toast;

    public Patient $patient;
    public bool $showModal = false;

    public function mount(Patient $patient)
    {
        $this->patient = $patient;
    }

    public function delete()
    {
        $this->patient->delete();
        $this->showModal = false;
        $this->success('Paciente excluído com sucesso!');

        return redirect('/dashboard/patients');
    }

    public function render()
    {
        return view('livewire.patients.show');
    }
}
