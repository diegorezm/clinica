<?php

namespace App\Livewire\Patients;

use App\Models\Patient;

class Create extends Form
{
    public function submit()
    {
        $this->validation();
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
