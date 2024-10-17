<?php

namespace App\Livewire\Appointments;

use Livewire\Component;

class FormWrapper extends Component
{
    public string $selectedTab = 'create';

    public function render()
    {
        return view('livewire.appointments.form-wrapper');
    }
}
